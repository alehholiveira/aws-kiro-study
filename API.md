# World Cup Backend API Documentation

## Overview

The World Cup Backend API provides access to historical FIFA World Cup data from 1950 onwards. The API enables querying World Cup winners by year, searching for matches between specific nations, and simulating future World Cup outcomes.

**Base URL:** `http://localhost:3000`

**Content Type:** All requests and responses use `application/json`

**CORS:** Cross-origin requests are enabled for all endpoints

---

## Endpoints

### 1. Get World Cup Winner by Year

Retrieve the World Cup winner for a specific year.

**Endpoint:** `GET /api/winners/:year`

**URL Parameters:**
- `year` (integer, required) - The World Cup year (must be 1950 or later)

**Request Example:**
```bash
curl http://localhost:3000/api/winners/2018
```

**Success Response (200 OK):**
```json
{
  "year": 2018,
  "winner": "France",
  "host_country": "Russia"
}
```

**Error Responses:**

**404 Not Found** - Winner not found for the specified year:
```json
{
  "error": "No World Cup winner found for year 2023"
}
```

**400 Bad Request** - Invalid year parameter:
```json
{
  "error": "Year must be a number"
}
```

```json
{
  "error": "Year must be an integer"
}
```

```json
{
  "error": "Year must be 1950 or later"
}
```

```json
{
  "error": "Year is required"
}
```

**Validation Rules:**
- Year must be a number
- Year must be an integer
- Year must be 1950 or later
- Year is required

---

### 2. Get Matches Between Two Teams

Find all historical World Cup matches between two specific nations.

**Endpoint:** `GET /api/matches`

**Query Parameters:**
- `team1` (string, required) - First team name (case-insensitive)
- `team2` (string, required) - Second team name (case-insensitive)

**Request Example:**
```bash
curl "http://localhost:3000/api/matches?team1=Brazil&team2=Germany"
```

**Success Response (200 OK):**
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

**Success Response - No Matches Found (200 OK):**
```json
{
  "matches": [],
  "count": 0
}
```

**Error Responses:**

**400 Bad Request** - Invalid team parameters:
```json
{
  "error": "Team 1 name cannot be empty"
}
```

```json
{
  "error": "Team 1 is required"
}
```

```json
{
  "error": "Team 2 name cannot be empty"
}
```

```json
{
  "error": "Team 2 is required"
}
```

**Validation Rules:**
- Team names must be non-empty strings
- Team names are trimmed of leading/trailing whitespace
- Team names must have at least 1 character after trimming
- Both team1 and team2 are required
- Search is case-insensitive
- Matches are returned regardless of which team is team1 or team2 (bidirectional search)

---

### 3. Simulate Future World Cup Winner

Simulate or predict a World Cup winner for a future tournament year.

**Endpoint:** `POST /api/simulate`

**Request Body:**
```json
{
  "year": 2026
}
```

**Request Example:**
```bash
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"year": 2026}'
```

**Success Response (201 Created):**
```json
{
  "year": 2026,
  "winner": "Brazil",
  "simulated": true
}
```

**Error Responses:**

**400 Bad Request** - Invalid World Cup year (not following 4-year pattern):
```json
{
  "error": "Year must be a valid World Cup year (1950, 1954, 1958, ...)"
}
```

**400 Bad Request** - Year is not after 2022:
```json
{
  "error": "Simulation is only available for years after 2022"
}
```

**400 Bad Request** - Invalid year format:
```json
{
  "error": "Year must be a number"
}
```

```json
{
  "error": "Year must be an integer"
}
```

```json
{
  "error": "Year must be 1950 or later"
}
```

```json
{
  "error": "Year is required"
}
```

**Validation Rules:**
- Year must be a number
- Year must be an integer
- Year must be 1950 or later
- Year must follow the World Cup year pattern: 1950 + (4 × n) where n ≥ 0
  - Valid years: 1950, 1954, 1958, 1962, ..., 2022, 2026, 2030, etc.
  - Invalid years: 2023, 2024, 2025, 2027, etc.
- Year must be after 2022 (future simulation only)
- Year is required

**Behavior:**
- If a simulation already exists for the specified year, the existing simulated winner is returned
- Simulated winners are persisted to the database
- Once simulated, the winner can be retrieved using the `GET /api/winners/:year` endpoint

---

### 4. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**Request Example:**
```bash
curl http://localhost:3000/health
```

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Common Error Responses

### 404 Not Found

Returned when a requested resource does not exist or an endpoint is not defined.

```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error

Returned when an unexpected server error occurs.

```json
{
  "error": "Internal server error"
}
```

---

## Validation Rules Summary

### Year Validation (GET /api/winners/:year)
- **Type:** Integer
- **Minimum:** 1950
- **Required:** Yes
- **Error Messages:**
  - "Year must be a number"
  - "Year must be an integer"
  - "Year must be 1950 or later"
  - "Year is required"

### World Cup Year Validation (POST /api/simulate)
- **Type:** Integer
- **Minimum:** 1950
- **Pattern:** Must follow 1950 + (4 × n) where n ≥ 0
- **Additional:** Must be after 2022
- **Required:** Yes
- **Error Messages:**
  - "Year must be a number"
  - "Year must be an integer"
  - "Year must be 1950 or later"
  - "Year must be a valid World Cup year (1950, 1954, 1958, ...)"
  - "Simulation is only available for years after 2022"
  - "Year is required"

### Team Name Validation (GET /api/matches)
- **Type:** String
- **Minimum Length:** 1 (after trimming)
- **Trimming:** Leading and trailing whitespace removed
- **Case Sensitivity:** Case-insensitive search
- **Required:** Yes (both team1 and team2)
- **Error Messages:**
  - "Team 1 name cannot be empty"
  - "Team 1 is required"
  - "Team 2 name cannot be empty"
  - "Team 2 is required"

---

## HTTP Status Codes

The API uses the following HTTP status codes:

- **200 OK** - Request succeeded
- **201 Created** - Resource created successfully (simulation)
- **400 Bad Request** - Invalid request parameters or validation error
- **404 Not Found** - Resource not found or undefined route
- **500 Internal Server Error** - Unexpected server error

---

## Examples

### Example 1: Query Historical Winner

```bash
# Request
curl http://localhost:3000/api/winners/2014

# Response (200 OK)
{
  "year": 2014,
  "winner": "Germany",
  "host_country": "Brazil"
}
```

### Example 2: Query Invalid Year

```bash
# Request
curl http://localhost:3000/api/winners/2023

# Response (404 Not Found)
{
  "error": "No World Cup winner found for year 2023"
}
```

### Example 3: Search Matches Between Teams

```bash
# Request
curl "http://localhost:3000/api/matches?team1=Argentina&team2=France"

# Response (200 OK)
{
  "matches": [
    {
      "id": 123,
      "year": 2022,
      "stage": "Final",
      "date": "2022-12-18",
      "team1": "Argentina",
      "team2": "France",
      "score1": 3,
      "score2": 3
    }
  ],
  "count": 1
}
```

### Example 4: Search with No Results

```bash
# Request
curl "http://localhost:3000/api/matches?team1=Iceland&team2=Japan"

# Response (200 OK)
{
  "matches": [],
  "count": 0
}
```

### Example 5: Simulate Future Winner

```bash
# Request
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"year": 2030}'

# Response (201 Created)
{
  "year": 2030,
  "winner": "Argentina",
  "simulated": true
}
```

### Example 6: Invalid Simulation Year

```bash
# Request
curl -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"year": 2025}'

# Response (400 Bad Request)
{
  "error": "Year must be a valid World Cup year (1950, 1954, 1958, ...)"
}
```

### Example 7: Case-Insensitive Team Search

```bash
# All of these requests return the same results:
curl "http://localhost:3000/api/matches?team1=brazil&team2=germany"
curl "http://localhost:3000/api/matches?team1=BRAZIL&team2=GERMANY"
curl "http://localhost:3000/api/matches?team1=Brazil&team2=Germany"
```

### Example 8: Bidirectional Match Search

```bash
# These two requests return the same matches:
curl "http://localhost:3000/api/matches?team1=Brazil&team2=Germany"
curl "http://localhost:3000/api/matches?team1=Germany&team2=Brazil"

# The API searches for matches where either:
# - team1 = "Brazil" AND team2 = "Germany"
# - team1 = "Germany" AND team2 = "Brazil"
```

---

## Data Models

### Winner Object

```typescript
{
  year: number,          // Tournament year
  winner: string,        // Name of winning nation
  host_country: string   // Host nation for the tournament
}
```

### Match Object

```typescript
{
  id: number,           // Unique match identifier
  year: number,         // Tournament year
  stage: string,        // Tournament stage (e.g., "Final", "Semi-Final", "Group Stage")
  date: string,         // Match date (ISO 8601 format: YYYY-MM-DD)
  team1: string,        // First team name
  team2: string,        // Second team name
  score1: number,       // Goals scored by team1
  score2: number        // Goals scored by team2
}
```

---

## Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- Team names in the database use standard FIFA naming conventions
- The simulation algorithm randomly selects from historical World Cup winners
- Once a future year is simulated, subsequent requests return the same winner
- The API includes CORS headers, allowing cross-origin requests from any domain
- All errors include descriptive error messages in the response body
