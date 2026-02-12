const { expect } = require('chai');
const worldCupYearSchema = require('../../src/validators/worldCupYearSchema');

describe('World Cup Year Validation Schema', () => {
  describe('Valid inputs', () => {
    it('should accept valid World Cup year 1950', () => {
      const { error } = worldCupYearSchema.validate({ year: 1950 });
      expect(error).to.be.undefined;
    });

    it('should accept valid World Cup year 1954', () => {
      const { error } = worldCupYearSchema.validate({ year: 1954 });
      expect(error).to.be.undefined;
    });

    it('should accept valid World Cup year 2022', () => {
      const { error } = worldCupYearSchema.validate({ year: 2022 });
      expect(error).to.be.undefined;
    });

    it('should accept valid World Cup year 2026', () => {
      const { error } = worldCupYearSchema.validate({ year: 2026 });
      expect(error).to.be.undefined;
    });

    it('should accept valid World Cup year 2030', () => {
      const { error } = worldCupYearSchema.validate({ year: 2030 });
      expect(error).to.be.undefined;
    });
  });

  describe('Invalid inputs', () => {
    it('should reject year not following 4-year pattern (1951)', () => {
      const { error } = worldCupYearSchema.validate({ year: 1951 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be a valid World Cup year (1950, 1954, 1958, ...)');
    });

    it('should reject year not following 4-year pattern (2023)', () => {
      const { error } = worldCupYearSchema.validate({ year: 2023 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be a valid World Cup year (1950, 1954, 1958, ...)');
    });

    it('should reject year not following 4-year pattern (2025)', () => {
      const { error } = worldCupYearSchema.validate({ year: 2025 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be a valid World Cup year (1950, 1954, 1958, ...)');
    });

    it('should reject year before 1950', () => {
      const { error } = worldCupYearSchema.validate({ year: 1946 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be 1950 or later');
    });

    it('should reject non-integer year', () => {
      const { error } = worldCupYearSchema.validate({ year: 2022.5 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be an integer');
    });

    it('should reject non-numeric year', () => {
      const { error } = worldCupYearSchema.validate({ year: 'abc' });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be a number');
    });

    it('should reject missing year', () => {
      const { error } = worldCupYearSchema.validate({});
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year is required');
    });
  });
});
