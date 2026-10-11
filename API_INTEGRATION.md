# Laravel API integration

Sign-in, logout/session restoration, and Warehouse **Register item / Recently registered** product list call the Laravel API. Public account creation is disabled. The browser stores the Sanctum bearer token in `localStorage` for this prototype. Use HTTPS and consider an HttpOnly-cookie strategy before production use.

## Run both applications locally

1. Start MySQL and prepare the backend `.env` as described in the backend README; run `php artisan migrate --seed` in the backend repo.
2. Start Laravel at `http://127.0.0.1:8000` with `php artisan serve --host=127.0.0.1 --port=8000`.
3. In this React repo, copy `.env.example` to `.env.local`. The default `VITE_API_BASE_URL` is `http://127.0.0.1:8000/api`; change it if Laravel is hosted elsewhere.
4. Run `npm ci && npm run dev`. The backend CORS template allows the Vite default origin `http://localhost:5173`.
5. Sign in with one of the separate Admin or Staff accounts configured by the backend seeder. Public sign-up is disabled; change `SEED_ADMIN_*` and `SEED_STAFF_*` in the backend `.env` before running the seeders if you need different local credentials.
6. Open **Warehouse → Register item**. A successful save appears in Laravel-backed Recently registered data and is available through `GET /api/products`.

The API paths/fields are documented in the backend repository's README. This is a starter integration, not a complete integration of every screen: purchasing orders, receiving/count workflows, storefront checkout, reports, and other planned modules retain their prototype/mock data until their corresponding backend modules are delivered.
