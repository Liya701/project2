
import { send } from "../utilities";

let titleH1 = document.querySelector("#titleH1") as HTMLHeadingElement;
let coverImg = document.querySelector("#coverImg") as HTMLImageElement;
let favoriteButton = document.querySelector("#favoriteButton") as HTMLButtonElement;
let unfavoriteButton = document.querySelector("#unfavoriteButton") as HTMLButtonElement;
let descriptionDiv = document.querySelector("#descriptionDiv") as HTMLDivElement;
let logOutButton = document.getElementById("logOutButton") as HTMLButtonElement;

let userId = localStorage.getItem("userId");
let songId = Number(new URLSearchParams(location.search).get("id"));

logOutButton.onclick = function () {
  localStorage.removeItem("userId");
  location.href = "index.html";
};

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

async function appendSong() {
  let songs = await send("getSong", userId) as any[];

  let song = songs.find(s => s.id === songId);
  if (!song) {
    titleH1.innerText = "song not found";
    return;
  }

  document.title = song.name;
  titleH1.innerText = song.name;
  coverImg.src = song.imageUrl;
  descriptionDiv.innerText = `Singer: ${song.singer}`;

  if (!userId) {
    favoriteButton.style.display = "none";
    unfavoriteButton.style.display = "none";
    return;
  }

  let isFavorite = await send("getIsFavorite", [userId, songId]) as boolean;
  favoriteButton.disabled = isFavorite;
  unfavoriteButton.disabled = !isFavorite;
}

appendSong();