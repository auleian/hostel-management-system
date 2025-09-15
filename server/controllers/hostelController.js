const express = require('express')
const Hostel = require('../models/hostel')



//function to create a new hostel
const addHostel = async (req, res) => {
  const hostel = new Hostel({
    name: req.body.name,
    location: req.body.location,
    description: req.body.description,
    rules: req.body.rules,
    amenities: req.body.amenities,
    genderPolicy: req.body.genderPolicy,
    contactInfo: req.body.contactInfo
  })

  try {
    const newHostel = await hostel.save()
    res.status(201).json(newHostel)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateHostel = async (req, res) => {
    try {
        if (req.body.name != null) {
            res.hostel.name = req.body.name
        }
        if (req.body.location != null) {
            res.hostel.location = req.body.location
        }   
        if (req.body.description != null) {
            res.hostel.description = req.body.description
        }
        if (req.body.rules != null) {
            res.hostel.rules = req.body.rules
        }
        if (req.body.amenities != null) {
            res.hostel.amenities = req.body.amenities
        }
        if (req.body.genderPolicy != null) {
            res.hostel.genderPolicy = req.body.genderPolicy
        }
        if (req.body.contactInfo != null) {
            res.hostel.contactInfo = req.body.contactInfo
        }
        
        const updatedHostel = await res.hostel.save()
        res.json(updatedHostel)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


//function to get hostel by id
const getHostel = async (req, res, next) => {
    let hostel 
    try {
        hostel = await Hostel.findById(req.params.id)
        if (hostel === null) {
            return res.status(404).json({ message: 'Hostel not found' })
        }
    }catch (error) {
        return res.status(500).json({ message: error.message }) 
    }
    res.hostel = hostel
    next()
}
module.exports = { getHostel, addHostel, updateHostel }