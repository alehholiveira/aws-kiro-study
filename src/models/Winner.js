const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Winner Model
 * Represents a World Cup tournament winner
 * 
 * Fields:
 * - id: Unique identifier (auto-increment)
 * - year: Tournament year (unique constraint)
 * - winner: Name of the winning nation
 * - host_country: Host nation for the tournament
 * - createdAt: Timestamp of record creation
 * - updatedAt: Timestamp of last update
 */
class Winner extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define associations here if needed in the future
    // Example: Winner.hasMany(models.Match, { foreignKey: 'year', sourceKey: 'year' });
  }
}

Winner.init(
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
      unique: true,
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
    winner: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Winner name cannot be empty'
        }
      }
    },
    host_country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Host country name cannot be empty'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'Winner',
    tableName: 'Winners',
    timestamps: true, // Enables createdAt and updatedAt
    underscored: false // Use camelCase for field names
  }
);

module.exports = Winner;
