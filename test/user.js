var auth = require('./../middlewares/auth');

describe('/user signup', () => {
  it('it should register user with ', (done) => {
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