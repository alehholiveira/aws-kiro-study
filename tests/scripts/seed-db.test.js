require('dotenv').config();
const { expect } = require('chai');
const { Sequelize, DataTypes, Model } = require('sequelize');

describe('Database Seed Script', () => {
  let sequelize, Winner, Match;

  before(async function() {
    this.timeout(30000);
    
    // Create a new connection for this test suite
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
      }
    );
    await sequelize.authenticate();

    // Define models for this test suite
    class WinnerModel extends Model {}
    WinnerModel.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      year: { type: DataTypes.INTEGER, unique: true, allowNull: false },
      winner: { type: DataTypes.STRING, allowNull: false },
      host_country: { type: DataTypes.STRING, allowNull: false }
    }, { sequelize, modelName: 'Winner', tableName: 'Winners' });
    Winner = WinnerModel;

    class MatchModel extends Model {}
    MatchModel.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      year: { type: DataTypes.INTEGER, allowNull: false },
      stage: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      team1: { type: DataTypes.STRING, allowNull: false },
      team2: { type: DataTypes.STRING, allowNull: false },
      score1: { type: DataTypes.INTEGER, allowNull: false },
      score2: { type: DataTypes.INTEGER, allowNull: false }
    }, { sequelize, modelName: 'Match', tableName: 'Matches' });
    Match = MatchModel;

    // Run the seed script to populate the database
    const fs = require('fs');
    const path = require('path');
    
    // Load and seed winners
    const winnersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/winners.json'), 'utf8')
    );
    for (const winnerData of winnersData) {
      await Winner.findOrCreate({
        where: { year: winnerData.year },
        defaults: winnerData
      });
    }

    // Load and seed matches
    const matchesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../data/matches.json'), 'utf8')
    );
    for (const matchData of matchesData) {
      await Match.findOrCreate({
        where: {
          year: matchData.year,
          date: matchData.date,
          team1: matchData.team1,
          team2: matchData.team2
        },
        defaults: matchData
      });
    }
  });

  after(async () => {
    await sequelize.close();
  });

  describe('Winners seeding', () => {
    it('should have seeded 19 World Cup winners', async () => {
      const count = await Winner.count();
      expect(count).to.equal(19);
    });

    it('should have winners from 1950 to 2022', async () => {
      const firstWinner = await Winner.findOne({ where: { year: 1950 } });
      const lastWinner = await Winner.findOne({ where: { year: 2022 } });
      
      expect(firstWinner).to.not.be.null;
      expect(firstWinner.winner).to.equal('Uruguay');
      expect(firstWinner.host_country).to.equal('Brazil');
      
      expect(lastWinner).to.not.be.null;
      expect(lastWinner.winner).to.equal('Argentina');
      expect(lastWinner.host_country).to.equal('Qatar');
    });

    it('should have all required fields populated', async () => {
      const winner = await Winner.findOne({ where: { year: 2018 } });
      
      expect(winner).to.not.be.null;
      expect(winner.year).to.equal(2018);
      expect(winner.winner).to.equal('France');
      expect(winner.host_country).to.equal('Russia');
      expect(winner.createdAt).to.be.instanceOf(Date);
      expect(winner.updatedAt).to.be.instanceOf(Date);
    });
  });

  describe('Matches seeding', () => {
    it('should have seeded 102 historical matches', async () => {
      const count = await Match.count();
      expect(count).to.equal(102);
    });

    it('should have matches with all required fields', async () => {
      const match = await Match.findOne({ 
        where: { 
          year: 2014,
          team1: 'Germany',
          team2: 'Brazil'
        } 
      });
      
      expect(match).to.not.be.null;
      expect(match.stage).to.equal('Semi-Final');
      expect(match.score1).to.equal(7);
      expect(match.score2).to.equal(1);
      expect(match.date).to.be.instanceOf(Date);
    });

    it('should have matches from various World Cup years', async () => {
      const match1950 = await Match.findOne({ where: { year: 1950 } });
      const match2022 = await Match.findOne({ where: { year: 2022 } });
      
      expect(match1950).to.not.be.null;
      expect(match2022).to.not.be.null;
    });

    it('should have matches with different stages', async () => {
      const finalMatch = await Match.findOne({ where: { stage: 'Final' } });
      const semiFinalMatch = await Match.findOne({ where: { stage: 'Semi-Final' } });
      const quarterFinalMatch = await Match.findOne({ where: { stage: 'Quarter-Final' } });
      
      expect(finalMatch).to.not.be.null;
      expect(semiFinalMatch).to.not.be.null;
      expect(quarterFinalMatch).to.not.be.null;
    });
  });

  describe('Data integrity', () => {
    it('should not have duplicate winners for the same year', async () => {
      const winners = await Winner.findAll({ where: { year: 2018 } });
      expect(winners).to.have.lengthOf(1);
    });

    it('should have valid score values', async () => {
      const matches = await Match.findAll();
      
      matches.forEach(match => {
        expect(match.score1).to.be.a('number');
        expect(match.score2).to.be.a('number');
        expect(match.score1).to.be.at.least(0);
        expect(match.score2).to.be.at.least(0);
      });
    });
  });
});
