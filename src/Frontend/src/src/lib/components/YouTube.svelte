<!-- <script>
  export let videoId;
  export let startAt;
  import { onMount, onDestroy } from "svelte";
  import { players } from "$lib/stores.js";

  onMount(() => {
    // Initialize the YouTube player

    window.onYouTubeIframeAPIReady = () => {
      new YT.Player(`iframe_${videoId}_${startAt}`, {
        events: {
          onReady: (event) => {
            $players.push(event.target);
            console.log("READY, PUSHED", $players);
          },
        },
      });
    };

    console.log("playersInMount", $players);
  });
</script>

<iframe
  width="560"
  height="315"
  src={`https://www.youtube.com/embed/${videoId}?start=${startAt}&fs=0&modestbranding=1&enablejsapi=1`}
  title="YouTube video player"
  frameborder="0"
  id={`iframe_${videoId}_${startAt}`}
/> -->

<script>
  // https://svelte.dev/repl/db36836fce4c42938ef192ef3a8a3a4b

  import { createEventDispatcher, onMount } from "svelte";
  import { players } from "$lib/stores.js";

  onMount(() => {
    if (!$players.length) {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () =>
        window.dispatchEvent(new Event("iframeApiReady"));
    } else {
      create_player();
    }

    function create_player() {
      player = new YT.Player(divId, {
        height: "390",
        width: "640",
        videoId: videoId,
        playerVars: {
          fs: 0,
          modestbranding: 1,
          start: startAt,
        },
        events: {
          onReady: playerIsReady,
          // onStateChange: playerStateChange,
        },
      });
    }

    window.addEventListener("iframeApiReady", function (e) {
      create_player();
    });
  });

  export let videoId;
  export let startAt;

  let player;
  let divId = "player_" + parseInt(Math.random() * 109999);

  export function play() {
    player.playVideo();
  }
  const dispatch = createEventDispatcher();

  // function playerStateChange({ data }) {
  //   dispatch("PlayerStateChange", data);
  //   console.log(data);
  //   let strReturn = "";
  //   if (data == -1) {
  //     strReturn = "(unstarted)";
  //   }
  //   if (data == 0) {
  //     strReturn = "(ended)";
  //   }
  //   if (data == 1) {
  //     strReturn = "(playing)";
  //   }
  //   if (data == 2) {
  //     strReturn = "(paused)";
  //   }
  //   if (data == 3) {
  //     strReturn = "(buffering)";
  //   }
  //   if (data == 5) {
  //     strReturn = "(video cued).";
  //   }
  //   dispatch("PlayerStateChangeString", strReturn);
  // }
  function playerIsReady() {
    dispatch("Ready");
    $players.push(player);
    console.log("pushed", $players);
    // setInterval(() => {
    //   dispatch("currentPlayTime", player.getCurrentTime());
    //   //console.log(player.getCurrentTime())
    // }, 1000);
  }
</script>

<div id={divId} />
