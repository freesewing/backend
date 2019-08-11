import Controller from '../controllers/user'

const User = new Controller()

export default (app, passport) => {
  /**********************************************
   *                                            *
   *             ANONYMOUS ROUTES               *
   *                                            *
   *********************************************/

  /*  Sign-up flow */

  // Sign up user
  app.post('/signup', User.signup)

  // Create account from confirmation / Consent for data processing given
  app.post('/user', User.create)

  /* Login flow */

  // User login
  app.post('/login', User.login)

  // Confirmation login
  app.post('/confirm/login', User.confirmationLogin)

  // Reset user password
  app.post('/reset/password', User.resetPassword)

  // Set user password after reset
  app.post('/set/password', User.setPassword)

  /* Email confirmation endpoints */
  // (these are always GET because they are links in an email)

  // Load patron list
  app.get('/patrons', User.patronList)

  /**********************************************
   *                                            *
   *           AUTHENTICATED ROUTES             *
   *                                            *
   *********************************************/

  /* CRUD endpoints */
  app.get('/account', passport.authenticate('jwt', { session: false }), User.readAccount) // Read account (own data)
  app.get('/users/:username', User.readProfile) // Read profile (other user's data)
  app.put('/user', passport.authenticate('jwt', { session: false }), User.update) // Update
  app.delete('/account', passport.authenticate('jwt', { session: false }), User.remove)

  // Confirm email change
  app.post(
    '/confirm/changed/email',
    passport.authenticate('jwt', { session: false }),
    User.confirmChangedEmail
  )

  // Export data
  app.get('/export', passport.authenticate('jwt', { session: false }), User.export)

  // Restrict processing (freeze account)
  app.get('/restrict', passport.authenticate('jwt', { session: false }), User.restrict)

  // Check whether username is available
  app.post(
    '/available/username',
    passport.authenticate('jwt', { session: false }),
    User.isUsernameAvailable
  )
}
