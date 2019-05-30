let port = process.env.PORT || 3001;

// for random port
if (process.env.NODE_ENV === 'test') {
  port = 0;
}

export { port };
export const env = process.env.NODE_ENV || 'development';
export const apiUrl = `http://localhost:${port}/api`;
