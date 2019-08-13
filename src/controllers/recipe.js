import { User, Recipe } from '../models'
import { log } from '../utils'

function RecipeController() {}

// CRUD basics
RecipeController.prototype.create = (req, res) => {
  if (!req.body) return res.sendStatus(400)
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, user) => {
    if (err || user === null) return res.sendStatus(400)
    let handle = uniqueHandle()
    let recipe = new Recipe({
      handle,
      user: user.handle,
      name: req.body.name,
      notes: req.body.notes,
      recipe: req.body.recipe,
      created: new Date()
    })
    recipe.save(function(err) {
      if (err) {
        log.error('recipeCreationFailed', user)
        console.log(err)
        return res.sendStatus(500)
      }
      log.info('recipeCreated', { handle: recipe.handle })
      return res.send(recipe.asRecipe())
    })
  })
}

RecipeController.prototype.read = (req, res) => {
  Recipe.findOne({ handle: req.params.handle }, (err, recipe) => {
    if (err) return res.sendStatus(400)
    if (recipe === null) return res.sendStatus(404)
    return res.send(recipe.asRecipe())
  })
}

RecipeController.prototype.update = (req, res) => {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, async (err, user) => {
    if (err || user === null) return res.sendStatus(400)
    Recipe.findOne({ handle: req.params.handle }, (err, recipe) => {
      if (err || recipe === null) return res.sendStatus(400)
      if (typeof req.body.name === 'string') recipe.name = req.body.name
      if (typeof req.body.notes === 'string') recipe.notes = req.body.notes
      return saveAndReturnRecipe(res, recipe)
    })
  })
}

RecipeController.prototype.delete = (req, res) => {
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, async (err, user) => {
    if (err || user === null) return res.sendStatus(400)
    Recipe.deleteOne({ handle: req.params.handle, user: user.handle }, err => {
      if (err) return res.sendStatus(400)
      else return res.sendStatus(204)
    })
  })
}

// Delete multiple
RecipeController.prototype.deleteMultiple = function(req, res) {
  if (!req.body) return res.sendStatus(400)
  if (!req.body.recipes) return res.sendStatus(400)
  if (!req.user._id) return res.sendStatus(400)
  User.findById(req.user._id, (err, user) => {
    if (err || user === null) return res.sendStatus(400)
    let recipes = req.body.recipes
    if (recipes.length < 1) return res.sendStatus(400)
    let handles = []
    for (let handle of recipes) handles.push({ handle })
    Recipe.deleteMany(
      {
        user: user.handle,
        $or: handles
      },
      err => {
        if (err) return res.sendStatus(500)
        const recipes = {}
        Recipes.find({ user: user.handle }, (err, recipeList) => {
          if (err) return res.sendStatus(400)
          for (let recipe of recipeList) recipes[recipe.handle] = recipe
          res.send({ recipes })
        })
      }
    )
  })
}

function saveAndReturnRecipe(res, recipe) {
  recipe.save(function(err, updatedRecipe) {
    if (err) {
      log.error('recipeUpdateFailed', updatedRecipe)
      return res.sendStatus(500)
    }
    return res.send(updatedRecipe.info())
  })
}

const newHandle = (length = 5) => {
  let handle = ''
  let possible = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; i++)
    handle += possible.charAt(Math.floor(Math.random() * possible.length))

  return handle
}

const uniqueHandle = () => {
  let handle, exists
  do {
    exists = false
    handle = newHandle()
    Recipe.findOne({ handle: handle }, (err, recipe) => {
      if (recipe !== null) exists = true
    })
  } while (exists !== false)

  return handle
}

export default RecipeController
