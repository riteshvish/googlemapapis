// let chai = require('chai');
// let chaiHttp = require('chai-http');
// var app = require('../app');
// let should = chai.should();
//
// chai.use(chaiHttp);
//
// describe('/POST User Sign up', () => {
//   it('it should POST user for login', (done) => {
//     var details = {
//       "username": "riteshvish2",
//       "password": "ritesh",
//       "email": "ritesv@mgail.com"
//     }
//     chai.request(app)
//       .post('/user/signup')
//       .send(details)
//       .end((err, res) => {
//         res.should.have.status(200);
//         // done();
//
//         describe('/POST User Login', () => {
//           it('it should POST user for login unauthrized', (done) => {
//             var details = {
//               "username": "riteshvish",
//               "password": "riteshd"
//             }
//             chai.request(app)
//               .post('/user/login')
//               .send(details)
//               .end((err, res) => {
//                 res.should.have.status(401);
//                 done();
//               });
//           });
//         });
//       });
//   });
// });