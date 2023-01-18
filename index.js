const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
// var jwt = require('jsonwebtoken');
const { query } = require('express');
const app = express()
const port = process.env.PORT || 7000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3jlrk4o.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const patientCollection = client.db("healthCare").collection("patients")
        const userCollection = client.db("healthCare").collection("users")

        app.post("/patient",async(req,res)=>{
            const info=req.body;
            const result=await patientCollection.insertOne(info)
            console.log(result)
            res.send(result)
        })
        app.post("/users",async(req,res)=>{
            const info=req.body;
            const result=await userCollection.insertOne(info)
            console.log(result)
            res.send(result)
        })
        app.get("/patients",async(req,res)=>{
            const query={}
            const patients=await patientCollection.find(query).toArray()
            console.log(patients)
            res.send(patients)
        })


        // dashboard user check-----


        app.get("/userTest",async(req,res)=>{
            const email=req.query.email
            console.log(email)
            const query={email:email}
            const patient=await userCollection.findOne(query)
            console.log(patient)
            result= patient?.role === "Patient" ? true: false
            console.log(result)
            res.send(result)
        })


        app.get("/patient/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const patient=await patientCollection.findOne(query)
            console.log(patient)
            res.send(patient)
        })
        app.delete("/patient/:id",async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const result=await patientCollection.deleteOne(query)
            console.log(result)
            res.send(result)
        })
    }finally{

    }
}

run().catch(er=>console.error(er))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })