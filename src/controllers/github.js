import jwt from "jsonwebtoken";
import config from "../config";
import octokitConstructor from "@octokit/rest";
import { User } from "../models";

function GithubController() { }

const octokit = octokitConstructor();

const auth = () => {
  octokit.authenticate({
    type: 'token',
    token: config.editor.token
  });
}

const createBranch = async (repo, branch, sha) => {
  auth();
  return await octokit.git.createRef({
    owner: config.editor.owner,
    repo,
    ref: "refs/heads/"+branch,
    sha
  });
}

const updateFile = async (repo, branch, file, data) => {
  console.log('updating file');
  auth();
  let result = await octokit.repos.getContents({
    owner: config.editor.owner,
    ref: branch,
    repo,
    path: file
  });
  if(result.status !== 200) {
    console.log('could not get file', result);
    return false;
  }
  let sha = result.data.sha;
  auth();
  return await octokit.repos.updateFile({
    sha,
    owner: config.editor.owner,
    repo,
    branch,
    path: file,
    ...data
  });
}

const createFile = async (repo, branch, file, data) => {
  console.log('creating file');
  auth();
  return await octokit.repos.createFile({
    owner: config.editor.owner,
    repo,
    branch,
    path: file,
    ...data
  });
}

const getPullRequests = async (repo, handle) => {
  return octokit.pulls.list({
    owner: "freesewing",
    repo,
    base: "develop",
    head: "freesewing-bot:editor_"+handle,
  });
}

const createPullRequest = async (repo, handle, username) => {
  return octokit.pulls.create({
    owner: "freesewing",
    repo,
    head: "freesewing-bot:editor_"+handle,
    base: "develop",
    title: "Merging in editor changes by "+username,
    maintainer_can_modify: true,
    body: "This pull request rounds up changes made by "
      + username
      + " (freesewing user " + handle + ") through the online editor on the website.\n\n"
      + "While this pull request is open, all future changes by this user will be added to it.  \n"
      + "When it's closed, a new change will trigger a new pull request.\n\n"
      + "Robot out :microphone: :arrow_down:"
  });
}

GithubController.prototype.updateFile = function (req, res) {
  if (!req.body) return res.sendStatus(400);
  if (!req.user._id) return res.sendStatus(400);
  if (config.editor.repos.indexOf(req.body.repo) === -1) return res.sendStatus(400);
  User.findById(req.user._id, (err, user) => {
    if(err || user === null) return res.sendStatus(400);
      octokit.repos.listBranches({
        owner: config.editor.owner,
        repo: req.body.repo,
        per_page: 100,
      }).then(result => {
        let branchName = config.editor.branchPrefix+user.handle;
        let branch = false;
        let develop = false;
        for (let b of result.data) {
          if (b.name === branchName) branch = b;
          if (b.name === "develop") develop = b;
        }
        let createOrUpdateFile;
        let message;
        if (req.body.create) {
          createOrUpdateFile = createFile;
          message = ":sparkles: New file added by "+user.username+": "+req.body.file+"\n\n\n"+req.body.msg;
        } else {
          createOrUpdateFile = updateFile;
          message = ":memo: Editor changes by "+user.username+" in "+req.body.file+"\n\n\n"+req.body.msg;
        }
        let data = {
          message,
          content: req.body.content,
          committer: config.editor.bot,
          author: {
            name: user.username,
            email: req.body.attribution ? user.email : "user+"+user.handle+"@freesewing.org"
          }
        }
        if(!branch) {
          // Need to create a branch for this user's work
          createBranch(req.body.repo, branchName, develop.commit.sha)
          .then(result => {
            createOrUpdateFile(req.body.repo, branchName, req.body.file, data)
            .then(result => {
              let commit = result.data.commit.html_url;
              getPullRequests(req.body.repo, user.handle)
              .then(result => {
                let pr;
                if(result.data.length > 0) {
                  pr = {
                    nr: result.data[0].number,
                    url: result.data[0].html_url,
                  };
                  return res.send({ commit, pr });
                } else {
                  createPullRequest(req.body.repo, user.handle, user.username)
                  .then(result => {
                    pr = {
                      nr: result.data.number,
                      url: result.data.html_url,
                    };
                    return res.send({ commit, pr });
                  });
                }
              });
            });
          });
        } else {
          createOrUpdateFile(req.body.repo, branchName, req.body.file, data)
          .then(result => {
            let commit = result.data.commit.html_url;
            getPullRequests(req.body.repo, user.handle)
            .then(result => {
              let pr;
              if(result.data.length > 0) {
                pr = {
                  nr: result.data[0].number,
                  url: result.data[0].html_url,
                };
                return res.send({ commit, pr });
              } else {
                createPullRequest(req.body.repo, user.handle, user.username)
                .then(result => {
                  pr = {
                    nr: result.data.number,
                    url: result.data.html_url,
                  };
                  return res.send({ commit, pr });
                });
              }
            });
          })
          .catch(err => {
            console.log(err);
          })
        }
      });
  });
}


export default GithubController;
