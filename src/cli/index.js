import '../env'
import crypto from 'crypto'
import mongoose from 'mongoose'
import config from '../config/index'
import chalk from 'chalk'
import verifyConfig from '../config/verify'
import { User, Confirmation, Model, Recipe } from '../models'
import optionDefinitions from "./options"
import commandLineArgs from 'command-line-args';
import path from 'path';
import fs from 'fs';
import { randomAvatar, ehash, newHandle, uniqueHandle, clean, userStoragePath, createAvatar } from '../utils'

const showHelp = () => {
  console.log()
  console.log(chalk.yellow('Use one of the following:'));
  console.log()
  console.log('  ',chalk.bold.blue('npm run clear:users'), '👉 Truncate the users collection')
  console.log('  ',chalk.bold.blue('npm run clear:models'), '👉 Truncate the models collection')
  console.log('  ',chalk.bold.blue('npm run clear:recipes'), '👉 Truncate the recipes collection')
  console.log('  ',chalk.bold.blue('npm run clear:confirmations'), '👉 Truncate the confirmations collection')
  console.log('  ',chalk.bold.blue('npm run clear:all'), '👉 Empty the entire database')
  console.log('  ',chalk.bold.blue('npm run clear:reboot'), '👉 Empty database, then load sample data')
  console.log()
  process.exit()
}

const clearUsers = async () => {
  await User.deleteMany({})
  console.log('🔥 Users deleted');
}
const clearModels = async () => {
  Model.deleteMany({})
  console.log('🔥 Models deleted');
}
const clearRecipes = async () => {
  Recipe.deleteMany({})
  console.log('🔥 Recipes deleted');
}
const clearConfirmations = async () => {
  Confirmation.deleteMany({})
  console.log('🔥 Confirmations deleted');
}

const users = [
  {
    email: 'test@freesewing.org',
    username: 'test_user',
    password: 'test',
    role: 'user',
    settings: {
      language: 'nl',
      units: 'imperial'
    },
    status: 'active',
  },
  {
    email: 'admin@freesewing.org',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    patron: 8,
    settings: {
      language: 'en',
      units: 'metric'
    },
    status: 'active',
  },
]

const loadSampleData = async () => {
  let promises = [];
  for (let sample of users) {
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
    createAvatar(handle);
    promises.push(user.save())
  }

  return Promise.all(promises);
}

const runTasks = options => {
  let promises = [];
  if (options.clearAll || options.reboot || options.clearUsers) promises.push(clearUsers())
  if (options.clearAll || options.reboot || options.clearModels) promises.push(clearModels())
  if (options.clearAll || options.reboot || options.clearRecipes) promises.push(clearRecipes())
  if (options.clearAll || options.reboot || options.clearConfirmations) promises.push(clearConfirmations())

  return Promise.all(promises);
}


const options = commandLineArgs(optionDefinitions);
if (options.help) {
  showHelp();
  process.exit();
}

// Verify configuration
verifyConfig(config, chalk)

// Connecting to the database
mongoose.Promise = global.Promise
mongoose
  .connect(config.db.uri, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(chalk.green('Successfully connected to the database'))
    console.log();
    runTasks(options).then(() => {
      if (options.reboot) {
        loadSampleData().then(() => {
          console.log('⚡ Users loaded');
          process.exit()
        });
      } else {
        console.log();
        process.exit()
      }
    })
  })
  .catch(err => {
    console.log(chalk.red('Could not connect to the database. Exiting now...'), err)
    process.exit()
  })



