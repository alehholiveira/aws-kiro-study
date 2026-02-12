const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const matchRoutes = require('../../src/routes/matches');
const Match = require('../../src/models/Match');
const { sequelize } = require('../../src/config/database');

describe('Match Routes Integration', () => {
  let app;

  // Set up Express app with match routes
  before(async function() {
    this.timeout(10000);
    
    // Create Express app
    app = express();
    app.use(express.json());
    app.use('/api/matches', matchRoutes);
    
    // Set up test database
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  // Clean up after each test
  afterEach(async () => {
    await Match.destroy({ where: {}, truncate: true });
  });

  describe('GET /api/matches', () => {
    beforeEach(async () => {
      // Seed with test matches
      await Match.bulkCreate([
        {
          year: 2014,
          stage: 'Semi-Final',
          date: new Date('2014-07-08'),
          team1: 'Brazil',
          team2: 'Germany',
          score1: 1,
          score2: 7
        },
        {
          year: 2002,
          stage: 'Final',
          date: new Date('2002-06-30'),
          team1: 'Germany',
          team2: 'Brazil',
          score1: 0,
          score2: 2
        },
        {
          year: 2018,
          stage: 'Quarter-Final',
          date: new Date('2018-07-06'),
          team1: 'France',
          team2: 'Uruguay',
          score1: 2,
          score2: 0
        }
      ]);
    });

    it('should return 200 with matches when valid teams are provided', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: 'Brazil', team2: 'Germany' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('matches');
      expect(response.body).to.have.property('count', 2);
      expect(response.body.matches).to.be.an('array').with.lengthOf(2);
    });

    it('should return 400 when team1 is missing', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team2: 'Germany' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Team 1 is required');
    });

    it('should return 400 when team2 is missing', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: 'Brazil' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.include('Team 2 is required');
    });

    it('should return 400 when team1 is empty string', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: '', team2: 'Germany' });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
    });

    it('should handle case-insensitive team names', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: 'BRAZIL', team2: 'germany' });

      expect(response.status).to.equal(200);
      expect(response.body.count).to.equal(2);
    });

    it('should return empty array when no matches exist', async () => {
      const response = await request(app)
        .get('/api/matches')
        .query({ team1: 'Brazil', team2: 'Argentina' });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('matches');
      expect(response.body).to.have.property('count', 0);
      expect(response.body.matches).to.be.an('array').that.is.empty;
    });
  });
});
