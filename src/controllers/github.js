import axios from 'axios'
import config from '../config'

import { log } from '../utils'

function GithubController() {}

// Create a gist
GithubController.prototype.createGist = function(req, res) {
  if (!req.body.data) return res.sendStatus(400)
  let client = GithubClient()
  client.post('/gists', {
    public: true,
    description: `An open source sewing pattern from freesewing.org`,
    files: {
      'pattern.yaml': { content: req.body.data }
    }
  })
  .then(result => {
    let id = result.data.id
    client.post(`/gists/${id}/comments`, {
      body: `👉 https://freesewing.org/recreate/gist/${id} 👀`
    })
    .then(result => res.send({id}))
    .catch(err => res.sendStatus(500))
  })
  .catch(err => res.sendStatus(500))
}

GithubController.prototype.createIssue = function(req, res) {
  if (!req.body.data) return res.sendStatus(400)
  if (!req.body.design) return res.sendStatus(400)
  let client = GithubClient()
  client.post('/gists', {
    public: true,
    description: `A FreeSewing crash report`,
    files: {
      'pattern.yaml': { content: req.body.data },
      'debug.yaml': { content: req.body.patternProps },
      'errors.md': { content: req.body.traces },
    }
  })
  .then(gist => {
    client.post('/repos/freesewing/freesewing.org/issues', {
      title: `Error while drafting ${req.body.design}`,
      body: `An error occured while drafting ${req.body.design} and a [crash report](https://gist.github.com/${gist.data.id}) was generated.`,
      labels: [
        `pkg:${req.body.design}`,
        'robot'
      ]
    })
    .then(issue => {
      let notify = (typeof config.github.notify.specific[req.body.design] === 'undefined')
        ? config.github.notify.dflt
        : config.github.notify.specific[req.body.design]
      let id = issue.data.number
      let body = 'Ping '
      for (const user of notify) body += `@${user}`
      body += " 👋   \n" + `Recreate this 👉 https://freesewing.org/recreate/gist/${gist.data.id}`
      client.post(`/repos/freesewing/freesewing.org/issues/${id}/comments`, { body })
      .then(result => res.send({id}))
      .catch(err => res.sendStatus(500))
    })
    .catch(err => res.sendStatus(500))
  })
  .catch(err => res.sendStatus(500))
}

const GithubClient = () => axios.create({
  baseURL: config.github.api,
  timeout: 5000,
  auth: {
    username: config.github.bot.user,
    password: config.github.token
  },
  headers: {
    Accept: 'application/vnd.github.v3+json'
  }
})

export default GithubController
