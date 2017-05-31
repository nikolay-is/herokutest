const fs = require('fs')
const url = require('url')
const path = require('path')
const formidable = require('formidable')
let database = require('../database/storage')

function makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

module.exports = (req, res) => {
  req.pathname = req.pathname || url.parse(req.url).pathname

  if (req.pathname === '/images/upload' && req.method === 'GET') {
    // let filePath = path.normalize(path.join(__dirname, '../public/views/images/image-upload-form.html'))
    let filePath = path.normalize(path.join(__dirname, '../public/views/images/image-upload-form.html'))
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, 'image-upload-form.html file not found', {
          'Content-Type': 'text/plain'
        })
        res.write('404 Not found!')
        res.end()
        return
      }

      res.writeHead(200, {
        'Content-Type': 'text/html'
      })
      res.write(data)
      res.end()
    })
  } else if (req.pathname === '/images/upload' && req.method === 'POST') {
    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err)
        return
      }

      let uploadFile = files['upload']
      if (uploadFile.type !== 'image/jpeg') {
        res.write('Upload only .jpg or .jpeg files please!')
        res.end()
        return
      }

      let name = fields['name']
      let ext = uploadFile.name.split('.').pop().toLowerCase()
      let publicImg = fields['public'] === 'public'

      let dir = '/content/images/' + (database.getLen() + 1) % 1000 //  + '/' // + '\\'
      let dirPath = path.resolve('.' + dir)
      let randomFileName = makeid() + '.' + ext
      let filePath = dir + '/' + randomFileName
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
      }
      let readStream = fs.createReadStream(uploadFile.path)
      let writeStream = fs.createWriteStream('.' + filePath)
      readStream.on('data', (data) => {
        writeStream.write(data)
      })
      readStream.on('end', () => {
        let image = {
          name: name || randomFileName,
          url: filePath,
          public: publicImg
        }
        database.add(image)
        res.writeHead(302, {
          'Location': '/'
        })
        res.end()
      })
    })
  } else {
    return true
  }
}
