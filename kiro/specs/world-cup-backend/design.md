# Design Document: World Cup Backend Application

## Overview

The World Cup Backend Application is a RESTful API built with Node.js, Express, and MySQL that provides access to historical FIFA World Cup data and enables future tournament simulations. The system follows a layered architecture with clear separation between routing, business logic, data access, and validation layers.

The application is containerized using Docker, with separate containers for the Node.js application and MySQL database. Sequelize ORM handles database operations, while Joi provides robust input validation. The system is designed to be testable, maintainable, and easily deployable.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Host                           │
│                                                              │
│  ┌──────────────────────┐      ┌─────────────────────────┐ │
│  │  Node.js Container   │      │   MySQL Container       │ │
│  │                      │      │                         │ │
│  │  ┌────────────────┐ │      │  ┌──────────────────┐  │ │
│  │  │  Express App   │ │      │  │  World Cup DB    │  │ │
│  │  │                │ │      │  │                  │  │ │
│  │  │  - Routes      │ │      │  │  - winners       │  │ │
│  │  │  - Controllers │◄├──────┼─►│  - matches       │  │ │
│  │  │  - Services    │ │      │  │  - nations       │  │ │
│  │  │  - Models      │ │      │  └──────────────────┘  │ │
│  │  │  - Validators  │ │      │                         │ │
│  │  └────────────────┘ │      └─────────────────────────┘ │
│  │                      │                                   │
│  │  Port: 3000          │      Port: 3306                   │
│  └──────────────────────┘                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Layered Architecture

1. **Routing Layer (Express Routes)**
   - Defines API endpoints
   - Maps HTTP requests to controllers
   - Applies middleware (validation, error handling)

2. **Controller Layer**
   - Handles HTTP request/response
   - Delegates business logic to services
   - Formats responses

3. **Service Layer**
   - Contains business logic
   - Orchestrates data operations
   - Implements simulation logic

4. **Data Access Layer (Sequelize Models)**
   - Defines database schema
   - Provides ORM interface
   - Handles database queries

5. **Validation Layer (Joi Schemas)**
   - Validates all input data
   - Provides descriptive error messages
   - Ensures data integrity

## Components and Interfaces

### 1. Database Schema

#### Winners Table
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  year: INTEGER (Unique, Not Null),
  winner: STRING (Not Null),
  host_country: STRING (Not Null),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

#### Matches Table
```javascript
{
  id: INTEGER (Primary Key, Auto Increment),
  year: INTEGER (Not Null),
  stage: STRING (Not Null), // e.g., "Group Stage", "Final", "Semi-Final"
  date: DATE (Not Null),
  team1: STRING (Not Null),
  team2: STRING (Not Null),
  score1: INTEGER (Not Null),
  score2: INTEGER (Not Null),
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

### 2. Sequelize Models

#### Winner Model
```javascript
class Winner extends Model {
  static associate(models) {
    // Associations if needed
  }
}

Winner.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  year: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  winner: { type: DataTypes.STRING, allowNull: false },
  host_country: { type: DataTypes.STRING, allowNull: false }
}, { sequelize, modelName: 'Winner' });
```

#### Match Model
```javascript
class Match extends Model {
  static associate(models) {
    // Associations if needed
  }
}

Match.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  year: { type: DataTypes.INTEGER, allowNull: false },
  stage: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  team1: { type: DataTypes.STRING, allowNull: false },
  team2: { type: DataTypes.STRING, allowNull: false },
  score1: { type: DataTypes.INTEGER, allowNull: false },
  score2: { type: DataTypes.INTEGER, allowNull: false }
}, { sequelize, modelName: 'Match' });
```

### 3. API Endpoints

#### GET /api/winners/:year
**Purpose:** Retrieve World Cup winner for a specific year

**Request:**
- Path Parameter: `year` (integer)

**Response (Success - 200):**
```javascript
{
  year: 2018,
  winner: "France",
  host_country: "Russia"
}
```

**Response (Not Found - 404):**
```javascript
{
  error: "No World Cup winner found for year 2023"
}
```

**Response (Bad Request - 400):**
```javascript
{
  error: "Invalid year parameter"
}
```

#### GET /api/matches?team1=:nation1&team2=:nation2
**Purpose:** Find all matches between two nations

**Request:**
- Query Parameters: `team1` (string), `team2` (string)

**Response (Success - 200):**
```javascript
{
  matches: [
    {
      id: 1,
      year: 2014,
      stage: "Semi-Final",
      date: "2014-07-08",
      team1: "Brazil",
      team2: "Germany",
      score1: 1,
      score2: 7
    }
  ],
  count: 1
}
```

**Response (Empty - 200):**
```javascript
{
  matches: [],
  count: 0
}
```

#### POST /api/simulate
**Purpose:** Simulate/predict a future World Cup winner

**Request Body:**
```javascript
{
  year: 2026
}
```

**Response (Success - 201):**
```javascript
{
  year: 2026,
  winner: "Brazil",
  simulated: true
}
```

**Response (Bad Request - 400):**
```javascript
{
  error: "Year 2025 is not a valid World Cup year"
}
```

### 4. Joi Validation Schemas

#### Year Validation Schema
```javascript
const yearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(1950)
    .required()
    .messages({
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1950 or later',
      'any.required': 'Year is required'
    })
});
```

#### World Cup Year Validation Schema
```javascript
const worldCupYearSchema = Joi.object({
  year: Joi.number()
    .integer()
    .min(1950)
    .custom((value, helpers) => {
      if ((value - 1950) % 4 !== 0) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required()
    .messages({
      'any.invalid': 'Year must be a valid World Cup year (1950, 1954, 1958, ...)',
      'number.base': 'Year must be a number',
      'number.integer': 'Year must be an integer',
      'number.min': 'Year must be 1950 or later',
      'any.required': 'Year is required'
    })
});
```

#### Nations Match Query Schema
```javascript
const matchQuerySchema = Joi.object({
  team1: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Team 1 name cannot be empty',
      'any.required': 'Team 1 is required'
    }),
  team2: Joi.string()
    .trim()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Team 2 name cannot be empty',
      'any.required': 'Team 2 is required'
    })
});
```

### 5. Service Layer

#### WinnerService
```javascript
class WinnerService {
  async getWinnerByYear(year) {
    // Query database for winner by year
    // Return winner or null if not found
  }
  
  async simulateWinner(year) {
    // Check if simulation already exists
    // If not, generate random winner from historical winners
    // Save to database
    // Return simulated winner
  }
}
```

#### MatchService
```javascript
class MatchService {
  async getMatchesBetweenTeams(team1, team2) {
    // Query database for matches where
    // (team1 = team1 AND team2 = team2) OR (team1 = team2 AND team2 = team1)
    // Return array of matches
  }
}
```

### 6. Middleware

#### Validation Middleware
```javascript
function validateRequest(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body || req.params || req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    req.validated = value;
    next();
  };
}
```

#### Error Handler Middleware
```javascript
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
}
```

## Data Models

### Winner Entity
- **id**: Unique identifier
- **year**: Tournament year (unique constraint)
- **winner**: Name of winning nation
- **host_country**: Host nation for the tournament
- **simulated**: Boolean flag indicating if this is a simulated result (derived from year > 2022)

### Match Entity
- **id**: Unique identifier
- **year**: Tournament year
- **stage**: Tournament stage (Group Stage, Round of 16, Quarter-Final, Semi-Final, Final, etc.)
- **date**: Match date
- **team1**: First team name
- **team2**: Second team name
- **score1**: Goals scored by team1
- **score2**: Goals scored by team2

### Relationships
- Winners and Matches are related by year (one-to-many: one winner per year, many matches per year)
- No explicit foreign key constraint to allow flexibility in data management


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Winner Retrieval Correctness
*For any* valid World Cup year in the database, querying the GET /api/winners/:year endpoint should return the correct winning nation with a 200 status code and valid JSON format.
**Validates: Requirements 2.2, 2.6**

### Property 2: Invalid Year Rejection
*For any* year that does not follow the World Cup year pattern (1950 + 4n where n >= 0), the GET /api/winners/:year endpoint should return a 400 error response.
**Validates: Requirements 2.3**

### Property 3: Match Retrieval Completeness
*For any* two nation names provided to GET /api/matches, all returned matches should involve both specified nations (in either team1 or team2 position) and contain all required fields (date, score, tournament year, stage).
**Validates: Requirements 3.2, 3.4**

### Property 4: Match Query Validation
*For any* invalid nation name input (empty strings, null values), the GET /api/matches endpoint should return a 400 error response with descriptive error message.
**Validates: Requirements 3.3**

### Property 5: Case-Insensitive Nation Search
*For any* nation name, searching with different case variations (lowercase, uppercase, mixed case) should return the same set of matches.
**Validates: Requirements 3.6**

### Property 6: World Cup Year Validation
*For any* year provided to POST /api/simulate, if the year does not follow the pattern (1950 + 4n) or is not after 2022, the endpoint should return a 400 validation error.
**Validates: Requirements 4.2, 4.3**

### Property 7: Simulation Generation
*For any* valid future World Cup year (after 2022, following 4-year pattern), the POST /api/simulate endpoint should successfully generate and return a simulated winner.
**Validates: Requirements 4.4**

### Property 8: Simulation Persistence Round-Trip
*For any* valid future World Cup year, after simulating a winner via POST /api/simulate, querying the same year via GET /api/winners/:year should return the same simulated winner.
**Validates: Requirements 4.5, 4.6**

### Property 9: Year Input Validation
*For any* non-integer year input, the Joi validator should reject the input and return a descriptive error message.
**Validates: Requirements 5.2**

### Property 10: World Cup Year Pattern Validation
*For any* year input for simulation that doesn't match the pattern (1950 + 4n), the Joi validator should reject it with an appropriate error message.
**Validates: Requirements 5.3**

### Property 11: Nation Name Validation
*For any* nation name input that is empty or not a string, the Joi validator should reject it with a descriptive error message.
**Validates: Requirements 5.4**

### Property 12: Validation Error Response Format
*For any* invalid input detected by Joi validators, the API should return a 400 Bad Request status with Joi's descriptive error message in the response body.
**Validates: Requirements 5.5**

### Property 13: HTTP Status Code Appropriateness
*For any* API request, the response should have an appropriate HTTP status code: 200 for success, 400 for bad request, 404 for not found, 500 for server error.
**Validates: Requirements 7.2**

### Property 14: Resource Not Found Handling
*For any* request for a non-existent resource (e.g., winner for a year with no data), the API should return a 404 status with a descriptive error message.
**Validates: Requirements 7.4**

### Property 15: CORS Headers Presence
*For any* API request, the response should include appropriate CORS headers to allow cross-origin requests.
**Validates: Requirements 7.6**

## Error Handling

### Error Categories

1. **Validation Errors (400 Bad Request)**
   - Invalid year format (non-integer)
   - Invalid World Cup year (not following 4-year pattern)
   - Empty or invalid nation names
   - Missing required parameters

2. **Not Found Errors (404 Not Found)**
   - Winner not found for specified year
   - No matches found between nations (returns empty array with 200, not 404)

3. **Server Errors (500 Internal Server Error)**
   - Database connection failures
   - Unexpected exceptions during processing
   - ORM errors

### Error Response Format

All errors follow a consistent JSON format:
```javascript
{
  error: "Descriptive error message"
}
```

### Error Handling Strategy

1. **Validation Layer**: Joi schemas catch input validation errors before reaching controllers
2. **Service Layer**: Business logic errors are thrown with descriptive messages
3. **Controller Layer**: Catches service errors and maps to appropriate HTTP status codes
4. **Global Error Handler**: Catches unhandled exceptions and returns 500 errors

### Logging

- All errors are logged with stack traces for debugging
- Request details (method, path, params) are logged with errors
- Sensitive information (passwords, tokens) is never logged

## Testing Strategy

### Dual Testing Approach

The application uses both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized test data

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library**: We will use **fast-check** for property-based testing in Node.js

**Configuration**:
- Each property test runs a minimum of 100 iterations with randomized inputs
- Each test is tagged with a comment referencing the design document property
- Tag format: `// Feature: world-cup-backend, Property N: [property description]`

**Example Property Test Structure**:
```javascript
// Feature: world-cup-backend, Property 8: Simulation Persistence Round-Trip
it('simulated winner persists and can be retrieved', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.integer({ min: 2026, max: 2100 }).filter(y => (y - 1950) % 4 === 0),
      async (year) => {
        // Simulate winner
        const simulateResponse = await request(app)
          .post('/api/simulate')
          .send({ year });
        
        const simulatedWinner = simulateResponse.body.winner;
        
        // Retrieve winner
        const getResponse = await request(app)
          .get(`/api/winners/${year}`);
        
        // Should return same winner
        expect(getResponse.body.winner).to.equal(simulatedWinner);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Framework**: Mocha with Chai for assertions and Supertest for API testing

**Test Categories**:

1. **Validator Unit Tests**
   - Test Joi schemas with valid inputs
   - Test Joi schemas with invalid inputs
   - Test edge cases (boundary values, empty strings, null values)

2. **Integration Tests (API Endpoints)**
   - Test each endpoint with valid requests
   - Test each endpoint with invalid requests
   - Test error responses and status codes
   - Test response format and data structure

3. **End-to-End Tests**
   - Test complete user flows (simulate → retrieve)
   - Test database initialization and seeding
   - Test container startup and connectivity

**Test Database**:
- Use a separate test database (world_cup_test)
- Reset database state before each test suite
- Seed with minimal test data for predictable results

### Test Coverage Goals

- Validator functions: 100% coverage
- Service layer: >90% coverage
- Controller layer: >85% coverage
- Overall: >80% coverage

### Testing Best Practices

- Keep unit tests focused on single behaviors
- Use property tests for validation logic and data transformations
- Mock external dependencies in unit tests
- Use real database in integration tests
- Clean up test data after each test
- Use descriptive test names that explain the scenario
