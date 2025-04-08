import { send } from "../utilities";
let musicPlayer = document.querySelector("#musicPlayer") as HTMLDivElement;

type Song = {
  name: string;
  singer: string;
  imageUrl: string;
  audioUrl: string;
};

// נטען את userId מתוך localStorage (שנשמר לאחר login/signup)
let userId = localStorage.getItem("userId");

// טוען את השירים מהשרת עבור המשתמש הנוכחי
async function loadSongs() {
  if (!userId) return;

  musicPlayer.innerHTML = ""; // מאפס את תצוגת השירים

  let songs = await send("getSongs", userId) as Song[];
  if (!songs || songs.length === 0) {
    // אם אין שירים, נוסיף שירים דוגמתיים
    songs = [
      { name: "i love it", singer: "Icona Pop, Charli xcx", imageUrl: "https://did.li/yF6CN", audioUrl: "https://did.li/ndsx5" },
      { name: "Song Title 2", singer: "Artist 2", imageUrl: "image2.jpg", audioUrl: "audio2.mp3" },
      { name: "Song Title 3", singer: "Artist 3", imageUrl: "image3.jpg", audioUrl: "audio3.mp3" }
    ];
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
loadSongs();
