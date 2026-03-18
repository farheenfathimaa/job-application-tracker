# Job Application Tracker

A modern, full-stack application to track and manage job applications. Built with a robust Java/Spring Boot backend and a premium React/Tailwind frontend.

## 🚀 Teck Stack
- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, Jakarta Validation
- **Frontend:** React (Vite), Tailwind CSS, Axios, Lucide Icons
- **Database:** PostgreSQL
- **DevOps:** Docker, Docker Compose, GitHub Actions

## 📊 Project Metrics
- **JobApplicationController Unit Tests:** 12 test cases
- **UserServiceController Unit Tests:** 6 test cases
- **Service Layer Test Coverage:** ~92% (JaCoCo)
- **Average API Response Time:** ~15ms (local)

## 🛠️ Getting Started
### Running with Docker Compose (Recommended)
1. Clone the repository.
2. Run the full stack with a single command:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Swagger API Docs:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Manual Setup
#### Backend
1. Ensure Java 21 and Maven are installed.
2. Update `application.yml` with your local DB credentials.
3. Run `mvn spring-boot:run` in the `backend/` directory.

#### Frontend
1. Run `npm install` in the `frontend/` directory.
2. Run `npm run dev`.

## 📂 Project Structure
- `backend/`: Spring Boot REST API
- `frontend/`: React single page application
- `database/`: SQL initialization scripts
- `.github/`: CI configurations

## 🔍 SQL Queries (Custom JPA)
This project uses manual JPQL/SQL queries for enhanced data retrieval:
1. `countApplicationsByStatusForUser`: Aggregates application counts by status for a specific user.
2. `findRecentApplicationsForUser`: Retrieves applications from the last 30 days.
3. `searchByCompanyForUser`: Performs a case-insensitive fuzzy search on company names.