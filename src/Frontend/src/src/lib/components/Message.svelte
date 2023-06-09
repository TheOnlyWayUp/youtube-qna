<script>
  export let message;
  import YouTube from "./YouTube.svelte";

  import { players } from "$lib/stores.js";
  import { browser } from "$app/environment";

  function pause() {
    if (browser) {
      $players.forEach((e) => e.pauseVideo());
    }
  }

  let random = Math.random() * 10000;
</script>

<div class="text-xl rounded-none flex join" class:pb-5={!message.human}>
  <div class="avatar placeholder">
    <div
      class="text-neutral-content w-12 join-item"
      class:rounded-tl-md={message.human}
      class:rounded-bl-md={message.human}
      class:bg-neutral={message.human}
      class:bg-neutral-focus={!message.human}
    >
      <span>
        {#if message.human}
          H
        {:else}
          AI
        {/if}
      </span>
    </div>
  </div>
  <div
    class:bg-base-300={message.human}
    class="font-normal rounded-none join-item max-w-[700px] w-full"
  >
    <p class="break-normal ml-3 mt-4" class:text-lg={!message.human}>
      {message.content}
    </p>
    {#if !message.human}
      <p class="prose mt-4 ml-3">Sources:</p>
      <div
        class="carousel w-[640px] space-x-4 bg-neutral rounded-md join-item ml-3"
      >
        {#each message.sources as source, idx}
          <div
            id={`item_${source.source}_${idx + 1}_${random}`}
            class="carousel-item w-full"
          >
            <YouTube videoId={source.source} startAt={source.start} />
          </div>
        {/each}
      </div>
      <div class="flex w-full py-2 gap-2 join-item ml-3">
        {#each message.sources as source, idx}
          <a
            href={`#${`item_${source.source}_${idx + 1}_${random}`}`}
            class="btn btn-outline"
            on:click={pause}>{idx + 1}</a
          >
        {/each}
      </div>
    {/if}
  </div>
</div>
