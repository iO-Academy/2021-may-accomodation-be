const express = require('express')
const exphbs = require('express-handlebars')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

const url = "mongodb://root:password@localhost:27017"

const app = express()
app.use(express.json())

const port = 3000

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.get('/hotels', async (request, response) => {
    const connection = await MongoClient.connect(url)
    const db = connection.db('seal')
    const collection = db.collection('hotels')

    const data = await collection.find({}).toArray()
    response.json(data)
})

app.post('/booking-confirmation', async (request, response) => {
    const connection = await MongoClient.connect(url)
    const db = connection.db('seal')
    const collection = db.collection('bookings')

    const newBooking = await collection.insertOne({booking: request.body.booking})
    response.json({success: newBooking.insertedId !== undefined})
})

app.listen(port, () => {
    console.log('Server running')
})