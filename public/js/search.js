// search button will call the cocktail api and write response on the page
// save cocktial will update the database

function searchCocktailDB(drink) {
  // Querying the Cocktail DB api for the selected drink, the ?app_id parameter is required, but can equal anything
  let queryURL = '/cocktailsdb/drinks/' + drink
  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(displayDrinks);
}

function searchCocktailDBByIngredient(ingredient) {
  // Querying the Cocktail DB api for the selected drink, the ?app_id parameter is required, but can equal anything
  let queryURL = '/cocktailsdb/drinks/' + ingredient;
  $.ajax({
    url: queryURL,
    method: 'GET',
  }).then(displayDrinks);
}

// Event handler for user clicking the select-drink button
$('#select-drink').on('click', function (event) {
  event.preventDefault();
  // Running the searchCocktailDB function(passing in the artist as an argument)
  searchCocktailDB($('#drink-input').val().trim());
  $('#drink-input').val("")
});

// Event handler for user clicking the select-drink button
$('#select-ingredient').on('click', function (event) {
  event.preventDefault();
  // Running the searchCocktailDB function(passing in the ingredient as an argument)
  searchCocktailDBByIngredient($('#ingredient-input').val().trim());
  $('#ingredient-input').val("")
});

function displayDrinks(response) {
  // clear the old responses
  $('#drink-div').html('');

  // Constructing HTML containing the drink information
  for (i = 0; i < response.drinks.length; i++) {
    const drink = response.drinks[i];
    console.log(drink)
    // start parsing new responses
    //prevents drinks from being added that have no ingrediants
    if (drink['strMeasure' + 1]) {
      //creates the inner text for the ingrediant paragraph
      let ingredientString = ``;
      let j = 1
      //only loops the number of ingrediants (instead of 20 times for every drink)
      while (drink['strMeasure' + j] !== null) {
        ingredientString += `${drink['strMeasure' + j]} ${drink['strIngredient' + j]} </br>`
        // `<p>
        // <span>${drink['strMeasure' + j]}</span> 
        // <span>${drink['strIngredient' + j]}</span>
        // </p>`
        j++
      }
      //creates a template literal for the drink card
      let drinkCard = `<div style="flex-basis:30%;">
        <div class="cocktailContainer containter" id="${i}-drink">
          <p class="col-lg-12 interior-box card-drinkName">${drink['strDrink']}</p>
          <img src=${drink['strDrinkThumb']} class="drinkImage" />
          <div class="interior-box card-ingred">${ingredientString}</div>
          <button id="${i}-readmore" class="readmore cocktailSearch">read more</button>
          <button id="${i}-readless" class="readless none cocktailSearch">read less</button>
          <button id="${i}-saveDrink"class="cocktailSearch">Save</button>
        </div>

        <div class="height-increaser">
          <p id="${i}-decribe" class="interior-box card-direct" >${drink['strInstructions']}</p>
        </div>
      </div>`

      $('#drink-div').append(drinkCard);

      //dynamically grabs each button
      let readmoreBtn = $(`#${i}-readmore`)
      let readlessBtn = $(`#${i}-readless`)
      //sets a boolean to stop overlapping animation
      let animated = false
      //makes the direction visible
      readmoreBtn.on('click', function (e) {
        e.preventDefault()
        //grabs the instruction html element 
        let directions = $(this.parentElement.nextSibling.nextSibling.firstChild.nextSibling)
        //and its container
        let animateContainer = $(this.parentElement.nextSibling.nextSibling)
        //if there is no other animation 
        if (!animated) {
          //then change the styles to create animation
          directions.attr("style", "top: 150px; position: relative; z-index: -15;")
          directions.addClass("animate-direct")
          let wait = 0
          animated = true
          //interval that waits for the animation to complete
          let interval = setInterval(function () {
            wait++
            if (wait === 1) {
              //before returning the styles back to default
              directions.attr("style", "top: 150px; z-index: unset;")
              animateContainer.attr("style", "z-index: unset;")
              clearInterval(interval)
              animated = false
            }
          }, 1000)
          //switches the visible button
          readmoreBtn.addClass("none")
          readlessBtn.removeClass("none")
        }
      })
      //hides the directions again
      readlessBtn.on('click', function (e) {
        e.preventDefault();
        let directions = $(this.parentElement.nextSibling.nextSibling.firstChild.nextSibling)
        //if there is no other animation 
        if (!animated) {
          //then change the styles to create animation
          $(this.parentElement.nextSibling.nextSibling).attr("style", "z-index: -15;")
          directions.attr("style", "top: 0px; position: relative; padding-top:0px; padding-bottom:0px; z-index: -15;")
          let wait = 0
          animated = true
          //interval that waits for the animation to complete
          let interval = setInterval(function () {
            wait++
            if (wait === 1) {
              //before returning the styles back to default
              directions.removeClass("animate-direct")
              clearInterval(interval)
              animated = false
            }
          }, 1000)
          //switches the visible button
          readlessBtn.addClass("none")
          readmoreBtn.removeClass("none")
        }
      })

      //saves the drink in the db associated with the user
      $(`#${i}-saveDrink`).on('click', function () {
        $.ajax({
          type: 'POST',
          url: '/api/save-drink',
          data: { drink: drink },
        });
        alert("Your drink has been saved!")
      })
    }
  }
  //gets the number of rows that will exist
  let rownum = Math.floor(response.drinks.length / 3)
  //gets the card height and compensates for margin and padding
  let cardheight = $("#0-drink").height() + 130
  //sets the height of drink div appropriately
  $("#drink-div").height(Math.floor(cardheight * rownum))
}