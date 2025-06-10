import { send } from "../utilities";

let songName = document.querySelector("#songName") as HTMLInputElement;
let singerName = document.querySelector("#singerName") as HTMLInputElement;
let imageUrl = document.querySelector("#imageUrl") as HTMLInputElement;
let audioUrl = document.querySelector("#audioUrl") as HTMLInputElement;
let addSongButton = document.querySelector(".addSongButton") as HTMLButtonElement;
let message = document.querySelector("#message") as HTMLDivElement;
let musicPlayer = document.querySelector("#musicPlayer") as HTMLDivElement;


// טיפוס שמגדיר איך שיר נראה - עם שם, זמר, תמונה וכתובת אודיו
type Song = {
  name: string;
  singer: string;
  imageUrl: string;
  audioUrl: string;
};

// מביא את מזהה המשתמש (שנשמר אחרי כניסה או הרשמה) מה-LocalStorage
let userId = localStorage.getItem("userId");

// פונקציה שבודקת אם הקישור שניתן הוא קישור תקין ליוטיוב (סינון בסיסי)
function isValidYouTubeUrl(url: string): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}/.test(url);
}

addSongButton.onclick = async function () {
  // אם אין משתמש מחובר - לא ניתן להוסיף שיר, ומוצגת הודעה מתאימה
  if (!userId) {
    message.innerText = "User not logged in.";
    return;  
  }

  // אם הקישור ליוטיוב לא תקין - יוצג למשתמש הודעה מתאימה
  if (!isValidYouTubeUrl(audioUrl.value)) {
    message.innerText = "😞 We couldn't add your song - Invalid YouTube URL";
    return;  
  }

  // שליחת בקשה לשרת להוספת השיר עם כל המידע שנאסף מהטופס
  let response = await send("addSong", [
    songName.value,
    singerName.value,
    imageUrl.value,
    audioUrl.value,
    userId
  ]);

  // במידה והשרת מחזיר בהצלחה - מציגים הודעה חיובית, מנקים את השדות וטוענים מחדש את רשימת השירים
  if (response === "Song added successfully") {
    message.innerText = "🎉 The song was successfully added!";
    clearInputs();  // מנקה שדות טקסט
    loadSongs();    // טוען את השירים כדי להציג אותם מחדש
  } else {
    // במידה והייתה תקלה - מציג הודעת שגיאה
    message.innerText = "😞 We couldn't add your song";
  }
};

// פונקציה שמנקה את שדות הטקסט בטופס כדי להקל על המשתמש להכניס שיר חדש
function clearInputs() {
  songName.value = "";
  singerName.value = "";
  imageUrl.value = "";
  audioUrl.value = "";
}

// פונקציה שאחראית לטעון את השירים מהשרת ולהציג אותם ב-musicPlayer
async function loadSongs() {
  if (!userId) return;  // אם אין משתמש מחובר - לא ממשיכים

  musicPlayer.innerHTML = "";  // מנקים את המוזיקה שהייתה קודם

  // מביאים את רשימת השירים מהשרת לפי המשתמש
  let songs = await send("getSong", userId) as Song[];

  if (!songs) songs = [];  // אם אין שירים מחזירים מערך ריק למניעת שגיאות


  }
  
