// Show recipes based on id in url
async function fetchRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search); // Access URL parameters
    const id = urlParams.get('id'); // Get the 'id' query parameter

    if (!id) {
        // If no ID is provided, display an error message and stop execution
        document.getElementById('recipe-details-container').innerHTML = '<p>No recipe ID specified.</p>';
        return;
    }

    try {
        // Fetch recipe details from the API using the recipe ID
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        if (!response.ok) {
            // If the HTTP request failed, throw an error
            throw new Error('Failed to fetch recipe details');
        }
        const data = await response.json(); // Convert response to JSON
        if (data.meals) {
            // If meals data is available, display it
            displayRecipeDetails(data.meals[0]);
        } else {
            // If no meals data found, display an error message
            document.getElementById('recipe-details-container').innerHTML = '<p>Recipe details not found.</p>';
        }
    } catch (error) {
        // Handle errors in fetching recipe details
        console.error("Error fetching recipe details:", error);
        document.getElementById('recipe-details-container').innerHTML = `<p>Error loading the recipe details: ${error.message}</p>`;
    }
}

// Display the recipe details in the webpage
function displayRecipeDetails(recipe) {
    const container = document.querySelector('.recipe-details-container');
    let ingredientsHTML = '<h3>Ingredients</h3><ul>'; // Start an unordered list for ingredients

    // Loop through possible ingredients and measurements (max 30 ingredients)
    for (let i = 1; i <= 30; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        // Display measures
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            // Only add ingredient if it is not empty
            ingredientsHTML += `<li>${ingredient} - ${measure}</li>`;
        }
    }
    // Add end-tag
    ingredientsHTML += '</ul>';

    // Handle YouTube video
    const youtubeId = recipe.strYoutube.split('=')[1]; // Extract YouTube video ID from the URL
    const youtubeEmbedHTML = `
        <h3>Video Recipe</h3>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;

    // Set the innerHTML of the container with all recipe details
    container.innerHTML = `
        <h1 class="h1">${recipe.strMeal}</h1>
        <div class="categorydiv">
            <div>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="recipe-image">
                <div class="categoryArea">
                    <p><strong>Category:</strong> ${recipe.strCategory}</p>
                    <p><strong>Area:</strong> ${recipe.strArea}</p>
                    ${ingredientsHTML}
                </div>
            </div>
            <div class="recipe-info">
                <p><strong>Instructions:</strong> </p>
                <p>${recipe.strInstructions}</p>
            </div>
        </div>
        <div class="center mt">
            ${youtubeEmbedHTML}
        </div>
    `;
}

window.addEventListener('load', fetchRecipeDetails); // Load and display recipe details when the page is loaded