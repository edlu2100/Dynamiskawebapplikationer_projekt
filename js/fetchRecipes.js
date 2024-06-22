// Exports function to fetch recipes based on a specific starting letter
export async function fetchRecipes(letter) {
    try {
        // Fetch-request
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);

        // Parse the JSON response
        const data = await response.json();
        // Return the meals array 
        return data.meals;
    } catch (error) {
        // If error, log it
        console.error(`Error fetching recipes for letter ${letter}:`, error);
        return null;
    }
}