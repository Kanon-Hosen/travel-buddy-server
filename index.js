const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config()

const port = process.env.PORT || 4000;

// * Mongobd connect:::::::::::::::::::::
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.we2oxi5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })

const dbConnect = () => {
    try {
        client.connect();
        console.log("Database Connected")
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect()

const Services = client.db('ServicesDB').collection('services');

app.post('/services', async (req, res) => {
    try {
        const body = req.body;

        const service = await Services.insertOne(body);
        
        if (service.insertedId) {
            res.send({
                success: true,
                message:"succesfully added"
            })
        }
        else {
            res.send({
                success: false,
                message:"Unsuccessfull"
            })
        }
    } catch (error) {
        res.send({
            success: true,
            message:error.message
        })
    }
})

app.delete('/service/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const service = await Services.deleteOne({ _id: ObjectId(id) });
        if (service.deletedCount) {
            res.send({
              success: true,
              message: "Delete Successfully",
            });
          }
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})
// * service get::::::::::::::::::::::::::::
app.get('/services', async (req, res) => {
    try {
        const cursor = Services.find({});
        const services = await cursor.toArray();
        res.send({
            success: true,
            message: "Success",
            data:services
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
            data:[]
        })
    }
})

app.patch('/service/:id', async (req, res) => {

    try {
        const id = req.params.id;
            const result = await Services.updateOne({ _id: ObjectId(id) }, { $set: req.body })
            if (result.matchedCount) {
                res.send({
                  success: true,
                  message: "Update successfully",
                });
              } else {
                res.send({
                  success: false,
                  message: "Update unsuccessfull",
                });
              }
        } catch (error) {
            res.send({
                success: false,
                message: 'Unsuccessfull'
            })
        }
})

app.get('/services/:id', async (req, res) => {
    const id = req.params.id;

    const service = await Services.findOne({_id: ObjectId(id)});
    res.send(service)
})

// Review ::::::::::::::::::::::::::::::::::::::::::::::::::

const Review = client.db('ServicesDB').collection('review')

app.post('/review', async(req, res) => {
    const review = await Review.insertOne(req.body)
    res.send(review)
})

app.get('/review/:id', async (req, res) => {
    const id = req.params.id;
    const cursor = Review.find({reviewSerId: id});
    const review = await cursor.toArray();
    res.send(review);
})
app.get('/editreview/:id', async (req, res) => {
    const id = req.params.id;
    const cursor = await Review.findOne({_id: ObjectId(id)});
    res.send(cursor);
})
app.patch('/editreview/:id', async (req, res) => {

    try {
    const id = req.params.id;
        const result = await Review.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        if (result.matchedCount) {
            res.send({
              success: true,
              message: "Update successfully",
            });
          } else {
            res.send({
              success: false,
              message: "Update unsuccessfull",
            });
          }
    } catch (error) {
        res.send({
            success: false,
            message: 'Unsuccessfull'
        })
    }
})

app.get('/', (req, res) => {
    res.send('Server started successfully');
})

app.listen(port, () => {
    console.log('Server started on port', port)
})