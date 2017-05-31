const fs = require('fs')
const path = require('path')
const dbPath = path.join(__dirname, '/database.json')

let products = []
// let count = 1

// function dbFileNotExist () {
//   if (fs.existsSync(dbPath)) {
//     console.log('exists')
//     return false
//   } else {
//     console.log('NOT EXISTS')
//     return true
//   }
// }

function getProducts () {
  // dbFileNotExist()
  // if (dbFileNotExist) {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '[]')
    return []
  }

  let json = fs.readFileSync(dbPath).toString() || '[]'
  let products = JSON.parse(json)
  return products
}

function saveProducts (products) {
  let json = JSON.stringify(products)
  fs.writeFileSync(dbPath, json)
}

module.exports.products = {}

module.exports.products.getAll = getProducts

module.exports.products.add = (product) => {
  let products = getProducts()
  product.id = products.length + 1
  products.push(product)
  saveProducts(products)
}

module.exports.products.findByName = (name) => {
  for (let p of products) {
    if (p.name === name) return p
  }
  return null
}
