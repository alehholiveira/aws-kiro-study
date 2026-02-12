const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Match Model
 * Represents a World Cup match between two teams
 * 
 * Fields:
 * - id: Unique identifier (auto-increment)
 * - year: Tournament year
 * - stage: Tournament stage (e.g., "Group Stage", "Final", "Semi-Final")
 * - date: Match date
 * - team1: First team name
 * - team2: Second team name
 * - score1: Goals scored by team1
 * - score2: Goals scored by team2
 * - createdAt: Timestamp of record creation
 * - updatedAt: Timestamp of last update
 */
class Match extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define associations here if needed in the future
  }
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Year must be an integer'
        },
        min: {
          args: [1950],
          msg: 'Year must be 1950 or later'
        }
      }
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Stage cannot be empty'
        }
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Date must be a valid date'
        }
      }
    },
    team1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Team 1 name cannot be empty'
        }
      }
    },
    team2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Team 2 name cannot be empty'
        }
      }
    },
    score1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Score 1 must be an integer'
        },
        min: {
          args: [0],
          msg: 'Score 1 must be non-negative'
        }
      }
    },
    score2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Score 2 must be an integer'
        },
        min: {
          args: [0],
          msg: 'Score 2 must be non-negative'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'Matches',
    timestamps: true, // Enables createdAt and updatedAt
    underscored: false, // Use camelCase for field names
    indexes: [
      {
        name: 'idx_team1',
        fields: ['team1']
      },
      {
        name: 'idx_team2',
        fields: ['team2']
      }
    ]
  }
);

module.exports = Match;
