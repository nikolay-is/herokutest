const fs = require('fs')
const path = require('path')
const url = require('url')
const zlib = require('zlib')

function getContentType (url) {
  let contentType = 'undefined'
  if (url.endsWith('.html')) contentType = 'text/html'
  else if (url.endsWith('.css')) contentType = 'text/css'
  else if (url.endsWith('.js')) contentType = 'application/javascript'
  else if (url.endsWith('.jpg')) contentType = 'image/jpeg'
  else if (url.endsWith('.ico')) contentType = 'image/x-icon'
  return contentType
}

let validateFileExtension = (path) => {
  if (path.endsWith('.html') ||
  path.endsWith('.css') ||
  path.endsWith('.js') ||
  path.endsWith('.jpg') ||
  path.endsWith('.ico')) {
    return true
  }

  return false
}

module.exports = function (req, res) {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname.startsWith('/content/') && req.method === 'GET' &&
  validateFileExtension(req.pathname)) {
    let filePath = path.normalize(path.join(__dirname, `..${req.pathname}`))

    console.log(`file with gzip compression: ${req.pathname}`)
    let readStream = fs.createReadStream(filePath)
    let gzip = zlib.createGzip()

    res.writeHead(200, {
      'Content-Type': getContentType(req.pathname),
      'Content-Encoding': 'gzip'
    })
    readStream.pipe(gzip).pipe(res)

    // fs.readFile(filePath, (err, data) => {
    //   if (err) {
    //     res.writeHead(404, 'Resource not found', {
    //       'Content-Type': 'text/plain'
    //     })
    //     res.write(`Resource ${req.pathname} not found`)
    //     res.end()
    //     return
    //   }

    //   res.writeHead(200, {
    //     'Content-Type': getContentType(req.pathname)
    //   })
    //   res.write(data)
    //   res.end()
    // })
  } else {
    res.writeHead(404, '404 Not found', {
      'Content-Type': 'text/plain'
    })
    res.write('404 Not found! - from static-files')
    res.end()
  }
}
