const Request = require('../source/request.js');
const Connector = require('../source/connector.js');
const expect = require('chai').expect;
const nock = require('nock')


describe('Request', function () {
  before(function(){
    connector = new Connector("mypublickey", "mysecretkey")
  });

  describe('#sign_string', function() {
    it('generates a valid hash', function () {
      request = new Request("GET", "https://www.someurl.com/api/some/path", {paginate_amount: 22}, connector)
      var string_to_sign =  "GET\n" +
                            "www.startwithplate.com\n" +
                            "/api/v2/partners/15/sites\n" +
                            "paginate_amount=10&paginate_page=2\n" +
                            "Sun, 06 Nov 1994 08:49:37 GMT"

      var expected_hash = "FOjhvBsNceYeVNAJtneSLUeYbNO133Gj1sx+aEu7I8A2ixH3VyYpc6PtxGDGVzpG1EPrDaL7sgurV2Q0+8BHDQ=="
      var generated_hash = request.sign_string(string_to_sign);

      expect(generated_hash).to.equal(expected_hash);
    })
  });

  describe('#string_to_sign', function(){
    it('generates a valid string to sign for a GET request', function(){
      var request = new Request("GET", "https://www.someurl.com/api/some/path", {paginate_amount: 22}, connector)

      var date_string = "Sun, 06 Nov 1994 08:49:37 GMT";
      var expected_string_to_sign = "GET\n" +
                                    "www.someurl.com\n" +
                                    "/api/some/path\n" +
                                    "paginate_amount=22\n" +
                                    date_string

      var generated_string_to_sign = request.string_to_sign(date_string);

      expect(generated_string_to_sign).to.equal(expected_string_to_sign)
    });

    it('generates a valid string to sign for a POST request', function(){
      var request = new Request("POST", "https://www.someurl.com/api/some/path", {paginate_amount: 22}, connector)

      var date_string = "Sun, 06 Nov 1994 08:49:37 GMT";
      var expected_string_to_sign = "POST\n" +
                                    "www.someurl.com\n" +
                                    "/api/some/path\n" +
                                    "\n" +
                                    date_string

      var generated_string_to_sign = request.string_to_sign(date_string);

      expect(generated_string_to_sign).to.equal(expected_string_to_sign)
    });

  });

  describe('#execute', function(){
    it('calls the url async', async function(){
      const scope = nock('https://www.someurl.com').log(console.log)
      .get('/api/some/path')
      .reply(200, {
        data: {
          success: true
        },
      });

      var request = new Request("GET", "https://www.someurl.com/api/some/path", {}, connector);
      await request.execute()
      expect(scope.isDone()).to.equal(true);
    });

  });
})
