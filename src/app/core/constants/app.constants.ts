export const API_CONFIG = {
  FLASK_API_BASE_URL: 'http://localhost:5000',
  POWER_BI_URL: 'https://app.powerbi.com/groups/me/reports/65826571-ec46-4d53-bb2d-f77048550e06/0190691bc19548850c9c?experience=power-bi'
};

export const ROUTES = {
  HOME: '',
  LOGIN: 'login',
  DASHBOARD: 'dashboard',
  PREDICTION: 'prediction',
  FORGOT_PASSWORD: 'forgot-password'
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER_DATA: 'user_data'
} as const;