// global

let searchForm = document.querySelector("#search-form");
let searchBtn = document.querySelector("#search-button");
let drinkList = document.querySelector("#drink-list");
let singleDrink = document.querySelector("#single-drink");
let errorMessage = document.querySelector("#error-message");
let ingredientOne = document.querySelector("#ingredient-one");
let ingredientTwo = document.querySelector("#ingredient-two");
let saveBtn = document.querySelector("#save-button");
let showBtn = document.querySelector("#show-favorites");
let allFavoritesDiv = document.querySelector("#all-favorites");
let savedDrinksArray = JSON.parse(localStorage.getItem("drinks")) || [];
let drinkDiv = document.querySelector("#drink-div");
let searchDiv = document.querySelector("#search-div");
let singleDrinkName = document.querySelector("#single-drink-name");
let singleDrinkImg = document.querySelector("#single-drink-img");
let singleDrinkRecipe = document.querySelector("#single-drink-recipe");
let singleDrinkDiv = document.querySelector("#single-drink-div");
let singleDrinkIngredients = document.querySelector("#single-drink-ingredients");

// functions
function getApi(event) {
  event.preventDefault();
  let requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientOne.value}`;
  console.log("button clicked");
  searchDiv.classList.add("hidden");
  drinkList.classList.remove("hidden");
  fetch(requestUrl)
    .then(function (response) {
      // if (!response.ok) {
      //   throw Error(response.statusText);
      // }
      return response.json();
    })
    .then(function (data) {
      let secondRequestUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientTwo.value}`;
      fetch(secondRequestUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (dataTwo) {
          console.log("one", data.drinks);
          console.log("two", dataTwo.drinks);
          const values = data.drinks.concat(dataTwo.drinks);
          const lookup = values.reduce((a, e) => {
            a[e.strDrink] = ++a[e.strDrink] || 0;
            return a;
          }, {});
          let duplicates = values.filter((e) => lookup[e.strDrink]);
          duplicates = duplicates.filter((value, index, self) => index === self.findIndex((t) => t.strDrink === value.strDrink));
          duplicates.forEach((drink) => {
            let drinkName = drink.strDrink;
            console.log(drinkName);
            // listOfDrinks.push(drinkName);
            drinkList.innerHTML += `<div class="text-xl text-[#560badff] underline p-1 text-center" id="${drinkName}"><a href="index.html?q=${drinkName}">${drinkName}</a></div> <br>`;
          });
        });
      // check for no data
    });
}

function handleDrinkDisplay() {
  const urlParams = new URLSearchParams(window.location.search);
  const drink = urlParams.get("q") || "";
  if (drink !== "") {
    console.log("drink from html", drink);
    singleDrinkName.innerHTML = drink;
    // diff fetch to get the recipe and image
    drinkImgRec(drink);
  }
}

function drinkImgRec(drink) {
  // function from a click event
  let requestDrink = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`;
  fetch(requestDrink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let drinkPicURL = data.drinks[0].strDrinkThumb;
      let drinkRecipe = data.drinks[0].strInstructions;
      console.log("drinkPic", drinkPicURL);
      // listOfDrinks.push(drinkName);
      singleDrinkImg.innerHTML += `<img class="w-96 h-96 p-4" src="${drinkPicURL}">`;
      // button to select recipe in English or Spanish
      // singleDrink.innerHTML += `<p class="text-center text-[#560badff] p-2 col-span-1 items-center">${drinkRecipe}</p>`;
      singleDrinkRecipe.innerHTML += drinkRecipe;
      for (i = 1; i < 16; i++) {
        let measureInd = `strMeasure${i}`;
        let ingredientInd = `strIngredient${i}`;
        if (data.drinks[0][measureInd] !== null) {
          singleDrinkIngredients.innerHTML += `<p>${data.drinks[0][measureInd]} ${data.drinks[0][ingredientInd]}`;
        }
      }
      // add drink name as data attribute to save button
      saveBtn.setAttribute("data-drinktosave", data.drinks[0].strDrink);
      // console log names of drinks, push them into a global array - second fetch and compare arrays
      saveBtn.classList.remove("hidden");
      searchDiv.classList.add("hidden");
      singleDrinkDiv.classList.remove("hidden");
    });
}

function saveFavorites() {
  let savedDrinkName = this.getAttribute("data-drinktosave");
  console.log(savedDrinkName);
  if (!savedDrinksArray.includes(savedDrinkName)) {
    savedDrinksArray.push(savedDrinkName);
    localStorage.setItem("drinks", JSON.stringify(savedDrinksArray));
  }
}

function showFavorites() {
  allFavoritesDiv.innerHTML = "<h2 class='mb-4 text-center font-bold text-2xl'>Your Favorites</h2>";
  savedDrinksArray.forEach((drink) => {
    allFavoritesDiv.innerHTML += `<a class="block mt-1" href="index.html?q=${drink}">${drink}</a> <br>`;
  });
  allFavoritesDiv.classList.remove("hidden");
}

// event listeners

searchBtn.addEventListener("click", getApi);
saveBtn.addEventListener("click", saveFavorites);
showBtn.addEventListener("click", showFavorites);
handleDrinkDisplay();
