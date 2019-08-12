import mongoose, { Schema } from 'mongoose'
import config from '../config'
import fs from "fs";
import { log, randomAvatar } from '../utils'
import path from 'path';
import sharp from 'sharp'

const ModelSchema = new Schema(
  {
    handle: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index: true
    },
    user: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    breasts: {
      type: Boolean,
      default: false
    },
    picture: {
      type: String,
      trim: true,
      default: ''
    },
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    notes: {
      type: String,
      trim: true
    },
    measurements: {
      bicepsCircumference: Number,
      bustSpan: Number,
      centerBackNeckToWaist: Number,
      chestCircumference: Number,
      headCircumference: Number,
      highBust: Number,
      highPointShoulderToBust: Number,
      hipsCircumference: Number,
      hipsToUpperLeg: Number,
      inseam: Number,
      kneeCircumference: Number,
      naturalWaist: Number,
      naturalWaistToFloor: Number,
      naturalWaistToHip: Number,
      naturalWaistToKnee: Number,
      naturalWaistToSeat: Number,
      naturalWaistToUnderbust: Number,
      neckCircumference: Number,
      seatCircumference: Number,
      seatDepth: Number,
      shoulderSlope: Number,
      shoulderToElbow: Number,
      shoulderToShoulder: Number,
      shoulderToWrist: Number,
      underbust: Number,
      upperLegCircumference: Number,
      wristCircumference: Number
    }
  },
  { timestamps: true }
)

ModelSchema.index({ user: 1, handle: 1 })

ModelSchema.methods.info = function() {
  let model = this.toObject()
  delete model.picture
  delete model.__v
  delete model._id
  model.pictureUris = {
    l: this.avatarUri(),
    m: this.avatarUri('m'),
    s: this.avatarUri('s'),
    xs: this.avatarUri('xs')
  }

  return model
}

ModelSchema.methods.avatarName = function(size = 'l') {
  let prefix = size === 'l' ? '' : size + '-'
  if (this.picture.slice(-4).toLowerCase() === '.svg') prefix = ''

  return prefix + this.picture;
}

ModelSchema.methods.avatarUri = function(size = 'l') {

  return (
    config.static +
    '/users/' +
    this.user.substring(0, 1) +
    '/' +
    this.user +
    '/models/' +
    this.handle +
    '/' +
    this.avatarName(size)
  )
}

ModelSchema.methods.storagePath = function() {

  return (
    config.storage +
    '/users/' +
    this.user.substring(0, 1) +
    '/' +
    this.user +
    '/models/' +
    this.handle +
    '/'
  )
}

ModelSchema.methods.createAvatar = function() {
  let dir = this.storagePath();
  fs.mkdir(dir, { recursive: true }, err => {
    if (err) console.log('mkdirFailed', dir, err)
    fs.writeFile(path.join(dir, this.handle) + '.svg', randomAvatar(), err => {
      if (err) console.log('writeFileFailed', dir, err)
    })
  })
}

ModelSchema.methods.saveAvatar = function(picture) {
  let type = picture.split(';').shift()
  type = type.split('/').pop()
  this.picture = this.handle+'.'+type;

  let dir = this.storagePath();
  let b64 = picture.split(';base64,').pop()
  fs.mkdir(dir, { recursive: true }, err => {
    if (err) log.error('mkdirFailed', err)
    let imgBuffer = Buffer.from(b64, 'base64')
    for (let size of Object.keys(config.avatar.sizes)) {
      sharp(imgBuffer)
        .resize(config.avatar.sizes[size], config.avatar.sizes[size])
        .toFile(path.join(dir, this.avatarName(size)), (err, info) => {
          if (err) log.error('avatarNotSaved', err)
        })
    }
  })

}



export default mongoose.model('Model', ModelSchema)
