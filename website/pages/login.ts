import { send } from "../utilities";

let username2 = document.querySelector("#username2") as HTMLInputElement;
let password2 = document.querySelector("#password2") as HTMLInputElement;
let loginbutton = document.querySelector(".loginbutton") as HTMLButtonElement;
let message2 = document.querySelector("#message2") as HTMLDivElement;


    loginbutton.onclick = async function () {
      let id = await send("login", [username2.value, password2.value]) as string | null;
  
      if (id == null) {
        username2.value = "";
        password2.value = "";
        message2.innerText = "Username or Password were incorrect";
      } else {
        localStorage.setItem("userId", id);
        location.href = "index.html";
      }
    };
  
  