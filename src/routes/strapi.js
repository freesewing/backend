import Controller from '../controllers/strapi'

const Strapi= new Controller()

export default (app, passport) => {
  // Email subscribe
  app.post('/strapi/maker', (req, res) => Strapi.addMaker(req, res, true))
  app.post('/strapi/aithor', (req, res) => Strapi.addAuthor(req, res, true))
}
