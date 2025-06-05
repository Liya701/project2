import { send } from "../utilities";

type Song = {
  id: number;
  name: string;
  imageUrl: string;
  audioUrl: string;
};

let titleH1 = document.querySelector("#titleH1") as HTMLHeadingElement;
let coverImg = document.querySelector("#coverImg") as HTMLImageElement;
let audioPlayer = document.querySelector("#audioPlayer") as HTMLAudioElement;
let favoriteButton = document.querySelector("#favoriteButton") as HTMLButtonElement;
let unfavoriteButton = document.querySelector("#unfavoriteButton") as HTMLButtonElement;
let message = document.querySelector("#message") as HTMLParagraphElement | null;
let loggedInDiv = document.getElementById("loggedInDiv") as HTMLDivElement;
let greetingDiv = document.getElementById("greetingDiv") as HTMLDivElement;
let logOutButton = document.getElementById("logOutButton") as HTMLButtonElement;
let id = localStorage.getItem("userId");

logOutButton.onclick = function () {
  localStorage.removeItem("userId");
  location.href = "index.html";
};

async function getUsername() {
  if (id == null) {
    loggedInDiv.classList.add("hidden");
    return;
  }

  let username = await send("getUsername", id) as string | null;

  if (username == null) {
    loggedInDiv.classList.add("hidden");
    return;
  }

  greetingDiv.innerText = "Welcome, " + username + "!";
}

getUsername(); 

let userId = localStorage.getItem("userId");
let url = new URLSearchParams(location.search);
let songId = Number(url.get("songId"));

favoriteButton.onclick = async function () {
  await send("addToFavorites", [userId, songId]);
  favoriteButton.disabled = true;
  unfavoriteButton.disabled = false;
};

unfavoriteButton.onclick = async function () {
  await send("removeFromFavorites", [userId, songId]);
  favoriteButton.disabled = false;
  unfavoriteButton.disabled = true;
};

async function loadSong() {
  let songs = await send("getPreviews", userId) as Song[];
  let song = songs.find(s => s.id === songId);

  if (!song) {
    if (message) {
      message.innerText = "song not found😢";
    }
    return;
  }

  document.title = song.name;
  titleH1.innerText = song.name;
  coverImg.src = song.imageUrl;

  let youtubeMatch = song.audioUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/);
let videoId = youtubeMatch?.[1]; // כי את יודעת שהקישור בטוח תקני
let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

let iframe = document.createElement("iframe");
iframe.width = "300";
iframe.height = "200";
iframe.src = embedUrl;
iframe.allow = "autoplay";
iframe.allowFullscreen = true;
iframe.style.marginTop = "20px";
iframe.style.border = "none";

audioPlayer.replaceWith(iframe);

  if (!userId) {
    favoriteButton.style.display = "none";
    unfavoriteButton.style.display = "none";
    return;
  }

  let isFavorite = await send("getIsFavorite", [userId, songId]);

  favoriteButton.disabled = isFavorite;
  unfavoriteButton.disabled = !isFavorite;
}

loadSong();