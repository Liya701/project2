import { send } from "../utilities";

let username2 = document.querySelector("#username2") as HTMLInputElement;
let password2 = document.querySelector("#password2") as HTMLInputElement;
let loginbutton = document.querySelector(".loginbutton") as HTMLButtonElement;
let message2 = document.querySelector("#message2") as HTMLDivElement;


    loginbutton.onclick = async function () {
 // שולח לשרת את שם המשתמש והסיסמה כדי לבדוק אם הם נכונים
  // אם כן – מחזיר את ה-id של המשתמש, ואם לא – מחזיר null
  let id = await send("login", [username2.value, password2.value]) as string | null;

  // אם ההתחברות נכשלה – כלומר, קיבלנו null
  if (id == null) {
    // מנקה את שדות הקלט כדי שהמשתמש יוכל לנסות שוב בלי למחוק ידנית
    username2.value = "";
    password2.value = "";

    // מציג הודעת שגיאה שהשם או הסיסמה שגויים
    message2.innerText = "Username or Password were incorrect";
  } else {
    // אם ההתחברות הצליחה – שומר את ה-id של המשתמש ב-localStorage
    localStorage.setItem("userId", id);

    location.href = "index.html";
  }
};
  