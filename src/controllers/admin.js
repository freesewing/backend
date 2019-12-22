import { User, Model, Pattern } from '../models'
import jwt from 'jsonwebtoken'
import config from '../config'
import { ehash } from '../utils'

function AdminController() {}


AdminController.prototype.search = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.find({
      $or: [
        { handle: { $regex: `.*${req.body.query}.*` } },
        { username: { $regex: `.*${req.body.query}.*` } },
        { ehash: ehash(req.body.query) },
      ]
    })
      .sort('username')
      .exec((err, users) => {
        if (err) return res.sendStatus(400)
        if (users === null) return res.sendStatus(404)
        return res.send(users.map(user => user.adminProfile()))
    })
  })
}

AdminController.prototype.setPatronStatus = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ handle: req.body.handle }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      user.patron = req.body.patron
      return saveAndReturnAccount(res, user)
    })
  })
}

AdminController.prototype.setRole = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ handle: req.body.handle }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      user.role = req.body.role
      return saveAndReturnAccount(res, user)
    })
  })
}

AdminController.prototype.unfreeze = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ handle: req.body.handle }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      user.status = 'active'
      return saveAndReturnAccount(res, user)
    })
  })
}

AdminController.prototype.impersonate = function(req, res) {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, admin) => {
    if (err || admin === null) return res.sendStatus(400)
    if (admin.role !== 'admin') return res.sendStatus(403)
    User.findOne({ handle: req.body.handle }, (err, user) => {
      if (err) return res.sendStatus(400)
      if (user === null) return res.sendStatus(404)
      let account = user.account()
      let token = getToken(account)
      let models = {}
      Model.find({ user: user.handle }, (err, modelList) => {
        if (err) return res.sendStatus(400)
        for (let model of modelList) models[model.handle] = model.info()
        let patterns = {}
        Pattern.find({ user: user.handle }, (err, patternList) => {
          if (err) return res.sendStatus(400)
          for (let pattern of patternList) patterns[pattern.handle] = pattern
          return user.updateLoginTime(() =>
            res.send({ account, models, patterns, token })
          )
        })
      })
    })
  })
}

function saveAndReturnAccount(res, user) {
  user.save(function(err, updatedUser) {
    if (err) {
      return res.sendStatus(500)
    } else return res.send({ account: updatedUser.account() })
  })
}

const getToken = account => {
  return jwt.sign(
    {
      _id: account._id,
      handle: account.handle,
      role: account.role,
      aud: config.jwt.audience,
      iss: config.jwt.issuer
    },
    config.jwt.secretOrKey
  )
}

export default AdminController
