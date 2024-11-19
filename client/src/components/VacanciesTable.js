import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VacanciesTable = () => {
    const [vacancies, setVacancies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newVacancy, setNewVacancy] = useState({
        company: '',
        position: '',
        salary_range: '',
        notes: '',
        application_status: '',
    });


    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const response = await axios.get('http://localhost:3000/jobOpenings');
                setVacancies(response.data);
            } catch (error) {
                console.error('Failed to fetch vacancies:', error);
            }
        };

        fetchVacancies();
    }, []);

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setNewVacancy({ ...newVacancy, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/jobOpenings', newVacancy);
            setVacancies([...vacancies, response.data]);
            setShowForm(false);
            setNewVacancy({
                company: '',
                position: '',
                salary_range: '',
                notes: '',
                application_status: '',
            });
        } catch (error) {
            console.error('Failed to add a vacancy:', error);
        }
    };

    return (
        <div>
            <button className="add-button" onClick={() => setShowForm(true)}>+</button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Company:</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={newVacancy.company}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <div>
                                <label>Position:</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={newVacancy.position}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <div>
                                <label>Salary range:</label>
                                <input
                                    type="text"
                                    name="salary_range"
                                    value={newVacancy.salary_range}
                                    onChange={handleChanges}
                                />
                            </div>
                            <div>
                                <label>Notes:</label>
                                <input
                                    type="text"
                                    name="notes"
                                    value={newVacancy.notes}
                                    onChange={handleChanges}
                                />
                            </div>
                            <div>
                                <label>Application status:</label>
                                <input
                                    type="text"
                                    name="application_status"
                                    value={newVacancy.application_status}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <button type="submit">Add vacancy</button>
                        </form>
                    </div>
                </div>
            )}

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
                {vacancies.map((vacancy) => (
                    <tr key={vacancy._id}>
                        <td>{vacancy.company}</td>
                        <td>{vacancy.position}</td>
                        <td>{vacancy.salary_range}</td>
                        <td>{vacancy.notes}</td>
                        <td>{vacancy.application_status}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VacanciesTable;