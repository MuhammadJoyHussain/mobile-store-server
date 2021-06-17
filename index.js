const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
require('dotenv').config()


const port = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9eao.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("freshValley").collection("products");
  const orderCollection = client.db("freshValley").collection("orders");
  const adminCollection = client.db("freshValley").collection("admins");
  


app.get('/product', (req, res)=>{
    productCollection.find({})
    .toArray((err, items) => {
        res.send(items);
    })
})

app.get('/product/:id', (req, res)=>{
    const id = ObjectID(req.params.id)
    productCollection.find({_id:id})
    .toArray((err, items) => {
        res.send(items);
    })
})


app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
})

app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then(documents => res.send(!!documents.deletedCount))
  })

  app.post('/addOrder', (req, res) =>{
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
})
 

app.post('/isAdmin', (req, res) =>{
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
})

app.get('/orders', (req, res)=>{
    orderCollection.find()
    .toArray((err, items) => {
        res.send(items);
    })
})

app.get('/isAdmin', (req, res) => {
    console.log(req.query);
    adminCollection.find({ email: req.query.email })
        .toArray((err, docs) =>{ res.send(!!docs.length)
        })
})

});


app.listen(process.env.PORT || port)