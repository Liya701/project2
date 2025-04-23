import { send } from "../utilities";

type Song = {
  name: string;
  singer: string;
  imageUrl: string;
  audioUrl: string;
};

let userId = localStorage.getItem("userId");
let songsContainer = document.querySelector("#songsContainer") as HTMLDivElement;

async function loadSongs() {
  if (!userId || !songsContainer) return;

  let songs = await send("getSongs", userId) as Song[];
  if (!songs) songs = [];

  songsContainer.innerHTML = "";

  songs.forEach(song => {
    let card = document.createElement("div");
    card.className = "song-card";

    let img = document.createElement("img");
    img.src = song.imageUrl;

    let title = document.createElement("h3");
    title.textContent = song.name;

    let artist = document.createElement("p");
    artist.textContent = song.singer;

    let playButton = document.createElement("button");
    playButton.textContent = "▶️";
    let audio = new Audio(song.audioUrl);

    playButton.onclick = () => {
      audio.play();
    };

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(artist);
    card.appendChild(playButton);
    songsContainer.appendChild(card);
  });
}

loadSongs();
