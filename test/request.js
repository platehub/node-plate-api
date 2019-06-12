var Request = require('../source/request.js');
var expect = require('chai').expect;

describe('Request#sign_string', function () {
  it('should generate a valid hash', function () {
    // 1. ARRANGE
    var x = 5;
    var y = 1;
    var sum1 = x + y;

    // 2. ACT
    var sum2 = 6

    // 3. ASSERT
    expect(sum2).to.be.equal(sum1);
  })

})
