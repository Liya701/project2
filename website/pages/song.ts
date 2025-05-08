import { send } from "../utilities";

let titleH1 = document.querySelector("#titleH1") as HTMLHeadingElement;
let coverImg = document.querySelector("#coverImg") as HTMLImageElement;
let audioPlayer = document.querySelector("#audioPlayer") as HTMLAudioElement;
let favoriteButton = document.querySelector("#favoriteButton") as HTMLButtonElement;
let unfavoriteButton = document.querySelector("#unfavoriteButton") as HTMLButtonElement;

let userId = localStorage.getItem("userId");
let url = new URLSearchParams(location.search);
let songId = Number(url.get("songId"));

favoriteButton.onclick = async function () {
  await send("addToFavorites", [userId, songId ]);

  favoriteButton.disabled = true;
  unfavoriteButton.disabled = false;
};

unfavoriteButton.onclick = async function () {
  await send("removeFromFavorites", [userId, songId ]);

  favoriteButton.disabled = false;
  unfavoriteButton.disabled = true;
};

async function loadSong() {
  let song = await send("getSong", songId);

  document.title = song.name;
  titleH1.innerText = song.name;
  coverImg.src = song.imageUrl;
  audioPlayer.src = song.audioUrl;

  if (!userId) {
    favoriteButton.style.display = "none";
    unfavoriteButton.style.display = "none";
    return;
  }

  let isFavorite = await send("getIsFavorite", { userId, songId });

  favoriteButton.disabled = isFavorite;
  unfavoriteButton.disabled = !isFavorite;
}

loadSong();