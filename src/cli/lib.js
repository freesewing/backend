import chalk from 'chalk'
import { User, Model, Recipe, Confirmation } from '../models'
import { ehash, uniqueHandle, createAvatar } from '../utils'
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
  await User.deleteMany({})
  console.log('🔥 Users deleted')
}
export const clearModels = async () => {
  Model.deleteMany({})
  console.log('🔥 Models deleted')
}
export const clearRecipes = async () => {
  Recipe.deleteMany({})
  console.log('🔥 Recipes deleted')
}
export const clearConfirmations = async () => {
  Confirmation.deleteMany({})
  console.log('🔥 Confirmations deleted')
}

export const loadSampleData = async () => {
  let promises = []
  for (let sample of data.users) {
    let handle = uniqueHandle()
    let user = new User({
      ...sample,
      initial: sample.email,
      ehash: ehash(sample.email),
      handle,
      picture: handle + '.svg',
      time: {
        created: new Date()
      }
    })
    createAvatar(handle)
    promises.push(user.save())
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
