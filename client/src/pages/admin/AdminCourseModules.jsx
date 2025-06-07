import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './admin-course-modules.css';

const AdminCourseModules = ({ 
  modules, 
  setModules, 
  isAddingModule, 
  setIsAddingModule, 
  editingModuleId, 
  setEditingModuleId, 
  currentModuleData, 
  setCurrentModuleData, 
  handleFileChange, 
  handleInputChange, 
  handleAddOrUpdateModule, 
  handleEditModule, 
  handleDeleteModule, 
  handleCancel,
  initialModuleState
}) => {
  const { id } = useParams();

  useEffect(() => {
    console.log('AdminCourseModules mounted');
    console.log('Modules prop in AdminCourseModules (on mount):', modules);
    return () => {
      console.log('AdminCourseModules unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Modules prop updated in AdminCourseModules:', modules);
  }, [modules]);

  return (
    <div className="admin-module-page-container">
      <div className="module-header">
        <div className="blue-bar"></div>
        <h2 className="module-title">Course Modules</h2>
      </div>

      {!isAddingModule && modules.length === 0 && (
        <div className="empty-modules-state">
          <p>No modules added yet. Click "Create New Module" to get started.</p>
          <button className="add-module-primary-btn" onClick={() => setIsAddingModule(true)}>
            + Create New Module
          </button>
        </div>
      )}

      {!isAddingModule && modules.length > 0 && (
        <div className="modules-list-view">
          <div className="modules-list-header">
            <h3>Your Modules</h3>
            <button className="add-module-primary-btn" onClick={() => setIsAddingModule(true)}>
              + Create New Module
            </button>
          </div>
          <div className="modules-grid">
            {modules.map(module => (
              <div key={module.id} className="module-list-card">
                <h4>{module.title}</h4>
                <p>{module.description}</p>
                <div className="module-list-actions">
                  <button onClick={() => handleEditModule(module.id)} className="edit-module-btn">Edit</button>
                  <button onClick={() => handleDeleteModule(module.id)} className="delete-module-btn">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAddingModule && (
        <div className="add-edit-module-form-container">
          <div className="module-card-form">
            <div className="form-group">
              <label htmlFor="module-title-input" className="section-title">Module Title:</label>
              <input
                type="text"
                id="module-title-input"
                name="title"
                className="text-input"
                value={currentModuleData.title}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to React"
              />
            </div>
            
            <div className="module-content-grid">
              <div className="video-section module-card">
                <p className="section-title">Video</p>
                <div className="upload-area">
                  {currentModuleData.videoPreview ? (
                    <img src={currentModuleData.videoPreview} alt="Video Thumbnail" className="uploaded-preview" />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    className="hidden-input"
                    onChange={(e) => handleFileChange(e, 'video')}
                  />
                  <label htmlFor="video-upload" className="add-button">ADD</label>
                </div>
              </div>

              <div className="notes-section module-card">
                <p className="section-title">Notes</p>
                <div className="upload-area">
                  {currentModuleData.notesPreview ? (
                    <img src={currentModuleData.notesPreview} alt="Notes Thumbnail" className="uploaded-preview" />
                  ) : (
                    <div className="placeholder-image"></div>
                  )}
                  <input
                    type="file"
                    id="notes-upload"
                    accept="image/*, .pdf, .doc, .docx, .txt"
                    className="hidden-input"
                    onChange={(e) => handleFileChange(e, 'notes')}
                  />
                  <label htmlFor="notes-upload" className="add-button">ADD</label>
                </div>
              </div>

              <div className="course-title-section module-card">
                <p className="section-title">Course Title</p>
                <input
                  type="text"
                  className="text-input"
                  value={currentModuleData.courseTitle}
                  onChange={handleInputChange}
                  name="courseTitle"
                  readOnly
                />
              </div>

              <div className="language-section module-card">
                <p className="section-title">Language</p>
                <select
                  className="select-input"
                  value={currentModuleData.language}
                  onChange={handleInputChange}
                  name="language"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div className="transcript-section module-card">
                <p className="section-title">Transcript</p>
                <textarea
                  className="textarea-input"
                  value={currentModuleData.transcript}
                  onChange={handleInputChange}
                  name="transcript"
                ></textarea>
              </div>

              <div className="instructor-bio-section module-card">
                <p className="section-title">Instructor Bio</p>
                <textarea
                  className="textarea-input"
                  value={currentModuleData.instructorBio}
                  onChange={handleInputChange}
                  name="instructorBio"
                ></textarea>
              </div>
            </div>

            <div className="module-form-actions">
              <button className="add-module-primary-btn" onClick={handleAddOrUpdateModule}>
                {editingModuleId ? 'Update Module' : 'Add Module'}
              </button>
              <button className="cancel-module-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseModules; 