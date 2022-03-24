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
      let ingredientString = '';
      let j = 1
      //only loops the number of ingrediants (instead of 20 times for every drink)
      while(drink['strMeasure' + j] !== null) {
        ingredientString += drink['strMeasure' + j] + " " + drink['strIngredient' + j];
        ingredientString += '<br/>';
        j++
      }

      //creates the pieces of the drink card
      let drinkName = $('<h3>').text(drink['strDrink']).attr("class", "col-lg-12 interior-box card-drinkName")
      let drinkContain = $('<div>').attr('class', 'cocktailContainer containter');
      let ingredients = $('<p>').html(ingredientString).attr("class", "interior-box card-ingred");
      let directions = $('<p>').text(drink['strInstructions']).attr("class", "col").attr("class", "interior-box hide card-direct");
      let drinkImage = $('<img>').attr('src', drink['strDrinkThumb']).attr("class", "drinkImage");
      let saveBttn = $('<button>').text('Save').attr('class', 'cocktailSearch');
      let readmoreBtn = $('<button>').text('read more').attr('class', 'readmore cocktailSearch');
      let readlessBtn = $('<button>').text('read less').attr('class', 'readless hide cocktailSearch');
      
      //makes the direction visible
      readmoreBtn.on('click', function (e) {
        e.preventDefault()
        directions.removeClass("hide")
        readmoreBtn.addClass("hide")
        readlessBtn.removeClass("hide")
      })
      //hides the directions again
      readlessBtn.on('click', function (e) {
        e.preventDefault();
        directions.addClass("hide")
        readlessBtn.addClass("hide")
        readmoreBtn.removeClass("hide")
      })
      //saves the drink in the db associated with the user
      saveBttn.on('click', function () {
        $.ajax({
          type: 'POST',
          url: '/api/save-drink',
          data: { drink: drink },
        });
        alert("Your drink has been saved!")
      })

      // appends the pieces together and the card to the page 
      drinkContain.append(drinkName, drinkImage, ingredients, readmoreBtn, readlessBtn, saveBttn, directions);
      $('#drink-div').append(drinkContain);
    }
  }
}