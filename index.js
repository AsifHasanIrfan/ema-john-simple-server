const express = require('express');
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iq5lz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    collection.insertOne(products)
    .then(result => {
      console.log(result.insertedContent)
      res.send(result.insertedContent)
    })
  })

  app.get('/products', (req, res) => {
    collection.find({}).limit(20)
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    collection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })
  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    collection.find({key: {$in: productKeys}})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedContent > 0)
    })
  })

});




app.listen(5000);