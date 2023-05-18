const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
require('dotenv').config()
const port = process.env.port || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mz723df.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const musicToysCollection=client.db('music').collection('musicData')

    // get all toy data 
    app.get('/alltoy',async(req,res)=>{
      const cursor =  musicToysCollection.find();
      const result=await cursor.toArray()
      res.send(result);
     })

     //insert toy data
   app.post('/alltoy',async(req,res)=>{
    const toyAdd=req.body;
    console.log(toyAdd)
    const result=await musicToysCollection.insertOne(toyAdd)
    res.send(result)

   })

  


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Musical toy site is running')
})

app.listen(port, () => {
  console.log(`Musical toy listening on port ${port}`)
})