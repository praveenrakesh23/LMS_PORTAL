import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AdminDashboardHeader from '../../components/AdminDashboardHeader';
import AdminSideMenubar from '../../components/AdminSideMenubar';
import AdminCourseBasics from './AdminCourseBasics';
import AdminCourseModules from './AdminCourseModules';
import AdminCourseAnnouncements from './AdminCourseAnnouncements';
import AdminCourseAssignments from './AdminCourseAssignments';
import AdminCourseGrades from './AdminCourseGrades';
import AdminCourseRubrics from './AdminCourseRubrics';
import './admin-course-details.css'; // We'll create this CSS file next

const AdminCourseDetailsPage = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const location = useLocation();

  // State for managing modules, lifted from AdminCourseModules
  const [modules, setModules] = useState([]);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  
  const initialModuleState = {
    videoFile: null,
    videoPreview: null,
    notesFile: null,
    notesPreview: null,
    courseTitle: '', 
    language: 'English',
    transcript: '',
    instructorBio: '',
    title: '', 
    description: '', // Add description for module list view
  };

  const [currentModuleData, setCurrentModuleData] = useState(initialModuleState);

  // Handlers for module management, passed down to AdminCourseModules
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'video') {
      setCurrentModuleData(prev => ({ ...prev, videoFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { setCurrentModuleData(prev => ({ ...prev, videoPreview: reader.result })); };
        reader.readAsDataURL(file);
      } else { setCurrentModuleData(prev => ({ ...prev, videoPreview: null })); }
    } else if (fileType === 'notes') {
      setCurrentModuleData(prev => ({ ...prev, notesFile: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { setCurrentModuleData(prev => ({ ...prev, notesPreview: reader.result })); };
        reader.readAsDataURL(file);
      } else { setCurrentModuleData(prev => ({ ...prev, notesPreview: null })); }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModuleData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateModule = () => {
    if (!currentModuleData.title.trim()) {
      alert('Module title is required!');
      return;
    }

    if (editingModuleId) {
      setModules(modules.map(mod => mod.id === editingModuleId ? { ...currentModuleData, id: editingModuleId } : mod));
      setEditingModuleId(null);
    } else {
      setModules([...modules, { ...currentModuleData, id: Date.now() }]);
    }
    setIsAddingModule(false);
    setCurrentModuleData(initialModuleState);
  };

  const handleEditModule = (moduleId) => {
    const moduleToEdit = modules.find(mod => mod.id === moduleId);
    if (moduleToEdit) {
      setCurrentModuleData(moduleToEdit);
      setEditingModuleId(moduleId);
      setIsAddingModule(true);
    }
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      setModules(modules.filter(mod => mod.id !== moduleId));
    }
  };

  const handleCancel = () => {
    setIsAddingModule(false);
    setEditingModuleId(null);
    setCurrentModuleData(initialModuleState);
  };

  useEffect(() => {
    console.log('AdminCourseDetailsPage mounted');
    console.log('Current Modules in AdminCourseDetailsPage (on mount):', modules);
    return () => {
      console.log('AdminCourseDetailsPage unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('Modules state updated in AdminCourseDetailsPage:', modules);
  }, [modules]);

  const renderContent = () => {
    if (location.pathname.includes(`/admin/course-details/${id}/basics`) || location.pathname === `/admin/course-details/${id}`) {
      return <AdminCourseBasics />;
    } else if (location.pathname.includes(`/admin/course-details/${id}/modules`)) {
      return (
        <AdminCourseModules 
          modules={modules}
          setModules={setModules}
          isAddingModule={isAddingModule}
          setIsAddingModule={setIsAddingModule}
          editingModuleId={editingModuleId}
          setEditingModuleId={setEditingModuleId}
          currentModuleData={currentModuleData}
          setCurrentModuleData={setCurrentModuleData}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
          handleAddOrUpdateModule={handleAddOrUpdateModule}
          handleEditModule={handleEditModule}
          handleDeleteModule={handleDeleteModule}
          handleCancel={handleCancel}
          initialModuleState={initialModuleState}
        />
      );
    } else if (location.pathname.includes(`/admin/course-details/${id}/announcements`)) {
      return <AdminCourseAnnouncements />;
    } else if (location.pathname.includes(`/admin/course-details/${id}/assignments`)) {
      return <AdminCourseAssignments />;
    } else if (location.pathname.includes(`/admin/course-details/${id}/grades`)) {
      return <AdminCourseGrades />;
    } else if (location.pathname.includes(`/admin/course-details/${id}/rubrics`)) {
      return <AdminCourseRubrics />;
    }
    // Add more conditions for other sidebar options later
    return <h1>Admin Course Details for Course ID: {id}</h1>;
  };

  return (
    <div className="admin-course-details-root">
      <AdminDashboardHeader />
      <div className="admin-course-details-content-row">
        <AdminSideMenubar />
        <div className="admin-course-details-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetailsPage; 