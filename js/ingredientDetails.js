async function fetchIngredientDetails() {
    // Access the URL parameters to retrieve the 'ingredient' value.
    const urlParams = new URLSearchParams(window.location.search);
    const ingredient = urlParams.get('ingredient');
    // Fetch and display category details based on the ingredient.
    fetchCategoryDetails(ingredient);

    // If no ingredient is specified, display an error message and exit the function.
    if (!ingredient) {
        document.getElementById('ingredient-details').innerHTML = 'No ingredient specified.';
        return;
    }

    // Set the header to show which ingredient is being displayed.
    const ingredientHeader = document.querySelector('.ingredientHeader');
    ingredientHeader.innerHTML = `<h2>Recipes with ${decodeURIComponent(ingredient)}</h2>`;

    // Attempt to fetch recipes that include the specified ingredient.
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`);
        if (!response.ok) throw new Error('Network response was not ok.');

        const data = await response.json();
        // If meals are found, display them; otherwise, show an error message.
        if (data.meals) {
            displayIngredientDetails(data.meals);
        } else {
            document.getElementById('ingredient-details').innerHTML = '<p>Inga recept finns med denna ingrediens</p>';
        }
    } catch (error) {
        console.error("Failed to fetch ingredient details: ", error);
        document.getElementById('ingredient-details').innerHTML = `Kunde inte hämta ingrediens: ${error.message}`;
    }
}

// Function to fetch and display details of a category associated with a recipe.
async function fetchCategoryDetails(categoryName) {
    try {
        // Fetch all categories from the API.
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
        const data = await response.json();

        // Find the category that matches the provided category name.
        const category = data.categories.find(cat => cat.strCategory === categoryName);
        // Display category details if found.
        if (category) {
            displayCategoryDetails(category);
        }

    } catch (error) {
        console.error(`Failed to fetch category details: `, error);
    }
}

// Function to display the details of a category in the HTML. (not all categories have it)
function displayCategoryDetails(category) {
    const container = document.getElementById('categoryDetails');
    if (category) {
        container.innerHTML = `
            <h1 class="center">${category.strCategory}</h1>
            <div>
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" style="width:300px;">
                <p>${category.strCategoryDescription}</p>
            </div>
        `;
    } else {
        container.innerHTML = '<p>Category not found.</p>';
    }
}

// Function to display meal details for a specific ingredient.
async function displayIngredientDetails(meals) {
    const container = document.querySelector('.ingredient-details');
    container.innerHTML = ''; // Clear previous content.

    // Loop through each meal and fetch its detailed information.
    for (const meal of meals) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
            if (!response.ok) throw new Error('Network response was not ok.');

            const detailData = await response.json();
            if (!detailData.meals) throw new Error('No meal details found.');

            // Create HTML structure for each meal and append to the container.
            const recipeDetails = detailData.meals[0];
            const mealDiv = document.createElement('div');
            mealDiv.className = 'card';
            mealDiv.innerHTML = `
                <a href="recipe-detail.html?id=${meal.idMeal}">
                    <img src="${recipeDetails.strMealThumb}" alt="${recipeDetails.strMeal}" class="cardImg">
                    <div>
                        <h3>${recipeDetails.strMeal}</h3>
                    </div>
                </a>
            `;

            container.appendChild(mealDiv);
        } catch (error) {
            console.error(`Failed to fetch detailed recipe information for meal ID ${meal.idMeal}: `, error);
        }
    }
}

// Run code when page load
window.addEventListener('load', fetchIngredientDetails);