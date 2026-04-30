/**
 * @fileoverview API Service - Centralized HTTP client for all backend API calls.
 * Uses axios with a base URL from environment variables.
 * All API functions return the response data directly for cleaner component code.
 */

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =============================================
// COLLEGE API CALLS
// =============================================

/**
 * Fetch paginated list of colleges with optional search/filters.
 * @param {Object} params - Query parameters (page, limit, search, state, course, etc.)
 */
export const getColleges = async (params = {}) => {
  const { data } = await api.get('/colleges', { params });
  return data;
};

/**
 * Fetch featured colleges for the homepage.
 */
export const getFeaturedColleges = async () => {
  const { data } = await api.get('/colleges/featured');
  return data;
};

/**
 * Fetch single college with full details (courses, placements, reviews).
 * @param {string} id - College UUID
 */
export const getCollegeById = async (id) => {
  const { data } = await api.get(`/colleges/${id}`);
  return data;
};

// =============================================
// FILTER API CALLS
// =============================================

/** Fetch distinct locations (states + cities) for filter dropdowns */
export const getFilterLocations = async () => {
  const { data } = await api.get('/filters/locations');
  return data;
};

/** Fetch distinct course types for filter dropdown */
export const getFilterCourses = async () => {
  const { data } = await api.get('/filters/courses');
  return data;
};

// =============================================
// COMPARE API CALLS
// =============================================

/**
 * Compare 2-3 colleges side by side.
 * @param {string[]} collegeIds - Array of 2-3 college UUIDs
 */
export const compareColleges = async (collegeIds) => {
  const { data } = await api.post('/compare', { college_ids: collegeIds });
  return data;
};

// =============================================
// PREDICTOR API CALLS
// =============================================

/** Fetch list of available exams */
export const getExams = async () => {
  const { data } = await api.get('/predictor/exams');
  return data;
};

/**
 * Predict colleges based on exam and rank.
 * @param {string} examId - Exam UUID
 * @param {number} rank - Student's rank
 */
export const predictColleges = async (examId, rank) => {
  const { data } = await api.post('/predictor/predict', { exam_id: examId, rank });
  return data;
};

export default api;
