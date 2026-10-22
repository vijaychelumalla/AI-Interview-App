const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.PORT = '0';
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/ai_interview_test_db';
process.env.JWT_SECRET = 'test_jwt_secret_key_998877';
process.env.ADMIN_SECRET_KEY = 'secret_admin_key_test';

const app = require('../server');
const User = require('../models/User');
const Interview = require('../models/Interview');

let server;
let baseUrl;

before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  await User.deleteMany({ email: /@test\.com$/ });
  await Interview.deleteMany({});

  server = http.createServer(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

after(async () => {
  await User.deleteMany({ email: /@test\.com$/ });
  await Interview.deleteMany({});
  await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
});

describe('AI Interview App Backend API & Security Tests', () => {
  let regularToken;
  let regularUserId;
  let adminToken;
  let adminUserId;

  test('1. POST /api/auth/signup - Registers new candidate user with role "user"', async () => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Candidate User',
        email: 'candidate@test.com',
        password: 'password123',
        role: 'admin' // Attempting to escalate role to admin
      })
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.ok(data.token);
    assert.strictEqual(data.user.role, 'user', 'Must enforce role "user" on standard signup');
    regularToken = data.token;
    regularUserId = data.user.id;
  });

  test('2. POST /api/auth/signup - Rejects duplicate email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Candidate',
        email: 'candidate@test.com',
        password: 'password123'
      })
    });

    assert.strictEqual(res.status, 400);
  });

  test('3. POST /api/auth/signup - Rejects password shorter than 6 characters', async () => {
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shorty',
        email: 'shorty@test.com',
        password: '123'
      })
    });

    assert.strictEqual(res.status, 400);
  });

  test('4. POST /api/auth/login - Authenticates valid credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'candidate@test.com',
        password: 'password123'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.strictEqual(data.user.email, 'candidate@test.com');
  });

  test('5. POST /api/auth/login - Rejects incorrect password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'candidate@test.com',
        password: 'wrong_password'
      })
    });

    assert.strictEqual(res.status, 400);
  });

  test('6. POST /api/admin/create-admin - Requires valid secret when ADMIN_SECRET_KEY is configured', async () => {
    // Attempt without secret
    const resNoSecret = await fetch(`${baseUrl}/api/admin/create-admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Admin',
        email: 'hackeradmin@test.com',
        password: 'password123'
      })
    });
    assert.strictEqual(resNoSecret.status, 403, 'Should reject unauthorized admin creation without secret');

    // Create with valid secret
    const resWithSecret = await fetch(`${baseUrl}/api/admin/create-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': 'secret_admin_key_test'
      },
      body: JSON.stringify({
        name: 'Test Administrator',
        email: 'admin@test.com',
        password: 'adminpassword123'
      })
    });

    assert.strictEqual(resWithSecret.status, 201);
    const data = await resWithSecret.json();
    assert.strictEqual(data.admin.role, 'admin');

    // Login as admin
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@test.com',
        password: 'adminpassword123'
      })
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;
    adminUserId = loginData.user.id;
  });

  test('7. GET /api/admin/users - Rejects standard user with 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${regularToken}` }
    });
    assert.strictEqual(res.status, 403);
  });

  test('8. GET /api/admin/users - Allows admin user to view all accounts', async () => {
    const res = await fetch(`${baseUrl}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 200);
    const users = await res.json();
    assert.ok(Array.isArray(users));
    assert.ok(users.length >= 2);
  });

  test('9. DELETE /api/admin/users/:id - Rejects admin deleting their own account', async () => {
    const res = await fetch(`${baseUrl}/api/admin/users/${adminUserId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.match(data.message, /cannot delete your own/i);
  });

  test('10. GET /api/admin/interviews - Requires admin authentication and cannot be accessed publicly', async () => {
    const resPublic = await fetch(`${baseUrl}/api/admin/interviews`);
    assert.strictEqual(resPublic.status, 401, 'Public access to all interviews must be blocked');

    const resRegular = await fetch(`${baseUrl}/api/admin/interviews`, {
      headers: { Authorization: `Bearer ${regularToken}` }
    });
    assert.strictEqual(resRegular.status, 403, 'Regular user access to all interviews must be blocked');

    const resAdmin = await fetch(`${baseUrl}/api/admin/interviews`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert.strictEqual(resAdmin.status, 200);
  });

  test('11. POST /api/interview/generate - Generates questions for valid role and count', async () => {
    const roles = ['Frontend', 'Backend', 'Fullstack', 'HR', 'DSA'];
    for (const role of roles) {
      const res = await fetch(`${baseUrl}/api/interview/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${regularToken}`
        },
        body: JSON.stringify({
          role,
          difficulty: 'Hard',
          questionCount: 3
        })
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.role, role);
      assert.strictEqual(data.questions.length, 3);
    }
  });

  test('12. POST /api/interview/submit - Rejects mismatched question and answer counts', async () => {
    const res = await fetch(`${baseUrl}/api/interview/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regularToken}`
      },
      body: JSON.stringify({
        role: 'Frontend',
        difficulty: 'Easy',
        questions: ['Q1', 'Q2'],
        answers: ['A1'] // Only 1 answer for 2 questions
      })
    });

    assert.strictEqual(res.status, 400);
  });

  test('13. GET /api/interview/my - Isolates user interview history', async () => {
    // Manually create an interview for regular user
    await Interview.create({
      user: regularUserId,
      role: 'Frontend',
      difficulty: 'Medium',
      questions: ['What is React?'],
      answers: ['React is a component-based UI library.'],
      feedback: ['Good concise explanation.'],
      marks: [4],
      totalScore: 4
    });

    const res = await fetch(`${baseUrl}/api/interview/my`, {
      headers: { Authorization: `Bearer ${regularToken}` }
    });

    assert.strictEqual(res.status, 200);
    const myInterviews = await res.json();
    assert.strictEqual(myInterviews.length, 1);
    assert.strictEqual(myInterviews[0].totalScore, 4);

    // Admin should see 0 in their personal /my interviews
    const adminMyRes = await fetch(`${baseUrl}/api/interview/my`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminMy = await adminMyRes.json();
    assert.strictEqual(adminMy.length, 0);
  });
});
