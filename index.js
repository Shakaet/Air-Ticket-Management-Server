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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const flightsDB = database.collection("flightsDB");
    const bookedDB = database.collection("bookedDB");

    app.get("/users/admin/:email",async(req,res)=>{

      let user_email=req.params.email

     
      let query={user_email}
      let user= await userCollection.findOne(query)

      let admin=false
      if(user){
        admin= user?.role === "admin"
      }

      res.send({ admin })


    })

    app.get("/users/user/:email",async(req,res)=>{

      let user_email=req.params.email

     
      let query={user_email}
      let users= await userCollection.findOne(query)

      let user=false
      if(users){
        user= users?.role === "user"
      }

      res.send({ user })


    })

    


  app.get("/flightsDetails/:id",async(req,res)=>{

    let idx=req.params.id

    let query={_id:new ObjectId(idx)}

        let result= await flightsDB.findOne(query)
        res.send(result)
   })

  app.get("/allflights",async(req,res)=>{

    let result= await flightsDB.find().toArray()
    res.send(result)
  })

  app.get("/bookedData",async(req,res)=>{

    

    let result= await bookedDB.find().toArray()
    res.send(result)
  })

  app.patch("/bookings/:id",async(req,res)=>{

    let idx=req.params.id
    let query={_id:new ObjectId(idx)}
    const updateDoc = {
      $set: {
        status:"approved"
      },
    };
    let result= await bookedDB.updateOne(query, updateDoc);
    res.send(result)

  })


  app.get("/bookedData/:email",async(req,res)=>{

    let email=req.params.email
    let query={email}

    let result= await bookedDB.find(query).toArray()
    res.send(result)
  })

  app.delete("/bookedData/:id",async(req,res)=>{

    let idx=req.params.id

    let flightId = req.query.flight_id;

    // console.log(flightId)

    let query={_id:new ObjectId(idx)}
    let filter={_id:new ObjectId(flightId)}
    const updateDoc = {
      $set: {
        status:"available"
      },
    };
    await flightsDB.updateOne(filter, updateDoc);

    const result = await bookedDB.deleteOne(query);
    res.send(result)


  })


  app.post("/bookedData",async(req,res)=>{

    let bookData=req.body
    // console.log(bookData)

    let idx=bookData.flight_id

    let query={_id:new ObjectId(idx)}

    const updateDoc = {
      $set: {
        status:"unavailable"
      },
    };
    await flightsDB.updateOne(query, updateDoc);

    const result = await bookedDB.insertOne(bookData);
      res.send(result)

  })


  app.get("/users",async(req,res)=>{

    let result=await userCollection.find().toArray()
    res.send(result)
  })

  app.patch("/users/:id",async(req,res)=>{

    let idx = req.params.id;
    let query = { _id: new ObjectId(idx)};
    let { role } = req.body;
    const updateDoc = {
      $set: {role} // Corrected structure
  };

  let result = await userCollection.updateOne(query, updateDoc);
  res.send(result);
      
  })

    app.post("/users",async(req,res)=>{

        let userData=req.body

        // console.log(userData)

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