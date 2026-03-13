# 🥫 Smart Pantry Dashboard

A full-stack inventory management application.
Staff members can view current stock levels, administrators can add new items, restock existing ones and delete entries.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security, Spring Data JPA |
| Database | H2 (in-memory) |
| Frontend | React 19, TypeScript, Vite, Axios |
| Testing | JUnit 5, Mockito, Spring MockMvc |
| Build | Maven Wrapper (no local Maven install required) |

---

## 🚀 How to Run

### Prerequisites
- Java 21+
- Node.js 18+

No Docker required — the app uses H2 in-memory database out of the box.

### 1. Backend

```bash
cd backend
.\mvnw spring-boot:run        # Windows
./mvnw spring-boot:run        # Mac/Linux
```

The API will start at **http://localhost:8080**

On first run, Maven will download dependencies automatically via the wrapper — no local Maven install needed.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:5173**

> ⚠️ The backend must be running before the frontend, as it calls the API on load.

### 3. Test Credentials

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `user` | `password` | USER | View inventory only |
| `admin` | `password` | ADMIN | Full access (add, restock, delete) |

---

## 📡 API Reference

All endpoints are prefixed with `/api/items`.

| Method | Endpoint | Auth Required | Status | Description |
|--------|----------|---------------|--------|-------------|
| `GET` | `/api/items` | None (public) | 200 | Returns all items with computed `isLowStock` |
| `POST` | `/api/items` | ADMIN | 201 | Creates a new inventory item |
| `PATCH` | `/api/items/{id}/restock` | ADMIN | 200 | Adds quantity to existing stock |
| `DELETE` | `/api/items/{id}` | ADMIN | 204 | Deletes an item |

---

## 🏗️ Architecture

The backend follows a standard layered architecture:

```
HTTP Request
    │
    ▼
InventoryController        (REST layer — maps HTTP to service calls)
    │
    ▼
InventoryService           (Business logic — isLowStock computation, orchestration)
    │
    ▼
InventoryItemRepository    (Data access — Spring Data JPA)
    │
    ▼
H2 Database
```
### Key Design Decisions

**DTOs over direct entity exposure**
The `InventoryItem` entity is never returned directly from the API. A dedicated `ItemResponse` DTO is used, which also carries the computed `isLowStock` field. This takes out the API contract from the database schema.

**`isLowStock` computed in the service layer, not stored**
The field is derived (`quantity < minThreshold`) so there is no reason to keep it. It is computed in `InventoryService.toResponse()` every time an item is fetched, ensuring it is always accurate.

**`@JsonProperty("isLowStock")` on the DTO**
Without this annotation, Lombok generates a `isLowStock()` getter and Jackson strips the `is` prefix. The annotation forces the correct key in the JSON response so the frontend receives exactly `"isLowStock"`.

**BCrypt on in-memory users**
The assignment specified hardcoded in-memory users. Even so, passwords are encoded with BCrypt rather than stored in plain text, as would be expected in any real application.

**Stateless session management**
Spring Security is configured with `STATELESS` session policy, appropriate for a Basic Auth REST API where no server-side session should be maintained between requests.

**Global exception handler**
A `@RestControllerAdvice` intercepts `EntityNotFoundException` (404) and `MethodArgumentNotValidException` (400) and returns clean, structured JSON error responses instead of Spring's default error page.

---

## ✅ Features Implemented

### Backend (Mandatory)
- [x] `InventoryItem` entity with `id`, `name`, `quantity`, `minThreshold`
- [x] `GET /api/items` — public, returns all items with computed `isLowStock`
- [x] `POST /api/items` — ADMIN only, creates a new item
- [x] `PATCH /api/items/{id}/restock` — ADMIN only, adds to current stock
- [x] Basic Auth with two hardcoded in-memory users (`user` / `admin`)
- [x] Standard layered architecture: Controller → Service → Repository

### Backend (Optional)
- [x] `DELETE /api/items/{id}` endpoint
- [x] Input validation with meaningful structured error responses
- [x] H2 in-memory database (PostgreSQL-ready via JPA abstraction)

### Frontend (Mandatory)
- [x] Inventory table displaying name, quantity, minThreshold
- [x] Low stock items visually distinct (red text, warning icon, highlighted row)
- [x] Login form with Basic Auth — credentials verified against the backend before login is accepted
- [x] Restock button per row — visible only when logged in as admin
- [x] Table updates immediately after restock without full page reload

### Frontend (Optional)
- [x] Add Item form for admins
- [x] Delete button per row for admins
- [x] Logout functionality
- [x] Loading spinner while fetching
- [x] Error states on failed requests

### Testing (Mandatory)
- [x] Unit test: `isLowStock` is false when `quantity == minThreshold`
- [x] Unit test: `isLowStock` is true when `quantity < minThreshold`
- [x] Unit test: `isLowStock` is false when `quantity > minThreshold`

### Testing (Optional)
- [x] Integration test: `POST /api/items` without credentials → 401
- [x] Integration test: `POST /api/items` with ADMIN credentials → 201
- [x] Integration test: `POST /api/items` with USER credentials → 403

---

## 💡 Decisions & Trade-offs

- **H2 over PostgreSQL:** Chosen for simplicity and ease of evaluation, no Docker setup required. The Spring Data JPA layer is database-agnostic, so switching to PostgreSQL would only require updating `application.properties` and the Maven dependency.
- **Types in API file:** TypeScript interfaces are co-located with the Axios API functions in `inventoryApi.ts` for simplicity, avoiding runtime import resolution issues with Vite.
- **`isAdmin` determined client-side:** The current implementation sets `isAdmin: username === 'admin'` on the frontend. This is intentional for the scope of this assignment. In a production application, roles would come from the backend via a `/api/me` endpoint returning the authenticated user's authorities.
- **What I'd improve with more time:** Add PostgreSQL + Docker Compose, add pagination to the inventory table, add item search/filter and write more comprehensive integration tests for the frontend.

---

## 📸 Screenshots

### Staff View (not logged in)
![ssuser](https://github.com/user-attachments/assets/37106462-68ba-471d-8d50-6f3918379123)

### Admin View (logged in as admin)
![ssadmin](https://github.com/user-attachments/assets/a85a29af-899b-49b4-873e-c5e0d541409e)

