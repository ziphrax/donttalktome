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

describe('app',function(){

    it('should exist',function(done){
        should.exist(app);
        done();
    });

    it('should be listening at localhost:3001', function (done) {
        request(app)
            .get('/')
            .expect( 200 , done );
    });

});
