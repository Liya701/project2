import { send } from "../utilities";

let favoritesContainer = document.querySelector("#favoritesContainer") as HTMLDivElement;
let previewsContainer = document.querySelector("#previewsContainer") as HTMLDivElement;
let moreSongsH2 = document.querySelector("#moreSongsH2") as HTMLHeadingElement;
let favoritesH2 = document.querySelector("#favoritesH2") as HTMLHeadingElement;
let loginAfterLogout = document.querySelector("#loginAfterLogout") as HTMLDivElement;
let goToLogin = document.querySelector("#goToLogin") as HTMLButtonElement;

let userId = localStorage.getItem("userId");

type Preview = {
  id: number;
  name: string;
  singer: string;
  imageUrl: string;
};

let previews = await send("getPreviews", userId) as Preview[];

// 🧠 פונקציות
function createPreviewA(preview: Preview): HTMLAnchorElement {
  let a = document.createElement("a");
  a.classList.add("preview");
  a.href = `song.html?songId=${preview.id}`;

  let img = document.createElement("img");
  img.classList.add("songImage");
  img.src = preview.imageUrl;
  a.appendChild(img);

  let nameDiv = document.createElement("div");
  nameDiv.innerText = preview.name;
  a.appendChild(nameDiv);

  let singerDiv = document.createElement("div");
  singerDiv.classList.add("singer");
  singerDiv.innerText = preview.singer;
  a.appendChild(singerDiv);

  return a;
}

async function generatePreviewsForUser() {
  for (let i = 0; i < previews.length; i++) {
    let previewA = createPreviewA(previews[i]);

    let isFavorite: boolean = await send("getIsFavorite", [
      userId,
      previews[i].id
    ]);

    if (isFavorite) {
      favoritesContainer.appendChild(previewA);
    } else {
      previewsContainer.appendChild(previewA);
    }
  }
}

async function generatePreviews() {
  for (let i = 0; i < previews.length; i++) {
    let previewA = createPreviewA(previews[i]);
    previewsContainer.appendChild(previewA);
  }
}

// 🎬 ההרצה בפועל
if (userId !== null) {
  generatePreviewsForUser();
} else {
  favoritesH2.classList.add("hidden");
  favoritesContainer.classList.add("hidden");
  moreSongsH2.classList.add("hidden");

  generatePreviews();

  loginAfterLogout.style.display = "block";

  goToLogin.onclick = () => {
    location.href = "login.html";
  };
}
