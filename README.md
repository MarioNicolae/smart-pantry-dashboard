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

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/items` | Public | Get all inventory items |
| POST | `/api/items` | ADMIN | Create a new item |
| PATCH | `/api/items/{id}/restock` | ADMIN | Add stock to an item |
| DELETE | `/api/items/{id}` | ADMIN | Delete an item |

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
- **What I'd improve with more time:** Add PostgreSQL + Docker Compose, add pagination to the inventory table, add item search/filter and write more comprehensive integration tests for the frontend.

## 📸 Screenshots

### Staff View (not logged in)
![ssuser](https://github.com/user-attachments/assets/37106462-68ba-471d-8d50-6f3918379123)

### Admin View (logged in as admin)
![ssadmin](https://github.com/user-attachments/assets/a85a29af-899b-49b4-873e-c5e0d541409e)

