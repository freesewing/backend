import axios from 'axios'
import config from '../config'
import asBuffer from 'data-uri-to-buffer'
import FormData from 'form-data'
import fs from 'fs'
import toFile from 'data-uri-to-file'
import toStream from 'buffer-to-stream'
import tou8 from 'buffer-to-uint8array'

const auth = {
  identifier: config.strapi.username,
  password: config.strapi.password,
}

const getToken = async () => {
  let result
  try {
    result = await axios.post(
      `${config.strapi.protocol}://${config.strapi.host}:${config.strapi.port}/auth/local`,
      {
        identifier: config.strapi.username,
        password: config.strapi.password
      }
    )
  }
  catch(err) {
    console.log('ERROR: Failed to load strapi token')
    console.log(err.response)
    return false
  }

  return result.data.jwt
}

const withToken = token => ({
  headers: {
    Authorization: `Bearer ${token}`,
  }
})

const ext = type => {
  switch (type.toLowerCase()) {
    case 'image/jpg':
    case 'image/jpeg':
      return 'jpg'
      break;
    case 'image/png':
      return 'png'
      break
    default:
      return false
  }
}

function StrapiController() {}

StrapiController.prototype.addAuthor = function(req, res) {
  if (!req.body || !req.body.displayname) return res.sendStatus(400)
  return res.send(req.body)
}

StrapiController.prototype.addMaker = async function(req, res) {
  if (
    !req.body ||
    !req.body.displayname ||
    !req.body.about ||
    !req.body.picture ||
    typeof req.body.displayname !== 'string' ||
    typeof req.body.about !== 'string' ||
    typeof req.body.picture !== 'string'
  ) return res.sendStatus(400)

  const token = await getToken()
  let result
  // Upload picture
  const form = new FormData()
  const buff = asBuffer(req.body.picture)
  const extention = ext(buff.type)
  if (!extention) res.status(400).send({error: `Filetype ${buff.type} is not supported`})

  // I hate you strapi, because this hack is the only way I can get your shitty upload to work
  const filename = `${config.strapi.tmp}/goSuckABagOfDicksStrapi.${extention}`
  const onDisk = await fs.promises.writeFile(filename, asBuffer(req.body.picture))
  const file = fs.createReadStream(filename)
  form.append('files', file)
  form.append('fileInfo', JSON.stringify({
    alternativeText: `Avatar for ${req.body.displayname}`
  }))


  axios.post('http://localhost:1337/upload', form, {
    headers: {
    ...(form.getHeaders()),
    Authorization: `Bearer ${token}`,
  },
})
.then(response => {
  console.log(response.data)
})
.catch(error => console.log(error))

    return res.send({})

}

export default StrapiController
