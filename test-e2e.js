// Comprehensive E2E & Full-Stack Verification Suite for RecipeHub (CodeNova Task 4)

async function runE2ETests() {
  console.log('=====================================================');
  console.log('🚀 RECIPEHUB FULL-STACK END-TO-END VERIFICATION SUITE');
  console.log('=====================================================\n');

  const BACKEND_URL = 'http://localhost:5000';
  const FRONTEND_URL = 'http://127.0.0.1:5173';
  const visitorId = 'e2e_tester_' + Date.now();

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  try {
    // 1. Verify Backend root
    console.log('\n--- 1. Testing Backend Server & Root Endpoint ---');
    const rootRes = await fetch(`${BACKEND_URL}/`);
    const rootData = await rootRes.json();
    assert(rootRes.status === 200, 'Backend is reachable and returns HTTP 200');
    assert(rootData.message === 'RecipeHub Backend is Running!', 'Root message matches specification');

    // 2. Verify Frontend server
    console.log('\n--- 2. Testing Frontend Dev Server ---');
    const feRes = await fetch(`${FRONTEND_URL}/`);
    const feHtml = await feRes.text();
    assert(feRes.status === 200, 'Frontend server is active on port 5173 and returns HTTP 200');
    assert(feHtml.includes('RecipeHub'), 'Frontend HTML includes RecipeHub title/meta');
    assert(feHtml.includes('src/main.jsx'), 'Frontend HTML loads the React application script');

    // 3. Verify Database Seed & Recipe Explorer API
    console.log('\n--- 3. Testing Recipe Retrieval & SQLite Seed ---');
    const recipesRes = await fetch(`${BACKEND_URL}/api/recipes`, {
      headers: { 'X-Visitor-ID': visitorId }
    });
    const recipesData = await recipesRes.json();
    assert(recipesData.success === true, 'GET /api/recipes returns success: true');
    assert(recipesData.count >= 8, `Database contains at least 8 seeded recipes (found ${recipesData.count})`);

    const sample = recipesData.data[0];
    assert(typeof sample.id === 'number', 'Recipe has integer ID');
    assert(typeof sample.title === 'string' && sample.title.length > 0, 'Recipe has title');
    assert(Array.isArray(sample.ingredients), 'Ingredients is parsed as a JavaScript Array');
    assert(Array.isArray(sample.instructions), 'Instructions is parsed as a JavaScript Array');
    assert(typeof sample.preparation_time === 'number', 'Preparation time is a number');
    assert(['Easy', 'Medium', 'Hard'].includes(sample.difficulty), 'Difficulty is valid');
    assert(['Breakfast', 'Lunch', 'Dessert', 'Vegan'].includes(sample.category), 'Category is valid');
    assert(typeof sample.likes === 'number', 'Likes count is a number');

    // 4. Testing Search by Title, Ingredient & Cuisine
    console.log('\n--- 4. Testing Multi-Field Search Functionality ---');
    const titleSearch = await fetch(`${BACKEND_URL}/api/recipes?search=Pancakes`).then(r => r.json());
    assert(titleSearch.data.some(r => r.title.toLowerCase().includes('pancake')), 'Search by recipe title works');

    const ingSearch = await fetch(`${BACKEND_URL}/api/recipes?search=avocado`).then(r => r.json());
    assert(ingSearch.data.some(r => r.title.toLowerCase().includes('avocado')), 'Search by ingredient keyword works');

    const cuisineSearch = await fetch(`${BACKEND_URL}/api/recipes?cuisine=Italian`).then(r => r.json());
    assert(cuisineSearch.data.some(r => r.cuisine === 'Italian'), 'Search by cuisine type works');

    // 5. Testing Category and Difficulty Filters
    console.log('\n--- 5. Testing Category and Difficulty Filtering ---');
    const breakfastFilter = await fetch(`${BACKEND_URL}/api/recipes?category=Breakfast`).then(r => r.json());
    assert(breakfastFilter.data.every(r => r.category === 'Breakfast'), 'Category filter: Breakfast returns only breakfast recipes');

    const veganFilter = await fetch(`${BACKEND_URL}/api/recipes?category=Vegan`).then(r => r.json());
    assert(veganFilter.data.every(r => r.category === 'Vegan'), 'Category filter: Vegan returns only vegan recipes');

    const easyFilter = await fetch(`${BACKEND_URL}/api/recipes?difficulty=Easy`).then(r => r.json());
    assert(easyFilter.data.every(r => r.difficulty === 'Easy'), 'Difficulty filter: Easy returns only easy recipes');

    // 6. Recipe Creation (CRUD - Create)
    console.log('\n--- 6. Testing Recipe Creation (POST /api/recipes) ---');
    const testRecipe = {
      title: 'E2E Roasted Garlic Hummus Bowl',
      description: 'Creamy homemade roasted garlic chickpea dip topped with warm zaatar pine nuts and pita chips.',
      preparation_time: 15,
      difficulty: 'Easy',
      category: 'Vegan',
      cuisine: 'Mediterranean',
      image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1000&q=80',
      ingredients: [
        '2 cans cooked chickpeas',
        '1/3 cup tahini paste',
        '4 cloves roasted garlic',
        '1/4 cup extra virgin olive oil',
        'Juice of 1 fresh lemon',
        '1 tsp ground cumin'
      ],
      instructions: [
        'Drain chickpeas and place into high-speed food processor.',
        'Add tahini, roasted garlic, lemon juice, cumin, and sea salt.',
        'Blend until smooth while drizzling in olive oil.',
        'Spoon into shallow bowl and drizzle with warm olive oil and paprika.'
      ]
    };

    const createRes = await fetch(`${BACKEND_URL}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRecipe)
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, 'POST /api/recipes returns HTTP 201 Created');
    assert(createData.success === true, 'Response contains success: true');
    const newRecipeId = createData.data.id;
    assert(typeof newRecipeId === 'number', `New recipe ID assigned: ${newRecipeId}`);

    // 7. Recipe Retrieval by ID (CRUD - Read)
    console.log('\n--- 7. Testing Recipe Details by ID (GET /api/recipes/:id) ---');
    const detailRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}`, {
      headers: { 'X-Visitor-ID': visitorId }
    });
    const detailData = await detailRes.json();
    assert(detailRes.status === 200, 'GET /api/recipes/:id returns HTTP 200');
    assert(detailData.data.title === testRecipe.title, 'Retrieved recipe title matches');
    assert(detailData.data.ingredients.length === 6, 'Retrieved 6 parsed ingredients');
    assert(detailData.data.instructions.length === 4, 'Retrieved 4 parsed instructions');

    // 8. Like and Duplicate Like Prevention
    console.log('\n--- 8. Testing Likes and Duplicate Constraint ---');
    const likeRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/like`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorId }
    });
    const likeData = await likeRes.json();
    assert(likeRes.status === 200, 'POST like returns HTTP 200');
    assert(likeData.likes === 1, 'Like count incremented to 1');

    // Duplicate like attempt
    const dupLikeRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/like`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorId }
    });
    assert(dupLikeRes.status === 409, 'Duplicate like rejected with HTTP 409 Conflict');

    // 9. Unlike Recipe
    console.log('\n--- 9. Testing Unlike Functionality ---');
    const unlikeRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/like`, {
      method: 'DELETE',
      headers: { 'X-Visitor-ID': visitorId }
    });
    const unlikeData = await unlikeRes.json();
    assert(unlikeRes.status === 200, 'DELETE like returns HTTP 200');
    assert(unlikeData.likes === 0, 'Like count decremented back to 0');

    // 10. Add to Favourites and Duplicate Prevention
    console.log('\n--- 10. Testing Favourites & Persistence ---');
    const favRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/favourite`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorId }
    });
    assert(favRes.status === 201, 'POST favourite returns HTTP 201 Created');

    // Duplicate favourite attempt
    const dupFavRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/favourite`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorId }
    });
    assert(dupFavRes.status === 409, 'Duplicate favourite rejected with HTTP 409 Conflict');

    // 11. Retrieve Visitor Favourites List
    console.log('\n--- 11. Testing GET /api/favourites ---');
    const getFavsRes = await fetch(`${BACKEND_URL}/api/favourites`, {
      headers: { 'X-Visitor-ID': visitorId }
    });
    const getFavsData = await getFavsRes.json();
    assert(getFavsRes.status === 200, 'GET /api/favourites returns HTTP 200');
    assert(getFavsData.data.some(r => r.id === newRecipeId), 'Newly favourited recipe is in visitor favourites list');

    // 12. Remove Favourite
    console.log('\n--- 12. Testing Remove Favourite ---');
    const remFavRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}/favourite`, {
      method: 'DELETE',
      headers: { 'X-Visitor-ID': visitorId }
    });
    assert(remFavRes.status === 200, 'DELETE favourite returns HTTP 200');

    const verifyRemFavs = await fetch(`${BACKEND_URL}/api/favourites`, {
      headers: { 'X-Visitor-ID': visitorId }
    }).then(r => r.json());
    assert(!verifyRemFavs.data.some(r => r.id === newRecipeId), 'Recipe successfully removed from visitor favourites');

    // 13. Update Recipe (CRUD - Update)
    console.log('\n--- 13. Testing Recipe Update (PUT /api/recipes/:id) ---');
    const updatePayload = {
      ...testRecipe,
      title: 'E2E Roasted Garlic Hummus Bowl (Updated Deluxe Edition)',
      preparation_time: 18
    };
    const updateRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'PUT /api/recipes/:id returns HTTP 200');
    assert(updateData.data.title.includes('Updated Deluxe Edition'), 'Updated title saved to database');
    assert(updateData.data.preparation_time === 18, 'Updated prep time saved to database');

    // 14. Input Validation (Error Handling)
    console.log('\n--- 14. Testing Backend Input Validation ---');
    const badInputRes = await fetch(`${BACKEND_URL}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'X' }) // Short title, missing fields
    });
    assert(badInputRes.status === 400, 'Invalid recipe payload rejected with HTTP 400 Bad Request');
    const badInputData = await badInputRes.json();
    assert(badInputData.success === false, 'Error response contains success: false');
    assert(typeof badInputData.message === 'string', 'Error response contains meaningful message');

    // 15. Delete Recipe & Cascade Cleanup (CRUD - Delete)
    console.log('\n--- 15. Testing Recipe Deletion (DELETE /api/recipes/:id) ---');
    const deleteRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}`, {
      method: 'DELETE'
    });
    assert(deleteRes.status === 200, 'DELETE /api/recipes/:id returns HTTP 200');

    // Verify deleted
    const verifyDelRes = await fetch(`${BACKEND_URL}/api/recipes/${newRecipeId}`);
    assert(verifyDelRes.status === 404, 'Accessing deleted recipe returns HTTP 404 Not Found');

    console.log('\n=====================================================');
    console.log(`🎉 ALL ${passed}/${total} E2E & FULL-STACK TESTS PASSED SUCCESSFULLY!`);
    console.log('=====================================================\n');
  } catch (err) {
    console.error('\n❌ E2E Test Suite Encountered an Error:', err.message);
    process.exit(1);
  }
}

runE2ETests();
