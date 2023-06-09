FROM python:3.9-slim

COPY requirements.txt requirements.txt
RUN python3 -m pip install -r requirements.txt
RUN python3 -c 'from langchain.embeddings import HuggingFaceEmbeddings;HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")'

WORKDIR /app
COPY src /app/src

EXPOSE 80

ENTRYPOINT [ "uvicorn" ]
CMD [ "src.server:app", "--host=0.0.0.0", "--port=80"]