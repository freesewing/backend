import { User } from '../models'

function AdminController() {}

AdminController.prototype.createUserAccount = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      return res.send(user)
    })
  })
}

AdminController.prototype.readUserAccount = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ username: req.params.username }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      return res.send(user)
    })
  })
}

AdminController.prototype.updateUserAccount = function(req, res) {}

AdminController.prototype.removeUserAccount = function(req, res) {}

AdminController.prototype.masquerade = function(req, res) {}

export default AdminController
