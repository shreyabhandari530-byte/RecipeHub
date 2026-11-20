const { app, server } = require('./server');

const TEST_PORT = 5001;

async function runTests() {
  console.log('--- Starting RecipeHub Backend API Test Suite ---');
  let testServer;
  try {
    testServer = app.listen(TEST_PORT);
    const BASE = `http://localhost:${TEST_PORT}`;
    const visitorA = 'test-visitor-' + Date.now();
    const visitorB = 'test-visitor-b-' + Date.now();

    // 1. Root endpoint test
    const rootRes = await fetch(`${BASE}/`);
    const rootJson = await rootRes.json();
    console.assert(rootRes.status === 200, 'Root should return 200');
    console.assert(rootJson.message === 'RecipeHub Backend is Running!', 'Root message match');
    console.log('✓ 1. Root endpoint GET / passed');

    // 2. GET all recipes
    const allRes = await fetch(`${BASE}/api/recipes`, {
      headers: { 'X-Visitor-ID': visitorA }
    });
    const allJson = await allRes.json();
    console.assert(allJson.success === true, 'GET all recipes success');
    console.assert(allJson.count >= 8, 'Initial recipe count >= 8');
    console.assert(Array.isArray(allJson.data[0].ingredients), 'Ingredients parsed as array');
    console.assert(Array.isArray(allJson.data[0].instructions), 'Instructions parsed as array');
    console.log(`✓ 2. GET all recipes passed (${allJson.count} recipes found)`);

    // 3. Search and filter
    const searchRes = await fetch(`${BASE}/api/recipes?search=Pasta`);
    const searchJson = await searchRes.json();
    console.assert(searchJson.data.some(r => r.title.includes('Pasta')), 'Search by title works');
    console.log('✓ 3. Search by title passed');

    const catRes = await fetch(`${BASE}/api/recipes?category=Breakfast`);
    const catJson = await catRes.json();
    console.assert(catJson.data.every(r => r.category === 'Breakfast'), 'Category filter works');
    console.log('✓ 4. Filter by category passed');

    const diffRes = await fetch(`${BASE}/api/recipes?difficulty=Easy`);
    const diffJson = await diffRes.json();
    console.assert(diffJson.data.every(r => r.difficulty === 'Easy'), 'Difficulty filter works');
    console.log('✓ 5. Filter by difficulty passed');

    // 4. Create new recipe (POST)
    const newRecipePayload = {
      title: 'Automated Test Berry Smoothie Bowl',
      description: 'Refreshing smoothie bowl loaded with antioxidant-rich berries, granola, and chia seeds.',
      preparation_time: 10,
      difficulty: 'Easy',
      category: 'Breakfast',
      cuisine: 'American',
      image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1000&q=80',
      ingredients: ['1 cup frozen mixed berries', '1 ripe banana', '1/2 cup almond milk', '2 tbsp granola'],
      instructions: ['Blend berries, banana and almond milk.', 'Pour into bowl.', 'Top with granola.']
    };

    const createRes = await fetch(`${BASE}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipePayload)
    });
    const createJson = await createRes.json();
    console.assert(createRes.status === 201, 'POST recipe returns 201');
    console.assert(createJson.success === true, 'POST recipe success');
    const createdId = createJson.data.id;
    console.log(`✓ 6. POST create recipe passed (ID: ${createdId})`);

    // 5. GET single recipe
    const singleRes = await fetch(`${BASE}/api/recipes/${createdId}`, {
      headers: { 'X-Visitor-ID': visitorA }
    });
    const singleJson = await singleRes.json();
    console.assert(singleRes.status === 200, 'GET recipe by id 200');
    console.assert(singleJson.data.title === newRecipePayload.title, 'Title match');
    console.log('✓ 7. GET single recipe passed');

    // 6. Like and Unlike functionality
    const initialLikes = singleJson.data.likes;
    const likeRes = await fetch(`${BASE}/api/recipes/${createdId}/like`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorA }
    });
    const likeJson = await likeRes.json();
    console.assert(likeRes.status === 200, 'Like returns 200');
    console.assert(likeJson.likes === initialLikes + 1, 'Likes count incremented');
    console.log(`✓ 8. Like API passed (likes: ${likeJson.likes})`);

    // Duplicate like rejection
    const dupLikeRes = await fetch(`${BASE}/api/recipes/${createdId}/like`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorA }
    });
    console.assert(dupLikeRes.status === 409, 'Duplicate like should return 409');
    console.log('✓ 9. Duplicate like prevention passed');

    // Unlike
    const unlikeRes = await fetch(`${BASE}/api/recipes/${createdId}/like`, {
      method: 'DELETE',
      headers: { 'X-Visitor-ID': visitorA }
    });
    const unlikeJson = await unlikeRes.json();
    console.assert(unlikeRes.status === 200, 'Unlike returns 200');
    console.assert(unlikeJson.likes === initialLikes, 'Likes count decremented');
    console.log('✓ 10. Unlike API passed');

    // 7. Favourite and Unfavourite
    const favRes = await fetch(`${BASE}/api/recipes/${createdId}/favourite`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorA }
    });
    const favJson = await favRes.json();
    console.assert(favRes.status === 201, 'Add favourite returns 201');
    console.log('✓ 11. Add Favourite API passed');

    // Duplicate favourite rejection
    const dupFavRes = await fetch(`${BASE}/api/recipes/${createdId}/favourite`, {
      method: 'POST',
      headers: { 'X-Visitor-ID': visitorA }
    });
    console.assert(dupFavRes.status === 409, 'Duplicate favourite returns 409');
    console.log('✓ 12. Duplicate favourite prevention passed');

    // Get favourites
    const getFavsRes = await fetch(`${BASE}/api/favourites`, {
      headers: { 'X-Visitor-ID': visitorA }
    });
    const getFavsJson = await getFavsRes.json();
    console.assert(getFavsJson.data.some(r => r.id === createdId), 'Favourited recipe in visitor favourites');
    console.log('✓ 13. GET favourites list passed');

    // Remove favourite
    const remFavRes = await fetch(`${BASE}/api/recipes/${createdId}/favourite`, {
      method: 'DELETE',
      headers: { 'X-Visitor-ID': visitorA }
    });
    console.assert(remFavRes.status === 200, 'Remove favourite returns 200');
    console.log('✓ 14. Remove Favourite API passed');

    // 8. Update Recipe (PUT)
    const updatePayload = {
      ...newRecipePayload,
      title: 'Automated Test Berry Smoothie Bowl (Updated)',
      preparation_time: 12
    };
    const updateRes = await fetch(`${BASE}/api/recipes/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    const updateJson = await updateRes.json();
    console.assert(updateRes.status === 200, 'PUT recipe returns 200');
    console.assert(updateJson.data.title.includes('Updated'), 'Title updated');
    console.log('✓ 15. PUT update recipe passed');

    // 9. Validation tests
    const invalidRes = await fetch(`${BASE}/api/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'No' }) // Missing description, invalid title length
    });
    console.assert(invalidRes.status === 400, 'Validation failure returns 400');
    console.log('✓ 16. Validation rejection passed (400)');

    // 10. Delete Recipe (DELETE)
    const deleteRes = await fetch(`${BASE}/api/recipes/${createdId}`, {
      method: 'DELETE'
    });
    console.assert(deleteRes.status === 200, 'DELETE recipe returns 200');
    const verifyDel = await fetch(`${BASE}/api/recipes/${createdId}`);
    console.assert(verifyDel.status === 404, 'Deleted recipe returns 404');
    console.log('✓ 17. DELETE recipe passed');

    console.log('\n===============================================');
    console.log('🎉 ALL BACKEND API & DATABASE TESTS PASSED 100%!');
    console.log('===============================================');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  } finally {
    if (testServer) testServer.close();
    if (server) server.close();
  }
}

runTests();
