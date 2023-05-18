const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
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
    const indexKeys = { toyname: 1 };
    const indexOptions = { name: "toyname" };
    const result = await musicToysCollection.createIndex(indexKeys, indexOptions);
 
    // get all toy data 
    app.get('/alltoy',async(req,res)=>{
      const cursor =  musicToysCollection.find();
      const result=await cursor.toArray()
      res.send(result);
     })

    // show my toy data
    app.get('/mytoy',async(req,res)=>{
     console.log(req.query.email)
     let query={}
     if(req.query?.email){
      query={email:req.query?.email}
     }
    const result=await musicToysCollection.find(query).toArray()
    
      res.send(result)
      // console.log(result)
     })
  

     //find one toy
     app.get('/singletoy/:id',async(req,res)=>{
      console.log(req.params.id);
      const singleToy = await musicToysCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(singleToy);
     })

     //insert toy data
   app.post('/alltoy',async(req,res)=>{
    const toyAdd=req.body;
    console.log(toyAdd)
    const result=await musicToysCollection.insertOne(toyAdd)
    res.send(result)

   })

   //delete single toy data
   app.delete('/mytoy/:id', async(req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await musicToysCollection.deleteOne(query);
    res.send(result);
})

// search toy's data by name 
app.get("/searchToys/:txt", async (req, res) => {
  const searchToy = req.params.txt;
  const result = await musicToysCollection
    .find({
       $or:[
        {
          toyname: { $regex: searchToy, $options: "i" } ,

        }
       ]
      
    })
    .toArray();
  res.send(result);
});

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