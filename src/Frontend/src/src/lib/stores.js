import { writable, readable } from 'svelte/store';

let prompt_types_ = [
    { name: "stuff" },
    { name: "refine" },
    { name: "map_reduce" },
    { name: "map_rerank" },
]
export let prompt_types = readable(prompt_types_);
export let configuration = writable({
    prompt_type: prompt_types_[0].name,
    temperature: 0.1, top_k: 4,
    token: ""
});
export let content = writable("")
export let selected_sources = writable([]);
export let history = writable([
    // { human: true, content: "Hey what's up?" },
    // { human: false, content: "test", sources: [{ source: '_jhDBSVxvzk', start: 5 }, { source: 'ijo0H9giSbA', start: 10 }] }
])
export let players = writable([]);
