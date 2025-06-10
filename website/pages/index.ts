import { send } from "../utilities";

let favoritesContainer = document.querySelector("#favoritesContainer") as HTMLDivElement;
let previewsContainer = document.querySelector("#previewsContainer") as HTMLDivElement;
let moreSongsH2 = document.querySelector("#moreSongsH2") as HTMLHeadingElement;
let favoritesH2 = document.querySelector("#favoritesH2") as HTMLHeadingElement;
let loginAfterLogout = document.querySelector("#loginAfterLogout") as HTMLDivElement;
let goToLogin = document.querySelector("#goToLogin") as HTMLButtonElement;


// מביא את ה-id של המשתמש מ-localStorage אם קיים (null אם לא)
let userId = localStorage.getItem("userId");

// טיפוס TypeScript שמייצג את השיר בקצרה – תצוגה מקדימה
type Preview = {
  id: number;
  name: string;
  singer: string;
  imageUrl: string;
};

// שולח בקשה לשרת לקבל את כל השירים (תצוגה מקדימה), בהתאם ל-userId (או null אם אין)
let previews = await send("getPreviews", userId) as Preview[];

//  פונקציה שיוצרת אלמנט <a> אחד שמייצג שיר בתצוגה
function createPreviewA(preview: Preview): HTMLAnchorElement {
  let a = document.createElement("a");                      // יוצר תגית <a>
  a.classList.add("preview");                               // מוסיף לה קלאס בשביל עיצוב
  a.href = `song.html?songId=${preview.id}`;               // שם קישור שיפנה לדף השיר עם ה-id

  let img = document.createElement("img");                  // יוצר תמונת השיר
  img.classList.add("songImage");                           // מוסיף קלאס לעיצוב
  img.src = preview.imageUrl;                               // שם את הקישור לתמונה
  a.appendChild(img);                                       // מוסיף את התמונה ל-a

  let nameDiv = document.createElement("div");              // יוצר div לשם השיר
  nameDiv.innerText = preview.name;                         // שם השיר
  a.appendChild(nameDiv);                                   // מוסיף ל-a

  let singerDiv = document.createElement("div");            // יוצר div לשם הזמר
  singerDiv.classList.add("singer");                        // קלאס לעיצוב
  singerDiv.innerText = preview.singer;                     // שם הזמר
  a.appendChild(singerDiv);                                 // מוסיף ל-a

  return a;                                                 // מחזיר את כל האלמנט <a>
}

// פונקציה שמייצרת תצוגות שירים עם בדיקה אם הם במועדפים
async function generatePreviewsForUser() {
  for (let i = 0; i < previews.length; i++) {
    let previewA = createPreviewA(previews[i]);             // יוצר preview אחד

    let isFavorite: boolean = await send("getIsFavorite", [ // שואל את השרת אם השיר במועדפים
      userId,
      previews[i].id
    ]);

    if (isFavorite) {
      favoritesContainer.appendChild(previewA);             // אם כן – מציג במועדפים
    } else {
      previewsContainer.appendChild(previewA);              // אחרת – מציג ב-"עוד שירים"
    }
  }
}

//  פונקציה שמייצרת תצוגות שירים בלי קשר למועדפים (אם אין משתמש מחובר)
async function generatePreviews() {
  for (let i = 0; i < previews.length; i++) {
    let previewA = createPreviewA(previews[i]);             // יוצר preview אחד
    previewsContainer.appendChild(previewA);                // מוסיף אותו ל-"עוד שירים"
  }
}

//  נקודת ההרצה בפועל – מה שקורה כשנטען הדף
if (userId !== null) {
  // אם יש משתמש מחובר – טוען תצוגות לפי מועדפים
  generatePreviewsForUser();
} else {
  // אם אין משתמש מחובר – מסתיר את הכותרות והמועדפים
  favoritesH2.classList.add("hidden");
  favoritesContainer.classList.add("hidden");
  moreSongsH2.classList.add("hidden");

  // מציג רק את כל השירים (בלי לבדוק מועדפים)
  generatePreviews();

  // מציג הודעה למשתמש שהוא צריך להתחבר
  loginAfterLogout.style.display = "block";

  goToLogin.onclick = () => {
    location.href = "login.html";
  };
}
