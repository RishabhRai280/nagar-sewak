// Simple test to verify API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch('http://localhost:8080/projects');
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    const data = await response.json();
    console.log('Data received:', data.length, 'projects');
    return data;
  } catch (error) {
    console.error('API test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
};

testAPI();