
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

export function bootstrapApi() {
  // ===================================================
  // Load the IFrame Player API code asynchronously by creating a script
  // tag into the HTML dynamically.
  var tag = document.createElement('script');

  // --- tag.src = "https://www.youtube.com/iframe_api";
  tag.src = "http://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// ===================================================
// Create the <iframe> YouTube player after the API code downloads.
// --- function onYouTubeIframeAPIReady() {
export function onYouTubeIframeAPIReady() {
  window.ytplayer = new YT.Player('player', {
    height: '300',
    // width: '400',
    videoId: '6-oHBkikDBg',
    enablejsapi: 1,
    autoplay: 1,
    playsinline: 1,       // do not go fullscreen on iOS automatically
    rel: 0,               // do not show related videos at end of play
    playerVars: {         // try to force browsers to use HTML5 player
        html5: 1,
        origin: 'http://localhost:8080',
    },
    origin: 'http://localhost:8080',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onError
    }
  });
}

// ===================================================
// 4. The API will call this function when the video player is ready.
// --- async function onPlayerReady(ytubeEvent) {
export async function onPlayerReady(ytubeEvent) {
  // emit a custom event here so that Vue app can catch it and react
  //  accordingly

  // Create a new event, allow bubbling, and provide any data you want to pass to the "details" property
  const ytubeReady = new CustomEvent('ytube-ready', {
    bubbles: true,
    detail: { text: () => `YT Player Ready for Action.` }
  });

  document.dispatchEvent(ytubeReady);
  console.log(`PlayerReady (from GLOBAL)!`)
}

// ===================================================
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;
// --- function onPlayerStateChange(ytubeEvent) {
export function onPlayerStateChange(ytubeEvent) {
  if (ytubeEvent.data == YT.PlayerState.PLAYING && !done) {
    window.ytplayer.stopVideo();
    done = true;
  }

  //  create and emit a custom event here so that Vue app can catch it and react
  //  accordingly:
  //    -- allow bubbling
  //    -- pass along data via the "details" property
  const ytubeStateChanged = new CustomEvent('ytube-state-changed', {
    bubbles: true,
    detail: { data: ytubeEvent.data, text: () => `YT Player State has Changed.` }
  });

  document.dispatchEvent(ytubeStateChanged);
}


// ===================================================
// --- function onError(ytubeEvent) {
export function onError(ytubeEvent) {
  //  create and emit a custom event here so that Vue app can catch it and react
  //  accordingly
  //    -- allow bubbling
  //    -- pass along data via the "details" property
  const ytubeError = new CustomEvent('ytube-error', {
    bubbles: true,
    detail: { data: ytubeEvent.data, text: () => `YT Player Experienced an Error.` }
  });

  document.dispatchEvent(ytubeError);
}

