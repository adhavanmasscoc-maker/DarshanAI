import API from './api';

export const mlService = {
  predictCrowd: async (payload) => {
    const response = await API.post('/ml/crowd-prediction', payload);
    return response.data;
  },

  classifyCrowd: async (payload) => {
    const response = await API.post('/ml/crowd-classification', payload);
    return response.data;
  },

  predictRisk: async (payload) => {
    const response = await API.post('/ml/risk-prediction', payload);
    return response.data;
  },

  predictWaitingTime: async (payload) => {
    const response = await API.post('/ml/waiting-time', payload);
    return response.data;
  },

  detectAnomaly: async (payload) => {
    const response = await API.post('/ml/anomaly', payload);
    return response.data;
  },

  runFullInference: async (payload) => {
    const response = await API.post('/ml/full-inference', payload);
    return response.data;
  },

  getModelPerformance: async () => {
    const response = await API.get('/ml/model-performance');
    return response.data;
  },

  getFeatureImportance: async () => {
    const response = await API.get('/ml/feature-importance');
    return response.data;
  }
};
