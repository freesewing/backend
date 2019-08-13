import Controller from '../controllers/admin'

const Admin = new Controller()

export default (app, passport) => {
  // Users
  app.get('/admin/users/:handle', passport.authenticate('jwt', { session: false }), Admin.readUserAccount)
  app.put('/admin/users/:handle', passport.authenticate('jwt', { session: false }), Admin.updateUserAccount)
  app.delete('/admin/users/:handle', passport.authenticate('jwt', { session: false }), Admin.removeUserAccount)
  app.post('/admin/users', passport.authenticate('jwt', { session: false }), Admin.createUserAccount)
  app.post('/admin/masquerade', passport.authenticate('jwt', { session: false }), Admin.masquerade)
}
