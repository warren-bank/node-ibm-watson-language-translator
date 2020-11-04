const https = require('https')

const request = (options, postBody) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = ''

      res.setEncoding('utf8')
      res.on('data', chunk => (data += chunk))
      res.on('end', () => resolve(JSON.parse(data.trim())))
    })

    req.on('error', reject)
    req.write(JSON.stringify(postBody))
    req.end()
  })
}

module.exports = request
