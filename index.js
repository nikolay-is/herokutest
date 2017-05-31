const http = require('http')
const port = process.env.PORT || 3000

const handlers = require('./handlers')

http.createServer((req, res) => {
  for (let handler of handlers) {
    if (!handler(req, res)) {
      break
    }
  }
  // res.writeHead(200, {
  //   'Content-Type': 'text/plain'
  // })
  // res.write('Server working')
  // res.end()
}).listen(port)

console.log('Server listening on port 3000')
