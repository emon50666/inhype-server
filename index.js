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
    const wishlistCollection = client.db('blogDB').collection('wishlist')

 

// add blog api
app.post('/blog', async (req, res) => {
  const newBlog = req.body;
  console.log(newBlog);
  
  const blogResult = await blogCollection.insertOne(newBlog);

 
  const cursor = blogCollection.find().sort({ date: -1 }).limit(6); 
  const recentBlogs = await cursor.toArray();

 
  res.send({ blogResult, recentBlogs });
});

// get recent blog posts
app.get('/blog', async (req, res) => {
  const cursor = blogCollection.find().sort({ date: -1 }).limit(6); 
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



// wishlist 
app.post('/wishlist',async(req,res)=>{
  const newBlog = req.body;
  console.log(newBlog)
  const result = await wishlistCollection.insertOne(newBlog)
  res.send(result)
  
})

// wishlist get api
app.get('/wishlist',async(req,res)=>{
  const cursor = wishlistCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})


app.get('/wishlist/:email',async(req,res)=>{
  console.log(req.params.email)
  const result = await wishlistCollection.find({ userEmail: req.params.email}).toArray()
  res.send(result)
})




// get a specific wishlist id api
// app.get('/wishlist/:id',async(req,res)=>{
//   const id = req.params.id
//   const query = {_id: new ObjectId (id)}
//   const result =  await wishlistCollection.findOne(query)
//   res.send(result)
// })







//  // comment blog api
app.post('/comment',async(req,res)=>{
  const newComment = req.body;
  console.log(newComment)
  const result = await commentCollection.insertOne(newComment)
  res.send(result)
  
})

//  // comment data show api
app.get('/comment',async(req,res)=>{
    const cursor = commentCollection.find();
    const result = await cursor.toArray();
    res.send(result)
})

   // comment specific id api
   app.get('/comment/:id',async(req,res)=>{
    console.log(req.params.id)
    const result = await commentCollection.find({ id: req.params.id}).toArray()
    res.send(result)
  })



  // get e feature blog api
  // app.get('/featureblog',async(req,res)=>{
  //   const description = await blogCollection.find().toArray();
  //   const sortDesc = description.sort((a,b) =>{
  //     console.log(sortDesc)
  //     return b.Description.split(" ").length - a.Description.split(" ").length;

  //   });
    
  //   console.log(description)
  //   console.log(sortDesc)
  //   const topPost = sortDesc.slice(0,10);
  //   res.send(topPost)
  // })




  app.get('/featureblog', async (req, res) => {
    try {
      
      const description = await blogCollection.find().toArray();
  
      
      if (description.length === 0) {
        return res.status(404).json({ error: 'No blog posts found' });
      }
  
    
      const sortedBlogs = description.sort((a, b) => {
        return b.Description.split(" ").length - a.Description.split(" ").length;
      });
  
      
      const topPosts = sortedBlogs.slice(0, 10);
  
    
      res.send(topPosts);
    } catch (error) {
      console.error('Error fetching and sorting blog posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  








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
