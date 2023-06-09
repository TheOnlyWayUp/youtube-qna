<script>
  import { selected_sources } from "$lib/stores.js";

  async function populate_sources() {
    let request = await fetch("/sources", { method: "GET" });
    source_data = await request.json();
    return source_data;
  }

  let create_payload = {
    url: "",
    name: "",
  };

  async function create_source() {
    await fetch("/create", {
      method: "POST",
      body: JSON.stringify(create_payload),
      headers: { "Content-Type": "application/json" },
    });
    create_payload.url = "";
    create_payload.name = "";
  }

  let source_data = [];

  import { onMount } from "svelte";

  const intervalTime = 15000; // Run every 5 seconds

  onMount(() => {
    source_data = populate_sources();

    const interval = setInterval(populate_sources, intervalTime);

    source_data = source_data;

    return () => clearInterval(interval);
  });
</script>

<div class="min-w-full rounded-lg shadow-xl flex-grow">
  <div class="card-body">
    <h2 class="card-title justify-center">Sources</h2>
    <div class="overflow-y-auto">
      {#each source_data as source (source.id)}
        <div class="bg-base-200">
          <label
            class="flex cursor-pointer label tooltip"
            data-tip={source.type}
            for={source.id}
          >
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              bind:group={$selected_sources}
              value={source.id}
              id={source.id}
              checked
            />
            <span class="label-text">{source.name}</span>
          </label>
        </div>
      {/each}
    </div>
    <div class="card-actions justify-center">
      <label for="my_modal_6" class="btn btn-outline mt-5">+ Add</label>

      <input type="checkbox" id="my_modal_6" class="modal-toggle" />
      <div class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Add Source</h3>
          <div class="py-4">
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">URL:</span>
                <input
                  type="url"
                  placeholder="of a Channel, Video or Playlist."
                  class="ml-2 input input-bordered w-full max-w-sm"
                  bind:value={create_payload.url}
                />
              </label>
              <label class="label">
                <span class="label-text">Name:</span>
                <input
                  type="text"
                  placeholder="Name this Source"
                  class="ml-2 input input-bordered input-primary w-full max-w-sm"
                  bind:value={create_payload.name}
                />
              </label>
            </div>
          </div>
          <div class="modal-action w-full flex">
            <label
              for="my_modal_6"
              class="btn flex-grow btn-primary"
              on:click={async (e) => {
                await create_source();
              }}>Add</label
            >
            <label for="my_modal_6" class="btn flex-shrink btn-outline"
              >Close!</label
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
