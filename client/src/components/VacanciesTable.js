import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiBaseUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const VacanciesTable = () => {
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errorPopup, setErrorPopup] = useState({ visible: false, message: '' });

    const initialVacancyState = {
        company: '',
        position: '',
        salary_range: '',
        notes: '',
        application_status: '',
    };

    useEffect(() => {
        const fetchVacancies = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/jobOpenings`);
                setVacancies(response.data);
            } catch (error) {
                console.error('Failed to fetch vacancies:', error);

                setErrorPopup({ visible: true, message: 'Failed to fetch vacancies. Please try again later.' });

            }
        };

        fetchVacancies();
    }, []);

    const handleRowClick = (vacancy) => {
        if (selectedVacancy && selectedVacancy._id === vacancy._id) {
            setSelectedVacancy(null);
        } else {
            setSelectedVacancy(vacancy);
        }
    };

    const handleEditing = () => {
        if (selectedVacancy) {
            setShowForm(true);
            setIsEditing(true);
        } else {
            alert('Please select a row to edit.');
        }
    };

    const handleAdding = () => {
        setSelectedVacancy(initialVacancyState);
        setShowForm(true);

        setIsEditing(false);
    };

    const handleDeleting = async () => {
        if (selectedVacancy) {
            if (window.confirm('Are you sure you want to delete this vacancy?')) {
                try {
                    await axios.delete(`${apiBaseUrl}/jobOpenings/${selectedVacancy._id}`);
                    setVacancies((prev) => prev.filter((vacancy) => vacancy._id !== selectedVacancy._id));
                    setSelectedVacancy(null);
                } catch (error) {
                    console.error('Failed to delete the vacancy:', error);
                    setErrorPopup({ visible: true, message: 'Failed to delete the vacancy. Please try again.' });
                }
            }
        } else {
            alert('Please select a row to delete.');
        }
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setSelectedVacancy({ ...selectedVacancy, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${apiBaseUrl}/jobOpenings/${selectedVacancy._id}`, selectedVacancy);
                setVacancies((prev) =>
                    prev.map((vacancy) =>
                        vacancy._id === selectedVacancy._id ? selectedVacancy : vacancy
                    )
                );
            } else {
                const response = await axios.post(`${apiBaseUrl}/jobOpenings`, selectedVacancy);
                setVacancies([...vacancies, response.data]);
            }
            setShowForm(false);
        } catch (error) {
            console.error(isEditing ? 'Failed to update the vacancy:' : 'Failed to add a vacancy:', error);
            setErrorPopup({ visible: true, message: isEditing ? 'Failed to update the vacancy. Please try again.' : 'Failed to add a vacancy. Please try again.' });
        }
    };

    return (
        <div>
            <button className="add-button" onClick={handleAdding}>
                +
            </button>
            <button className="edit-button" onClick={handleEditing}>
                Edit selected
            </button>
            <button className="delete-button" onClick={handleDeleting}>
                Delete selected
            </button>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowForm(false)}>
                            &times;
                        </span>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Company:</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={selectedVacancy.company}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <div>
                                <label>Position:</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={selectedVacancy.position}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <div>
                                <label>Salary range:</label>
                                <input
                                    type="text"
                                    name="salary_range"
                                    value={selectedVacancy.salary_range}
                                    onChange={handleChanges}
                                />
                            </div>
                            <div>
                                <label>Notes:</label>
                                <input
                                    type="text"
                                    name="notes"
                                    value={selectedVacancy.notes}
                                    onChange={handleChanges}
                                />
                            </div>
                            <div>
                                <label>Application status:</label>
                                <input
                                    type="text"
                                    name="application_status"
                                    value={selectedVacancy.application_status}
                                    onChange={handleChanges}
                                    required
                                />
                            </div>
                            <button type="submit">
                                {isEditing ? 'Save Changes' : 'Add Vacancy'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {errorPopup.visible && (
                <div className="popup">
                    <div className="popup-content">
                        <p>{errorPopup.message}</p>
                        <button onClick={() => setErrorPopup({visible: false, message: ''})}>OK</button>
                    </div>
                </div>
            )}
            <div className="table-container">
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
                        <tr
                            key={vacancy._id}
                            onClick={() => handleRowClick(vacancy)}
                            style={{
                                backgroundColor: selectedVacancy?._id === vacancy._id ? 'rgba(74,144,226,0.66)' : '',
                                cursor: 'pointer',
                            }}
                        >
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
        </div>
    );
};

export default VacanciesTable;