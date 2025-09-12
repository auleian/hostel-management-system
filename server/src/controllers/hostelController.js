const express = require('express')
import express from 'express';
import Hostel from '../models/hostel.js';


//function to create a new hostel
export const addHostel = async (req, res) => {
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

export const updateHostel = async (req, res) => {
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

}


//function to get hostel by id
export const getHostel = async (req, res, next) => {
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
