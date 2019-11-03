const mongoose = require('mongoose');
const request = require('supertest');

const server = require('../app');

const testImage = {
  path: './src/__tests__/test.png',
  id: null,
};

describe('Testing Images endpoints', () => {
  afterAll(async () => {
    await Promise.all(mongoose.connections.map(async item => { await item.close(); }));
    server.close();
  });

  it('should response status be 200 GET /config', async () => {
    const response = await request(server).get('/config');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('should response status be 200 GET /service/health', async () => {
    const response = await request(server).get('/service/health');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/plain/);
  });

  it('should response status be 201 POST /images', async () => {
    const response = await request(server).post('/images').attach('file', testImage.path);
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    testImage.id = response.body.id;
  });

  it('should response status be 200 GET /images', async () => {
    const response = await request(server).get('/images');
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.statusCode).toBe(200);
  });

  it('should response status be 200 GET /images:id', async () => {
    const response = await request(server).get(`/images/${testImage.id}`);
    expect(response.statusCode).toBe(200);
  });

  it('should response status be 204 DELETE /images:id', async () => {
    const response = await request(server).delete(`/images/${testImage.id}`);
    expect(response.statusCode).toBe(204);
  });
});
