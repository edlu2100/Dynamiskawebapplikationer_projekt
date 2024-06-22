// Importing the fetchRecipes function from an external JavaScript file.
import { fetchRecipes } from './fetchRecipes.js';

async function fetchAndDisplayRandomMeals() {
    // Checks if the user has scrolled to display the header
    const header = document.querySelector('#headerstart');
    window.addEventListener('scroll', () => {
        // If the user has scrolled more than 50 pixels, the header is displayed
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            // Otherwise, the header is hidden
            header.classList.remove('scrolled');
        }
    });

    // Creates an array of the letters A to Z
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const allMeals = []; // Array to store all fetched meals

    // Iterates over each letter in the alphabet
    for (let letter of alphabet) {
        const meals = await fetchRecipesByLetter(letter); // Fetches meals starting with the letter
        allMeals.push(...meals); // Adds the meal to the array
        if (allMeals.length >= 200) break; // Breaks the loop if there are more than 200 meals (speeds up the process)
    }

    // Displays 12 random meals
    displayRandomMeals(allMeals, 12);
}

// Fetches meals for the letters that are to be displayed
async function fetchRecipesByLetter(letter) {
    try {
        // Sends an HTTP request to the API and fetches meals based on the letter
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json(); // Converts the response to JSON
        return data.meals || []; // Returns the meals or an empty array if no meals are found
    } catch (error) {
        // Logs the error message if the fetch fails
        console.error(`Error fetching meals for letter ${letter}:`, error);
        return [];
    }
}

// Prints meals to the screen
function displayRandomMeals(meals, count) {
    const shuffled = meals.sort(() => 0.5 - Math.random()); // Shuffles the array
    const selectedMeals = shuffled.slice(0, count); // Selects 12 meals

    const container = document.querySelector('.recipes');
    container.innerHTML = '';

    // Loops through the meals and displays them on the screen
    selectedMeals.forEach(meal => {
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
}

// Runs the code when the page loads
window.addEventListener('load', fetchAndDisplayRandomMeals);