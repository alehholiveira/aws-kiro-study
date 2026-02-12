const { expect } = require('chai');
const { sequelize, Winner } = require('../../src/models');

describe('Winner Model', () => {
  before(async () => {
    // Sync database before tests
    await sequelize.sync({ force: true });
  });

  // Don't close connection here - let test runner handle it

  beforeEach(async () => {
    // Clear Winners table before each test
    await Winner.destroy({ where: {}, truncate: true });
  });

  describe('Model Definition', () => {
    it('should create a winner with all required fields', async () => {
      const winner = await Winner.create({
        year: 2018,
        winner: 'France',
        host_country: 'Russia'
      });

      expect(winner.id).to.exist;
      expect(winner.year).to.equal(2018);
      expect(winner.winner).to.equal('France');
      expect(winner.host_country).to.equal('Russia');
      expect(winner.createdAt).to.exist;
      expect(winner.updatedAt).to.exist;
    });

    it('should enforce unique constraint on year', async () => {
      await Winner.create({
        year: 2018,
        winner: 'France',
        host_country: 'Russia'
      });

      try {
        await Winner.create({
          year: 2018,
          winner: 'Croatia',
          host_country: 'Russia'
        });
        expect.fail('Should have thrown unique constraint error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeUniqueConstraintError');
      }
    });

    it('should not allow null year', async () => {
      try {
        await Winner.create({
          winner: 'Brazil',
          host_country: 'Brazil'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null winner', async () => {
      try {
        await Winner.create({
          year: 2014,
          host_country: 'Brazil'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should not allow null host_country', async () => {
      try {
        await Winner.create({
          year: 2014,
          winner: 'Germany'
        });
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('SequelizeValidationError');
      }
    });

    it('should update timestamps on modification', async () => {
      const winner = await Winner.create({
        year: 2014,
        winner: 'Germany',
        host_country: 'Brazil'
      });

      const originalUpdatedAt = winner.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      winner.winner = 'Germany (Updated)';
      await winner.save();

      expect(winner.updatedAt.getTime()).to.be.greaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Model Queries', () => {
    beforeEach(async () => {
      // Seed some test data
      await Winner.bulkCreate([
        { year: 2018, winner: 'France', host_country: 'Russia' },
        { year: 2014, winner: 'Germany', host_country: 'Brazil' },
        { year: 2010, winner: 'Spain', host_country: 'South Africa' }
      ]);
    });

    it('should find winner by year', async () => {
      const winner = await Winner.findOne({ where: { year: 2018 } });
      
      expect(winner).to.exist;
      expect(winner.winner).to.equal('France');
      expect(winner.host_country).to.equal('Russia');
    });

    it('should return null for non-existent year', async () => {
      const winner = await Winner.findOne({ where: { year: 2022 } });
      expect(winner).to.be.null;
    });

    it('should find all winners', async () => {
      const winners = await Winner.findAll();
      expect(winners).to.have.lengthOf(3);
    });
  });
});
