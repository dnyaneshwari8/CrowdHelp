import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_URL
});

// Add a request interceptor to include JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Auth Services
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const verifyOTP = async (otpData) => {
    const response = await api.post('/auth/verify-otp', otpData);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
};

export const resetPassword = async (resetData) => {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
};

/**
 * Campaign Services
 */
export const fetchCampaigns = async (filters = {}) => {
    const { category, search } = filters;
    let url = '/campaigns';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await api.get(url);
    return response.data;
};

export const fetchCampaignById = async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
};

export const fetchCampaignUpdates = async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/updates`);
    return response.data;
};

export const createCampaign = async (formData) => {
    const response = await api.post('/campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateCampaign = async (id, formData) => {
    const response = await api.patch(`/campaigns/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteCampaign = async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
};

/**
 * User Services
 */
export const fetchUserProfile = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const updateUserProfile = async (formData) => {
    const response = await api.patch('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const toggleFavorite = async (campaignId) => {
    const response = await api.post('/users/favorites/toggle', { campaignId });
    return response.data;
};

export const fetchCertificates = async () => {
    const response = await api.get('/users/certificates');
    return response.data;
};

export const applyNGO = async (formData) => {
    const response = await api.post('/users/apply-ngo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * Donation Services
 */
export const createOrder = async (orderData) => {
    const response = await api.post('/create-order', orderData);
    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await api.post('/verify-payment', paymentData);
    return response.data;
};

export const fetchDonations = async () => {
    const response = await api.get('/donations');
    return response.data;
};

export const fetchMyDonations = async () => {
    const response = await api.get('/my-donations');
    return response.data;
};

export const fetchLeaderboard = async () => {
    const response = await api.get('/leaderboard');
    return response.data;
};

export const fetchDonorWall = async () => {
    const response = await api.get('/donor-wall');
    return response.data;
};

export const downloadReceipt = (donationId) => {
    window.open(`${API_URL}/download-receipt/${donationId}`, '_blank');
};

export const downloadCertificate = (donationId) => {
    window.open(`${API_URL}/download-certificate/${donationId}`, '_blank');
};

/**
 * NGO Dashboard Services
 */
export const fetchNGODashboardStats = async () => {
    const response = await api.get('/ngo/dashboard');
    return response.data;
};

export const fetchNGOCampaigns = async () => {
    const response = await api.get('/ngo/my-campaigns');
    return response.data;
};

export const fetchNGODonations = async (params = {}) => {
    const response = await api.get('/ngo/donations', { params });
    return response.data;
};

export const fetchNGOAnalytics = async () => {
    const response = await api.get('/ngo/analytics');
    return response.data;
};

export const fetchNGOUpdates = async () => {
    const response = await api.get('/ngo/updates');
    return response.data;
};

export const postNGOUpdate = async (updateData) => {
    const response = await api.post('/ngo/updates', updateData);
    return response.data;
};

export const deleteNGOUpdate = async (id) => {
    const response = await api.delete(`/ngo/updates/${id}`);
    return response.data;
};

export const fetchNGONotifications = async () => {
    const response = await api.get('/ngo/notifications');
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.patch(`/ngo/notifications/${id}/read`);
    return response.data;
};

export const fetchNGODocuments = async () => {
    const response = await api.get('/ngo/documents');
    return response.data;
};

export const updateNGOProfile = async (formData) => {
    const response = await api.patch('/ngo/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * Admin Services
 */
export const fetchAllUsers = async (filters = {}) => {
    const { search, role } = filters;
    let url = '/admin/users';
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await api.get(url);
    return response.data;
};

export const fetchUserDetails = async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
};

export const fetchAllDonations = async () => {
    const response = await api.get('/admin/donations');
    return response.data;
};

export const fetchAdvancedAnalytics = async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
};

export const exportDonations = () => {
    window.open(`${API_URL}/admin/export-donations`, '_blank');
};

export const toggleBlockUser = async (userId) => {
    const response = await api.post('/admin/block-user', { userId });
    return response.data;
};

export const fetchAllCampaignsAdmin = async () => {
    const response = await api.get('/admin/campaigns');
    return response.data;
};

export const fetchNGOApplications = async () => {
    const response = await api.get('/admin/ngo-applications');
    return response.data;
};

export const updateNGOStatus = async (ngoId, status, adminRemarks = '') => {
    if (status === 'APPROVED') {
        return approveNGO(ngoId, adminRemarks);
    } else {
        return rejectNGO(ngoId, adminRemarks);
    }
};

export const approveNGO = async (applicationId, adminRemarks) => {
    const response = await api.post('/admin/approve-ngo', { applicationId, adminRemarks });
    return response.data;
};

export const rejectNGO = async (applicationId, adminRemarks) => {
    const response = await api.post('/admin/reject-ngo', { applicationId, adminRemarks });
    return response.data;
};

export const fetchPendingCampaigns = async () => {
    const response = await api.get('/admin/pending-campaigns');
    return response.data;
};

export const updateCampaignStatus = async (campaignId, status, adminRemarks = '') => {
    if (status === 'APPROVED') {
        return approveCampaign(campaignId);
    } else {
        return rejectCampaign(campaignId, adminRemarks);
    }
};

export const approveCampaign = async (campaignId) => {
    const response = await api.post('/admin/approve-campaign', { campaignId });
    return response.data;
};

export const rejectCampaign = async (campaignId, adminRemarks) => {
    const response = await api.post('/admin/reject-campaign', { campaignId, adminRemarks });
    return response.data;
};

export const fetchAuditLogs = async () => {
    const response = await api.get('/admin/audit-logs');
    return response.data;
};

// NGO Application Specific
export const submitNGOApplication = async (formData) => {
    const response = await api.post('/ngo-applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const fetchMyNGOApplication = async () => {
    const response = await api.get('/ngo-applications/my-application');
    return response.data;
};

export default api;
