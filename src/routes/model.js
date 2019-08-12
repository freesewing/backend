import Controller from '../controllers/model'

const Model = new Controller()

export default (app, passport) => {
  app.post('/models', passport.authenticate('jwt', { session: false }), Model.create) // Create
  app.get('/models/:handle', passport.authenticate('jwt', { session: false }), Model.read) // Read
  app.put('/models/:handle', passport.authenticate('jwt', { session: false }), Model.update) // Update
  app.delete('/models/:handle', passport.authenticate('jwt', { session: false }), Model.delete) // Delete
}
