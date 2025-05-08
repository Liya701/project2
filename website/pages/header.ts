import { send } from "../utilities";

let loggedInDiv = document.getElementById("loggedInDiv") as HTMLDivElement;
let greetingDiv = document.getElementById("greetingDiv") as HTMLDivElement;
let logOutButton = document.getElementById("logOutButton") as HTMLButtonElement;

let id = localStorage.getItem("userId");

logOutButton.onclick = function () {
  localStorage.removeItem("userId");
  location.href = "index.html";
};

async function getUsername() {
  if (id == null) {
    loggedInDiv.classList.add("hidden");
    return;
  }

  let username = await send("getUsername", id) as string | null;

  if (username == null) {
    loggedInDiv.classList.add("hidden");
    return;
  }

  greetingDiv.innerText = "Welcome, " + username + "!";
}

getUsername();