var assert = require('assert');
import  { hello }  from '../src/App';


describe('App', function() {
  describe('Comparison Functionality', function() {
    it('Should return hello', function() {
      assert.equal(hello(), "Hello");
    });
  });
});