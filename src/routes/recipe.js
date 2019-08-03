import Controller from '../controllers/recipe'

const Recipe = new Controller()

export default (app, passport) => {
  /**********************************************
   *                                            *
   *             ANONYMOUS ROUTES               *
   *                                            *
   *********************************************/

  // Load shared recipe
  app.get('/recipe/:handle', Recipe.readRecipe)

  /**********************************************
   *                                            *
   *           AUTHENTICATED ROUTES             *
   *                                            *
   *********************************************/

  /* CRUD endpoints */

  app.post('/recipe', passport.authenticate('jwt', { session: false }), Recipe.create) // Create
  app.get('/recipe/:handle', passport.authenticate('jwt', { session: false }), Recipe.read) // Read
  app.put('/recipe/:handle', passport.authenticate('jwt', { session: false }), Recipe.update) // Update
  app.delete('/recipe/:handle', passport.authenticate('jwt', { session: false }), Recipe.delete) // Delete

  // Delete multiple
  app.post(
    '/remove/recipes',
    passport.authenticate('jwt', { session: false }),
    Recipe.deleteMultiple
  )
}
