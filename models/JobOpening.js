const mongoose = require('mongoose');

const jobOpeningSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    salary_range: { type: String, required: true },
    notes: { type: String },
    application_status: { type: String, default: "Pending" },
}, { collection: 'jobOpenings' });

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);

module.exports = JobOpening;