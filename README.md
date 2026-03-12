# 🥫 Smart Pantry Dashboard

A full-stack inventory management app built with Spring Boot and React + TypeScript.
Staff members can view current stock, administrators can add new items and restock existing ones.

## 🛠️ Tech Stack

- **Backend:** Java, Spring Boot 3, Spring Security, Spring Data JPA, H2 (in-memory)
- **Frontend:** React, TypeScript, Vite, Axios
- **Testing:** JUnit, Mockito, Spring MockMvc

## 🚀 How to Run

### Backend
```bash
cd backend
.\mvnw spring-boot:run
```
The API will be available at `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`

### Test Credentials
| Username | Password | Role  |
|----------|----------|-------|
| user     | password | USER  |
| admin    | password | ADMIN |

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/items` | Public | Get all inventory items |
| POST | `/api/items` | ADMIN | Create a new item |
| PATCH | `/api/items/{id}/restock` | ADMIN | Add stock to an item |
| DELETE | `/api/items/{id}` | ADMIN | Delete an item |

## ✅ Features

### Backend
- Layered architecture: Controller → Service → Repository
- Computed `isLowStock` field (true when `quantity < minThreshold`)
- Basic Auth with two in-memory users (USER and ADMIN roles)
- Input validation with meaningful error responses (400 with field details)
- Global exception handler for clean JSON error responses

### Frontend
- Inventory table with live data from the backend
- Low stock items highlighted in red
- Login form with Basic Auth (credentials stored in component state)
- Admin panel: Add Item form + Restock and Delete buttons per row
- Table updates immediately after restock/add/delete without page reload
- Loading spinner and error states
- Logout functionality

### Tests
- Unit tests for `isLowStock` boundary logic (equal, below, above threshold)
- Integration test: POST without credentials → 401
- Integration test: POST with ADMIN credentials → 201
- Integration test: POST with USER credentials → 403

## 💡 Decisions & Trade-offs

- **H2 over PostgreSQL:** Chosen for simplicity and ease of evaluation, no Docker setup required. The Spring Data JPA layer is database-agnostic, so switching to PostgreSQL would only require updating `application.properties` and the Maven dependency.
- **Types in API file:** TypeScript interfaces are co-located with the Axios API functions in `inventoryApi.ts` for simplicity, avoiding runtime import resolution issues with Vite.
- **What I'd improve with more time:** Add PostgreSQL + Docker Compose, add pagination to the inventory table, add item search/filter and write more comprehensive integration tests for the frontend.

## 📸 Screenshots

### Staff View (not logged in)
![ssuser](https://github.com/user-attachments/assets/37106462-68ba-471d-8d50-6f3918379123)

### Admin View (logged in as admin)
![ssadmin](https://github.com/user-attachments/assets/a85a29af-899b-49b4-873e-c5e0d541409e)

