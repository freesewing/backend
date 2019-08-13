import Controller from '../controllers/recipe'

const Recipe = new Controller()

export default (app, passport) => {
  app.get('/recipes/:handle', Recipe.read) // Anomymous read
  app.post('/recipes', passport.authenticate('jwt', { session: false }), Recipe.create) // Create
  app.put('/recipes/:handle', passport.authenticate('jwt', { session: false }), Recipe.update) // Update
  app.delete('/recipes/:handle', passport.authenticate('jwt', { session: false }), Recipe.delete) // Delete
}
