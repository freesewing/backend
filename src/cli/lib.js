import chalk from 'chalk'
import { User, Model, Recipe, Confirmation } from '../models'
import { ehash, createAvatar } from '../utils'
import data from './data'

export const showHelp = () => {
  console.log()
  console.log(chalk.yellow('Use one of the following:'))
  console.log()
  console.log('  ', chalk.bold.blue('npm run clear:users'), '👉 Truncate the users collection')
  console.log('  ', chalk.bold.blue('npm run clear:models'), '👉 Truncate the models collection')
  console.log('  ', chalk.bold.blue('npm run clear:recipes'), '👉 Truncate the recipes collection')
  console.log(
    '  ',
    chalk.bold.blue('npm run clear:confirmations'),
    '👉 Truncate the confirmations collection'
  )
  console.log('  ', chalk.bold.blue('npm run clear:all'), '👉 Empty the entire database')
  console.log(
    '  ',
    chalk.bold.blue('npm run clear:reboot'),
    '👉 Empty database, then load sample data'
  )
  console.log()
  process.exit()
}

export const clearUsers = async () => {
  await Model.deleteMany().then(result => {
   if (result.ok) console.log('🔥 Users deleted')
   else console.log('🚨 Could not remove users', result)
  })
}
export const clearModels = async () => {
  await Model.deleteMany().then(result => {
   if (result.ok) console.log('🔥 Models deleted')
   else console.log('🚨 Could not remove models', result)
  })
}
export const clearRecipes = async () => {
  await Recipe.deleteMany().then(result => {
   if (result.ok) console.log('🔥 Recipes deleted')
   else console.log('🚨 Could not remove recipes', result)
  })
}
export const clearConfirmations = async () => {
  await Confirmation.deleteMany().then(result => {
   if (result.ok) console.log('🔥 Confirmations deleted')
   else console.log('🚨 Could not remove confirmations', result)
  })
}

export const loadSampleData = async () => {
  let promises = []
  for (let sample of data.users) {
    let user = new User({
      ...sample,
      initial: sample.email,
      ehash: ehash(sample.email),
      picture: sample.handle + '.svg',
      time: {
        created: new Date()
      }
    })
    createAvatar(sample.handle)
    promises.push(user.save())
  }
  for (let sample of data.models) {
    promises.push(new Model(sample).save())
  }
  for (let sample of data.recipes) {
    promises.push(new Recipe(sample).save())
  }

  return Promise.all(promises)
}

export const runTasks = options => {
  let promises = []
  if (options.clearAll || options.reboot || options.clearUsers) promises.push(clearUsers())
  if (options.clearAll || options.reboot || options.clearModels) promises.push(clearModels())
  if (options.clearAll || options.reboot || options.clearRecipes) promises.push(clearRecipes())
  if (options.clearAll || options.reboot || options.clearConfirmations)
    promises.push(clearConfirmations())

  return Promise.all(promises)
}
