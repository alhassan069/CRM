// Set environment to test
process.env.NODE_ENV = 'test';

// Set up test database config
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'root';
process.env.DB_PASSWORD = 'macbook15';
process.env.DB_NAME = 'doctor_crm_test';
process.env.DB_DIALECT = 'mysql';
process.env.JWT_SECRET = 'test_jwt_secret'; 