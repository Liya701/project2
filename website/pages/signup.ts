import { send } from "../utilities";
let username = document.querySelector("#username") as HTMLInputElement;
let password = document.querySelector("#password") as HTMLInputElement;
let signupbutton = document.querySelector(".signupbutton") as HTMLButtonElement;
let message = document.querySelector("#message") as HTMLDivElement;


signupbutton.onclick = async function () {
 // שולח בקשה לשרת לבצע הרשמה עם שם המשתמש והסיסמה שהמשתמש הזין.
  // אם ההרשמה מצליחה – מחזיר userId; אם נכשלת (למשל, השם תפוס) – מחזיר null.
  let userId = await send("signup", [username.value, password.value]) as string | null;

  // אם קיבלנו userId – כלומר, ההרשמה הצליחה:
  if (userId != null) {
    // שומר את ה-userId ב-localStorage כדי שנדע בהמשך מי המשתמש שמחובר
    localStorage.setItem("userId", userId);

    location.href = "index.html";
  } else {
    message.innerText = "Username is already taken";
  }
}

