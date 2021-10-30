const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

//Midlewere
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kynb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const tourCollection = client.db("dreamtour").collection("tours");
    const allbookingCollection = client.db("dreamtour").collection("allbooking");
    
    console.log("database connect")

    // Insert Tour Data
    app.post("/addtours", async (req, res) => {
        console.log(req.body);
        const result = await tourCollection.insertOne(req.body);
        console.log(result);
    });
    // Insert booking
    app.post("/addbooking", async (req, res) => {
        console.log(req.body);
        const result = await allbookingCollection.insertOne(req.body);
        console.log(result);
    });
    // get all Tours 
    app.get("/alltoursshow", async (req, res) => {
        const result = await tourCollection.find({}).toArray();
        res.send(result);
    });
    // get all Booking  
    app.get("/allbooking", async (req, res) => {
        const result = await allbookingCollection.find({}).toArray();
        res.send(result);
    });
    // get Single details Tours
    app.get("/detailsTour/:id", async (req, res) => {
        
        const result = await tourCollection.find({ _id: ObjectId(req.params.id) }).toArray();
        res.send(result[0]);
    });
    // get user booking details
    app.get("/myOrder/:email", async (req, res) => {
        const result = await allbookingCollection.find({ email:(req.params.email)}).toArray();
        res.send(result);
    });
    // delete user booking
    app.delete("/deleteBooking/:id", async (req, res) => {
        const result = await allbookingCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });

    // client.close();
});

app.get("/", (req, res) => {
    res.send("Wellcome to Running Server ");
});
app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})