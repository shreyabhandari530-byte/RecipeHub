# 🍳 RecipeHub – Community Recipe Sharing Platform
### CodeNova Full Stack Web Development Internship • Task 4

[![Node.js](https://img.shields.io/badge/Node.js-v24.22.0-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.3.0-lightgrey.svg)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-orange.svg)](https://github.com/WiseLibs/better-sqlite3)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 1. Project Overview

**RecipeHub** is a responsive, feature-packed full-stack web application developed for **CodeNova Full Stack Web Development Internship (Task 4)**. It provides an intuitive, community-driven space where culinary enthusiasts, home cooks, and food lovers can discover recipes, explore diverse cuisines, publish their own creations, check off ingredients interactively during cooking, like dishes, and save their favourite recipes.

The application connects a **React.js single-page frontend (SPA)** with an **Express.js RESTful API** and an **SQLite relational database** powered by `better-sqlite3` with foreign key cascades, data validation, and anonymous visitor identification.

---

## 🎯 2. Project Objectives

- Provide a seamless and responsive platform for discovering and publishing recipes.
- Deliver real-time, zero-reload search by recipe title, ingredient keyword, and cuisine.
- Implement categorized and difficulty-based filtering.
- Provide an interactive, client-side ingredient checklist with real-time visual progress tracking.
- Enable persistent likes and favourites linked to anonymous visitors using custom header tracking (`X-Visitor-ID`).
- Maintain clean code separation across controllers, routes, middleware, services, and reusable React components.

---

## ✨ 3. Key Features

- **Dynamic Homepage & Hero Section**: Features an inviting culinary hero banner, live community statistics, quick search, and category shortcuts.
- **Real-Time Search & Filtering**: Instant client-side and server-side filtering by dish name, ingredient keyword (e.g. avocado, garlic), cuisine (Italian, Asian, etc.), category (Breakfast, Lunch, Dessert, Vegan), and difficulty (Easy, Medium, Hard).
- **Interactive Ingredient Checklist**: Dynamic checkboxes that calculate live preparation progress (e.g., *4 of 6 ingredients ready - 67%*), with progress bar animations and quick "Check All / Reset" controls without modifying underlying database records.
- **Interactive Cooking Instructions**: Clickable step completion items that allow home cooks to check off instructions as they cook.
- **Anonymous Visitor Liking & Favouriting**: Generates a persistent unique visitor ID stored in `localStorage`, sent with an `X-Visitor-ID` HTTP header. Unique SQLite constraints prevent duplicate likes or favourites from the same visitor while providing immediate optimistic UI updates.
- **Complete Recipe CRUD Operations**:
  - **Create**: Add new recipes with dynamically added/removed ingredient inputs and cooking instruction steps.
  - **Read**: Fetch complete recipe lists or individual recipe detail pages.
  - **Update**: Edit existing recipes with pre-populated form fields.
  - **Delete**: Remove recipes with a modal confirmation dialog and automatic database cascade cleanup of associated likes and favourites.
- **Dedicated Favourites Collection**: A dedicated page displaying all recipes saved by the visitor with one-click removal and direct recipe navigation.
- **Food-Inspired Warm Design**: Styled with warm creams, fresh sage green, saffron orange, and cocoa brown accents, rounded cards, subtle shadows, and mobile responsiveness.

---

## 🛠️ 4. Technology Stack

### Frontend
- **Framework**: React.js 18 (Vite build tool)
- **Routing**: React Router DOM (v6)
- **Language**: JavaScript (ES6+), HTML5, CSS3
- **Styling**: Modular CSS with CSS Custom Properties (Variables), Responsive Flexbox & Grid
- **State & Lifecycle**: React Hooks (`useState`, `useEffect`, `useCallback`, `useParams`, `useNavigate`, `useSearchParams`)
- **Data Fetching**: Native Fetch API with centralized API client

### Backend
- **Runtime**: Node.js (v24.x)
- **Framework**: Express.js (v5.x)
- **Architecture**: Controller-Route-Service-Middleware pattern (RESTful JSON APIs)
- **Database Driver**: `better-sqlite3` (High-performance synchronous C++ SQLite3 binding)
- **Cross-Origin**: CORS middleware
- **Configuration**: Dotenv environment variable management

### Database
- **Engine**: SQLite 3 (`recipehub.db`)
- **Features**: Foreign keys enabled (`PRAGMA foreign_keys = ON`), `ON DELETE CASCADE`, composite `UNIQUE(recipe_id, visitor_id)` constraints, composite indexes for high-speed searches.

---

## 🏗️ 5. Architecture & Project Structure

```
RecipeHub/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Sticky navbar with mobile toggle & fav counter
│   │   │   ├── Footer.jsx               # Platform info, category shortcuts & culinary tip
│   │   │   ├── RecipeCard.jsx           # Recipe grid card with like & fav toggles
│   │   │   ├── SearchBar.jsx            # Real-time search input with clear trigger
│   │   │   ├── CategoryFilter.jsx       # Category tabs & difficulty filter pills
│   │   │   ├── IngredientChecklist.jsx  # Interactive checklist with progress bar
│   │   │   ├── LikeButton.jsx           # Animated like button with optimistic update
│   │   │   ├── Loading.jsx              # Culinary animated loading spinner
│   │   │   └── ErrorMessage.jsx         # Accessible error banner with retry action
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Hero section, search, filters & recipe grid
│   │   │   ├── AddRecipe.jsx            # Dynamic multi-field recipe creation form
│   │   │   ├── RecipeDetails.jsx        # Full recipe details, checklist & instructions
│   │   │   ├── EditRecipe.jsx           # Recipe update form with preloaded values
│   │   │   ├── Favourites.jsx           # Saved favourites collection page
│   │   │   └── NotFound.jsx             # 404 page
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                   # Base fetch client with X-Visitor-ID header
│   │   │   └── recipeService.js         # REST API methods (CRUD, likes, favourites)
│   │   │
│   │   ├── styles/
│   │   │   ├── App.css                  # Global variables, typography, reset & buttons
│   │   │   ├── Navbar.css               # Navbar responsive layout & styles
│   │   │   ├── Home.css                 # Hero section, search filter bar & grid styling
│   │   │   ├── RecipeCard.css           # Recipe card hover effects & badges
│   │   │   ├── AddRecipe.css            # Form layouts & dynamic ingredient rows
│   │   │   └── RecipeDetails.css        # Detail header, checklist grid & modal dialog
│   │   │
│   │   ├── App.jsx                      # App router & global favourites count state
│   │   ├── main.jsx                     # React DOM entry point
│   │   └── index.css                    # Base root container styles
│   │
│   ├── index.html                       # HTML5 entry with Inter font & icon
│   └── package.json                     # Frontend dependencies & build scripts
│
├── backend/
│   ├── config/
│   │   └── database.js                  # better-sqlite3 connection & schema bootstrap
│   │
│   ├── controllers/
│   │   ├── recipeController.js          # GetAll, GetById, Create, Update, Delete
│   │   ├── likeController.js            # Like & Unlike with duplicate prevention
│   │   └── favouriteController.js       # Add, Remove, and List visitor favourites
│   │
│   ├── routes/
│   │   ├── recipeRoutes.js              # /api/recipes endpoints
│   │   └── favouriteRoutes.js           # /api/favourites endpoints
│   │
│   ├── middleware/
│   │   ├── errorHandler.js              # Centralized JSON error responder
│   │   └── validateRecipe.js            # Input validation & sanitization
│   │
│   ├── database/
│   │   ├── schema.sql                   # SQL table declarations & indexes
│   │   ├── seed.js                      # Idempotent seed script (8 sample recipes)
│   │   └── recipehub.db                 # SQLite database file
│   │
│   ├── server.js                        # Express server initialization
│   ├── test-api.js                      # Comprehensive automated backend test suite
│   ├── package.json                     # Backend scripts & dependencies
│   ├── .env.example                     # Environment variables template
│   └── .env                             # Local environment configuration
│
├── .gitignore
└── README.md
```

---

## 🗄️ 6. Database Schema Design

### 1. `recipes`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique recipe ID |
| `title` | TEXT | NOT NULL | Recipe title (min 3 characters) |
| `description` | TEXT | NOT NULL | Short summary of recipe |
| `preparation_time`| INTEGER | NOT NULL | Prep time in minutes (> 0) |
| `difficulty` | TEXT | NOT NULL | 'Easy', 'Medium', or 'Hard' |
| `category` | TEXT | NOT NULL | 'Breakfast', 'Lunch', 'Dessert', 'Vegan' |
| `cuisine` | TEXT | DEFAULT 'General' | Cuisine style (e.g. Italian, Asian) |
| `image_url` | TEXT | NULLABLE | Food photograph URL (or fallback) |
| `ingredients` | TEXT | NOT NULL | JSON stringified array of ingredients |
| `instructions` | TEXT | NOT NULL | JSON stringified array of cooking steps |
| `likes` | INTEGER | DEFAULT 0 CHECK(likes >= 0) | Aggregated community like count |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of last modification |

### 2. `recipe_likes`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique like record ID |
| `recipe_id` | INTEGER | NOT NULL, FK -> recipes(id) ON DELETE CASCADE | Target recipe |
| `visitor_id` | TEXT | NOT NULL | Anonymous visitor identifier |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp of like |
| *Constraint* | UNIQUE(recipe_id, visitor_id) | Prevents duplicate likes from same visitor |

### 3. `favourites`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique favourite record ID |
| `recipe_id` | INTEGER | NOT NULL, FK -> recipes(id) ON DELETE CASCADE | Target recipe |
| `visitor_id` | TEXT | NOT NULL | Anonymous visitor identifier |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Timestamp saved |
| *Constraint* | UNIQUE(recipe_id, visitor_id) | Prevents duplicate favourite records |

---

## 🌐 7. REST API Documentation

Base URL: `http://localhost:5000/api`

### Health Check
- `GET /`
  - Response: `200 OK`
  ```json
  { "message": "RecipeHub Backend is Running!" }
  ```

### Recipes
- `GET /api/recipes`
  - Optional Query Parameters: `search`, `category`, `difficulty`, `cuisine`
  - Headers: `X-Visitor-ID` (optional, returns `is_liked` and `is_favourite` flags)
  - Response: `200 OK`
  ```json
  {
    "success": true,
    "count": 8,
    "data": [
      {
        "id": 1,
        "title": "Avocado Toast",
        "description": "Crispy artisanal sourdough topped with creamy mashed avocado...",
        "preparation_time": 15,
        "difficulty": "Easy",
        "category": "Breakfast",
        "cuisine": "American",
        "image_url": "https://...",
        "ingredients": ["2 slices artisan sourdough bread", "..."],
        "instructions": ["Toast sourdough slices...", "..."],
        "likes": 5,
        "is_liked": false,
        "is_favourite": false
      }
    ]
  }
  ```

- `GET /api/recipes/:id`
  - Response: `200 OK` or `404 Not Found`

- `POST /api/recipes`
  - Headers: `Content-Type: application/json`
  - Request Body:
  ```json
  {
    "title": "Vegetable Pasta",
    "description": "Healthy homemade vegetable pasta",
    "preparation_time": 25,
    "difficulty": "Easy",
    "category": "Lunch",
    "cuisine": "Italian",
    "image_url": "https://example.com/pasta.jpg",
    "ingredients": ["Pasta", "Tomatoes", "Onions", "Olive oil"],
    "instructions": ["Boil pasta", "Sauté vegetables", "Mix and serve"]
  }
  ```
  - Response: `201 Created`

- `PUT /api/recipes/:id`
  - Updates all fields of an existing recipe.
  - Response: `200 OK`

- `DELETE /api/recipes/:id`
  - Deletes recipe and cascades to delete all associated likes and favourites.
  - Response: `200 OK`

### Likes
- `POST /api/recipes/:id/like`
  - Headers: `X-Visitor-ID: <visitor_id>`
  - Increments likes and records visitor.
  - Response: `200 OK` (or `409 Conflict` if already liked)

- `DELETE /api/recipes/:id/like`
  - Headers: `X-Visitor-ID: <visitor_id>`
  - Decrements likes and removes visitor record (never drops below 0).
  - Response: `200 OK`

### Favourites
- `POST /api/recipes/:id/favourite`
  - Headers: `X-Visitor-ID: <visitor_id>`
  - Adds recipe to visitor's saved collection.
  - Response: `201 Created` (or `409 Conflict` if already saved)

- `DELETE /api/recipes/:id/favourite`
  - Headers: `X-Visitor-ID: <visitor_id>`
  - Removes recipe from visitor's favourites.
  - Response: `200 OK`

- `GET /api/favourites`
  - Headers: `X-Visitor-ID: <visitor_id>`
  - Returns all recipes favourited by the visitor.
  - Response: `200 OK`

---

## 🚀 8. Getting Started & Installation

### Prerequisites
- **Node.js** (v18.x or higher; tested on v24.22.0)
- **npm** (v9.x or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/YourUsername/RecipeHub.git
cd RecipeHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure environment variables (a pre-configured `.env.example` is provided):
```bash
cp .env.example .env
```
Initialize sample recipes into SQLite:
```bash
npm run seed
```
Start the backend server:
```bash
# Production start
npm start

# Or with nodemon hot-reloading for development
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend development server will launch on `http://localhost:5173`.

---

## 🧪 9. Automated Testing Suite

### Backend Test Suite
The backend includes a self-contained integration test suite verifying every REST endpoint, validation rule, constraint, and cascade:
```bash
cd backend
node test-api.js
```
Tested Scenarios:
- `GET /` Root health check
- `GET /api/recipes` Fetch and verify JSON array parsing
- Search by title, ingredient keyword, and cuisine
- Filter by category and difficulty
- `POST /api/recipes` Recipe creation and data validation
- `GET /api/recipes/:id` Fetching single recipe
- `POST /api/recipes/:id/like` Liking with duplicate prevention (409)
- `DELETE /api/recipes/:id/like` Unliking and count decrement
- `POST /api/recipes/:id/favourite` Favouriting with duplicate prevention (409)
- `GET /api/favourites` Retrieval of visitor saved collection
- `DELETE /api/recipes/:id/favourite` Removing favourite
- `PUT /api/recipes/:id` Full recipe update
- `POST /api/recipes` Validation rejection (400) for missing fields / short title
- `DELETE /api/recipes/:id` Recipe deletion and 404 verification

---

## 📸 10. Application Screenshots & Walkthrough

| View | Description |
|---|---|
| **Homepage Hero** | Welcoming hero section with headline, community metrics, and CTA buttons. |
| **Recipe Explorer** | Interactive search bar with Category filter tabs (Breakfast, Lunch, Dessert, Vegan) and Difficulty pills. |
| **Recipe Card** | Image thumbnail, prep time, difficulty badge, category badge, and interactive Like/Favourite buttons. |
| **Interactive Checklist** | Recipe Details view with dynamic ingredient checkboxes, progress bar, and clickable cooking steps. |
| **Add / Edit Recipe** | Clean form with dynamic item add/remove buttons, live URL preview, and validation. |
| **Saved Favourites** | Dedicated collection of favourited recipes persisted in SQLite. |

---

## 🔮 11. Future Enhancements

- User Accounts & JWT Authentication (optional upgrade from anonymous visitor IDs).
- Star Ratings & Community Reviews.
- Recipe image upload via Multer or Cloudinary integration.
- Dietary allergen badges (Gluten-Free, Nut-Free, Dairy-Free).
- Printable Recipe Card PDF export.

---

## 📄 12. License & Internship Attribution

Developed by **Full Stack Development Intern** for **CodeNova Full Stack Internship (Task 4)**.  
Licensed under the [MIT License](LICENSE).
