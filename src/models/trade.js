'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define('trade', {
    tradeId: {
      type: DataTypes.INTEGER,
      unique: true, 
      field: "tradeId"
    },
    isLong: DataTypes.BOOLEAN,
    liquidationPrice: DataTypes.STRING,
    block: DataTypes.INTEGER,
    exchangeAddress: DataTypes.STRING
  }, {});
  Trade.associate = function(models) {
    // associations can be defined here
  };
  return Trade;
};