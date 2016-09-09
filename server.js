var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var bodyParser = require('body-parser')

var co = require('co');
var wrap = require('co-express');
var mongo = require('co-mongodb');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var connectionString = 'mongodb://mongo:27017/test';

co(function* () {
  try {
    db = yield mongo.client.connect(connectionString);
    baskets = db.collection('baskets');

    // res = yield collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }])
    // console.log('insertMany')
    // console.log(res)

    // docs = yield collection.find({}).toArray();
    // console.log('find');
    // console.log(docs);

    //res = yield collection.deleteOne({ a: 2 });
    //res = yield collection.deleteMany({});
    //console.log('deleteMany');
    //console.log(res.result.n);
  } catch (err) {
    console.log(err);
  }
});

// app.get('/', wrap(function* (req, res) {
//   try {
//     contents = yield collection.find({}).toArray();
//     if (req.query.a !== undefined)
//       contents = yield collection.find({ a: parseInt(req.query.a) }).toArray();
//     res.json(contents);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(contents);
//   }
// }));

//Create new basket
app.post('/basket', wrap(function* (req, res) {
  var response = yield baskets.insertOne(req.body)
  res.json(response)
}))

//Retrieve basket using basket_id
app.get('/basket/:id', wrap(function* (req, res) {
  res.json({id: parseInt(req.params.id)})
}))

// app.post('/', wrap(function* (req, res) {
//   try {
//     contents = yield collection.find({}).toArray();
//     console.log(req.body)
//     if (req.body.a !== undefined)
//       contents = yield collection.find({ a: parseInt(req.body.a) }).toArray();
//     res.json(contents);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(contents);
//   }
// }));

// app.get('/:a', wrap(function* (req, res) { 
//   contents = yield collection.find({ a: parseInt(req.params.a) }).toArray();
//   res.json(contents);
// }));

http.listen(3000, function () {
  console.log('listening on *:3000');
});