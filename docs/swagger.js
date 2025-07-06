import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import deepmerge from 'deepmerge'

const baseDoc = JSON.parse(fs.readFileSync('./docs/swagger.json', 'utf8'))
const productDoc = JSON.parse(fs.readFileSync('./docs/productDoc.json', 'utf8'))
const authDoc = JSON.parse(fs.readFileSync('./docs/authDoc.json', 'utf8'))
const cartDoc = JSON.parse(fs.readFileSync('./docs/cartDoc.json', 'utf8'))

const swaggerDocument = deepmerge.all([baseDoc, productDoc, authDoc, cartDoc])

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

export default swaggerDocs