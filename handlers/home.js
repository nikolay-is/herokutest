const fs = require('fs')
const path = require('path')
const url = require('url')
let database = require('../database/storage')

module.exports = function (req, res) {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/' && req.method === 'GET') {
    // let filePath = path.normalize(path.join(__dirname, '../views/home/index.html'))
    let filePath = path.normalize(path.join(__dirname, '../public/views/home/index.html'))

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, 'Index.html not found', {
          'Content-Type': 'text/plain'
        })
        res.write('404 Not found')
        res.end()
        return
      }

      let imagesData = database.getAll()
      let result = ''
      let hiddenImages = ''
      result += '<ul>'

      for (let i = 0; i < imagesData.length; i++) {
        let image = imagesData[i]

        let imgUrl = /[^/]*$/.exec(image.url)[0]
        if (image.public) {
          result += `
            <li>
              <a href="images/details/${imgUrl}/${i + 1}">${image.name}</a>
            </li>`
        } else {
          hiddenImages += `
            <p>/images/details/${imgUrl}/${i + 1}</p>
            `
        }
      }
      result += '</ul>'

      if (hiddenImages !== '') {
        result += `</br>Hidden Images:` + hiddenImages
      }

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
