const homeHandler = require('./home')
const staticFilesHandler = require('./static-files')
const imageUploadHandler = require('./image-upload')
const imageDetailsHandler = require('./image-details')
const statusHeaderHandler = require('./status-header')

module.exports = [statusHeaderHandler, homeHandler, imageUploadHandler, imageDetailsHandler, staticFilesHandler]
