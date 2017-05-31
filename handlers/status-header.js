const fs = require('fs')
const url = require('url')
const path = require('path')
let database = require('../database/storage')

module.exports = (req, res) => {
  let statusHeader = req.headers['statusheader']
  if (statusHeader && statusHeader === 'Full') {
    req.pathname = req.pathname || url.parse(req.url).pathname
    let filePath = path.normalize(path.join(__dirname, '../public/views/images/status-header.html'))
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        return
      }

      let totalImages = database.getAll().length

      let html = data
        .replace('{{content}}', `<h1>Total images - ${totalImages}</h1`)
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
