import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service to handle all API calls to the backend
 */
export const createOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/create-order`, orderData);
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await axios.post(`${API_URL}/verify-payment`, paymentData);
    return response.data;
};

export const fetchDonations = async () => {
    const response = await axios.get(`${API_URL}/donations`);
    return response.data;
};

export const downloadReceipt = (donationId) => {
    window.open(`${API_URL}/download-receipt/${donationId}`, '_blank');
};
