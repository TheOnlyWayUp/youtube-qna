<script>
  import MessageList from "./MessageList.svelte";
  import MessageInput from "./MessageInput.svelte";
</script>

<div class="flex-grow m-10">
  <div class="card card-compact w-full h-full bg-base-200 shadow-xl rounded-sm">
    <div class="card-body">
      <h2 class="card-title">Youtube QnA</h2>

      <div class="flex flex-col min-h-full">
        <div class="overflow-y-auto min-h-[75vh] max-h-[75vh] mb-5 ml-5">
          <MessageList />
        </div>
        <div class="flex-grow card-actions justify-center">
          <div class="form-control w-full mx-10 mb-5">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
