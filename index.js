const  express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

// data bse code 


const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.mbvqn67.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const blogCollection = client.db('blogDB').collection('blog')
    const commentCollection = client.db('blogDB').collection('comment')
 

// add blog api
app.post('/blog', async (req, res) => {
  const newBlog = req.body;
  console.log(newBlog);
  
  // Insert the new blog post
  const blogResult = await blogCollection.insertOne(newBlog);

  // Fetch recent blog posts
  const cursor = blogCollection.find().sort({ date: -1 }).limit(6); // Assuming 'date' field for sorting
  const recentBlogs = await cursor.toArray();

  // Send both the result of the blog insertion and the recent blog posts in the response
  res.send({ blogResult, recentBlogs });
});

// get recent blog posts
app.get('/blog', async (req, res) => {
  const cursor = blogCollection.find().sort({ date: -1 }).limit(6); // Assuming 'date' field for sorting
  const result = await cursor.toArray();
  res.send(result);
});








// get a specific blog id api
app.get('/blog/:id',async(req,res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId (id)}
  const result =  await blogCollection.findOne(query)
  res.send(result)
})


// // // // comment blog api
app.post('/comment',async(req,res)=>{
  const newComment = req.body;
  console.log(newComment)
  const result = await commentCollection.insertOne(newComment)
  res.send(result)
  
})

// // // comment data show api
app.get('/comment',async(req,res)=>{
    const cursor = commentCollection.find();
    const result = await cursor.toArray();
    res.send(result)
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
