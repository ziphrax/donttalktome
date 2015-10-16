var request = require('supertest');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = require('should');
var namespace = '/api/v1';
var app = require(__dirname + '/../server.js');
var port = 3001;
var controller;
var jwt = '';

describe(namespace + '/friends',function(){

  before(function(done){
    request(app)
        .post(namespace + '/authentication')
        .send({ name:'Administrator' , password:'Admin' })
        .end( function(err,res){
            jwt = res.body.token;
            done();
        });
  });

  it('should get friends list',function(done){
    request(app)
      .get(namespace + '/friends/562101e1e7dd283830fda547')
      .set('x-access-token',jwt)
      .expect(200)
      .expect(function(res){
          res.body.should.have.property('success',true);
          res.body.should.have.property('data');
          res.body.data.should.be.instanceOf(Array);
      })
      .end( done );
  });

  it('POST /friends/makeFriends should send friends request',function(done){
    this.timeout(10000);
    request(app)
      .post(namespace + '/friends/makeFriends')
      .set('x-access-token',jwt)
      .send({
        text : 'Yay, you have been invited become friends',
        from: 'develope@localhost.test',
        to: 'developer@localhost.test',
        cc : '',
        subject: 'New Event Invite',
        to_user_id: '562101e1e7dd283830fda547',
        from_user_id: '562101e1e7dd283830fda547'
      })
      .expect(200)
      .expect(function(res){
          res.body.should.have.property('success',true);
          res.body.should.have.property('data');
          res.body.data.should.be.instanceOf(Array);
          assert.equal(res.body.data.length,1);
          res.body.data[0].should.have.property('_id');
          res.body.data[0].should.have.property('from_user_id');
          res.body.data[0].should.have.property('to_user_id');
      })
      .end( done );
  });

  it('POST /friends/nearest/1',function(done){
      request(app)
        .get(namespace + '/friends/nearset')
        .set('x-access-token',jwt)
        .expect(200)
        .expect(function(res){
            res.body.should.have.property('success',true);
            res.body.should.have.property('data');
            res.body.data.should.be.instanceOf(Array);
        })
        .end( done );
  });

});
