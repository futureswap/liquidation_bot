import models, { sequelize } from '../models'
import trade1 from './trades/trade1.json'


  export const createTrade = async () => {
    await models.trade.bulkCreate([
        trade1
    ]
    );
  }
