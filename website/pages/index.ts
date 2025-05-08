import { send } from "../utilities";

let favoritesContainer = document.querySelector("#favoritesContainer") as HTMLDivElement;
let previewsContainer = document.querySelector("#previewsContainer") as HTMLDivElement;
let favoritesH2 = document.querySelector("#favoritesH2") as HTMLHeadingElement;
let moreSongsH2 = document.querySelector("#moreSongsH2") as HTMLHeadingElement;

let userId = localStorage.getItem("userId");

type Preview = {
  id: number;
  title: string;
  imageSource: string;
};

let previews = await send("getPreviews", userId) as Preview[];

function createPreview(preview: Preview): HTMLAnchorElement {
  let a = document.createElement("a");
  a.classList.add("preview");
  a.href = "song.html?songId=" + preview.id;

  let img = document.createElement("img");
  img.classList.add("songImage");
  img.src = preview.imageSource;
  a.appendChild(img);

  let title = document.createElement("div");
  title.innerText = preview.title;
  a.appendChild(title);

  return a;
}

async function showPreviewsForUser() {
  for (let preview of previews) {
    let previewA = createPreview(preview);

    let isFavorite = await send("getIsFavorite", [
      userId,
      preview.id
    ]) as boolean;

    if (isFavorite) {
      favoritesContainer.appendChild(previewA);
    } else {
      previewsContainer.appendChild(previewA);
    }
  }
}

async function showAllPreviews() {
  for (let preview of previews) {
    let previewA = createPreview(preview);
    previewsContainer.appendChild(previewA);
  }
}

if (userId) {
  showPreviewsForUser();
} else {
  favoritesH2.classList.add("hidden");
  favoritesContainer.classList.add("hidden");
  moreSongsH2.classList.add("hidden");
  showAllPreviews();
}
