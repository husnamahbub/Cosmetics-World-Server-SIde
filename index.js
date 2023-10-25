const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const cosmeticsBands = require('./cosmetics.json')


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f6jcw4q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const addCosmeticsCollections = client.db('allCosmetics').collection('addCosmetics');
const selectCosmeticsCollections = client.db('allCosmetics').collection('selectCart');


app.get('/cosmeticsBands', (req, res) => {
    res.send(cosmeticsBands)
})



app.get('/addCosmetics', async(req, res) => {
    const cursor = addCosmeticsCollections.find()
    const result = await cursor.toArray();
    res.send(result)
  })
  
  app.get('/addCosmetics/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id)};
    const result = await addCosmeticsCollections.findOne(query);
    res.send(result);
  })
  app.get('/cosmetics/:brand', async(req, res) => {
    const brand = req.params.brand;
    console.log(brand);
    const query = {brand: brand}
    const result = await addCosmeticsCollections.find(query).toArray();
    res.send(result)
  })
  
  app.put('/addCosmetics/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const option = { upsert: true }
    const updatedProducts = req.body;
    const products = {
        $set: {
          photo: updatedProducts.photo,
            name: updatedProducts.name,
            rating: updatedProducts.rating,
            price: updatedProducts.price,
            brand: updatedProducts.brand,
            category: updatedProducts.category,
            details: updatedProducts.details,
  
        }
    }
    const result = await addCosmeticsCollections.updateOne(filter, products, option);
    res.send(result)
  })


app.post('/addCosmetics', async(req, res) => {
    const cosmetic = req.body;
    const result = await addCosmeticsCollections.insertOne(cosmetic);
    res.send(result)
})

app.post('/selectCart', async(req, res) => {
  const selectCosmetics = req.body;
  const result = await selectCosmeticsCollections.insertOne(selectCosmetics)
  res.send(result);
 })

 app.get('/selectCart', async(req, res) => {
  const cursor = selectCosmeticsCollections.find()
  const result = await cursor.toArray();
  res.send(result);
 })

app.delete('/selectCart/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: id}
  const result = await selectCosmeticsCollections.deleteOne(query)
  res.send(result);
 })


app.get('/', (req, res) => {
    res.send('cosmetics world server is running')
})

app.listen(port, () => {
    console.log(`Cosmetics World Server is running on port: ${port}`)
})