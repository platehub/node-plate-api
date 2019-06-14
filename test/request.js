const Request = require('../source/request.js');
const Connector = require('../source/connector.js');
const expect = require('chai').expect;
const nock = require('nock')


describe('Request', function () {
  before(function(){
    connector = new Connector('mypublickey', 'mysecretkey')
  });

  describe('#signString', function() {
    it('generates a valid hash', function () {
      request = new Request('GET', 'https://www.someurl.com/api/some/path', {paginate_amount: 22}, connector)
      var stringToSign =  'GET\n' +
                            'www.startwithplate.com\n' +
                            '/api/v2/partners/15/sites\n' +
                            'paginate_amount=10&paginate_page=2\n' +
                            'Sun, 06 Nov 1994 08:49:37 GMT'

      var expectedHash = 'FOjhvBsNceYeVNAJtneSLUeYbNO133Gj1sx+aEu7I8A2ixH3VyYpc6PtxGDGVzpG1EPrDaL7sgurV2Q0+8BHDQ=='
      var generatedHash = request.signString(stringToSign);

      expect(generatedHash).to.equal(expectedHash);
    })
  });

  describe('#stringToSign', function(){
    it('generates a valid string to sign for a GET request', function(){
      var request = new Request('GET', 'https://www.someurl.com/api/some/path', {paginate_amount: 22}, connector)

      var dateString = 'Sun, 06 Nov 1994 08:49:37 GMT';
      var expectedStringToSign = 'GET\n' +
                                    'www.someurl.com\n' +
                                    '/api/some/path\n' +
                                    'paginate_amount=22\n' +
                                    dateString

      var generatedStringToSign = request.stringToSign(dateString);

      expect(generatedStringToSign).to.equal(expectedStringToSign)
    });

    it('generates a valid string to sign for a POST request', function(){
      var request = new Request('POST', 'https://www.someurl.com/api/some/path', {paginate_amount: 22}, connector)

      var dateString = 'Sun, 06 Nov 1994 08:49:37 GMT';
      var expectedStringToSign = 'POST\n' +
                                    'www.someurl.com\n' +
                                    '/api/some/path\n' +
                                    '\n' +
                                    dateString

      var generatedStringToSign = request.stringToSign(dateString);

      expect(generatedStringToSign).to.equal(expectedStringToSign)
    });

  });

  describe('#execute', function(){
    beforeEach(function(){
      orignalDateToUTCString = Date.toUTCString
      Date.toUTCString = function () {
        return 'Sun, 06 Nov 1994 08:49:37 GMT';
      }
    });

    afterEach(function(){
      Date.toUTCString = orignalDateToUTCString;
    });


    it('calls the url with correct headers', async function(){
      const scope = nock('http://www.startwithplate.com', {
        reqheaders: {
          'Date': 'Sun, 06 Nov 1994 08:49:37 GMT',
          'Authorization': 'hmac mypublickey:FOjhvBsNceYeVNAJtneSLUeYbNO133Gj1sx+aEu7I8A2ixH3VyYpc6PtxGDGVzpG1EPrDaL7sgurV2Q0+8BHDQ=='
        }
      })
      .get('/api/v2/partners/15/sites?paginate_amount=10&paginate_page=2')
      .reply(200, {
        data: {
          success: true
        },
      });

      var request = new Request(
        'GET',
        'http://www.startwithplate.com/api/v2/partners/15/sites',
        {paginate_amount:10, paginate_page:2},
        connector
      );
      await request.execute()
      expect(scope.isDone()).to.equal(true);
    });

  });
})
