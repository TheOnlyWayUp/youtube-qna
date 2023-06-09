<script>
  import {
    content,
    history,
    configuration,
    selected_sources,
  } from "$lib/stores.js";

  let processing_chat = false;

  async function send_chat_message() {
    $history.push({
      human: true,
      content: $content,
    });
    processing_chat = true;

    let response = await fetch("/chat", {
      method: "POST",
      body: JSON.stringify({
        configuration: $configuration,
        history: $history,
        sources: $selected_sources,
      }),
      headers: { "Content-Type": "application/json" },
    });

    let data = await response.json();
    if (data.content) {
      $content = "";

      $history.push({
        human: false,
        content: data.content,
        sources: data.sources,
      });
    } else {
      alert("There was an Error.");
    }
    processing_chat = false;

    $history = $history;
  }

  let placeholder = "Explain A/B Testing in Five Points";

  $: {
    if (!$configuration.token.length) {
      placeholder = "Enter OpenAI API Token in Configuration Panel.";
    } else {
      placeholder = "Explain A/B Testing in Five Points";
    }
  }
</script>

<div class="input-group w-full">
  <textarea
    type="text"
    {placeholder}
    place
    class=" input input-bordered w-full placeholder-gray-600 text-white"
    bind:value={$content}
    class:input-disabled={processing_chat || !$configuration.token.length}
    disabled={processing_chat || !$configuration.token.length}
    on:submit={async (e) => {
      await send_chat_message();
    }}
  />
  <button
    class="btn btn-square"
    on:click={async (e) => {
      await send_chat_message();
    }}
    class:btn-disabled={processing_chat}
    disabled={processing_chat}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-send"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  </button>
</div>
