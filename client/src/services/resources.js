import api from './api'

export const authApi = {
  me: () => api.get('/auth/me')
}

export const userApi = {
  profile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data)
}

export const donationApi = {
  list: (params = {}) => api.get('/donations', { params }),
  getOne: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/donations/${id}`, data),
  remove: (id) => api.delete(`/donations/${id}`)
}

export const requestApi = {
  list: (params = {}) => api.get('/requests', { params }),
  getOne: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data)
}

export const matchApi = {
  list: (params = {}) => api.get('/matches', { params }),
  generate: (data) => api.post('/matches/generate', data)
}

export const deliveryApi = {
  list: (params = {}) => api.get('/deliveries', { params }),
  create: (data) => api.post('/deliveries', data),
  updateStatus: (id, status) => api.put(`/deliveries/${id}/status`, { status }),
  verify: (id, verificationCode) => api.post(`/deliveries/${id}/verify`, { verificationCode })
}

export const notificationApi = {
  list: () => api.get('/notifications'),
  readOne: (id) => api.put(`/notifications/${id}/read`),
  readAll: () => api.put('/notifications/read-all')
}

export const rewardApi = {
  list: () => api.get('/rewards')
}

export const analyticsApi = {
  overview: () => api.get('/analytics/overview'),
  donations: () => api.get('/analytics/donations'),
  requests: () => api.get('/analytics/requests'),
  impact: () => api.get('/analytics/impact')
}

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: () => api.get('/admin/users'),
  changeUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
  reports: () => api.get('/admin/reports'),
  disasterMode: (enabled) => api.put('/admin/disaster-mode', { enabled })
}
