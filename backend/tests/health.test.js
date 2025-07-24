const request = require('supertest');
const express = require('express');
const healthRouter = require('../routes/health');

const app = express();
app.use('/api/health', healthRouter);

describe('Health Check Endpoints', () => {
  test('GET /api/health should return 200 and health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('message', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'savoon-bank-backend');
  });

  test('GET /api/health/ready should return 200 and ready status', async () => {
    const response = await request(app)
      .get('/api/health/ready')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'ready');
    expect(response.body).toHaveProperty('service', 'savoon-bank-backend');
  });

  test('GET /api/health/live should return 200 and alive status', async () => {
    const response = await request(app)
      .get('/api/health/live')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'alive');
    expect(response.body).toHaveProperty('service', 'savoon-bank-backend');
  });
});
