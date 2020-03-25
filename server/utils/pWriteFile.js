var fs = require('fs')

function pWriteFile(filePath, dataBuffer) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, dataBuffer, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

module.exports = pWriteFile;