# Intero REST API

This is a RESTful API designed to manage educational institution data, including authentication and authorization for administrative tasks. It provides public endpoints for searching and filtering data, and protected endpoints for creating, updating, and deleting records by authenticated administrators.

## Features

* **Public Data Access:**
    * Get all educational institutions.
    * Filter institutions by `bentuk_pendidikan` (form of education).
    * Get a single institution by `NPSN` (National School ID).
    * Search institutions by name or NPSN.
* **Admin Authentication:**
    * Admin registration.
    * Admin login, returning a JWT for authenticated access.
* **Protected Admin Operations:**
    * Create new educational institution records.
    * Update existing educational institution records.
    * Delete educational institution records.
* **Role-Based Authorization:** Ensures only authenticated 'admin' users can perform CUD (Create, Update, Delete) operations.
* **Secure Password Handling:** Uses `bcryptjs` for password hashing.
* **Token-Based Authentication:** Utilizes JSON Web Tokens (JWT) for secure API access.
* **Supabase Integration:** Leverages Supabase for database management.

## Technologies Used

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web framework for Node.js.
* **Supabase**: Backend-as-a-Service for database, authentication, etc.
* **jsonwebtoken**: For generating and verifying JWTs.
* **bcryptjs**: For password hashing.
* **dotenv**: To load environment variables from a `.env` file.
* **cors**: For Cross-Origin Resource Sharing.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd interoRestAPI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Supabase Setup:**
    * Create a new project on [Supabase](https://supabase.com/).
    * Obtain your `Project URL` and `anon (public)` key from your project settings under "API".
    * Ensure you have a table named `admin` for user management and a table (e.g., `institutions`) for your educational data, configured with appropriate RLS (Row Level Security) policies if needed for public access.

4.  **Environment Variables:**
    Create a `.env` file in the root of your project (`interoRestAPI/.env`) with the following variables:

    ```env
    PORT=3000 # Or any other port you prefer
    JWT_SECRET=<YOUR_VERY_STRONG_RANDOM_JWT_SECRET>
    SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
    SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_PUBLIC_KEY>
    # SUPABASE_SERVICE_KEY=<YOUR_SUPABASE_SERVICE_ROLE_KEY> # Only if needed for specific backend operations that bypass RLS
    ```
    * **`JWT_SECRET`**: Generate a strong random string (e.g., using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
    * **`SUPABASE_URL`** and **`SUPABASE_ANON_KEY`**: Get these from your Supabase Project Settings -> API.

5.  **Run the application:**
    ```bash
    npm start
    ```
    The API will run on the port specified in your `.env` file (default: `3000`).

## API Endpoints

The API base URL is `http://localhost:3000` (or your chosen `PORT`).

### Authentication Routes

* **`POST /api/admin/register`**
    * **Description:** Registers a new admin user.
    * **Body:** `{"email": "admin@example.com", "password": "securepassword", "nama": "Admin Name"}`
    * **Access:** Public
* **`POST /api/admin/login`**
    * **Description:** Logs in an admin user and returns a JWT.
    * **Body:** `{"email": "admin@example.com", "password": "securepassword"}`
    * **Access:** Public

### Public Data Routes

* **`GET /api/`**
    * **Description:** Get all educational institutions.
    * **Access:** Public
* **`GET /api/filter`**
    * **Description:** Filter institutions by `bentuk_pendidikan`.
    * **Query Params:** `?bentuk_pendidikan=SD` (e.g., `SD`, `SMP`, `SMA`, etc.)
    * **Access:** Public
* **`GET /api/:npsn`**
    * **Description:** Get a single institution by NPSN.
    * **Path Params:** `:npsn` (e.g., `12345678`)
    * **Access:** Public
* **`GET /api/search`**
    * **Description:** Search institutions by `nama` (name) or `NPSN`.
    * **Query Params:** `?q=keyword` (e.g., `?q=smkn%201`)
    * **Access:** Public

### Protected Admin Routes (Requires Authentication - `Authorization: Bearer <JWT>`)

* **`POST /api/`**
    * **Description:** Create a new educational institution record.
    * **Body:** (JSON object representing the institution data, e.g., `{"npsn": "...", "nama": "...", ...}`)
    * **Access:** Admin only
* **`PUT /api/:npsn`**
    * **Description:** Update an existing educational institution record by NPSN.
    * **Path Params:** `:npsn`
    * **Body:** (JSON object with updated institution data)
    * **Access:** Admin only
* **`DELETE /api/:npsn`**
    * **Description:** Delete an educational institution record by NPSN.
    * **Path Params:** `:npsn`
    * **Access:** Admin only

## Authentication and Authorization

* **Authentication:** When an admin logs in, a JWT is issued. This token must be included in the `Authorization` header of subsequent requests as `Bearer <token>`.
* **Authorization:** The `authMiddleware.js` verifies the JWT and checks the user's `role` (which should be 'admin' for protected routes).

## Deployment

This API can be deployed on platforms like Vercel, which supports Node.js applications. The `vercel.json` file is configured for this purpose. Ensure your environment variables are correctly set up in your Vercel project dashboard.

## API Documentation (Swagger/OpenAPI)

The project includes a `swagger.yaml` file for API documentation. You can use tools like Swagger UI or Postman to view and interact with the API definition.

---
