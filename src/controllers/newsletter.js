import { Newsletter, Confirmation } from '../models'
import {
  log,
  email,
  ehash,
} from '../utils'
import config from '../config'
import path from 'path'

const bail = (res, page='index') => res.sendFile(path.resolve(__dirname, '..', 'landing', `${page}.html`))

function NewsletterController() {}

NewsletterController.prototype.subscribe = function(req, res, subscribe=true) {
  if (!req.body || !req.body.email) return res.sendStatus(400)
  let confirmation = new Confirmation({
    type: 'newsletter',
    data: { email: req.body.email }
  })
  confirmation.save(function(err) {
    if (err) return res.sendStatus(500)
    log.info('newsletterSubscription', {
      email: req.body.email,
      confirmation: confirmation._id
    })
    email.subscribe(req.body.email, confirmation._id)
    return res.send({status: 'subscribed'})
  })
}

NewsletterController.prototype.confirm = function(req, res, subscribe=true) {
  if (!req.params.token) return bail(res, 'invalid')
  Confirmation.findById(req.params.token, (err, confirmation) => {
    if (err) return bail(res)
    if (confirmation === null) return bail(res)
    Newsletter.findOne(
      {
        ehash: ehash(confirmation.data.email)
      },
      (err, reader) => {
        if (err) return bail(res)
        // Already exists?
        if (reader !== null) return bail(res, 'already-subscribed')
        let sub = new Newsletter({
          email: confirmation.data.email,
          ehash: ehash(confirmation.data.email),
          time: {
            created: new Date()
          }
        })
        sub.save(function(err) {
          if (err) {
            log.error('newsletterSubscriptionFailed', sub)
            console.log(err)
            return res.sendStatus(500)
          }
          return bail(res, 'subscribe')
        })
      })
  })
}

export default NewsletterController
