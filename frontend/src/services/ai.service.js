import axios from 'axios';
import { API_URL } from '../config/api.config';

// Get auth token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * Get deal coach advice for a specific lead
 * @param {string} leadId - The lead ID
 * @returns {Promise<Object>} - The response data
 */
export const getDealCoachAdvice = async (leadId) => {
  try {
    const response = await axios.post(
      `${API_URL}/ai/leads/${leadId}/deal-coach`, 
      {}, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting deal coach advice:', error);
    throw error;
  }
};

/**
 * Get customer persona for a specific lead
 * @param {string} leadId - The lead ID
 * @returns {Promise<Object>} - The response data
 */
export const getCustomerPersona = async (leadId) => {
  try {
    const response = await axios.post(
      `${API_URL}/ai/leads/${leadId}/persona`, 
      {}, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting customer persona:', error);
    throw error;
  }
};

/**
 * Get objection handler suggestions
 * @param {string} objection - The objection text
 * @returns {Promise<Object>} - The response data
 */
export const getObjectionHandler = async (objection) => {
  try {
    const response = await axios.post(
      `${API_URL}/ai/objection-handler`, 
      { objection }, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting objection handler:', error);
    throw error;
  }
};

/**
 * Get win-loss report insights
 * @returns {Promise<Object>} - The response data
 */
export const getWinLossReport = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/ai/win-loss-report`, 
      {}, 
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Error getting win-loss report:', error);
    throw error;
  }
}; 