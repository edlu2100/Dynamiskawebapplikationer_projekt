// When the page loads
window.onload = function() {
    // Set values in dropdown menus
    populateDropdown('https://www.themealdb.com/api/json/v1/1/list.php?a=list', document.getElementById('country-select'), 'strArea');
    populateDropdown('https://www.themealdb.com/api/json/v1/1/list.php?c=list', document.getElementById('category-select'), 'strCategory');
};

// Set values in dropdown lists
async function populateDropdown(url, dropdown, property) {
    try {
        // Fetch call for values for the dropdown
        const response = await fetch(url); // Performs an HTTP request
        if (!response.ok) throw new Error('Network response was not ok.');

        // Convert the response to JSON
        const data = await response.json();
        // Loops through all values from API and outputs in an option
        data.meals.forEach(meal => {
            const option = document.createElement('option');
            option.value = meal[property];
            option.textContent = meal[property];
            // Adds the option element to the dropdown menu
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Failed to fetch data: ", error);
    }
}

// Listens when submit button is pressed
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Calls the function to fetch meals based on form data
    fetchMeals();
});

// Function to fetch meals based on user's choices
function fetchMeals() {
    const country = document.getElementById('country-select').value;
    const category = document.getElementById('category-select').value;
    const ingredients = document.getElementById('ingredient-input').value.trim();
    let url = 'https://www.themealdb.com/api/json/v1/1/filter.php?';

    // Builds URL based on user's input
    if (country) url += `a=${encodeURIComponent(country)}&`;
    if (category) url += `c=${encodeURIComponent(category)}&`;
    if (ingredients) url += `i=${encodeURIComponent(ingredients)}`;

    // Removes any excess '&' character
    url = url.replace(/&$/, '');

    // Displays meals based on the constructed URL
    displayMeals(url);
}

// Print meals to the screen
async function displayMeals(url) {
    try {
        // Fetch call
        const response = await fetch(url); // Performs an HTTP request
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json(); // Converts the response to JSON
        const container = document.getElementById('meal-results');
        container.innerHTML = ''; // Clears previous results

        // If no meal is found
        if (!data.meals) {
            container.innerHTML = '<p>No recipes matching the criteria were found.</p>';
            return;
        }

        // Prints the meals
        data.meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'card';
            mealDiv.innerHTML = `
                <a href="recipe-detail.html?id=${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="cardImg">
                    <div>
                        <h3>${meal.strMeal}</h3>
                    </div>
                </a>
            `;
            container.appendChild(mealDiv);
        });
    } catch (error) {
        console.error("Failed to fetch meals: ", error);
        // If an error occurs
        document.getElementById('meal-results').innerHTML = 'Failed to fetch meals due to an error.';
    }
}