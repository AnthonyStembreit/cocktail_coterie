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
        ingredientString += `<p>
        <span>${drink['strMeasure' + j]}</span> 
        <span>${drink['strIngredient' + j]}</span>
        </p>`
        j++
      }
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
      // //creates the pieces of the drink card
      // let drinkName = $('<h3>').text(drink['strDrink']).attr("class", "col-lg-12 interior-box card-drinkName")
      // let drinkContain = $('<div>').attr('class', 'cocktailContainer containter');
      // let ingredients = $('<div>').html(ingredientString).attr("class", "interior-box card-ingred");
      // let directions = $('<p>').text(drink['strInstructions']).attr("class", "col").attr("class", "interior-box hide card-direct");
      // let drinkImage = $('<img>').attr('src', drink['strDrinkThumb']).attr("class", "drinkImage");
      // let saveBttn = $('<button>').text('Save').attr('class', 'cocktailSearch');
      // let readmoreBtn = $('<button>').text('read more').attr('class', 'readmore cocktailSearch');
      // let readlessBtn = $('<button>').text('read less').attr('class', 'readless hide cocktailSearch');
      $('#drink-div').append(drinkCard);
   
      let readmoreBtn = $(`#${i}-readmore`)
      let readlessBtn = $(`#${i}-readless`)
      let animated = false
      //makes the direction visible
      readmoreBtn.on('click', function (e) {
        e.preventDefault()
        let directions = $(this.parentElement.nextSibling.nextSibling.firstChild.nextSibling)
        let animateContainer = $(this.parentElement.nextSibling.nextSibling)
        if (!animated) {
          directions.attr("style", "top: 150px; position: relative; z-index: -15;")
          directions.addClass("animate-direct")
          let wait = 0
          animated = true
          let interval = setInterval(function () {
            wait++
            if (wait === 1) {
              directions.attr("style", "top: 150px; z-index: unset;")
              animateContainer.attr("style", "z-index: unset;")
              clearInterval(interval)
              animated = false
            }
          }, 1000)
          readmoreBtn.addClass("none")
          readlessBtn.removeClass("none")
        }
      })
      //hides the directions again
      readlessBtn.on('click', function (e) {
        e.preventDefault();
        let directions = $(this.parentElement.nextSibling.nextSibling.firstChild.nextSibling)
        if (!animated) {
          $(this.parentElement.nextSibling.nextSibling).attr("style", "z-index: -15;")
          directions.attr("style", "top: 0px; position: relative; padding-top:0px; padding-bottom:0px; z-index: -15;")
          let wait = 0
          animated = true
          let interval = setInterval(function () {
            wait++
            if (wait === 1) {
              directions.removeClass("animate-direct")
              clearInterval(interval)
              animated = false
            }
          }, 1000)
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

      // appends the pieces together and the card to the page 
      // drinkContain.append(drinkName, drinkImage, ingredients, readmoreBtn, readlessBtn, saveBttn, directions);
   
    }
  }
  let rownum = Math.floor(response.drinks.length / 3)
  let cardheight = $("#0-drink").height()+ 130
  $("#drink-div").height(Math.floor(cardheight * rownum))
  console.log(Math.floor(cardheight * rownum))

}