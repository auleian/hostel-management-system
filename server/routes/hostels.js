const express = require('express')
const router = express.Router()

//getting all hostels
router.get('/', (req, res) => {
  res.send('List of all hostels')
})

//getting a specific hostel
router.get('/:id', (req, res) => {
  res.send(`Get hostel with ID ${req.params.id}`)
})

module.exports = router