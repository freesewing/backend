import Controller from '../controllers/github'

const Github = new Controller()

export default (app, passport) => {
  /**********************************************
   *                                            *
   *             ANONYMOUS ROUTES               *
   *                                            *
   *********************************************/

  /**********************************************
   *                                            *
   *           AUTHENTICATED ROUTES             *
   *                                            *
   *********************************************/

  app.put('/github/file', passport.authenticate('jwt', { session: false }), Github.updateFile) // Update file

  //app.get('/github/stars', passport.authenticate('jwt', { session: false }), Github.getStars); // Get star count
  //app.put('/user', passport.authenticate('jwt', {session: false }), User.update); // Update
  //app.delete('/user', userController.delete); // Delete
}
