-- World Cup Backend Database Schema
-- This script creates the database tables for storing World Cup data

-- Create Winners table
CREATE TABLE IF NOT EXISTS Winners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL UNIQUE,
  winner VARCHAR(255) NOT NULL,
  host_country VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Matches table
CREATE TABLE IF NOT EXISTS Matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year INT NOT NULL,
  stage VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  team1 VARCHAR(255) NOT NULL,
  team2 VARCHAR(255) NOT NULL,
  score1 INT NOT NULL,
  score2 INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_year (year),
  INDEX idx_team1 (team1),
  INDEX idx_team2 (team2),
  INDEX idx_teams (team1, team2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
