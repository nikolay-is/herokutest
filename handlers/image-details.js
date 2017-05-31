const fs = require('fs')
const path = require('path')
const url = require('url')
let database = require('../database/storage')

module.exports = function (req, res) {
  req.pathname = req.pathname || url.parse(req.url).pathname
  if (req.pathname.startsWith('/images/details/') && req.method === 'GET') {
    let result = req.pathname.split('/')
    let index = result[result.length - 1]
    let totalLen = database.getLen()
    if (!index || index > totalLen || index < 0) {
      res.end()
      return true
    }

    let filePath = path.normalize(path.join(__dirname, '../public/views/images/image-details.html'))
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, 'image-details.html not found', {
          'Content-Type': 'text/plain'
        })
        res.write('404 Not found')
        res.end()
        return
      }

      let image = database.getAt(index)

      let result = `<img src="${image.url}" alt="${image.name}">`
      let html = data.replace('{{content}}', result)

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(html)
      res.end()
    })
  } else {
    return true
  }
}
