module.exports = function tests(store, config, chai) {
  const should = chai.should()

  describe('Model endpoints', () => {
    it('should create a model', done => {
      chai
        .request(config.backend)
        .post('/models')
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          name: 'Test model',
          units: 'imperial',
          breasts: true
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.breasts.should.be.true
          data.model.units.should.equal('imperial')
          data.model.name.should.equal('Test model')
          data.model.pictureUris.xs
            .split('/')
            .pop()
            .should.equal(data.model.handle + '.svg')
          config.user.model = data.model.handle
          done()
        })
    })

    it('should update the model name', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          name: 'New model name'
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.name.should.equal('New model name')
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should update the model chest', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          breasts: 'false'
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.breasts.should.be.false
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should update the model units', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          units: 'metric'
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.units.should.equal('metric')
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should update the model notes', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          notes: 'These are the notes'
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.notes.should.equal('These are the notes')
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should update the model measurements', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          measurements: {
            shoulderToShoulder: 456,
            neckCircumference: 345
          }
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.measurements.shoulderToShoulder.should.equal(456)
          data.model.measurements.neckCircumference.should.equal(345)
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should not set a non-existing measurement', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          measurements: {
            hairLength: 12
          }
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          should.not.exist(data.model.measurements.hairLength)
          data.model.measurements.shoulderToShoulder.should.equal(456)
          data.model.measurements.neckCircumference.should.equal(345)
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should update the model avatar', done => {
      chai
        .request(config.backend)
        .put('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .send({
          picture: config.avatar
        })
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.measurements.shoulderToShoulder.should.equal(456)
          data.model.measurements.neckCircumference.should.equal(345)
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should load the model data', done => {
      chai
        .request(config.backend)
        .get('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .end((err, res) => {
          res.should.have.status(200)
          let data = JSON.parse(res.text)
          data.model.measurements.shoulderToShoulder.should.equal(456)
          data.model.measurements.neckCircumference.should.equal(345)
          data.model.handle.should.equal(config.user.model)
          done()
        })
    })

    it('should delete the model', done => {
      chai
        .request(config.backend)
        .delete('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .end((err, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should no longer have this model', done => {
      chai
        .request(config.backend)
        .get('/models/' + config.user.model)
        .set('Authorization', 'Bearer ' + config.user.token)
        .end((err, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })
}
