const isBrowser = typeof window !== 'undefined';

export const environment = {
  production: false,
  get apiUrl(): string {
    return isBrowser
      ? `http://${window.location.hostname}:8000/api`
      : 'http://localhost:8000/api';
  }
};
