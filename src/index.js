import 'dotenv/config'
import models, { sequelize } from './models'
import logger from 'morgan'
import routes from './routes'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {main} from '../blockchainServices/index'
import {eraseDatabaseOnSync} from './config/configurations'
import * as seedData from './seeders'

const port = 3001
const app = express()

if (process.env.NODE === 'development') {
  app.use(logger('dev'))
}

if (!process.env.PRIVATE_KEY) {
  throw new Error('No private key detected')
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



sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    // seedData.createTrade();
  }
    app.listen(port, () => {
    console.log(`Tyrannosaurus Rekt listening on port ${port}!`)
  })
})

main()