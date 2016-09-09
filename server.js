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
      return false;
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
app.post('/basket', wrap(function* (req, res) {
  console.log("Inside app.post('/basket')");
  res.json(yield baskets.insertOne(req.body))
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Retrieve basket with basket items based on criteria (basket_id)
app.get('/basket/:basketid', wrap(function* (req, res) {
  console.log("Inside app.get('/basket/:basketid')");
  var resp = yield baskets.find({ id: parseInt(req.params.basketid) }).toArray()
  res.json(resp[0])
}))

//Add an item(product) to the basket
app.post('/basket/:basketid/addProduct', wrap(function* (req, res) {
  console.log(validateProduct(req.body));
  res.json({})
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Get an item(product) from the basket
app.get('/basket/:basketid/addProduct', wrap(function* (req, res) {
  console.log(validateProduct(req.body));
  res.json({})
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Remove an item(product) from the basket
app.delete('/basket/:basketid/removeProduct', wrap(function* (req, res) {
  //console.log(validateProduct(req.body));
  res.json({})
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))

//Checkout -> Just show basket total
app.get('/basket/:basketid/checkout', wrap(function* (req, res) {
  //console.log(validateProduct(req.body));
  res.json({})
  //var response = yield baskets.insertOne(req.body)
  //res.json(response)
}))



http.listen(3000, function () {
  console.log('listening on *:3000')
})