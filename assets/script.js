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
let searchDiv = document.querySelector("#search-div");

// functions
function getApi(event) {
  event.preventDefault();
  let requestUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredientOne.value}`;
  console.log("button clicked");
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
            drinkList.innerHTML += `<div id="${drinkName}"><a href="index.html?q=${drinkName}">${drinkName}</a></div>`;
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
    singleDrink.innerHTML = drink;
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
      singleDrink.innerHTML += `<img src="${drinkPicURL}">`;
      // button to select recipe in English or Spanish
      singleDrink.innerHTML += `<p>${drinkRecipe}</p>`;
      // add drink name as data attribute to save button
      saveBtn.setAttribute("data-drinktosave", data.drinks[0].strDrink);
      // console log names of drinks, push them into a global array - second fetch and compare arrays
      saveBtn.classList.remove("hidden");
      searchForm.classList.add("hidden");
    });
}

function saveFavorites() {
  let savedDrinkName = this.getAttribute("data-drinktosave");
  console.log(savedDrinkName);
  savedDrinksArray.push(savedDrinkName);
  localStorage.setItem("drinks", JSON.stringify(savedDrinksArray));
}

function showFavorites() {
  allFavoritesDiv.innerHTML = "";
  savedDrinksArray.forEach((drink) => {
    allFavoritesDiv.innerHTML += `<a href="index.html?q=${drink}">${drink}</a> <br>`;
  });
}

// event listeners

searchBtn.addEventListener("click", getApi);
saveBtn.addEventListener("click", saveFavorites);
showBtn.addEventListener("click", showFavorites);
handleDrinkDisplay();
