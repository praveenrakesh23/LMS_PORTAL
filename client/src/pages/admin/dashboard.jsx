import AdminDashboardHeader from '../../components/AdminDashboardHeader';
import { useNavigate } from 'react-router-dom';
import star from '../../assets/course-card/star.svg';
import user from '../../assets/course-card/user.svg';
import calendar from '../../assets/course-card/calendar.svg';
import './dashboard-style.css';
import { useState, useEffect } from 'react';

function dashboard(){
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 12; // Assuming 12 courses per page based on the grid layout
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [showOverlay, setShowOverlay] = useState(true); // New state for overlay
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch('/src/sample-courses.json')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
        // Start timer to hide overlay after 2 seconds
        setTimeout(() => {
          setShowOverlay(false);
        }, 2000);
      })
      .catch(error => {
        console.error('Error fetching courses:', error);
        setLoading(false);
        setShowOverlay(false); // Hide overlay even on error
      });
  }, []);

  const totalCourses = courses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  // Calculate the courses to display for the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const handlePreviousClick = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleImageLoad = (courseId) => {
    setLoadedImages(prev => ({
      ...prev,
      [courseId]: true
    }));
  };

  const handleCreateCourseClick = () => {
    // Navigate to the course details page with a 'new' ID for creation
    navigate('/admin/course-details/new');
  };

  return(
    <>
      <AdminDashboardHeader/>
      <div className="dashboard-container">
        {/* TODO: Add styling for header, button, grid, and cards to match the image */}
        <div className="dashboard-header-controls">
          <h1 className="text-2xl font-bold">All Courses</h1>
          <button className="dashboard-create-course-btn" onClick={handleCreateCourseClick}>
            + Create Course
          </button>
        </div>
        {showOverlay ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="dashboard-grid">
            {currentCourses.map(course => (
              <div
                key={course.id}
                className="dashboard-card"
              >
                <div className="dashboard-card-img-container">
                  {!loadedImages[course.id] && (
                    <div className="dashboard-card-img-placeholder">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className={`dashboard-card-img ${loadedImages[course.id] ? 'loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(course.id)}
                  />
                </div>
                <div className="dashboard-card-content">
                  <h3 className="dashboard-card-title">{course.title}</h3>
                  <div className="dashboard-card-info">
                    <span className="dashboard-card-rating">
                      <img src={star} alt="star" className="icon-star" />
                      {course.rating} ({course.ratingCount})
                    </span>
                    <span className="dashboard-card-enrolled">
                      <img src={user} alt="user" className="icon-user" />
                      Students Enrolled: {course.studentsEnrolled}
                    </span>
                    <span className="dashboard-card-updated">
                      <img src={calendar} alt="calendar" className="icon-calendar" />
                      Last Updated: {new Date(course.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* TODO: Add pagination component here */}
        <div className="dashboard-pagination flex justify-between mt-8">
          <button
            className="dashboard-pagination-btn"
            onClick={handlePreviousClick}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span> {/* Optional: display current page */}
          <button
            className="dashboard-pagination-btn"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </>
  );
}

export default dashboard;