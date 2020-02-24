"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "trades",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        tradeId: {
          type: Sequelize.INTEGER
        },
        open: {
          type: Sequelize.BOOLEAN
        },
        liquidationPrice: {
          type: Sequelize.INTEGER
        },
        block: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        indexes: [
          // Create a unique index on email
          {
            unique: true,
            fields: ["tradeId"],
            presence: true
          }
        ]
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("trades");
  }
};
