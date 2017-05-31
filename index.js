const http = require('http')

const port = 3000

const handlers = require('./handlers')

let environment = process.env.NODE_ENV || 'development'
const config = require('./config/config')
const database = require('./config/database.config')

database(config[environment])

http.createServer((req, res) => {
  for (let handler of handlers) {
    if (!handler(req, res)) {
      break
    }
  }
}).listen(port, (err) => {
  if (err) {
    return console.log(`Server cannot start on port: ${port}`, err)
  }
  console.log(`server is listening on port: ${port}`)
})
