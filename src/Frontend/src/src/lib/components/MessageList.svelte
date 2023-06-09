<script>
  import { history } from "$lib/stores.js";
  import Message from "./Message.svelte";
</script>

<table class="table">
  <tbody class="overflow-y-auto space-y-1">
    {#each $history as message}
      <Message {message} />
      {#if !message.human}
        <div class="divider my-2" />
      {/if}
    {/each}
  </tbody>
</table>
