const express = require('express')
const exphbs = require('express-handlebars')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const dateRange = require('./dateRange')

const url = "mongodb://root:password@localhost:27017"

const app = express()
app.use(express.json())

const port = 3000

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(cors())
app.options('*', cors())

app.get('/hotels', async (request, response) => {
    const connection = await MongoClient.connect(url)
    const db = connection.db('seal')
    const collection = db.collection('hotels')
    let start = new Date(request.query.checkin)
    let end = new Date(request.query.checkout)
    const data = await collection.find({'booked':
            {$not:
                    {$in:
                            [
                                start,
                                end
                            ]
                    }
            }}).toArray()
    response.json(data)
})

app.post('/hotels/:id', async (request, response) => {
    const connection = await MongoClient.connect(url)
    const db = connection.db('seal')
    const collection = db.collection('hotels')
    let userName = request.body.name
    let userEmail = request.body.email
    let userAdult_guests = request.body.adult_guests
    let userChild_guests = request.body.child_guests
    let userCheckinDate = request.body.checkin
    let userCheckoutDate = request.body.checkout
    let bookedDates = dateRange(userCheckinDate, userCheckoutDate)
    const newBooking = await collection.updateOne({_id: ObjectId(request.params.id)},{$push: {bookings: {name: userName, email: userEmail, checkin: userCheckinDate, checkout: userCheckoutDate, adult_guests: userAdult_guests, child_guests: userChild_guests}}})
    const newBookedDates = await collection.updateOne({_id: ObjectId(request.params.id)},{$push: {booked: {$each: bookedDates}}})
    response.json({success: newBooking.modifiedCount === 1})
    response.json({success: newBookedDates.modifiedCount === 1})
})

app.listen(port, () => {
    console.log('Server running')
})