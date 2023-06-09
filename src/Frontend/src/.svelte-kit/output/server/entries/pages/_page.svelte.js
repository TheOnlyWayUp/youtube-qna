import { c as create_ssr_component, a as subscribe, b as add_attribute, d as each, e as escape, v as validate_component, f as createEventDispatcher } from "../../chunks/index2.js";
import { r as readable, w as writable } from "../../chunks/index.js";
let prompt_types_ = [
  { name: "stuff" },
  { name: "refine" },
  { name: "map_reduce" },
  { name: "map_rerank" }
];
let prompt_types = readable(prompt_types_);
let configuration = writable({
  prompt_type: prompt_types_[0].name,
  temperature: 0.1,
  top_k: 4,
  token: ""
});
let content = writable("");
let selected_sources = writable([]);
let history = writable([
  // { human: true, content: "Hey what's up?" },
  // { human: false, content: "test", sources: [{ source: '_jhDBSVxvzk', start: 5 }, { source: 'ijo0H9giSbA', start: 10 }] }
]);
let players = writable([]);
const Configuration = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $configuration, $$unsubscribe_configuration;
  let $prompt_types, $$unsubscribe_prompt_types;
  $$unsubscribe_configuration = subscribe(configuration, (value) => $configuration = value);
  $$unsubscribe_prompt_types = subscribe(prompt_types, (value) => $prompt_types = value);
  $$unsubscribe_configuration();
  $$unsubscribe_prompt_types();
  return `<div class="min-w-full shadow-xl flex-grow max-h-[50vh] rounded-lg"><div class="card-body"><h2 class="card-title justify-center">Configuration</h2>
    <div><ul><li><div class="form-control w-full max-w-xs"><label class="label flex flex-col"><span class="${["label-text", !$configuration.token.length ? "text-red-500" : ""].join(" ").trim()}">OpenAI API Key</span>
              <input type="password" class="${[
    "input input-xs input-ghost w-full max-w-xs",
    !$configuration.token.length ? "input-ghost" : ""
  ].join(" ").trim()}"${add_attribute("value", $configuration.token, 0)}></label></div></li>
        <li><div class="form-control w-full max-w-xs"><label class="label flex flex-col"><span class="label-text">Temperature</span>
              <input type="number" placeholder="Type here" class="input input-xs input-bordered w-full max-w-xs"${add_attribute("value", $configuration.temperature, 0)}></label></div></li>
        <li><div class="form-control w-full max-w-xs"><label class="label flex flex-col"><span class="label-text">No. Documents (top_k)</span>
              <input type="number" placeholder="Type here" class="input input-xs input-bordered w-full max-w-xs"${add_attribute("value", $configuration.top_k, 0)}></label></div></li>
        <li><div class="form-control w-full max-w-xs"><label class="label flex flex-col"><span class="label-text">Prompt Type</span>
              <select class="select select-ghost select-xs w-full max-w-xs">${each($prompt_types, (prompt) => {
    return `<option${add_attribute("value", prompt.name, 0)}>${escape(prompt.name)}</option>`;
  })}</select></label></div></li></ul></div></div></div>`;
});
const PickAddSources = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selected_sources, $$unsubscribe_selected_sources;
  $$unsubscribe_selected_sources = subscribe(selected_sources, (value) => $selected_sources = value);
  let create_payload = { url: "", name: "" };
  let source_data = [];
  $$unsubscribe_selected_sources();
  return `<div class="min-w-full rounded-lg shadow-xl flex-grow"><div class="card-body"><h2 class="card-title justify-center">Sources</h2>
    <div class="overflow-y-auto">${each(source_data, (source) => {
    return `<div class="bg-base-200"><label class="flex cursor-pointer label tooltip"${add_attribute("data-tip", source.type, 0)}${add_attribute("for", source.id, 0)}><input type="checkbox" class="checkbox checkbox-sm"${add_attribute("value", source.id, 0)}${add_attribute("id", source.id, 0)} checked${~$selected_sources.indexOf(source.id) ? add_attribute("checked", true, 1) : ""}>
            <span class="label-text">${escape(source.name)}</span></label>
        </div>`;
  })}</div>
    <div class="card-actions justify-center"><label for="my_modal_6" class="btn btn-outline mt-5">+ Add</label>

      <input type="checkbox" id="my_modal_6" class="modal-toggle">
      <div class="modal"><div class="modal-box"><h3 class="font-bold text-lg">Add Source</h3>
          <div class="py-4"><div class="form-control w-full max-w-xs"><label class="label"><span class="label-text">URL:</span>
                <input type="url" placeholder="of a Channel, Video or Playlist." class="ml-2 input input-bordered w-full max-w-sm"${add_attribute("value", create_payload.url, 0)}></label>
              <label class="label"><span class="label-text">Name:</span>
                <input type="text" placeholder="Name this Source" class="ml-2 input input-bordered input-primary w-full max-w-sm"${add_attribute("value", create_payload.name, 0)}></label></div></div>
          <div class="modal-action w-full flex"><label for="my_modal_6" class="btn flex-grow btn-primary">Add</label>
            <label for="my_modal_6" class="btn flex-shrink btn-outline">Close!</label></div></div></div></div></div></div>`;
});
const ConfSourceGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="w-64 flex flex-col items-stretch my-2">${validate_component(PickAddSources, "PickAddSources").$$render($$result, {}, {}, {})}

  <div class="divider"></div>

  ${validate_component(Configuration, "Configuration").$$render($$result, {}, {}, {})}</div>`;
});
const YouTube = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_players;
  $$unsubscribe_players = subscribe(players, (value) => value);
  let { videoId } = $$props;
  let { startAt } = $$props;
  let player;
  let divId = "player_" + parseInt(Math.random() * 109999);
  function play() {
    player.playVideo();
  }
  createEventDispatcher();
  if ($$props.videoId === void 0 && $$bindings.videoId && videoId !== void 0)
    $$bindings.videoId(videoId);
  if ($$props.startAt === void 0 && $$bindings.startAt && startAt !== void 0)
    $$bindings.startAt(startAt);
  if ($$props.play === void 0 && $$bindings.play && play !== void 0)
    $$bindings.play(play);
  $$unsubscribe_players();
  return `



<div${add_attribute("id", divId, 0)}></div>`;
});
const Message = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_players;
  $$unsubscribe_players = subscribe(players, (value) => value);
  let { message } = $$props;
  let random = Math.random() * 1e4;
  if ($$props.message === void 0 && $$bindings.message && message !== void 0)
    $$bindings.message(message);
  $$unsubscribe_players();
  return `<div class="${["text-xl rounded-none flex join", !message.human ? "pb-5" : ""].join(" ").trim()}"><div class="avatar placeholder"><div class="${[
    "text-neutral-content w-12 join-item",
    (message.human ? "rounded-tl-md" : "") + " " + (message.human ? "rounded-bl-md" : "") + " " + (message.human ? "bg-neutral" : "") + " " + (!message.human ? "bg-neutral-focus" : "")
  ].join(" ").trim()}"><span>${message.human ? `H` : `AI`}</span></div></div>
  <div class="${[
    "font-normal rounded-none join-item max-w-[700px] w-full",
    message.human ? "bg-base-300" : ""
  ].join(" ").trim()}"><p class="${["break-normal ml-3 mt-4", !message.human ? "text-lg" : ""].join(" ").trim()}">${escape(message.content)}</p>
    ${!message.human ? `<p class="prose mt-4 ml-3">Sources:</p>
      <div class="carousel w-[640px] space-x-4 bg-neutral rounded-md join-item ml-3">${each(message.sources, (source, idx) => {
    return `<div${add_attribute("id", `item_${source.source}_${idx + 1}_${random}`, 0)} class="carousel-item w-full">${validate_component(YouTube, "YouTube").$$render(
      $$result,
      {
        videoId: source.source,
        startAt: source.start
      },
      {},
      {}
    )}
          </div>`;
  })}</div>
      <div class="flex w-full py-2 gap-2 join-item ml-3">${each(message.sources, (source, idx) => {
    return `<a${add_attribute("href", `#${`item_${source.source}_${idx + 1}_${random}`}`, 0)} class="btn btn-outline">${escape(idx + 1)}</a>`;
  })}</div>` : ``}</div></div>`;
});
const MessageList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $history, $$unsubscribe_history;
  $$unsubscribe_history = subscribe(history, (value) => $history = value);
  $$unsubscribe_history();
  return `<table class="table"><tbody class="overflow-y-auto space-y-1">${each($history, (message) => {
    return `${validate_component(Message, "Message").$$render($$result, { message }, {}, {})}
      ${!message.human ? `<div class="divider my-2"></div>` : ``}`;
  })}</tbody></table>`;
});
const MessageInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $configuration, $$unsubscribe_configuration;
  let $$unsubscribe_history;
  let $content, $$unsubscribe_content;
  let $$unsubscribe_selected_sources;
  $$unsubscribe_configuration = subscribe(configuration, (value) => $configuration = value);
  $$unsubscribe_history = subscribe(history, (value) => value);
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_selected_sources = subscribe(selected_sources, (value) => value);
  let placeholder = "Explain A/B Testing in Five Points";
  {
    {
      if (!$configuration.token.length) {
        placeholder = "Enter OpenAI API Token in Configuration Panel.";
      } else {
        placeholder = "Explain A/B Testing in Five Points";
      }
    }
  }
  $$unsubscribe_configuration();
  $$unsubscribe_history();
  $$unsubscribe_content();
  $$unsubscribe_selected_sources();
  return `<div class="input-group w-full"><textarea type="text"${add_attribute("placeholder", placeholder, 0)} place class="${[
    "input input-bordered w-full placeholder-gray-600 text-white",
    !$configuration.token.length ? "input-disabled" : ""
  ].join(" ").trim()}" ${!$configuration.token.length ? "disabled" : ""}>${$content || ""}</textarea>
  <button class="${["btn btn-square", ""].join(" ").trim()}" ${""}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button></div>`;
});
const MessageGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="flex-grow m-10"><div class="card card-compact w-full h-full bg-base-200 shadow-xl rounded-sm"><div class="card-body"><h2 class="card-title">Youtube QnA</h2>

      <div class="flex flex-col min-h-full"><div class="overflow-y-auto min-h-[75vh] max-h-[75vh] mb-5 ml-5">${validate_component(MessageList, "MessageList").$$render($$result, {}, {}, {})}</div>
        <div class="flex-grow card-actions justify-center"><div class="form-control w-full mx-10 mb-5">${validate_component(MessageInput, "MessageInput").$$render($$result, {}, {}, {})}</div></div></div></div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="flex flex-col sm:flex-row min-w-full min-h-screen">${validate_component(ConfSourceGrid, "ConfSourceGrid").$$render($$result, {}, {}, {})}

  ${validate_component(MessageGrid, "MessageGrid").$$render($$result, {}, {}, {})}</div>`;
});
export {
  Page as default
};
