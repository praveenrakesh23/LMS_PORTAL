import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './admin-course-basics.css';

const AdminCourseBasics = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    courseTitle: '',
    courseSubtitle: '',
    courseDescription: '',
    courseCategory: '',
    courseLevel: '',
    courseLanguage: '',
    coursePrice: '',
    courseThumbnail: null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseTitle.trim()) {
      newErrors.courseTitle = 'Course title is required';
    }
    if (!formData.courseSubtitle.trim()) {
      newErrors.courseSubtitle = 'Course subtitle is required';
    }
    if (!formData.courseDescription.trim()) {
      newErrors.courseDescription = 'Course description is required';
    }
    if (!formData.courseCategory) {
      newErrors.courseCategory = 'Please select a category';
    }
    if (!formData.courseLevel) {
      newErrors.courseLevel = 'Please select a level';
    }
    if (!formData.courseLanguage.trim()) {
      newErrors.courseLanguage = 'Course language is required';
    }
    if (!formData.coursePrice) {
      newErrors.coursePrice = 'Course price is required';
    }
    if (!formData.courseThumbnail) {
      newErrors.courseThumbnail = 'Course thumbnail is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setFormData(prevState => ({
        ...prevState,
        [name]: file
      }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setThumbnailPreview(null);
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // In a real application, you would upload the file here
        // For now, we'll just log the file object
        console.log('Form Data:', formData);
        console.log('Course Thumbnail File:', formData.courseThumbnail);
        
        // Navigate to modules page
        navigate(`/admin/course-details/${id}/modules`);
        toast.success('Basics saved! Proceeding to Modules...');
      } catch (error) {
        toast.error('Failed to save course basics. Please try again.');
      }
    } else {
      toast.error('Please fill in all required fields correctly.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="admin-basics-container">
      <h2 className="admin-basics-title">Course Basics</h2>
      <p className="admin-basics-description">Provide basic information about your course.</p>

      <form className="admin-basics-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="course-title">Course Title:</label>
          <input 
            type="text" 
            id="course-title" 
            name="courseTitle" 
            placeholder="e.g., Introduction to React" 
            value={formData.courseTitle} 
            onChange={handleChange}
            className={errors.courseTitle ? 'error' : ''}
          />
          {errors.courseTitle && <span className="error-message">{errors.courseTitle}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-subtitle">Course Subtitle:</label>
          <input 
            type="text" 
            id="course-subtitle" 
            name="courseSubtitle" 
            placeholder="e.g., Build dynamic web applications" 
            value={formData.courseSubtitle} 
            onChange={handleChange}
            className={errors.courseSubtitle ? 'error' : ''}
          />
          {errors.courseSubtitle && <span className="error-message">{errors.courseSubtitle}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-description">Course Description:</label>
          <textarea 
            id="course-description" 
            name="courseDescription" 
            rows="6" 
            placeholder="Provide a detailed description of your course..." 
            value={formData.courseDescription} 
            onChange={handleChange}
            className={errors.courseDescription ? 'error' : ''}
          ></textarea>
          {errors.courseDescription && <span className="error-message">{errors.courseDescription}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-thumbnail" className="form-label">Course Thumbnail:</label>
          <div className="file-input-container">
            <input 
              type="file" 
              id="course-thumbnail" 
              name="courseThumbnail" 
              accept="image/*"
              onChange={handleChange}
              className="hidden-file-input"
            />
            <label htmlFor="course-thumbnail" className="custom-file-upload-btn">
              {formData.courseThumbnail ? formData.courseThumbnail.name : 'Choose File'}
            </label>
          </div>
          {errors.courseThumbnail && <span className="error-message">{errors.courseThumbnail}</span>}
          {thumbnailPreview && (
            <div className="thumbnail-preview">
              <img src={thumbnailPreview} alt="Thumbnail Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="course-category">Category:</label>
          <select 
            id="course-category" 
            name="courseCategory" 
            value={formData.courseCategory} 
            onChange={handleChange}
            className={errors.courseCategory ? 'error' : ''}
          >
            <option value="">Select a category</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="business">Business</option>
          </select>
          {errors.courseCategory && <span className="error-message">{errors.courseCategory}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-level">Level:</label>
          <select 
            id="course-level" 
            name="courseLevel" 
            value={formData.courseLevel} 
            onChange={handleChange}
            className={errors.courseLevel ? 'error' : ''}
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.courseLevel && <span className="error-message">{errors.courseLevel}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-language">Language:</label>
          <input 
            type="text" 
            id="course-language" 
            name="courseLanguage" 
            placeholder="e.g., English" 
            value={formData.courseLanguage} 
            onChange={handleChange}
            className={errors.courseLanguage ? 'error' : ''}
          />
          {errors.courseLanguage && <span className="error-message">{errors.courseLanguage}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="course-price">Price:</label>
          <input 
            type="number" 
            id="course-price" 
            name="coursePrice" 
            placeholder="e.g., 99.99" 
            step="0.01" 
            value={formData.coursePrice} 
            onChange={handleChange}
            className={errors.coursePrice ? 'error' : ''}
          />
          {errors.coursePrice && <span className="error-message">{errors.coursePrice}</span>}
        </div>

        <button 
          type="submit" 
          className="admin-basics-save-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Continue to Modules'}
        </button>
      </form>
    </div>
  );
};

export default AdminCourseBasics; 