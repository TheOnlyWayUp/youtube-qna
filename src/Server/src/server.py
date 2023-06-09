from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from pathlib import Path
from enum import Enum
from uuid import uuid4

# from yt import process_url, return_chain_from_vs_ids, vectorstore_dir
# -------------------------------- #
from typing import List
import json
from io import StringIO
from pathlib import Path
from uuid import uuid4
import webvtt
from yt_dlp import YoutubeDL
from yt_dlp.utils import DownloadError
from langchain.docstore.document import Document
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS


data_dir = Path(__file__).parent / "data"
vectorstore_dir = data_dir / "vectorstore"

data_dir.mkdir(exist_ok=True)
vectorstore_dir.mkdir(exist_ok=True)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)


options = options = {
    "write_sub": True,  # Download non-auto-generated subtitles
    "write_auto_sub": True,  # Download auto-generated subtitles
    "sub_langs": ["en"],  # Specify the desired subtitle language(s)
    "write_sub_format": "vtt",
    "skip_download": True,
    "yes_playlist": True,
}


def process_url(url: str, name: str):
    """Start-to-Finish, Downloads and Indexes any YouTube URL."""
    with YoutubeDL(options) as ydl:
        video_info = ydl.extract_info(url, download=False)

    randomized_extension = str(uuid4()).split("-")[0]
    name = name.replace(" ", "_").rstrip("_") + "_" + randomized_extension
    folder = vectorstore_dir / name

    def create_return_document(text: str, file_id, start, end):
        return Document(
            page_content=text,
            metadata={
                "video_id": file_id,
                "start_timestamp": start,
                "end_timestamp": end,
                "source": f"https://youtu.be/{file_id}?t={start}",
                "citation": f"https://youtu.be/{file_id}?t={start}",
                "dockey": f"https://youtu.be/{file_id}?t={start}",
            },
        )
        # The 'citation' and 'dockey' keys are required for PaperQnA compatibility. To use PaperQnA, modify the ./ask/__init__.py file.

    def return_seconds(li):
        return (int(li[0]) * 3600) + (int(li[1]) * 60) + (int(li[2]))

    def get_video_info(record: dict):
        title = record.get("fulltitle", "")
        video_id = record.get("id", "")
        description = record.get("description", "")

        subtitles = ""
        if "subtitles" in record:
            # Process the subtitles metadata
            for lang, subs in record["subtitles"].items():
                if lang in options["sub_langs"]:
                    for record in subs:
                        if record.get("ext") == options["write_sub_format"]:
                            url = record.get("url")
                            vtt_content = ydl.urlopen(url).read().decode("utf-8")
                            subtitles = vtt_content
                            break

        if "automatic_captions" in record and not subtitles:
            for lang, subs in record["automatic_captions"].items():
                if lang in options["sub_langs"]:
                    for record in subs:
                        if record.get("ext") == options["write_sub_format"]:
                            url = record.get("url")
                            vtt_content = ydl.urlopen(url).read().decode("utf-8")
                            subtitles = vtt_content
                            break

        channel_name = video_info.get("channel")
        channel_id = video_info.get("channel_id")

        to_return = {
            "title": title,
            "video_id": video_id,
            "description": description,
            "subtitles": subtitles,
            "channel_name": channel_name,
            "channel_id": channel_id,
        }

        return to_return

    def subtitles_to_documents(
        channel_name: str, video_id: str, subtitles_buffer: StringIO
    ):
        documents = []
        uploaders = set()
        lines = []
        for caption in webvtt.read_buffer(subtitles_buffer):
            start, end, text = caption.start, caption.end, caption.text
            if not text:
                continue
            lines.append(
                {"start": start.strip(), "end": end.strip(), "text": text.strip()}
            )

        # file_uploader
        # file_id = (
        #     raw_file_id.strip().split(".")[0].strip()[1:-1]
        # )  # Expected FileName Format for VTT Captions is: `Uploader - [<VideoID>].en.vtt`

        # This block ensures that each Document is approximately n seconds of speech in length.
        document_duration_seconds: int = 10
        _unqualifying_buffer_start: int = 0
        _unqualifying_buffer_duration: int = 0
        _text_buffer: str = ""

        for line in lines:
            text: str = line["text"]
            start, end = (
                return_seconds(line["start"].split(".")[0].split(":")),
                return_seconds(line["end"].split(".")[0].split(":")),
            )
            duration = end - start  # seconds

            if (duration + _unqualifying_buffer_duration) >= document_duration_seconds:
                _unqualifying_buffer_duration = 0

                text = _text_buffer + " " + text
                _text_buffer = ""

                documents.append(
                    create_return_document(
                        text, video_id, _unqualifying_buffer_start, end
                    )
                )

                _unqualifying_buffer_start = end
            else:
                _unqualifying_buffer_duration += duration
                _text_buffer = _text_buffer + " " + text

        uploaders.add(channel_name.strip())

        return {"documents": documents, "uploaders": list(uploaders)}

    def insert_documents(documents: List[Document]):
        vectorstore = FAISS.from_documents(documents, embedding=embedding_model)

        try:
            old_vs = FAISS.load_local(folder, embeddings=embedding_model)
            vectorstore.merge_from(old_vs)
        except RuntimeError:
            # Meaning it doesn't exist
            ...

        vectorstore.save_local(folder)

    documents = []
    if "entries" in video_info:
        for video in video_info["entries"]:
            data_ = get_video_info(video)
            with YoutubeDL(options) as ydl:
                try:
                    data = get_video_info(
                        ydl.extract_info(data_["video_id"], download=False)
                    )
                except DownloadError:
                    continue
            if data["video_id"] == data["channel_id"]:
                continue
            documents.extend(
                [
                    create_return_document(
                        text=f"""Title: {data['title']}\nDescription: {data['description']}""",
                        file_id=data["video_id"],
                        start=-1,
                        end=-1,
                    )
                ]
            )
            if not data["subtitles"]:
                continue
            subtitles = StringIO(data["subtitles"])
            subtitles.seek(0)
            documents.extend(
                subtitles_to_documents(
                    data["channel_name"], data["video_id"], subtitles
                )["documents"]
            )

            insert_documents(documents)
            documents = []
    else:
        data = get_video_info(video_info)
        documents.extend(
            [
                create_return_document(
                    text=f"""Title: {data['title']}\nDescription: {data['description']}""",
                    file_id=data["video_id"],
                    start=-1,
                    end=-1,
                )
            ]
        )
        subtitles = StringIO(data["subtitles"])
        subtitles.seek(0)
        documents.extend(
            subtitles_to_documents(data["channel_name"], data["video_id"], subtitles)[
                "documents"
            ]
        )

        insert_documents(documents)
        documents = []

    return name


from langchain.chains import LLMChain
from langchain.chains import ConversationalRetrievalChain
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.chains.conversational_retrieval.prompts import CONDENSE_QUESTION_PROMPT
from langchain.vectorstores.base import VectorStoreRetriever


def return_chain_from_vs_ids(vs_names: List[str], memory, prompt_type: str, llm):
    """Load Relevant VectorStores and construct a LangChain Chain."""
    if not len(vs_names):
        return
    chain_vs: FAISS = FAISS.load_local(
        str((vectorstore_dir / vs_names.pop()).absolute()), embeddings=embedding_model
    )
    for path in vs_names:
        chain_vs.merge_from(
            FAISS.load_local((vectorstore_dir / path), embeddings=embedding_model)
        )
    # Watch out, since vs_names are literal filenames, if they're meant to be supplied directly from the client, it could cause a vulnerability. Ensure that these are obfuscated and abstracted over, like having a dictionary connecting random strings to these vs_ids, and have those random strings be selected from the client side. Else, validate vs_ids fon the server to ensure they exist before sending them here.
    # -- This has been addressed

    retriever = VectorStoreRetriever(vectorstore=chain_vs)
    doc_chain = load_qa_with_sources_chain(llm, chain_type=prompt_type.value)
    question_generator = LLMChain(llm=llm, prompt=CONDENSE_QUESTION_PROMPT)

    from langchain.memory import ConversationBufferMemory

    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

    chain = ConversationalRetrievalChain(
        retriever=retriever,
        question_generator=question_generator,
        combine_docs_chain=doc_chain,
        memory=memory,
    )

    return chain


# -------------------------------- #
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI
from threading import Thread

app = FastAPI()
build_dir = Path(__file__).parent / "build"

mapped_sources = {}
in_progress_sources = {}


@app.get("/")
def get_index():
    return HTMLResponse((build_dir / "app.html").read_text())


class GetSourcesResponsePayload(BaseModel):
    name: str
    type: str
    id: str


@app.get("/sources", response_model=list[GetSourcesResponsePayload])
def get_sources():
    dirs = [
        folder.stem
        for folder in list(vectorstore_dir.glob("*"))
        if folder.is_dir() and (folder / "index.faiss").exists()
    ]  # [name, name, ...]
    names_in_mapping = [el["name"] for el in mapped_sources.values()]
    for record in dirs:
        if record in names_in_mapping:
            continue
        rec_id = str(uuid4())
        mapped_sources[rec_id] = {
            "name": record,
            "type": "UserAdded",
            "id": rec_id,
        }
    return list({**mapped_sources, **in_progress_sources}.values())


class AddSourcePayload(BaseModel):
    url: str
    name: str


@app.post("/create")
def add_source(data: AddSourcePayload):
    rec_id = str(uuid4())
    in_progress_sources[rec_id] = {"name": data.name, "type": "Creating", "id": rec_id}

    def create_source():
        process_url(data.url, name=data.name)
        del in_progress_sources[rec_id]

    t = Thread(target=create_source)
    t.start()


class PromptTypeEnum(Enum):
    stuff = "stuff"
    refine = "refine"
    map_reduce = "map_reduce"
    map_rerank = "map_rerank"


class ConfigurationPayload(BaseModel):
    prompt_type: PromptTypeEnum
    temperature: float
    top_k: int
    token: str


class HistoryElementPayload(BaseModel):
    human: bool
    content: str
    sources: list = []


class ChatPayload(BaseModel):
    configuration: ConfigurationPayload
    history: list[HistoryElementPayload]
    sources: list


@app.post("/chat")
def chat(data: ChatPayload):
    history = ConversationBufferMemory()
    print(mapped_sources)
    chain = return_chain_from_vs_ids(
        vs_names=[mapped_sources[el]["name"] for el in data.sources],
        memory=history,
        prompt_type=data.configuration.prompt_type,
        llm=OpenAI(
            openai_api_key=data.configuration.token,
            temperature=data.configuration.temperature,
        ),
    )
    response = chain(
        include_run_info=True,
        return_only_outputs=False,
        inputs={"question": data.history.pop().content},
    )
    print(response)

    to_return = {
        "content": response["answer"].split("SOURCES:")[0],
    }

    try:
        to_return["sources"] = [
            {
                "source": source.replace("https://youtu.be/", "").split("?")[0].strip(),
                "start": int(
                    source.replace("https://youtu.be/", "").split("?t=")[1].strip()
                ),
            }
            for source in [
                element
                for sublist in [
                    source.split("\n")
                    for source in response["answer"]
                    .split("SOURCES:")[1]
                    .strip()
                    .split(",")
                ]
                for element in sublist
            ]
        ]
    except IndexError:
        # Meaning that no sources were provided
        to_return["sources"] = []

    return to_return

    return {
        "content": "test",
        "sources": [
            {"source": "_jhDBSVxvzk", "start": 5},
            {"source": "ijo0H9giSbA", "start": 10},
        ],
    }


app.mount("/", StaticFiles(directory=build_dir), name="static")

"""
|- When a Source is added, create a temporary entry in the sources dictionary `{"name": "Creating {}...", "id": "placeholder"}`, and remove it when the source is done being indexed.
|- If we use qdrant for vector storage, we can store source_ids (equivalent to collection names in qdrant) in a configuration.json file.

|- On source creation, spawn a thread/asynchronously use `yt-dlp` or a relevant python package to download only the subtitles for all videos from the URL.
|-> Run the "10s Splitter" from the NSRCEL Project (splits vtt files into chunks of minimum 10s of text based on timestamps)
|-> Use fast embedding library from huggingface and index+ingest the split documents into the Vectorstore

- On source creation:frontend, add validation for input (supposed to be URL). Also add on __server__ side.

|- On Post:/chat, correlate sources in post body to source_ids in vectorstore configuration file holding collection names, take the ones that exist and create a chain from langchain with them, to allow DocumentRetriever to access documents from all chained stores.
Note: We'll likely go with FAISS, or Langchain's VectorStores, whichever uses a more efficient algorithm (taking speed into account, as well), as they're easier to bundle in an application. It's not as simple to bundle a qdrant server as it would be to bundle Langchain's VectorStores or Langchain+FAISS - as these rely on simple file exports/imports.
"""
