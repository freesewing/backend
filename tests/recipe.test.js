module.exports = function tests(store, config, chai) {

  describe('Recipe endpoints', () => {

    it('should create a recipe', done => {
      chai
        .request(config.backend)
        .post('/recipes')
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          name: 'Test recipe',
          notes: 'Some notes',
          recipe: {
            test: 'value'
          }
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text);
          data.name.should.equal('Test recipe')
          data.notes.should.equal('Some notes')
          data.recipe.test.should.equal('value')
          config.user.recipe = data.handle;
          done()
        })
    })

    it('should update the recipe name', done => {
      chai
        .request(config.backend)
        .put('/recipes/'+config.user.recipe)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          name: 'New name',
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text);
          data.name.should.equal('New name')
          data.handle.should.equal(config.user.recipe)
          done()
        })
    })

    it('should update the recipe notes', done => {
      chai
        .request(config.backend)
        .put('/recipes/'+config.user.recipe)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          notes: 'These are the notes'
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text);
          data.notes.should.equal('These are the notes')
          data.handle.should.equal(config.user.recipe)
          done()
        })
    })


    it('should load the recipe data without authentication', done => {
      chai
        .request(config.backend)
        .get('/recipes/'+config.user.recipe)
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text);
          data.notes.should.equal('These are the notes')
          data.handle.should.equal(config.user.recipe)
          done()
        })
    })

    it('should delete the recipe', done => {
      chai
        .request(config.backend)
        .delete('/recipes/'+config.user.recipe)
        .set('Authorization', 'Bearer ' + config.user.token)
        .end((err, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should no longer have this recipe', done => {
      chai
        .request(config.backend)
        .get('/recipes/'+config.user.recipe)
        .set('Authorization', 'Bearer ' + config.user.token)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })

  })

}
