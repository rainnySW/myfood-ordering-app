# FoodOrderingAtPlace - Project Blueprint & AI Prompt

This document contains a highly detailed prompt and architectural structure. You can copy and paste the prompt below to any AI agent in the future to perfectly recreate this style of Restaurant Ordering Webapp from scratch.

---

## 🤖 AI Master Prompt for Recreation

**Copy and paste everything below this line to your AI assistant when starting a new project:**

```markdown
I want you to build a comprehensive "FoodOrderingAtPlace" web application. This is a digital menu and ordering system meant to be used by customers at a restaurant table, and by kitchen staff to track orders.

Please build this using **Next.js (React)** and **Tailwind CSS**. Do not use any external UI libraries (like MUI or Chakra); build the UI components from scratch using Tailwind for maximum customization.

### 1. Design & UX Guidelines ("Comfy-Warm" Aesthetic)
The app must not look generic or corporate. It needs to feel warm, cozy, tactile, and premium.
- **Color Palette**: Use a warm background (`#FAF6F0` for light mode, `#1A1A1A` for dark mode). Use a vibrant but soft pastel orange (e.g., `#D97736` or similar) as the primary accent color.
- **Shapes**: Avoid sharp 90-degree corners. Use highly rounded corners (`rounded-2xl` and `rounded-3xl`) for cards, buttons, and modals.
- **Shadows**: Do not use harsh grey borders. Instead, active or selected elements (like selected radio buttons or the cart panel) should use soft, warm, glowing drop-shadows (e.g., `shadow-[0_4px_15px_rgba(217,119,54,0.3)]`).
- **Micro-Interactions**: Elements must feel alive. Add `transition-all duration-300` everywhere. Buttons and clickable cards should slightly enlarge on hover (`hover:scale-[1.02]`) and compress on click (`active:scale-95`).
- **Overlays**: Modals and side-drawers should use `backdrop-blur-sm` combined with a semi-transparent dark overlay to keep the background visible but out of focus.

### 2. Core Architecture & Global State
Keep state management simple to allow rapid prototyping.
- Use `pages/_app.js` as a monolithic state container holding:
  - `cart`: Array of items.
  - `user`: Currently logged in user.
  - `lang`: Current language (e.g., 'en' or 'th').
  - `isDark`: Dark mode boolean.
- **Internationalization (i18n)**: Do not use complex i18n libraries. Create a simple `translations` dictionary object in `_app.js`. Create a `t(key)` function and pass it down as a prop. Store the user's language choice in `localStorage`.

### 3. Hybrid Database Strategy (CRITICAL)
This app is meant for live demonstrations, so it must NEVER crash if the Wi-Fi or database connection fails.
- Set up a standard **MongoDB + Mongoose** backend via Next.js `/api` routes.
- Create a `lib/db.js` file that wraps all database calls in a `try/catch` block.
- **The Fallback**: If the MongoDB connection fails or times out, the `catch` block MUST seamlessly fall back to using in-memory arrays (e.g., `let localOrders = []`, `let localUsers = []`). The UI should never know the database failed; it should just continue working locally.
- **Menu Items**: Hardcode the menu items array in `lib/db.js` rather than fetching from the DB to ensure instant load times.

### 4. Required Features & Components
1. **Interactive Menu (Home Page)**: 
   - Display food items in categories (Ramen, Sides, Drinks).
   - Use horizontal scrolling or grid layouts.
2. **Dynamic Options Modal**:
   - When a user clicks a food card, open a centered modal.
   - Conditionally render customization options based on the item's `category`.
     - *If Category is Ramen*: Show "Size" radios (Normal, Special +$1.50) and "Extras" checkboxes (e.g., Add Egg).
     - *If Category is Sides*: Show "Size" radios (Normal, Special, Super Special) and "Sauce" radios (e.g., Ketchup, Mayo).
     - *If Category is Drinks*: Show "Sweetness" radios (0%, 50%, 100%).
3. **Smart Cart Drawer**:
   - A right-side panel that slides in (`transform translate-x-full` to `translate-x-0`).
   - *Auto-Open Rule*: The drawer should automatically pop open ONLY when the very first item is added to an empty cart. If items are already in the cart, do not interrupt the user; just quietly update the cart badge counter.
   - *Editable Cart*: Items in the cart must have an "Edit" button. Clicking this closes the cart, re-opens the Options Modal pre-filled with the user's previous choices, and allows them to update the item without deleting it.
4. **User System**:
   - Simple Signup/Login sliding panel. Save preferences (Dark mode, Language) to the database and re-apply them when the user logs in.
5. **Kitchen Dashboard (`/kitchen`)**:
   - A separate page for kitchen staff.
   - Fetches the active orders and displays them in a Kanban-style layout (Pending -> Preparing -> Served).

Please begin by setting up the Next.js project, the `lib/db.js` hybrid fallback architecture, and the `_app.js` global state container. Let me know when you are ready for the next step.
```

---

## 📁 Directory Structure Overview

If you are reconstructing this manually, here is the exact folder structure you should aim for:

```text
/FoodOrderingAtPlace
│
├── /models                # Mongoose Database Schemas
│   ├── Order.js           # Schema for customer orders
│   └── User.js            # Schema for users & preferences
│
├── /lib                   # Core Logic & Connections
│   ├── db.js              # HYBRID DB (MongoDB + Local Array Fallback)
│   └── mongodb.js         # Standard mongoose.connect logic
│
├── /pages
│   ├── api/               # Next.js API Routes (Backend)
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── orders.js
│   │   └── update-profile.js
│   │
│   ├── _app.js            # GLOBAL STATE (Cart, User, i18n) + Overlays (Cart Drawer, Modals)
│   ├── _document.js       # HTML structure (Inject global CSS keyframes here)
│   ├── index.js           # Main Menu Page (Food cards, Categories)
│   └── kitchen.js         # Kitchen Dashboard (Kanban boards for staff)
│
├── /public
│   └── /FoodImageIcon     # Local image assets for the menu
│
├── tailwind.config.js     # Tailwind setup (Ensure dark mode is 'class')
└── .env.local             # MONGODB_URI and Cloudinary secrets
```
