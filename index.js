const { MongoClient } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;

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

        app.get('/service/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await AllPlaces.findOne(query);
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

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('server running on port here' + port);
});