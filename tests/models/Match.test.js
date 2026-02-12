const { expect } = require('chai');
const { sequelize, Match } = require('../../src/models');

describe('Match Model', () => {
  before(async () => {
    // Sync database before tests
    await sequelize.sync({ force: true });
  });

  after(async () => {
    // Clean up after tests
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear Matches table before each test
    await Match.destroy({ where: {}, truncate: true });
  });

  describe('Model Definition', () => {
    it('should create a match with all required fields', async () => {
      const match = await Match.create({
        year: 2014,
        stage: 'Semi-Final',
        date: new Date('2014-07-08'),
        team1: 'Brazil',
        team2: 'Germany',
        score1: 1,
        score2: 7
      });

      expect(match.id).to.exist;
      expect(match.year).to.equal(2014);
      expect(match.stage).to.equal('Semi-Final');
      expect(match.date).to.be.instanceOf(Date);
      expect(match.team1).to.equal('Brazil');
      expect(match.team2).to.equal('Germany');
      expect(match.score1).to.equal(1);
      expect(match.score2).to.equal(7);
      expect(match.createdAt).to.exist;
      expect(match.updatedAt).to.exist;
    });

    it('should not allow null year', async () => {
      try {
        await Match.create({
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score1: 4,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null stage', async () => {
      try {
        await Match.create({
          year: 2018,
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score1: 4,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null date', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          team1: 'France',
          team2: 'Croatia',
          score1: 4,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null team1', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team2: 'Croatia',
          score1: 4,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null team2', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          score1: 4,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null score1', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null score2', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score1: 4
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow negative scores', async () => {
      try {
        await Match.create({
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score1: -1,
          score2: 2
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should update timestamps on modification', async () => {
      const match = await Match.create({
        year: 2014,
        stage: 'Semi-Final',
        date: new Date('2014-07-08'),
        team1: 'Brazil',
        team2: 'Germany',
        score1: 1,
        score2: 7
      });

      const originalUpdatedAt = match.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      match.score1 = 2;
      await match.save();

      expect(match.updatedAt.getTime()).to.be.greaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Model Queries', () => {
    beforeEach(async () => {
      // Seed some test data
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
          year: 2018,
          stage: 'Final',
          date: new Date('2018-07-15'),
          team1: 'France',
          team2: 'Croatia',
          score1: 4,
          score2: 2
        },
        {
          year: 2010,
          stage: 'Final',
          date: new Date('2010-07-11'),
          team1: 'Spain',
          team2: 'Netherlands',
          score1: 1,
          score2: 0
        }
      ]);
    });

    it('should find matches by team1', async () => {
      const matches = await Match.findAll({ where: { team1: 'Brazil' } });
      
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].team2).to.equal('Germany');
    });

    it('should find matches by team2', async () => {
      const matches = await Match.findAll({ where: { team2: 'Croatia' } });
      
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].team1).to.equal('France');
    });

    it('should find matches by year', async () => {
      const matches = await Match.findAll({ where: { year: 2014 } });
      
      expect(matches).to.have.lengthOf(1);
      expect(matches[0].stage).to.equal('Semi-Final');
    });

    it('should find all matches', async () => {
      const matches = await Match.findAll();
      expect(matches).to.have.lengthOf(3);
    });

    it('should return empty array for non-existent team', async () => {
      const matches = await Match.findAll({ where: { team1: 'NonExistent' } });
      expect(matches).to.have.lengthOf(0);
    });
  });

  describe('Indexes', () => {
    it('should have index on team1 for query performance', async () => {
      const indexes = await sequelize.getQueryInterface().showIndex('Matches');
      const team1Index = indexes.find(idx => idx.name === 'idx_team1');
      
      expect(team1Index).to.exist;
      expect(team1Index.fields.map(f => f.attribute)).to.include('team1');
    });

    it('should have index on team2 for query performance', async () => {
      const indexes = await sequelize.getQueryInterface().showIndex('Matches');
      const team2Index = indexes.find(idx => idx.name === 'idx_team2');
      
      expect(team2Index).to.exist;
      expect(team2Index.fields.map(f => f.attribute)).to.include('team2');
    });
  });
});
