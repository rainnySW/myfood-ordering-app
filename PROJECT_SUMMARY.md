# Ramen Aroy - Project Summary

## Core Stack
- **Frontend**: Next.js (React), Vanilla CSS / Tailwind UI logic
- **Backend**: Next.js API Routes (`/api/*`)
- **Database**: MongoDB Atlas (Mongoose) + Local Fallback mechanism
- **Image Storage**: Cloudinary (Free Tier) - Implemented for User Portraits

## Features Implemented
1. **Interactive Slideshow / Menu**: Beautiful, warm-themed UI with horizontal scrolling and smooth animations.
2. **Cart & Checkout**: Drawer-based cart system with item customization (Sizes, Eggs, Sweetness).
3. **Database Fallback System**: Seamlessly falls back to local memory if the network blocks the MongoDB connection (preventing crashes).
4. **Kitchen Dashboard**: Auto-refreshing dashboard (`/kitchen`) for kitchen staff to manage active orders (Pending -> Preparing -> Served).
5. **Authentication System**: Full Sign In & Sign Up flow wired to MongoDB.
6. **User Portraits**: Support for uploading custom user avatars directly to Cloudinary.

## Current Setup & Configuration
- **Network Block Fix**: The local `.env.local` uses a direct IP legacy connection string to bypass strict Wi-Fi/Router `querySrv` blocking.
- **Next.js Config**: `next.config.js` is set to allow network testing via local IPs and Cloudflare Tunnels (`allowedDevOrigins`).

## Next Steps for the User (Cloudinary Setup)
To make the User Portrait upload actually work, the user needs to:
1. Create a free account at [Cloudinary.com](https://cloudinary.com).
2. Go to Settings -> Upload -> Enable "Unsigned" uploading and get the **Upload Preset** name.
3. Get their **Cloud Name** from the dashboard.
4. Add these to `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your_upload_preset"
   ```

---

## Blueprint: OrderingFoodAtRester
*A reusable architecture and UI/UX pattern for building beautiful, cozy Restaurant Ordering Webapps.*

### 1. UX & UI Principles (The "Comfy-Warm" Mood)
- **Colors & Lighting**: Use warm backgrounds (`bg-[#FAF6F0]`), soft dark modes (`bg-[#1A1A1A]`), and pastel accent colors (like `pastelOrange`).
- **Shapes & Shadows**: Avoid sharp edges. Use `rounded-2xl` or `rounded-3xl`. Use soft, glowing drop shadows (`shadow-[0_4px_15px_rgba(255,200,153,0.4)]`) for active/selected states rather than harsh borders.
- **Micro-Interactions**: Elements should feel tactile. Apply `transition-all duration-300 hover:scale-[1.02] active:scale-95` to buttons, cards, and radio options.
- **Overlays**: Use `backdrop-blur-sm` with dark/light tinting for modals and drawers to maintain depth without feeling disconnected from the restaurant vibe.

### 2. Core State Architecture
- **Global State Container**: For small-to-medium restaurant apps, `_app.js` acts as a monolithic state container. It holds `cart`, `user`, `lang` (language preference), and `isDark` (theme).
- **Internationalization (i18n)**: Maintain a `translations` dictionary object. Use a simple `t(key)` function and pass `lang` down. Store the user's language choice in `localStorage` and sync it to their database profile (`User.preferences.language`).

### 3. Data & Hybrid Storage Model
To ensure the app NEVER crashes during a live restaurant demo due to network issues, implement a **Hybrid DB Approach**:
- `lib/db.js`: Wraps all MongoDB calls in `try/catch`. If `mongoose.connect()` fails or a query fails, it immediately falls back to manipulating in-memory arrays (`localOrders`, `localUsers`).
- **Menu Items**: Keep `localMenu` hardcoded for lightning-fast reads. (Restaurants rarely change menus by the second).
- **Models**:
  - `User`: `{ email, password, name, role, preferences: { darkMode, language } }`
  - `Order`: `{ items: [...], total, status, tableNumber, created_at }`

### 4. Critical UI Components
1. **The Cart Drawer**: A fixed side-panel that slides in (`transform translate-x-0`). Automatically pops open *only on the first item added* to avoid annoying the user on subsequent adds. Contains inline "Edit" buttons to reopen the Options Modal.
2. **Dynamic Options Modal**: A centralized modal triggered when a FoodCard is clicked. It reads the `item.category` (e.g., `Ramen`, `Drinks`, `Sides`) to conditionally render customization fields:
   - *Radio Buttons*: Size, Sweetness, Sauces.
   - *Checkboxes*: Add-on Extras (like Boiled Egg).
3. **Kitchen Dashboard**: A separate route (`/kitchen`) that polls or fetches `getOrders()` and maps them into Kanban-style columns (Pending -> Preparing -> Served).
