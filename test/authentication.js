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

describe( namespace + '/authentication' , function(){

    it('should respond with auth token' , function(done){
        request(app)
            .post(namespace + '/authentication')
            .send({ name:'Administrator' , password:'Admin' })
            .expect( 200 )
            .expect(function(res){
                jwt = res.body.token;
                res.body.should.have.property('token');
            })
            .end( done );
    });

    it('should respond with incorrect username should error' , function(done){
        request(app)
            .post(namespace + '/authentication')
            .send({ name:'Administrator2' , password:'Admin' })
            .expect( 401 )
            .expect(function(res){
                res.body.should.have.property('success',false);
                res.body.should.have.property('message','Authentication failed.');
            })
            .end( done );
    });

    it('should respond with incorrect password should error' , function(done){
        request(app)
            .post(namespace + '/authentication')
            .send({ name:'Administrator' , password:'Admin2' })
            .expect( 401 )
            .expect(function(res){
                res.body.should.have.property('success',false);
                res.body.should.have.property('message','Authentication failed.');
            })
            .end( done );
    });

});
