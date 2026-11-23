const playlists = {
  rock: { name: "Rock nacional de los 90", videos: ["T_FkEw27XJ0", "Jf_Ach2THWs"] },
  lentos: { name: "Los lentos inolvidables", videos: ["yCC_b5WHLX0", "Y0S7jebCkbU", "m6_wV9DtZTU"] },
  hits: { name: "Hits de los 2000", videos: ["eap0G9ldKc0", "y8rBC6GCUjg", "a8Rwz6zBJSE"] },
  clasicos: { name: "Clásicos para cantar", videos: ["CRBincBc_8k", "1To_Wz5RWi0", "hReAuaAuJOE"] }
};

const buttons = document.querySelectorAll("[data-playlist]");
const player = document.querySelector("#reproductor");
const status = document.querySelector("#track-status");
const watchLink = document.querySelector("#youtube-link");

const idleDisplay = player.firstElementChild;
const floating = document.querySelector("#floating-rock");
const floatingPlay = document.querySelector("#floating-play");
const floatingIcon = document.querySelector("#floating-icon");
const floatingLabel = document.querySelector("#floating-label");
const floatingPlayerLink = document.querySelector("#floating-player-link");
let selected = null;
let startedFromFloating = false;

function updateControls() {
  for (const option of buttons) {
    option.setAttribute("aria-pressed", String(option.dataset.playlist === selected));
  }

  floatingIcon.textContent = startedFromFloating ? "■" : "▶";
  floatingLabel.textContent = startedFromFloating ? "Detener música" : "Rock nacional";
  floatingPlay.setAttribute("aria-label", startedFromFloating ? "Detener música" : "Reproducir rock nacional de los 90");
  floatingPlayerLink.hidden = !startedFromFloating;
}

function loadPlaylist(key, playOnLoad = false) {
  const { name, videos } = playlists[key];
  const [first, ...queue] = videos;
  const frame = document.createElement("iframe");
  const embed = new URL(first, "https://www.youtube-nocookie.com/embed/");
  embed.searchParams.set("playlist", queue.join(","));
  embed.searchParams.set("autoplay", playOnLoad ? "1" : "0");
  frame.src = embed.href;
  frame.title = "Reproductor de YouTube · " + name;
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.allowFullscreen = true;
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  player.replaceChildren(frame);

  selected = key;
  startedFromFloating = playOnLoad;
  status.textContent = "Playlist seleccionada · " + name;
  watchLink.href = "https://www.youtube.com/watch?v=" + first;
  watchLink.hidden = false;
  updateControls();
}

function showPlayer() {
  player.scrollIntoView({ block: "start" });
  player.querySelector("iframe")?.focus({ preventScroll: true });
}

for (const button of buttons) {
  button.addEventListener("click", () => {
    if (selected !== button.dataset.playlist) loadPlaylist(button.dataset.playlist);
    showPlayer();
  });
}

floatingPlay.addEventListener("click", () => {
  floating.classList.add("interacted");

  if (startedFromFloating) {
    player.replaceChildren(idleDisplay);
    status.textContent = "Sin playlist seleccionada";
    watchLink.hidden = true;
    selected = null;
    startedFromFloating = false;
    updateControls();
    return;
  }

  loadPlaylist("rock", true);
});

floatingPlayerLink.addEventListener("click", (event) => {
  event.preventDefault();
  showPlayer();
});

updateControls();
floating.hidden = false;
