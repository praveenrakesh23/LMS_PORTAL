import React, { useState } from 'react';
import './admin-course-assignments.css';

const AdminCourseAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    dueDate: '',
    points: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddAssignment = () => {
    if (newAssignment.title.trim() && newAssignment.dueDate.trim() && newAssignment.points.trim()) {
      setAssignments(prevAssignments => [
        ...prevAssignments,
        { ...newAssignment, id: Date.now() }
      ]);
      setNewAssignment({ title: '', dueDate: '', points: '', description: '' });
    } else {
      alert('Please fill in title, due date, and points for the assignment.');
    }
  };

  return (
    <div className="admin-assignments-container">
      <h2 className="admin-assignments-title">Course Assignments</h2>
      <p className="admin-assignments-description">Manage assignments for this course.</p>

      <div className="admin-new-assignment-form">
        <div className="form-group">
          <label htmlFor="assignment-title">Assignment Title:</label>
          <input type="text" id="assignment-title" name="title" placeholder="e.g., Module 1 Quiz" value={newAssignment.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="assignment-dueDate">Due Date:</label>
          <input type="date" id="assignment-dueDate" name="dueDate" value={newAssignment.dueDate} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="assignment-points">Points:</label>
          <input type="number" id="assignment-points" name="points" placeholder="e.g., 100" value={newAssignment.points} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="assignment-description">Description (Optional):</label>
          <textarea id="assignment-description" name="description" rows="3" placeholder="Add assignment details..." value={newAssignment.description} onChange={handleInputChange}></textarea>
        </div>
        <button onClick={handleAddAssignment} className="admin-add-assignment-btn">Add Assignment</button>
      </div>

      <div className="admin-assignments-list">
        {assignments.length === 0 ? (
          <p className="no-assignments-message">No assignments yet. Add one above!</p>
        ) : (
          assignments.map(assignment => (
            <div key={assignment.id} className="admin-assignment-card">
              <h3 className="admin-assignment-card-title">{assignment.title}</h3>
              <p className="admin-assignment-card-meta">Due: {assignment.dueDate} | Points: {assignment.points}</p>
              {assignment.description && <p className="admin-assignment-card-description">{assignment.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCourseAssignments; 