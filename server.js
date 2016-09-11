var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var fs = require('fs')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var expressJWT = require('express-jwt')

var co = require('co')
var wrap = require('co-express')
var mongo = require('co-mongodb')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var connectionString = 'mongodb://mongo:27017/test'

var validateProduct = function (input) {
  var structure = {
    product_id: 'string',
    product_item_type: 'string',
    description: 'string',
    net_price: 'number',
    currency: 'string'
  }

  for (var elem in structure) {
    if (typeof input[elem] !== structure[elem]) {
      console.log(typeof input[elem])
      return false
    }
  }

  return {
    product_id: input['product_id'],
    product_item_type: input['product_item_type'],
    description: input['description'],
    net_price: input['net_price'],
    currency: input['currency']
  }
}

co(function* () {
  try {
    db = yield mongo.client.connect(connectionString)
    baskets = db.collection('baskets')
  } catch (err) {
    console.log(err)
  }
})

//Create a basket with basket items
app.post('/basket', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  console.log("Inside app.post('/basket')")
  res.json(yield baskets.insertOne(req.body))
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Retrieve basket with basket items based on criteria (basket_id)
app.get('/basket/:basketid', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  console.log("Inside app.get('/basket/:basketid')")
  var resp = yield baskets.find({ id: parseInt(req.params.basketid) }).toArray()
  res.json(resp[0])
}))

//Add an item(product) to the basket
app.post('/basket/:basketid/addProduct', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  if (!validateProduct(req.body))
    return res.json({})
  var resp = yield baskets.update({ id: parseInt(req.params.basketid) }, { $push: { 'products': req.body } })
  res.json(resp)
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//TODO It doesn`t works right now
//Get an item(product) from the basket
app.get('/basket/:basketid/getProduct/:itemid', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  console.log("Inside app.get('/basket/:basketid/getProduct/:itemid')")
  var resp = yield baskets.find({ id: parseInt(req.params.basketid), "products.product_id": req.params.itemid }).toArray()
  res.json(resp)
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Remove an item(product) from the basket
app.delete('/basket/:basketid/removeProduct', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  //console.log(validateProduct(req.body))
  res.json({})
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Checkout -> Just show basket total
app.get('/basket/:basketid/checkout', expressJWT({
  secret: 'superSecret'
}), wrap(function* (req, res) {
  //console.log(validateProduct(req.body))
  var totalPrice = 0
  var currentCart = yield baskets.find({ id: parseInt(req.params.basketid) }).toArray()
  for (var product of currentCart[0].products) {
    totalPrice += product.net_price
  }
  res.json({ totalPrice: totalPrice })
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

app.post('/auth', wrap(function* (req, res) {
  console.log(req.body.username, req.body.password)
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    var token = jwt.sign({ username: 'admin' }, 'superSecret', {
      expiresIn: 60 * 15 // expires in 15 minutes
    });
    res.json({ token: token })
  }
  else {
    res.json({ error: 'Invalid credentials' })
  }
}))

http.listen(3000, function () {
  console.log('listening on *:3000')
})