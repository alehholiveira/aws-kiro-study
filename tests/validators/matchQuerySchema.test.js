const { expect } = require('chai');
const matchQuerySchema = require('../../src/validators/matchQuerySchema');

describe('Match Query Validation Schema', () => {
  describe('Valid inputs', () => {
    it('should accept valid team names', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 'Brazil', 
        team2: 'Germany' 
      });
      expect(error).to.be.undefined;
    });

    it('should trim whitespace from team names', () => {
      const { error, value } = matchQuerySchema.validate({ 
        team1: '  Brazil  ', 
        team2: '  Germany  ' 
      });
      expect(error).to.be.undefined;
      expect(value.team1).to.equal('Brazil');
      expect(value.team2).to.equal('Germany');
    });

    it('should accept team names with spaces', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 'Costa Rica', 
        team2: 'South Korea' 
      });
      expect(error).to.be.undefined;
    });
  });

  describe('Invalid inputs', () => {
    it('should reject empty team1', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: '', 
        team2: 'Germany' 
      });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Team 1 name cannot be empty');
    });

    it('should reject empty team2', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 'Brazil', 
        team2: '' 
      });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Team 2 name cannot be empty');
    });

    it('should reject whitespace-only team1', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: '   ', 
        team2: 'Germany' 
      });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Team 1 name cannot be empty');
    });

    it('should reject missing team1', () => {
      const { error } = matchQuerySchema.validate({ 
        team2: 'Germany' 
      });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Team 1 is required');
    });

    it('should reject missing team2', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 'Brazil' 
      });
      expect(error).to.exist;
      expect(error.details[0].message).to.equal('Team 2 is required');
    });

    it('should reject non-string team1', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 123, 
        team2: 'Germany' 
      });
      expect(error).to.exist;
    });

    it('should reject non-string team2', () => {
      const { error } = matchQuerySchema.validate({ 
        team1: 'Brazil', 
        team2: 456 
      });
      expect(error).to.exist;
    });
  });
});
