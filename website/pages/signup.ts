import { send } from "../utilities";
let username = document.querySelector("#username") as HTMLInputElement;
let password = document.querySelector("#password") as HTMLInputElement;
let signupbutton = document.querySelector(".signupbutton") as HTMLButtonElement;
let message = document.querySelector("#message") as HTMLDivElement;


signupbutton.onclick = async function () {
  let userId = await send("signup", [username.value, password.value]) as string | null;

  if (userId != null) {
    localStorage.setItem("userId", userId);
    location.href = "index.html";
  } else {
    message.innerText = "Username is already taken";
  }
}

