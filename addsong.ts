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

// נטען את userId מתוך localStorage (שנשמר לאחר login/signup)
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
  ]) as string;

  if (response === "Song added successfully") {
    message.innerText = "🎉 the song was succsesfully added";
    clearInputs();
    loadSongs(); // טען מחדש את השירים מהשרת
  } else {
    message.innerText = "😞 we couldn't add your song";
  }
};

function clearInputs() {
  songName.value = "";
  singerName.value = "";
  imageUrl.value = "";
  audioUrl.value = "";
}


// טוען את השירים מהשרת עבור המשתמש הנוכחי
async function loadSongs() {
  if (!userId) return;

  musicPlayer.innerHTML = "";

  let songs = await send("getSongs", userId) as Song[];
if (!songs) {
  songs = [];
}

  songs.forEach((song) => {
    let card = document.createElement("div");
    card.className = "song-card";

    let img = document.createElement("img");
    img.src = song.imageUrl;

    let info = document.createElement("div");
    info.innerHTML = `<h3>${song.name}</h3><p>${song.singer}</p>`;

    let button = document.createElement("button");
    button.textContent = "▶️";
    let audio = new Audio(song.audioUrl);

    button.onclick = () => {
      audio.play();
    };

    card.appendChild(img);
    card.appendChild(info);
    card.appendChild(button);
    musicPlayer.appendChild(card);
  });
}

// טוען את השירים כשנטענת הדף
loadSongs()
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
    ]) as string;
  
    if (response === "Song added successfully") {
      message.innerText = "🎉 The song was successfully added!";
      clearInputs();
      loadSongs(); // Reload the songs from the server
  
      // Redirect to index.html after song is added
      setTimeout(() => {
        window.location.href = 'index.html'; // Redirect after 2 seconds
      }, 2000);
    } else {
      message.innerText = "😞 We couldn't add your song";
    }
  };
