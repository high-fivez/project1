// global
let firstFetch = document.querySelector("#first-fetch");
let fetchBtn = document.querySelector("#btn");
let drinkList = document.querySelector("#drink-list");
let singleDrink = document.querySelector("#single-drink");
// let listOfDrinks = [];

// functions
function getApi() {
  let requestUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Tequila";
  console.log("button clicked");
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.drinks.forEach((drink) => {
        let drinkName = drink.strDrink;
        console.log(drinkName);
        // listOfDrinks.push(drinkName);
        drinkList.innerHTML += `<div id="${drinkName}"><a href="index.html?q=${drinkName}">${drinkName}</a></div>`;
      });
      // console log names of drinks, push them into a global array - second fetch and compare arrays
      console.log(data);
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
      // console log names of drinks, push them into a global array - second fetch and compare arrays
    });
}

function drinkRecipe() {}

// event listeners

fetchBtn.addEventListener("click", getApi);
handleDrinkDisplay();
