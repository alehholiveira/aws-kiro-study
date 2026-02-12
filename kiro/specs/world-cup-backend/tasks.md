# Implementation Plan: World Cup Backend Application

## Overview

This implementation plan breaks down the World Cup Backend Application into discrete, incremental coding tasks. Each task builds on previous work, starting with project setup and infrastructure, then implementing core functionality, and finally adding comprehensive testing. The approach ensures that each component is validated early through code and tests.

## Tasks

- [x] 1. Initialize project structure and dependencies
  - Create package.json with Node.js 24 configuration
  - Install dependencies: express, sequelize, mysql2, joi, dotenv, cors
  - Install dev dependencies: mocha, chai, supertest, fast-check, nodemon
  - Create directory structure: src/, src/models/, src/routes/, src/controllers/, src/services/, src/validators/, src/middleware/, src/config/, tests/
  - Set up .env.example file with database configuration variables
  - _Requirements: 6.1, 6.6_

- [ ] 2. Set up Docker configuration
  - [x] 2.1 Create Dockerfile for Node.js application
    - Use Node.js 24 base image
    - Copy package files and install dependencies
    - Expose port 3000
    - Set up health check
    - _Requirements: 6.1, 6.5_
  
  - [x] 2.2 Create docker-compose.yml
    - Define Node.js service with volume mounts
    - Define MySQL service with environment variables
    - Configure network between services
    - Add wait-for-it script or depends_on with health check
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [x] 2.3 Create database initialization script
    - Write SQL script to create database schema
    - Write seed data script with World Cup winners 1950-2022
    - Write seed data script with historical matches
    - _Requirements: 1.1, 1.2, 1.3_

- [ ] 3. Configure Sequelize ORM
  - [x] 3.1 Create Sequelize configuration
    - Set up src/config/database.js with environment-based config
    - Configure connection pooling and logging
    - _Requirements: 1.4, 6.6_
  
  - [x] 3.2 Create Winner model
    - Define Winner model with id, year, winner, host_country fields
    - Add unique constraint on year
    - Add timestamps
    - _Requirements: 1.1, 1.4_
  
  - [x] 3.3 Create Match model
    - Define Match model with id, year, stage, date, team1, team2, score1, score2 fields
    - Add indexes on team1 and team2 for query performance
    - Add timestamps
    - _Requirements: 1.2, 1.4_
  
  - [x] 3.4 Create database sync and seed script
    - Write script to sync models with database
    - Write script to seed initial data from JSON files
    - _Requirements: 1.3_

- [ ] 4. Implement Joi validation schemas
  - [x] 4.1 Create year validation schema
    - Define schema for basic year validation (integer, min 1950)
    - Export yearSchema
    - _Requirements: 5.2_
  
  - [ ]* 4.2 Write property test for year validation
    - **Property 9: Year Input Validation**
    - **Validates: Requirements 5.2**
  
  - [x] 4.3 Create World Cup year validation schema
    - Define schema with custom validator for 4-year pattern
    - Add descriptive error messages
    - Export worldCupYearSchema
    - _Requirements: 5.3_
  
  - [ ]* 4.4 Write property test for World Cup year validation
    - **Property 10: World Cup Year Pattern Validation**
    - **Validates: Requirements 5.3**
  
  - [x] 4.5 Create nations match query validation schema
    - Define schema for team1 and team2 parameters
    - Add string trimming and non-empty validation
    - Export matchQuerySchema
    - _Requirements: 5.4_
  
  - [ ]* 4.6 Write property test for nation name validation
    - **Property 11: Nation Name Validation**
    - **Validates: Requirements 5.4**

- [ ] 5. Create validation middleware
  - [x] 5.1 Implement validateRequest middleware
    - Create middleware function that accepts Joi schema
    - Validate req.body, req.params, or req.query based on schema
    - Return 400 with Joi error message on validation failure
    - Attach validated data to req.validated
    - _Requirements: 5.5_
  
  - [ ]* 5.2 Write unit tests for validation middleware
    - Test with valid inputs
    - Test with invalid inputs
    - Test error response format
    - _Requirements: 5.5_

- [ ] 6. Implement service layer
  - [x] 6.1 Create WinnerService
    - Implement getWinnerByYear(year) method
    - Implement simulateWinner(year) method with random selection from historical winners
    - Handle not found cases
    - _Requirements: 2.2, 4.4, 4.5_
  
  - [x] 6.2 Create MatchService
    - Implement getMatchesBetweenTeams(team1, team2) method
    - Use case-insensitive search with Sequelize
    - Handle bidirectional matching (team1 vs team2 or team2 vs team1)
    - _Requirements: 3.2, 3.6_

- [ ] 7. Implement controllers
  - [x] 7.1 Create WinnerController
    - Implement getWinnerByYear handler
    - Implement simulateWinner handler
    - Handle errors and return appropriate status codes
    - Format JSON responses
    - _Requirements: 2.1, 2.2, 4.1, 7.2, 7.4_
  
  - [x] 7.2 Create MatchController
    - Implement getMatchesBetweenTeams handler
    - Format JSON responses with matches array and count
    - Handle empty results
    - _Requirements: 3.1, 3.2, 3.4_

- [ ] 8. Set up Express routes
  - [x] 8.1 Create winner routes
    - Define GET /api/winners/:year with validation middleware
    - Define POST /api/simulate with validation middleware
    - Wire to WinnerController methods
    - _Requirements: 2.1, 4.1_
  
  - [x] 8.2 Create match routes
    - Define GET /api/matches with query parameter validation
    - Wire to MatchController methods
    - _Requirements: 3.1_

- [ ] 9. Implement error handling middleware
  - [x] 9.1 Create global error handler
    - Catch all unhandled errors
    - Log errors with stack traces
    - Return 500 status with generic error message
    - _Requirements: 7.3, 7.5_
  
  - [x] 9.2 Create 404 handler
    - Handle undefined routes
    - Return 404 with descriptive message
    - _Requirements: 7.4_

- [ ] 10. Create Express application setup
  - [x] 10.1 Create main app.js file
    - Initialize Express app
    - Add CORS middleware
    - Add JSON body parser
    - Mount API routes
    - Add error handling middleware
    - _Requirements: 7.1, 7.6_
  
  - [x] 10.2 Create server.js entry point
    - Import app from app.js
    - Connect to database
    - Start server on configured port
    - Handle graceful shutdown
    - _Requirements: 6.5_

- [x] 11. Checkpoint - Ensure basic functionality works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Write integration tests for API endpoints
  - [ ]* 12.1 Write tests for GET /api/winners/:year
    - Test with valid World Cup year
    - Test with invalid year format
    - Test with year before 1950
    - Test with future year without data
    - Test response format and status codes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ]* 12.2 Write property test for winner retrieval
    - **Property 1: Winner Retrieval Correctness**
    - **Validates: Requirements 2.2, 2.6**
  
  - [ ]* 12.3 Write property test for invalid year rejection
    - **Property 2: Invalid Year Rejection**
    - **Validates: Requirements 2.3**
  
  - [ ]* 12.4 Write tests for GET /api/matches
    - Test with valid nation names
    - Test with invalid nation names
    - Test with nations that never played
    - Test case-insensitivity
    - Test response format
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 12.5 Write property test for match retrieval
    - **Property 3: Match Retrieval Completeness**
    - **Validates: Requirements 3.2, 3.4**
  
  - [ ]* 12.6 Write property test for match query validation
    - **Property 4: Match Query Validation**
    - **Validates: Requirements 3.3**
  
  - [ ]* 12.7 Write property test for case-insensitive search
    - **Property 5: Case-Insensitive Nation Search**
    - **Validates: Requirements 3.6**
  
  - [ ]* 12.8 Write tests for POST /api/simulate
    - Test with valid future World Cup year
    - Test with invalid year (not 4-year pattern)
    - Test with year before 2023
    - Test persistence of simulated result
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 12.9 Write property test for World Cup year validation
    - **Property 6: World Cup Year Validation**
    - **Validates: Requirements 4.2, 4.3**
  
  - [ ]* 12.10 Write property test for simulation generation
    - **Property 7: Simulation Generation**
    - **Validates: Requirements 4.4**
  
  - [ ]* 12.11 Write property test for simulation persistence
    - **Property 8: Simulation Persistence Round-Trip**
    - **Validates: Requirements 4.5, 4.6**

- [ ] 13. Write property tests for validation error responses
  - [ ]* 13.1 Write property test for validation error format
    - **Property 12: Validation Error Response Format**
    - **Validates: Requirements 5.5**
  
  - [ ]* 13.2 Write property test for HTTP status codes
    - **Property 13: HTTP Status Code Appropriateness**
    - **Validates: Requirements 7.2**
  
  - [ ]* 13.3 Write property test for not found handling
    - **Property 14: Resource Not Found Handling**
    - **Validates: Requirements 7.4**
  
  - [ ]* 13.4 Write property test for CORS headers
    - **Property 15: CORS Headers Presence**
    - **Validates: Requirements 7.6**

- [ ] 14. Write end-to-end tests
  - [ ]* 14.1 Write E2E test for complete simulation flow
    - Test simulating a winner then retrieving it
    - Test multiple simulations for different years
    - Verify database persistence
    - _Requirements: 4.4, 4.5, 4.6_
  
  - [ ]* 14.2 Write E2E test for match query flow
    - Test querying matches between nations
    - Test with multiple nation pairs
    - Verify response completeness
    - _Requirements: 3.2, 3.4_
  
  - [ ]* 14.3 Write E2E test for error handling flow
    - Test invalid requests through entire stack
    - Verify error responses and logging
    - _Requirements: 7.2, 7.3, 7.4_

- [ ] 15. Create test configuration and scripts
  - [ ]* 15.1 Set up Mocha test configuration
    - Create .mocharc.json with test settings
    - Configure test database connection
    - Set up test hooks for database reset
    - _Requirements: 8.4_
  
  - [ ]* 15.2 Add npm test scripts
    - Add script for unit tests
    - Add script for integration tests
    - Add script for E2E tests
    - Add script for all tests with coverage
    - _Requirements: 8.1, 8.2, 8.3_

- [ ] 16. Create documentation files
  - [x] 16.1 Create README.md
    - Document project setup instructions
    - Document Docker commands
    - Document API endpoints with examples
    - Document environment variables
    - _Requirements: 6.1, 6.2, 6.5, 6.6_
  
  - [x] 16.2 Create API documentation
    - Document all endpoints with request/response examples
    - Document error responses
    - Document validation rules
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 5.2, 5.3, 5.4_

- [x] 17. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use fast-check library with minimum 100 iterations
- Integration tests use Mocha/Chai with Supertest
- Test database is separate from development database
- Docker containers must be running for E2E tests
