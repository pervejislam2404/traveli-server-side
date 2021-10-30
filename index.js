const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5040;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvyqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("ALL_TRAVEL_PLACES");
        const AllPlaces = database.collection("places");
        const AllGuides = database.collection("guide");
        const AddedService = database.collection("AddedService");

        app.get('/places', async(req, res) => {
            const query = {};
            const result = await AllPlaces.find(query).toArray();
            res.json(result)
        })

        app.delete('/deleteOne/:id', async(req, res) => {
            const userID = req.params.id;
            // console.log(userID);
            const query = { _id: ObjectId(userID) }
            const result = await AddedService.deleteOne(query);
            res.send(result)
        })

        app.post('/newUser', async(req, res) => {
            const newUser = req.body;
            const result = await AllPlaces.insertOne(newUser);
            res.json(result)
        })

        app.get('/service/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = {
                projection: { _id: 0 },
            };
            const result = await AllPlaces.findOne(query, options);
            res.json(result);
        })


        app.post('/addedService', async(req, res) => {
            const newService = req.body;
            const result = await AddedService.insertOne(newService);
            res.send(result)
        })

        app.get('/guides', async(req, res) => {
            const query = {};
            const result = await AllGuides.find(query).toArray();
            res.json(result);
        })

        app.get('/added/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email: email };

            const result = await AddedService.find(query).toArray();

            res.json(result)
        })


        app.get('/allAddedService', async(req, res) => {
            const query = {};
            const result = await AddedService.find(query).toArray();
            res.json(result);
        })

        app.put('/updateUser/:id', async(req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    status: user.status,
                },
            };
            const result = await AddedService.updateOne(query, updateDoc, options);
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('server running on port ' + port);
});