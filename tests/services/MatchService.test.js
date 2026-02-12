const { expect } = require('chai');
const MatchService = require('../../src/services/MatchService');
const Match = require('../../src/models/Match');
const { sequelize } = require('../../src/config/database');

describe('MatchService', () => {
  // Set up test database
  before(async () => {
    await sequelize.sync({ force: true });
  });

  // Clean up after each test
  afterEach(async () => {
    await Match.destroy({ where: {}, truncate: true });
  });

  after(async () => {
    await sequelize.close();
  });

  describe('getMatchesBetweenTeams', () => {
    it('should return matches between two teams', async () => {
      // Create test matches
      await Match.create({
        year: 2014,
        stage: 'Semi-Final',
        date: '2014-07-08',
        team1: 'Brazil',
        team2: 'Germany',
        score1: 1,
        score2: 7
      });

      await Match.create({
        year: 2002,
        stage: 'Final',
        date: '2002-06-30',
        team1: 'Germany',
        team2: 'Brazil',
        score1: 0,
        score2: 2
      });

      const matches = await MatchService.getMatchesBetweenTeams('Brazil', 'Germany');

      expect(matches).to.be.an('array');
      expect(matches).to.have.lengthOf(2);
      expect(matches[0].year).to.equal(2002); // Ordered by date
      expect(matches[1].year).to.equal(2014);
    });

    it('should handle case-insensitive search', async () => {
      await Match.create({
        year: 2018,
        stage: 'Group Stage',
        date: '2018-06-17',
        team1: 'Brazil',
        team2: 'Switzerland',
        score1: 1,
        score2: 1
      });

      // Test with different case variations
      const matches1 = await MatchService.getMatchesBetweenTeams('brazil', 'switzerland');
      const matches2 = await MatchService.getMatchesBetweenTeams('BRAZIL', 'SWITZERLAND');
      const matches3 = await MatchService.getMatchesBetweenTeams('BrAzIl', 'SwItZeRlAnD');

      expect(matches1).to.have.lengthOf(1);
      expect(matches2).to.have.lengthOf(1);
      expect(matches3).to.have.lengthOf(1);
      expect(matches1[0].team1).to.equal('Brazil');
      expect(matches1[0].team2).to.equal('Switzerland');
    });

    it('should handle bidirectional matching', async () => {
      await Match.create({
        year: 2010,
        stage: 'Quarter-Final',
        date: '2010-07-02',
        team1: 'Argentina',
        team2: 'Germany',
        score1: 0,
        score2: 4
      });

      // Search in both directions
      const matches1 = await MatchService.getMatchesBetweenTeams('Argentina', 'Germany');
      const matches2 = await MatchService.getMatchesBetweenTeams('Germany', 'Argentina');

      expect(matches1).to.have.lengthOf(1);
      expect(matches2).to.have.lengthOf(1);
      expect(matches1[0].id).to.equal(matches2[0].id);
    });

    it('should return empty array when no matches exist', async () => {
      await Match.create({
        year: 2018,
        stage: 'Final',
        date: '2018-07-15',
        team1: 'France',
        team2: 'Croatia',
        score1: 4,
        score2: 2
      });

      const matches = await MatchService.getMatchesBetweenTeams('Brazil', 'Argentina');

      expect(matches).to.be.an('array');
      expect(matches).to.have.lengthOf(0);
    });

    it('should return multiple matches between same teams', async () => {
      await Match.create({
        year: 1998,
        stage: 'Final',
        date: '1998-07-12',
        team1: 'Brazil',
        team2: 'France',
        score1: 0,
        score2: 3
      });

      await Match.create({
        year: 2006,
        stage: 'Quarter-Final',
        date: '2006-07-01',
        team1: 'Brazil',
        team2: 'France',
        score1: 0,
        score2: 1
      });

      await Match.create({
        year: 1986,
        stage: 'Quarter-Final',
        date: '1986-06-21',
        team1: 'France',
        team2: 'Brazil',
        score1: 1,
        score2: 1
      });

      const matches = await MatchService.getMatchesBetweenTeams('Brazil', 'France');

      expect(matches).to.have.lengthOf(3);
      expect(matches[0].year).to.equal(1986); // Ordered by date
      expect(matches[1].year).to.equal(1998);
      expect(matches[2].year).to.equal(2006);
    });

    it('should not return matches with only one team matching', async () => {
      await Match.create({
        year: 2014,
        stage: 'Semi-Final',
        date: '2014-07-08',
        team1: 'Brazil',
        team2: 'Germany',
        score1: 1,
        score2: 7
      });

      await Match.create({
        year: 2014,
        stage: 'Final',
        date: '2014-07-13',
        team1: 'Germany',
        team2: 'Argentina',
        score1: 1,
        score2: 0
      });

      const matches = await MatchService.getMatchesBetweenTeams('Brazil', 'Argentina');

      expect(matches).to.have.lengthOf(0);
    });
  });
});
