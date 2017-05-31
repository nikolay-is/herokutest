const url = require('url')
// const database = require('../config/database')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty')
const shortid = require('shortid')

const Product = require('../models/Product')

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/product/add' && req.method === 'GET') {
    let filepath = path.normalize(path.join(__dirname, '../views/products/add.html'))
    fs.readFile(filepath, (err, data) => {
      if (err) {
        console.log(err)
        res.writeHead(404, 'add.html file not found', {'Content-Type': 'text/plain'})
        res.write('404 Not found!')
        res.end()
        return
      }

      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write(data)
      res.end()
    })
  } else if (req.pathname === '/product/add' && req.method === 'POST') {
    let form = new multiparty.Form()
    let product = {}

    form.on('part', (part) => {
      if (part.filename) {
        let dataString = ''

        part.setEncoding('binary')
        part.on('data', (data) => {
          dataString += data
        })

        part.on('end', () => {
          let fileName = shortid.generate()// + path.extname(part.filename)
          let filePath = '/content/images/' + fileName

          product.image = filePath
          fs.writeFile(
            `.${filePath}`, dataString, {encoding: 'ascii'}, (err) => {
              if (err) {
                console.log(err)
                // return
              }
            }
          )
        })
      } else {
        part.setEncoding('utf-8')
        let field = ''
        part.on('data', (data) => {
          field += data
        })

        part.on('end', () => {
          console.log(part.name)
          product[part.name] = field
        })
      }
    })

    form.on('close', () => {
      // database.products.add(product)
      Product.create(product).then(() => {
        res.writeHead(302, {
          Location: '/'
        })
        res.end()
      })
    })
    form.parse(req)
  } else {
    return true
  }
}
