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

addSongButton.onclick = async function () {
  if (!userId) {
    message.innerText = "User not logged in.";
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

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
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

  let songs = await send("getSongs", userId) as Song[];
  if (!songs) songs = [];


  }
