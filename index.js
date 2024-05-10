const  express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');


const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// data bse code 

const uri = "mongodb+srv://myblog:fXzMMGIdOcIamrwc@cluster0.mbvqn67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS} @cluster0.mbvqn67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
  
     

// add blog api
app.post('/blog',async(req,res)=>{
    const newBlog = req.body;
    console.log(newBlog)
    
})









// basic api
app.get('/',(req,res)=>{
    res.send('blog server is running')
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













app.listen(port,()=>{
    console.log(`server is running this port: ${port}`)
})
