var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')
var bodyParser = require('body-parser')

var co = require('co')
var wrap = require('co-express')
var mongo = require('co-mongodb')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var connectionString = 'mongodb://mongo:27017/test'

co(function* () {
  try {
    db = yield mongo.client.connect(connectionString)
    baskets = db.collection('baskets')
  } catch (err) {
    console.log(err)
  }
})

//Create new basket
app.post('/basket', wrap(function* (req, res) {
  var response = yield baskets.insertOne(req.body)
  res.json(response)
}))

//Retrieve basket using basket_id
app.get('/basket/:id', wrap(function* (req, res) {
  res.json({ id: parseInt(req.params.id) })
}))

http.listen(3000, function () {
  console.log('listening on *:3000')
})