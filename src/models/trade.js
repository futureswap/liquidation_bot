'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trade = sequelize.define('trade', {
    tradeId: DataTypes.INTEGER,
    open: DataTypes.BOOLEAN,
    liquidationPrice: DataTypes.INTEGER,
    block: DataTypes.INTEGER
  }, {});
  Trade.associate = function(models) {
    // associations can be defined here
  };
  return Trade;
};