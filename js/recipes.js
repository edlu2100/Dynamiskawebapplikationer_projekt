import { fetchRecipes } from './fetchRecipes.js';

function createAlphabetLinks() {
    // Define the alphabet array, missing some letters intentionally (no value)
    const alphabet = 'ABCDEFGHIJKLMNOPRSTVWY'.split('');
    const linksContainer = document.querySelector('.alphabet-links');
    // Make each letter a button
    linksContainer.innerHTML = alphabet.map(letter =>
        `<button class="alphabet-button" data-letter="${letter}">${letter}</button>`
    ).join('');

    // Add event listeners to all alphabet buttons
    document.querySelectorAll('.alphabet-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove 'active' class from all buttons
            document.querySelectorAll('.alphabet-button').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add 'active' class to the clicked button (change color of active)
            e.target.classList.add('active');

            // Get the letter from the clicked button
            const letter = e.target.dataset.letter;
            // Load meals with specific letter
            loadMealsByLetter(letter);
        });
    });
}

async function loadMealsByLetter(letter) {
    // Fetch meals by the given letter using the fetchRecipes function
    const meals = await fetchRecipes(letter);
    // Display the fetched meals
    displayMeals(meals);
}

function displayMeals(meals) {
    // Select the container to display meals
    const container = document.querySelector('.recipes');
    container.innerHTML = ''; // Clear existing content in the container

    if (meals && meals.length > 0) {
        // Loop through the meals and create a card for each meal
        meals.forEach(meal => {
            const mealDiv = document.createElement('div');
            mealDiv.className = 'card'; // Set the class for styling
            mealDiv.innerHTML = `
                <a href="recipe-detail.html?id=${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="cardImg">
                    <div>
                        <h3>${meal.strMeal}</h3>
                    </div>
                </a>
            `;
            container.appendChild(mealDiv); // Append the meal card to the container
        });
    } else {
        // Display a message if no meals are found for the selected letter
        container.innerHTML = '<p>No meals found starting with this letter.</p>';
    }
}
// When page is loaded
window.addEventListener('load', () => {
    createAlphabetLinks(); // Create alphabet links on page load
    loadMealsByLetter('a'); // Initially load meals for 'A' to display on page load
});