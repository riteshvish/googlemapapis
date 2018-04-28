var auth = require('./../middlewares/auth');
// auth.generateToken("riteshvish", function(err, token) {
//   console.log(err);
//   console.log(token);
//   setTimeout(function() {
//
//     auth.verifyToken(token.access_token, function(err, token) {
//       console.log(err);
//       console.log(token);
//     })
//   }, 3000)
// })

// let chai = require('chai');
// let chaiHttp = require('chai-http');
// var app = require('../app');
// let should = chai.should();

// chai.use(chaiHttp);

describe('/username access_token', () => {
  it('it should get access_token', (done) => {
    auth.generateToken("riteshvish", {
        ttl: 0.1,
        refresh: true
      },
      function(err, token) {
        console.log(err);
        console.log(token);
        auth.verifyToken(token.access_token, function(err, token) {
          console.log(err);
          done();
        })
      })
  });
});