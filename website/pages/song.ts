import { send } from "../utilities";


let titleH1 = document.querySelector("#titleH1") as HTMLHeadingElement;
let coverImg = document.querySelector("#coverImg") as HTMLImageElement;
let favoriteButton = document.querySelector("#favoriteButton") as HTMLButtonElement;
let unfavoriteButton = document.querySelector("#unfavoriteButton") as HTMLButtonElement;
let descriptionDiv = document.querySelector("#descriptionDiv") as HTMLDivElement;

let userId = localStorage.getItem("userId"); 

let bookId = await send("getSongs", userId) 

favoriteButton.onclick = async function () {
  await send("addToFavorites", { userId, bookId });
  favoriteButton.disabled = true;
  unfavoriteButton.disabled = false;
};

unfavoriteButton.onclick = async function () {
  await send("removeFromFavorites", { userId, bookId });
  favoriteButton.disabled = false;
  unfavoriteButton.disabled = true;
};

async function appendBook() {
  let book = await send("/getBook", bookId) as {
    title: string;
    imageSource: string;
    description: string;
    isFavorite: boolean;
  };

  document.title = book.title;
  titleH1.innerText = book.title;
  coverImg.src = book.imageSource;
  descriptionDiv.innerText = book.description;

  if (!userId) {
    favoriteButton.style.display = "none";
    unfavoriteButton.style.display = "none";
    return;
  }

  let isFavorite = await send("/getIsFavorite", { userId, bookId }) as boolean;
  favoriteButton.disabled = isFavorite;
  unfavoriteButton.disabled = !isFavorite;
}

appendBook();


