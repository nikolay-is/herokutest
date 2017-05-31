
const fs = require('fs')
// const path = require('path')
// const dataFileName = './storage.json'
const dataFileName = './database/storage.json'


let imageData = []

function loadDataFromFile () {
  if (!fs.existsSync(dataFileName)) {
    // console.log(`--------------- imageData: ${imageData}`)
    imageData = []
    fs.writeFileSync(dataFileName, imageData)
    // console.log('-----------------------')
    return imageData
  } else {
    let jsonData = fs.readFileSync(dataFileName, 'utf8').toString() || '[]'
    imageData = JSON.parse(jsonData)
    return imageData
  }
}

function saveDataToFile (data) {
  let jsonData = JSON.stringify(data)
  fs.writeFileSync(dataFileName, jsonData, {encoding: 'utf8'})
}

module.exports = {
  add: (image) => {
    imageData = loadDataFromFile()
    image.id = imageData.length + 1
    imageData.push(image)
    saveDataToFile(imageData)
  },
  getAll: () => {
    return loadDataFromFile()
  },
  getAt: (index) => {
    return loadDataFromFile()[index - 1]
  },
  getLen: () => {
    imageData = loadDataFromFile()
    return imageData.length
  }
}

// let data = []

// module.exports = {
//   save: (image) => {
//     data.push(image)
//   },
//   getAll: () => {
//     return data.slice(0)

//   },
//   getAt: (index) => {
//     return data[index - 1]
//   },
//   getLen: () => {
//     return data.length
//   }
// }
