import 'dotenv/config'
import models, { sequelize } from './models'
import logger from 'morgan'
import routes from './routes'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {main} from '../blockchainServices/index'
import * as seedData from './seeders'

const port = process.env.PORT
const app = express()

if (process.env.NODE === 'development') {
  app.use(logger('dev'))
}

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.context = {
    models
  }
  next()
})

app.use('/trades', routes.trades)


const eraseDatabaseOnSync = false;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    // seedData.createTrade();
  }
    app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
  })
})

main()