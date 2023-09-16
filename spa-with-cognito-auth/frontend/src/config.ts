export const isDev = import.meta.env.DEV;

export const API_ENDPOINT = isDev
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;
