import { send } from "../utilities";

let username2 = document.getElementById("username2") as HTMLInputElement;
let password2 = document.getElementById("password2") as HTMLInputElement;
let loginButton = document.getElementById("loginButton") as HTMLButtonElement;
let message2 = document.getElementById("message2") as HTMLDivElement;

loginButton.onclick = async function () {
  let id = await send("login", [ username2.value, password2.value,]) as string | null;

  if (id == null) {
    username2.value = "";
    password2.value = "";
    message2.innerText = "Username or Password were incorrent";
  }
  else {
    localStorage.setItem("userId", id);
    location.href = "index.html";
  }
}