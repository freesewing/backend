import { User, Model, Draft } from "../models";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mailer from "./email";
import logger from "./log";
import config from "../config";
import axios from "axios";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export const email = mailer;
export const log = logger;

export const getHash = (email) => {
  let hash = crypto.createHash("sha256");
  hash.update(clean(email));
  return hash.digest("hex");
}

export const clean = (email) => email.toLowerCase().trim();

export const getToken = (account) => {
  return jwt.sign({
    _id: account._id,
    handle: account.handle,
    aud: config.jwt.audience,
    iss: config.jwt.issuer,
  }, config.jwt.secretOrKey);
}

export const getHandle = type => {
  let go, handle, exists;
  if (type === "model") go = Model;
  else if (type === "draft") go = Draft;
  else go = User;
  do {
    exists = false;
    handle = createHandle();
    go.findOne({ handle: handle }, (err, result) => {
      if(result !== null) exists = true;
    });
  } while (exists !== false);

  return handle;
}

export const createHandle = (length = 5) => {
	let handle = "";
  let possible = "abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i++)
    handle += possible.charAt(Math.floor(Math.random() * possible.length));

  return handle;
}

export const imageType = contentType => {
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpg";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/bmp") return "bmp";
  if (contentType === "image/webp") return "webp";
}

export const saveAvatarFromBase64 = (data, handle, type) => {
  fs.mkdir(userStoragePath(handle), {recursive: true}, (err) => {
    if(err) log.error("mkdirFailed", err);
    let imgBuffer =  Buffer.from(data, 'base64');
    for(let size of Object.keys(config.avatar.sizes)) {
      sharp(imgBuffer)
      .resize(config.avatar.sizes[size], config.avatar.sizes[size])
      .toFile(avatarPath(size, handle, type), (err, info) => {
        if(err) log.error("avatarNotSaved", err);
      });
    }
  });
}

export const userStoragePath = handle => {
  return path.join(
      config.storage,
      handle.substring(0,1),
      handle);
}

export const avatarPath = (size, handle, ext, type="user") => {
 let dir = userStoragePath(handle);
 if(size === "l") return path.join(dir, handle+"."+ext);
 else return path.join(dir, size+"-"+handle+"."+ext);
}

