const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/hostel-management')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {console.log('Connected to the database')})

app.use(express.json())

const hostelRouter = require('./routes/hostels')
app.use('/hostels', hostelRouter)

app.listen(5000, () => {
  console.log('Server is running on port 5000')
})