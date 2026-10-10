# Laravel API integration

The login, signup, logout/session restoration, and Warehouse **Register item / Recently registered** product list now call the Laravel API. The browser stores the Sanctum bearer token in `localStorage` for this prototype. Use HTTPS and consider an HttpOnly-cookie strategy before production use.

## Run both applications locally

1. Start MySQL and prepare the backend `.env` as described in the backend README; run `php artisan migrate --seed` in the backend repo.
2. Start Laravel at `http://127.0.0.1:8000` with `php artisan serve --host=127.0.0.1 --port=8000`.
3. In this React repo, copy `.env.example` to `.env.local`. The default `VITE_API_BASE_URL` is `http://127.0.0.1:8000/api`; change it if Laravel is hosted elsewhere.
4. Run `npm ci && npm run dev`. The backend CORS template allows the Vite default origin `http://localhost:5173`.
5. Create a staff account through **Sign up**, then sign in. Public signup always creates staff; admin accounts must be created by the trusted backend seeder and cannot be chosen from the browser.
6. Open **Warehouse → Register item**. A successful save appears in Laravel-backed Recently registered data and is available through `GET /api/products`.

The API paths/fields are documented in the backend repository's README. This is a starter integration, not a complete integration of every screen: purchasing orders, receiving/count workflows, storefront checkout, reports, and other planned modules retain their prototype/mock data until their corresponding backend modules are delivered.
