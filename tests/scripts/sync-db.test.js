require('dotenv').config();
const { expect } = require('chai');
const { Sequelize } = require('sequelize');

describe('Database Sync Script', () => {
  let sequelize;

  before(async () => {
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
  });

  after(async () => {
    await sequelize.close();
  });

  it('should have Winners table created', async () => {
    const tableInfo = await sequelize.getQueryInterface().describeTable('Winners');
    
    expect(tableInfo).to.have.property('id');
    expect(tableInfo).to.have.property('year');
    expect(tableInfo).to.have.property('winner');
    expect(tableInfo).to.have.property('host_country');
    expect(tableInfo).to.have.property('createdAt');
    expect(tableInfo).to.have.property('updatedAt');
  });

  it('should have Matches table created', async () => {
    const tableInfo = await sequelize.getQueryInterface().describeTable('Matches');
    
    expect(tableInfo).to.have.property('id');
    expect(tableInfo).to.have.property('year');
    expect(tableInfo).to.have.property('stage');
    expect(tableInfo).to.have.property('date');
    expect(tableInfo).to.have.property('team1');
    expect(tableInfo).to.have.property('team2');
    expect(tableInfo).to.have.property('score1');
    expect(tableInfo).to.have.property('score2');
    expect(tableInfo).to.have.property('createdAt');
    expect(tableInfo).to.have.property('updatedAt');
  });

  it('should have unique constraint on Winners.year', async () => {
    const [indexes] = await sequelize.query(
      "SHOW INDEX FROM Winners WHERE Column_name = 'year' AND Non_unique = 0"
    );
    expect(indexes.length).to.be.greaterThan(0);
  });
});
