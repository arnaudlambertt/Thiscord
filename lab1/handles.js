const url = require('url');
const qs = require('querystring');
fs = require('fs');

module.exports = {
  serverHandle : function (req, res) {
    const route = url.parse(req.url);
    const path = route.pathname;
    const params = qs.parse(route.query);

    //not asynchronous loading of html files
    var slash = fs.readFileSync('./html/slash.html', 'utf8');
    var errorPage = fs.readFileSync('./html/404.html', 'utf8');

    if (path === '/hello' && 'name' in params) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      if (params['name'] === 'arno')
      {
        res.write('Hello myself');
      }
      else
      {
        res.write('Hello ' + params['name']);
      }
    }
    else if (path === '/') {
        res.write(slash);
    }
    else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write(errorPage);
    }

    res.end();
  }
}
