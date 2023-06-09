<script>
  import { prompt_types, configuration } from "$lib/stores.js";
</script>

<div class=" min-w-full shadow-xl flex-grow max-h-[50vh] rounded-lg">
  <div class="card-body">
    <h2 class="card-title justify-center">Configuration</h2>
    <div>
      <ul>
        <li>
          <div class="form-control w-full max-w-xs">
            <label class="label flex flex-col">
              <span
                class="label-text"
                class:text-red-500={!$configuration.token.length}
                >OpenAI API Key</span
              >
              <input
                type="password"
                class="input input-xs input-ghost w-full max-w-xs"
                class:input-ghost={!$configuration.token.length}
                bind:value={$configuration.token}
              />
            </label>
          </div>
        </li>
        <li>
          <div class="form-control w-full max-w-xs">
            <label class="label flex flex-col">
              <span class="label-text">Temperature</span>
              <input
                type="number"
                placeholder="Type here"
                class="input input-xs input-bordered w-full max-w-xs"
                bind:value={$configuration.temperature}
              />
            </label>
          </div>
        </li>
        <li>
          <div class="form-control w-full max-w-xs">
            <label class="label flex flex-col">
              <span class="label-text">No. Documents (top_k)</span>
              <input
                type="number"
                placeholder="Type here"
                class="input input-xs input-bordered w-full max-w-xs"
                bind:value={$configuration.top_k}
              />
            </label>
          </div>
        </li>
        <li>
          <div class="form-control w-full max-w-xs">
            <label class="label flex flex-col">
              <span class="label-text">Prompt Type</span>
              <select
                class="select select-ghost select-xs w-full max-w-xs"
                bind:value={$configuration.prompt_type}
              >
                {#each $prompt_types as prompt}
                  <option>{prompt.name}</option>
                {/each}
              </select>
            </label>
          </div>
        </li>
      </ul>
    </div>
  </div>
</div>
