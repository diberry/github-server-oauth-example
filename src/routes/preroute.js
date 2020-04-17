const path = require('path');
const preroute = (req, res, next) => {

    console.log(`preroute - ${req.session.id} - [${req.path}] - ${JSON.stringify(req.session)}`)

    next()
}

const errorHandling  =  ((err, req, res, next) => {

  console.log(`postroute error - ${err}`)

    if (res.headersSent) {
      return next(err)
    }
    res.status(500)

    const filePath =path.join(__dirname,'../public/error.html');
    res.sendFile(filePath)
  })

  module.exports = {
    preroute,
    errorHandling
  }