import api from './api';

export const getMembers = () => api.get('/users/members');
