import { send } from "../utilities";

let songName = document.querySelector("#songName") as HTMLInputElement;
let singerName = document.querySelector("#singerName") as HTMLInputElement;
let imageUrl = document.querySelector("#imageUrl") as HTMLInputElement;
let audioUrl = document.querySelector("#audioUrl") as HTMLInputElement;
let addSongButton = document.querySelector(".addSongButton") as HTMLButtonElement;
let message = document.querySelector("#message") as HTMLDivElement;
let musicPlayer = document.querySelector("#musicPlayer") as HTMLDivElement;

type Song = {
  name: string;
  singer: string;
  imageUrl: string;
  audioUrl: string;
};

// Load userId from localStorage (saved after login/signup)
let userId = localStorage.getItem("userId");

function isValidYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}/.test(url);
}

addSongButton.onclick = async function () {
  if (!userId) {
    message.innerText = "User not logged in.";
    return;
  }

  if (!isValidYouTubeUrl(audioUrl.value)) {
    message.innerText = "😞 We couldn't add your song - Invalid YouTube URL";
    return;
  }

  let response = await send("addSong", [
    songName.value,
    singerName.value,
    imageUrl.value,
    audioUrl.value,
    userId
  ]);

  if (response === "Song added successfully") {
    message.innerText = "🎉 The song was successfully added!";
    clearInputs();
    loadSongs();
  } else {
    message.innerText = "😞 We couldn't add your song";
  }
};
function clearInputs() {
  songName.value = "";
  singerName.value = "";
  imageUrl.value = "";
  audioUrl.value = "";
}

async function loadSongs() {
  if (!userId) return;

  musicPlayer.innerHTML = "";

  let songs = await send("getSong", userId) as Song[];
  if (!songs) songs = [];


  }
