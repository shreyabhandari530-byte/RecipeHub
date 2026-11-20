const db = require('../config/database');

const sampleRecipes = [
  {
    title: 'Avocado Toast',
    description: 'Crispy artisanal sourdough topped with creamy mashed avocado, chili flakes, poached eggs, and microgreens.',
    preparation_time: 15,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'American',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '2 slices artisan sourdough bread',
      '1 ripe Haas avocado',
      '1 tbsp extra virgin olive oil',
      '1/2 tsp red pepper flakes',
      '1/2 lemon, juiced',
      '1 pinch sea salt & freshly ground black pepper',
      '2 fresh eggs (optional for poached topping)',
      'Fresh microgreens for garnish'
    ],
    instructions: [
      'Toast sourdough slices until golden brown and crisp.',
      'Cut the avocado in half, remove the pit, and scoop the flesh into a small bowl.',
      'Mash avocado with lemon juice, a drizzle of olive oil, salt, and black pepper.',
      'If desired, poach two eggs in lightly simmering water with a dash of vinegar for 3 minutes.',
      'Generously spread mashed avocado over the warm toast.',
      'Top with poached eggs, red pepper flakes, and fresh microgreens. Serve immediately.'
    ]
  },
  {
    title: 'Fluffy Golden Pancakes',
    description: 'Light, fluffy American-style breakfast pancakes served with pure maple syrup, butter, and fresh berries.',
    preparation_time: 20,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'American',
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '1 1/2 cups all-purpose flour',
      '3 1/2 tsp baking powder',
      '1 tbsp granulated sugar',
      '1/2 tsp salt',
      '1 1/4 cups whole milk',
      '1 large egg',
      '3 tbsp unsalted butter, melted',
      '1 tsp pure vanilla extract',
      'Fresh strawberries and blueberries for serving',
      'Warm pure maple syrup'
    ],
    instructions: [
      'In a large bowl, sift together flour, baking powder, sugar, and salt.',
      'In another bowl, whisk milk, egg, melted butter, and vanilla extract.',
      'Pour wet ingredients into dry ingredients and stir gently until just combined (lumps are fine).',
      'Heat a lightly oiled griddle or nonstick frying pan over medium heat.',
      'Pour 1/4 cup of batter per pancake onto the hot griddle.',
      'Cook until bubbles form on surface and pop, about 2-3 minutes; flip and cook 1-2 minutes until golden.',
      'Stack high and serve hot with fresh berries and warm maple syrup.'
    ]
  },
  {
    title: 'Vegetable Pasta Primavera',
    description: 'Al dente penne pasta tossed with sautéed bell peppers, zucchini, cherry tomatoes, fragrant garlic, and fresh basil.',
    preparation_time: 25,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'Italian',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281744?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '300g Penne or rigatoni pasta',
      '2 cups cherry tomatoes, halved',
      '1 medium zucchini, sliced into half-moons',
      '1 red bell pepper, thinly sliced',
      '3 cloves fresh garlic, minced',
      '3 tbsp extra virgin olive oil',
      '1/4 cup grated Parmesan cheese (or nutritional yeast)',
      '1/4 cup fresh basil leaves, torn',
      'Salt and cracked black pepper to taste'
    ],
    instructions: [
      'Bring a large pot of salted water to a rolling boil. Cook pasta until al dente; reserve 1/2 cup pasta water before draining.',
      'In a large skillet, heat olive oil over medium heat. Add minced garlic and sauté for 1 minute until aromatic.',
      'Add sliced bell peppers and zucchini. Cook for 4-5 minutes until tender-crisp.',
      'Toss in cherry tomatoes and cook for 2 minutes until they start to soften and blister.',
      'Add the drained pasta and reserved pasta water to the skillet. Toss everything together.',
      'Season with salt and pepper. Stir in fresh basil leaves and grated parmesan. Serve warm.'
    ]
  },
  {
    title: 'Vegetable Fried Rice',
    description: 'Wok-tossed jasmine rice loaded with crisp garden vegetables, scallions, toasted sesame oil, and savory soy sauce.',
    preparation_time: 20,
    difficulty: 'Medium',
    category: 'Lunch',
    cuisine: 'Asian',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '3 cups day-old cooked jasmine rice',
      '1 cup frozen peas and diced carrots',
      '1/2 cup sweet corn kernels',
      '3 spring onions (scallions), chopped',
      '3 cloves garlic, minced',
      '1 tbsp fresh ginger, grated',
      '3 tbsp dark & light soy sauce blend',
      '1 tbsp toasted sesame oil',
      '2 tbsp vegetable cooking oil',
      '1/2 tsp white pepper'
    ],
    instructions: [
      'Heat 1 tbsp oil in a large wok or heavy skillet over high heat.',
      'Add garlic and ginger; stir-fry vigorously for 30 seconds until fragrant.',
      'Add peas, diced carrots, and corn. Stir-fry for 2-3 minutes until heated through.',
      'Push vegetables to the sides, add remaining oil, then add chilled day-old rice, breaking up any clumps with a spatula.',
      'Drizzle soy sauce, sesame oil, and white pepper over the rice. Toss continuously on high heat for 3-4 minutes.',
      'Garnish with chopped scallions and toasted sesame seeds. Serve piping hot.'
    ]
  },
  {
    title: 'Decadent Chocolate Cake',
    description: 'Rich, moist double chocolate fudge cake topped with a velvety chocolate ganache and chocolate curls.',
    preparation_time: 50,
    difficulty: 'Hard',
    category: 'Dessert',
    cuisine: 'French',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '2 cups all-purpose flour',
      '2 cups granulated sugar',
      '3/4 cup unsweetened Dutch-process cocoa powder',
      '2 tsp baking powder & 1 1/2 tsp baking soda',
      '1 tsp salt',
      '2 large eggs',
      '1 cup whole milk',
      '1/2 cup vegetable oil',
      '2 tsp vanilla extract',
      '1 cup freshly brewed hot coffee',
      '1 cup semi-sweet dark chocolate chips for ganache',
      '1/2 cup heavy cream'
    ],
    instructions: [
      'Preheat oven to 350°F (175°C). Grease and flour two 9-inch round baking pans.',
      'In a large bowl, whisk flour, sugar, cocoa powder, baking powder, baking soda, and salt.',
      'Add eggs, milk, oil, and vanilla. Beat on medium speed for 2 minutes until smooth.',
      'Stir in boiling coffee by hand (batter will be thin, which creates moisture).',
      'Divide batter evenly between pans. Bake for 30 to 35 minutes until a toothpick inserted in center comes out clean.',
      'Cool cakes completely on wire racks.',
      'Warm heavy cream, pour over chocolate chips, and whisk until silky smooth to make ganache.',
      'Frost between layers and coat the entire cake with glossy chocolate ganache. Chill before slicing.'
    ]
  },
  {
    title: 'Rainbow Fruit Salad',
    description: 'A vibrant medley of fresh seasonal fruits drizzled with a refreshing honey-lime and mint dressing.',
    preparation_time: 15,
    difficulty: 'Easy',
    category: 'Dessert',
    cuisine: 'Mediterranean',
    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '1 cup fresh strawberries, hulled and quartered',
      '1 cup sweet pineapple chunks',
      '1 cup seedless green and red grapes, halved',
      '1 cup fresh blueberries',
      '2 ripe kiwis, peeled and sliced',
      '1 ripe mango, diced',
      '2 tbsp fresh lime juice',
      '2 tbsp raw organic honey (or agave syrup)',
      '2 tbsp fresh mint leaves, finely chiffonaded'
    ],
    instructions: [
      'Wash, peel, and chop all fruits into bite-sized uniform pieces.',
      'Combine strawberries, pineapple, grapes, blueberries, kiwis, and mango in a large glass serving bowl.',
      'In a small bowl, whisk together fresh lime juice, honey, and chopped mint.',
      'Drizzle the honey-lime dressing evenly over the fruit.',
      'Toss gently with silicone spoons to prevent crushing delicate berries.',
      'Refrigerate for 20 minutes before serving chilled.'
    ]
  },
  {
    title: 'Mediterranean Chickpea Salad',
    description: 'Crisp cucumbers, juicy cherry tomatoes, kalamata olives, and protein-packed chickpeas in zesty lemon herb dressing.',
    preparation_time: 15,
    difficulty: 'Easy',
    category: 'Vegan',
    cuisine: 'Mediterranean',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '2 cans (15 oz each) chickpeas (garbanzo beans), rinsed and drained',
      '1 English cucumber, diced',
      '1 1/2 cups cherry tomatoes, halved',
      '1/2 red onion, finely chopped',
      '1/2 cup kalamata olives, pitted and sliced',
      '1/3 cup fresh Italian flat-leaf parsley, chopped',
      '3 tbsp extra virgin olive oil',
      '2 tbsp fresh lemon juice',
      '1 clove garlic, finely grated',
      '1 tsp dried oregano',
      'Sea salt and freshly cracked black pepper'
    ],
    instructions: [
      'Drain and thoroughly rinse chickpeas in cold water; pat dry with clean kitchen towels.',
      'In a large mixing bowl, combine chickpeas, cucumber, cherry tomatoes, red onion, kalamata olives, and fresh parsley.',
      'In a mason jar, combine olive oil, lemon juice, grated garlic, dried oregano, salt, and pepper. Shake vigorously until emulsified.',
      'Pour dressing over salad and toss well to coat all ingredients.',
      'Let rest for 10-15 minutes so flavors absorb deeply into chickpeas.',
      'Serve cold or at room temperature as a healthy vegan lunch or side.'
    ]
  },
  {
    title: 'Creamy Coconut Vegetable Curry',
    description: 'Tender cauliflower florets, sweet potatoes, baby spinach, and chickpeas simmered in aromatic coconut red curry broth.',
    preparation_time: 35,
    difficulty: 'Medium',
    category: 'Vegan',
    cuisine: 'Indian',
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      '1 head cauliflower, cut into bite-sized florets',
      '1 large sweet potato, peeled and cubed',
      '1 can (15 oz) chickpeas, rinsed and drained',
      '2 cups fresh baby spinach leaves',
      '1 can (14 oz) full-fat coconut milk',
      '1 can (14 oz) crushed tomatoes',
      '1 medium yellow onion, diced',
      '3 cloves garlic, minced',
      '1 tbsp ginger, freshly grated',
      '2 tbsp mild yellow curry powder',
      '1 tsp ground cumin & 1/2 tsp ground turmeric',
      '2 tbsp coconut oil',
      'Fresh cilantro & lime wedges for serving',
      'Cooked Basmati rice for pairing'
    ],
    instructions: [
      'Heat coconut oil in a large Dutch oven or deep pot over medium heat.',
      'Add chopped onion and cook for 4-5 minutes until translucent.',
      'Add minced garlic, ginger, curry powder, cumin, and turmeric; sauté for 1 minute until fragrant.',
      'Add sweet potatoes, cauliflower florets, and crushed tomatoes. Stir to coat thoroughly in spices.',
      'Pour in coconut milk and bring mixture to a gentle boil.',
      'Reduce heat to low, cover with lid, and simmer for 20 minutes until sweet potatoes and cauliflower are fork-tender.',
      'Stir in chickpeas and baby spinach; simmer uncovered for 3-4 minutes until spinach is wilted.',
      'Taste and season with salt and a squeeze of fresh lime juice.',
      'Garnish with fresh cilantro and serve warm over fluffy Basmati rice.'
    ]
  }
];

function seedDatabase() {
  console.log('Seeding RecipeHub database...');

  const checkStmt = db.prepare('SELECT id FROM recipes WHERE title = ?');
  const insertStmt = db.prepare(`
    INSERT INTO recipes (
      title, description, preparation_time, difficulty, category, cuisine,
      image_url, ingredients, instructions, likes
    ) VALUES (
      @title, @description, @preparation_time, @difficulty, @category, @cuisine,
      @image_url, @ingredients, @instructions, @likes
    )
  `);

  const insertMany = db.transaction((recipes) => {
    let insertedCount = 0;
    for (const recipe of recipes) {
      const existing = checkStmt.get(recipe.title);
      if (!existing) {
        insertStmt.run({
          title: recipe.title,
          description: recipe.description,
          preparation_time: recipe.preparation_time,
          difficulty: recipe.difficulty,
          category: recipe.category,
          cuisine: recipe.cuisine || null,
          image_url: recipe.image_url || null,
          ingredients: JSON.stringify(recipe.ingredients),
          instructions: JSON.stringify(recipe.instructions),
          likes: Math.floor(Math.random() * 8) + 2 // Start with a few initial community likes
        });
        insertedCount++;
        console.log(`✓ Inserted recipe: "${recipe.title}" (${recipe.category})`);
      } else {
        console.log(`- Recipe already exists: "${recipe.title}"`);
      }
    }
    return insertedCount;
  });

  const inserted = insertMany(sampleRecipes);
  console.log(`Database seeding completed. ${inserted} new recipes added.`);
}

if (require.main === module) {
  seedDatabase();
  process.exit(0);
}

module.exports = seedDatabase;
