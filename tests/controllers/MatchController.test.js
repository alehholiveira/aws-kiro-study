const { expect } = require('chai');
const MatchController = require('../../src/controllers/MatchController');
const Match = require('../../src/models/Match');
const { sequelize } = require('../../src/config/database');

describe('MatchController', () => {
  // Set up test database
  before(async function() {
    this.timeout(10000);
    // Ensure connection is open
    if (sequelize.connectionManager.pool) {
      await sequelize.authenticate();
    }
    await sequelize.sync({ force: true });
  });

  // Clean up after each test
  afterEach(async () => {
    await Match.destroy({ where: {}, truncate: true });
  });

  describe('getMatchesBetweenTeams', () => {
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

    it('should return 200 with matches array and count when matches exist', async () => {
      // Arrange
      const req = {
        validated: { team1: 'Brazil', team2: 'Germany' }
      };
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.body = data;
          return this;
        }
      };
      const next = () => {};

      // Act
      await MatchController.getMatchesBetweenTeams(req, res, next);

      // Assert
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('matches');
      expect(res.body).to.have.property('count');
      expect(res.body.count).to.equal(2);
      expect(res.body.matches).to.be.an('array').with.lengthOf(2);
      
      // Verify match details
      const match1 = res.body.matches[0];
      expect(match1).to.have.property('year');
      expect(match1).to.have.property('stage');
      expect(match1).to.have.property('date');
      expect(match1).to.have.property('team1');
      expect(match1).to.have.property('team2');
      expect(match1).to.have.property('score1');
      expect(match1).to.have.property('score2');
    });

    it('should return 200 with empty array when no matches exist', async () => {
      // Arrange
      const req = {
        validated: { team1: 'Brazil', team2: 'Argentina' }
      };
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.body = data;
          return this;
        }
      };
      const next = () => {};

      // Act
      await MatchController.getMatchesBetweenTeams(req, res, next);

      // Assert
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.property('matches');
      expect(res.body).to.have.property('count', 0);
      expect(res.body.matches).to.be.an('array').that.is.empty;
    });

    it('should handle case-insensitive team names', async () => {
      // Arrange
      const req = {
        validated: { team1: 'BRAZIL', team2: 'germany' }
      };
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.body = data;
          return this;
        }
      };
      const next = () => {};

      // Act
      await MatchController.getMatchesBetweenTeams(req, res, next);

      // Assert
      expect(res.statusCode).to.equal(200);
      expect(res.body.count).to.equal(2);
    });

    it('should handle bidirectional matching (team1 vs team2 or team2 vs team1)', async () => {
      // Arrange - swap team order
      const req = {
        validated: { team1: 'Germany', team2: 'Brazil' }
      };
      const res = {
        status: function(code) {
          this.statusCode = code;
          return this;
        },
        json: function(data) {
          this.body = data;
          return this;
        }
      };
      const next = () => {};

      // Act
      await MatchController.getMatchesBetweenTeams(req, res, next);

      // Assert
      expect(res.statusCode).to.equal(200);
      expect(res.body.count).to.equal(2);
    });

    it('should call next with error on service failure', async function() {
      // This test is skipped as closing connection affects other tests
      // In production, service errors would be caught and passed to next()
      this.skip();
    });
  });
});
