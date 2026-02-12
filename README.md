# World Cup Backend API

A RESTful API service that provides comprehensive access to historical FIFA World Cup data from 1950 onwards. Built with Node.js, Express, and MySQL, the application enables users to query World Cup winners, search for matches between nations, and simulate future tournament outcomes.

## Features

- Query World Cup winners by year (1950-2022)
- Search historical matches between any two nations
- Simulate future World Cup winners
- Comprehensive input validation using Joi
- Fully containerized with Docker
- Property-based testing with fast-check
- CORS-enabled for cross-origin requests

## Prerequisites

- Docker and Docker Compose
- Node.js 24+ (for local development)
- MySQL 8.0+ (for local development)

## Quick Start with Docker

1. Clone the repository and navigate to the project directory

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start the application:
```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`

4. Verify the application is running:
```bash
curl http://localhost:3000/health
```

## Docker Commands

### Start Services
```bash
# Start all services in detached mode
docker-compose up -d

# Start with logs visible
docker-compose up

# Rebuild and start (after code changes)
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# View logs for specific service
docker-compose logs app
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f
```

### Database Operations
```bash
# Access MySQL shell
docker-compose exec db mysql -u root -p world_cup_db

# Reset database (inside app container)
docker-compose exec app npm run db:reset
```

### Container Management
```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart app

# Execute commands in container
docker-compose exec app npm test
```

## Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

3. Start MySQL locally and create the database:
```bash
mysql -u root -p
CREATE DATABASE world_cup_db;
```

4. Sync database schema:
```bash
npm run db:sync
```

5. Seed the database:
```bash
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Winners

#### GET /api/winners/:year
Retrieve the World Cup winner for a specific year.

**Parameters:**
- `year` (path parameter) - World Cup year (integer, 1950 or later)

**Example Request:**
```bash
curl http://localhost:3000/api/winners/2018
```

**Response (200 OK):**
```json
{
  "id": 18,
  "year": 2018,
  "winner": "France",
  "host_country": "Russia"
}
```

**Error Responses:**

404 Not Found - Year has no winner data:
```json
{
  "error": "No World Cup winner found for year 2023"
}
```

400 Bad Request - Invalid year format:
```json
{
  "error": "\"year\" must be a number"
}
```

### Matches

#### GET /api/matches?team1=:nation1&team2=:nation2
Find all historical matches between two nations.

**Query Parameters:**
- `team1` (string, required) - First nation name
- `team2` (string, required) - Second nation name

**Example Request:**
```bash
curl "http://localhost:3000/api/matches?team1=Brazil&team2=Germany"
```

**Response (200 OK):**
```json
{
  "matches": [
    {
      "id": 1,
      "year": 2014,
      "stage": "Semi-Final",
      "date": "2014-07-08",
      "team1": "Brazil",
      "team2": "Germany",
      "score1": 1,
      "score2": 7
    },
    {
      "id": 2,
      "year": 2002,
      "stage": "Final",
      "date": "2002-06-30",
      "team1": "Germany",
      "team2": "Brazil",
      "score1": 0,
      "score2": 2
    }
  ],
  "count": 2
}
```

**Empty Result (200 OK):**
```json
{
  "matches": [],
  "count": 0
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "\"team1\" is required"
}
```

### Simulation

#### POST /api/simulate
Simulate a future World Cup winner.

**Request Body:**
```json
{
  "year": 2026
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"year": 2026}'
```

**Response (201 Created):**
```json
{
  "id": 20,
  "year": 2026,
  "winner": "Brazil",
  "host_country": "Simulated"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Year must be a valid World Cup year (1950, 1954, 1958, ...)"
}
```

**Notes:**
- Year must be after 2022
- Year must follow the World Cup pattern: 1950, 1954, 1958, etc. (every 4 years)
- Once simulated, the result is persisted and can be retrieved via GET /api/winners/:year

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Database Configuration
DB_HOST=localhost          # Database host (use 'db' for Docker)
DB_PORT=3306              # MySQL port
DB_NAME=world_cup_db      # Database name
DB_USER=root              # Database user
DB_PASSWORD=password      # Database password

# Application Configuration
PORT=3000                 # API server port
NODE_ENV=development      # Environment (development/production/test)

# Test Database Configuration
TEST_DB_NAME=world_cup_test  # Test database name
```

### Docker Environment Variables

When using Docker Compose, the following defaults are used:
- `DB_HOST=db` (MySQL container name)
- `PORT=3000`
- `NODE_ENV=development`

You can override these in the `docker-compose.yml` file or by setting them in your `.env` file.

## Database Scripts

### Sync Database Schema
```bash
# Sync models with database (non-destructive)
npm run db:sync

# Force sync (drops and recreates tables - DESTRUCTIVE)
npm run db:sync:force
```

### Seed Database
```bash
# Seed database with World Cup data
npm run db:seed

# Clear existing data and reseed
npm run db:seed:clear
```

### Reset Database
```bash
# Complete reset: drop tables, recreate, and seed
npm run db:reset
```

## Testing

The project includes comprehensive unit tests, integration tests, and property-based tests.

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests only
npm run test:e2e
```

### Run Tests in Docker
```bash
docker-compose exec app npm test
```

### Testing Framework

- **Mocha** - Test runner
- **Chai** - Assertion library
- **Supertest** - HTTP assertion library
- **fast-check** - Property-based testing

## Project Structure

```
.
├── src/
│   ├── app.js                 # Express application setup
│   ├── config/
│   │   └── database.js        # Database configuration
│   ├── controllers/           # Request handlers
│   │   ├── MatchController.js
│   │   └── WinnerController.js
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── models/                # Sequelize models
│   │   ├── Match.js
│   │   └── Winner.js
│   ├── routes/                # API route definitions
│   │   ├── health.js
│   │   ├── matches.js
│   │   ├── simulate.js
│   │   └── winners.js
│   ├── services/              # Business logic
│   │   ├── MatchService.js
│   │   └── WinnerService.js
│   └── validators/            # Joi validation schemas
│       ├── matchQuerySchema.js
│       ├── worldCupYearSchema.js
│       └── yearSchema.js
├── tests/                     # Test files
├── scripts/                   # Database scripts
│   ├── seed-db.js
│   └── sync-db.js
├── data/                      # Seed data (JSON)
│   ├── matches.json
│   └── winners.json
├── init-db/                   # Docker database initialization
│   ├── 01-schema.sql
│   ├── 02-seed-winners.sql
│   └── 03-seed-matches.sql
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Docker image definition
├── server.js                  # Server entry point
└── package.json               # Project dependencies
```

## Architecture

The application follows a layered architecture:

1. **Routes Layer** - Defines API endpoints and applies middleware
2. **Controller Layer** - Handles HTTP requests/responses
3. **Service Layer** - Contains business logic
4. **Data Access Layer** - Sequelize models for database operations
5. **Validation Layer** - Joi schemas for input validation

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

- **200 OK** - Successful request
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input or validation error
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

All errors follow this format:
```json
{
  "error": "Descriptive error message"
}
```

## Data Sources

Historical World Cup data (1950-2022) is sourced from official FIFA records and includes:
- Tournament winners and host countries
- Match results with scores, dates, and stages
- Participating nations

## License

ISC

## Support

For issues or questions, please open an issue in the repository.
