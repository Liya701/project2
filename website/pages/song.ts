import { send } from "../utilities"; 

type Song = {
  id: number;
  name: string;
  imageUrl: string;
  audioUrl: string;
};

let titleH1 = document.querySelector("#titleH1") as HTMLHeadingElement; 
let coverImg = document.querySelector("#coverImg") as HTMLImageElement; 
let favoriteButton = document.querySelector("#favoriteButton") as HTMLButtonElement; 
let unfavoriteButton = document.querySelector("#unfavoriteButton") as HTMLButtonElement; 
let message = document.querySelector("#message") as HTMLParagraphElement | null; 
let loggedInDiv = document.getElementById("loggedInDiv") as HTMLDivElement; 
let greetingDiv = document.getElementById("greetingDiv") as HTMLDivElement; 
let logOutButton = document.getElementById("logOutButton") as HTMLButtonElement; 

let userId = localStorage.getItem("userId");  // מושך את ה-userId מהאחסון המקומי, כדי לדעת מי המשתמש המחובר כרגע

logOutButton.onclick = function () {
  localStorage.removeItem("userId");   // כשהמשתמש לוחץ logout - מוחק את ה-userId מה-localStorage

  location.href = "index.html";  
};

async function getUsername() {
  if (userId == null) {
    loggedInDiv.classList.add("hidden");  // אם אין משתמש מחובר - מסתיר את ה-div שמציג את המשתמש המחובר

    return; 
  }

  let username = await send("getUsername", userId) as string | null; // שולח בקשה לשרת לקבל את שם המשתמש לפי ה-userId

  if (username == null) {
    loggedInDiv.classList.add("hidden");  // אם אין שם משתמש (מישהו התחבר אבל משהו לא בסדר) - מסתיר את ה-div שוב

    return; 
  }

  greetingDiv.innerText = "Welcome, " + username + "!"; 
}

getUsername(); 

let url = new URLSearchParams(location.search); // קורא את הפרמטרים בכתובת (query string), כדי לקבל מידע מה-URL
let songId = Number(url.get("songId")); // שולף את ה-ID של השיר מהפרמטר songId וממיר למספר

favoriteButton.onclick = async function () {
  await send("addToFavorites", [userId, songId]); // כשמוסיפים למועדפים - שולח בקשה לשרת להוסיף את השיר למועדפים של המשתמש

  favoriteButton.disabled = true;  // מבטל את הכפתור "הוסף למועדפים" כדי למנוע קליקים חוזרים

  unfavoriteButton.disabled = false;  // מפעיל את כפתור "הסר מהמועדפים"
};

unfavoriteButton.onclick = async function () {
  await send("removeFromFavorites", [userId, songId]); 

  favoriteButton.disabled = false; 

  unfavoriteButton.disabled = true; 
};

async function loadSong() {
  let songs = await send("getPreviews", userId) as Song[];  // שולף רשימת שירים מהשרת עבור המשתמש

  let song = songs.find(s => s.id === songId);  // מחפש את השיר המתאים לפי ה-ID שקיבלנו מה-URL

  if (!song) {
    if (message) {
      message.innerText = "song not found😢"; 
    }
    return; 
  }

  document.title = song.name; 
  titleH1.innerText = song.name; 
  coverImg.src = song.imageUrl; 
  createYouTubePlayer(song.audioUrl);   // קורא לפונקציה שמציגה את נגן היוטיוב עם קישור השמע של השיר

  function createYouTubePlayer(youtubeUrl: string): void {
    const playerContainer = document.querySelector("#playerContainer") as HTMLDivElement; // לוכד את הדיב שבו נציג את הנגן

    playerContainer.innerHTML = "";  // מנקה את התוכן הקודם (אם היה)

    // להוציא את ה-videoId מתוך הקישור
    const videoId = youtubeUrl.split("v=")[1]?.substring(0, 11)
      || youtubeUrl.split("youtu.be/")[1]?.substring(0, 11);
    // מנסה להוציא את מזהה הסרטון מהקישור - הן מהפורמט הרגיל של יוטיוב (v=...) והן מהפורמט הקצר (youtu.be/...)

    if (!videoId) {
      console.error("Invalid YouTube URL"); // אם לא מצא מזהה תקין - מדפיס שגיאה בקונסול

      return; 
    }

    let iframe = document.createElement("iframe");  // יוצר תגית iframe חדשה להצגת נגן יוטיוב

    iframe.width = "300"; 
    iframe.height = "200"; 
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`; // מגדיר את ה-src של ה-iframe עם מזהה הסרטון והפעלת ניגון אוטומטי

    iframe.allow = "autoplay"; // מאפשר הפעלה אוטומטית של הוידאו

    iframe.allowFullscreen = true; // מאפשר מעבר למסך מלא

    iframe.style.marginTop = "20px"; 
    iframe.style.border = "none";  // קצת עיצוב לנגן

    playerContainer.appendChild(iframe);  // מוסיף את הנגן לדיב בעמוד
  }

  if (!userId) {
    favoriteButton.style.display = "none"; 
    unfavoriteButton.style.display = "none"; 
    // אם אין משתמש מחובר - מסתיר את כפתורי המועדפים כי אי אפשר להוסיף או להסיר מועדפים בלי משתמש

    return; 
  }

  let isFavorite = await send("getIsFavorite", [userId, songId]);  // בודק אם השיר כבר במועדפים של המשתמש
  
  favoriteButton.disabled = isFavorite;  // אם השיר במועדפים - מבטל את כפתור הוספה למועדפים
  
  unfavoriteButton.disabled = !isFavorite;  // ואם השיר לא במועדפים - מבטל את כפתור הסרה מהמועדפים
}
loadSong(); 