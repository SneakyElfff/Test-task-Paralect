const express = require('express');
const router = express.Router();
const JobOpening = require('../models/JobOpening');

// get all vacancies
router.get('/', async (request, response) => {
    try {
        const jobOpenings = await JobOpening.find();
        response.status(200).json(jobOpenings);
    } catch (err) {
        response.status(500).json({ error: 'Failed to fetch job openings', details: err.message });
    }
});

// add a new vacancy
router.post('/', async (request, response) => {
    try {
        const jobOpening = new JobOpening(request.body);
        await jobOpening.save();
        response.status(201).json(jobOpening);
    } catch (err) {
        response.status(400).json({ error: 'Failed to add a job opening' });
    }
});

// update an existing vacancy
router.put('/:id', async (request, response) => {
    try {
        const jobOpening = await JobOpening.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
        });
        response.status(200).json(jobOpening);
    } catch (err) {
        response.status(400).json({ error: 'Failed to update a job opening' });
    }
});

// delete the vacancy
router.delete('/:id', async (request, response) => {
    try {
        await JobOpening.findByIdAndDelete(request.params.id);
        response.status(200).json({ message: 'Job opening deleted successfully' });
    } catch (err) {
        response.status(400).json({ error: 'Failed to delete a job opening' });
    }
});

module.exports = router;