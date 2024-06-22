async function fetchIngredients() {
    try {
        // Make an HTTP request to the specified URL and wait for the response
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        // Parse the JSON response into a JavaScript object
        const data = await response.json();
        // Pass meal to displayIngredients to be displayed
        displayIngredients(data.meals);
    } catch (error) {
        console.error("Failed to fetch ingredients: ", error);
    }
}

// Function to display ingredients
function displayIngredients(ingredients) {
    // Get the DOM element
    const container = document.getElementById('ingredients');
    // Initialize an empty string for building HTML content
    let htmlContent = '';

    // Iterate over each ingredient in the ingredients array
    ingredients.forEach(ingredient => {
        // Skip if ingredient name is "Candied Peel" due to known issues (e.g., broken image)
        if (ingredient.strIngredient === "Candied Peel") {
            return;
        }

        // Construct HTML content for each ingredient
        htmlContent += `
            <div class="ingredientCard">
                <a href="ingredient-details.html?ingredient=${encodeURIComponent(ingredient.strIngredient)}">
                    <img src="https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient.strIngredient)}.png" alt="Image of ${ingredient.strIngredient}">
                    <p>${ingredient.strIngredient}</p>
                </a>
            </div>
        `;
    });

    // Set the innerHTML of the container with all ingredient details
    container.innerHTML = htmlContent;
}

// Add an event listener that calls fetchIngredients when the window loads
window.addEventListener('load', fetchIngredients);