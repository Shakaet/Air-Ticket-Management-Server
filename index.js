const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
var cors = require('cors')
app.use(cors())
app.use(express.json());

// Air-Ticket
// ir3UwPDlD2HSVpd1

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Air-Ticket:ir3UwPDlD2HSVpd1@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    const database = client.db("AirTicket");
    const userCollection = database.collection("users");
    



    app.post("/users",async(req,res)=>{

        let userData=req.body

        console.log(userData)

        let user_email=userData.user_email
      let query= {user_email}

      let existingUser= await userCollection.findOne(query)
      if(existingUser){
        return res.status(404).send({message:"Users already existed"})
      }
      const result = await userCollection.insertOne(userData);
      res.send(result)
    })

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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})