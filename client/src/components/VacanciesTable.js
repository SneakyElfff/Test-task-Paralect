import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobTable = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/jobOpenings');
                setJobs(response.data);
            } catch (error) {
                console.error('Error to fetch jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <table>
            <thead>
            <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Salary range</th>
                <th>Notes</th>
                <th>Application status</th>
            </tr>
            </thead>
            <tbody>
            {jobs.map((job) => (
                <tr key={job._id}>
                    <td>{job.company}</td>
                    <td>{job.position}</td>
                    <td>{job.salary_range}</td>
                    <td>{job.notes}</td>
                    <td>{job.application_status}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default JobTable;