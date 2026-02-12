const { expect } = require('chai');
const yearSchema = require('../../src/validators/yearSchema');

describe('Year Validation Schema', () => {
  describe('Valid inputs', () => {
    it('should accept valid year 1950', () => {
      const { error } = yearSchema.validate({ year: 1950 });
      expect(error).to.be.undefined;
    });

    it('should accept valid year 2022', () => {
      const { error } = yearSchema.validate({ year: 2022 });
      expect(error).to.be.undefined;
    });

    it('should accept valid year 2026', () => {
      const { error } = yearSchema.validate({ year: 2026 });
      expect(error).to.be.undefined;
    });
  });

  describe('Invalid inputs', () => {
    it('should reject year before 1950', () => {
      const { error } = yearSchema.validate({ year: 1949 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be 1950 or later');
    });

    it('should reject non-integer year', () => {
      const { error } = yearSchema.validate({ year: 2022.5 });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be an integer');
    });

    it('should reject non-numeric year', () => {
      const { error } = yearSchema.validate({ year: 'abc' });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year must be a number');
    });

    it('should reject missing year', () => {
      const { error } = yearSchema.validate({});
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Year is required');
    });
  });
});
