import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runAuthTests() {
  console.log('🚀 TESTING ENTERPRISE AUTHENTICATION & SINGLE ACTIVE SESSION CONCURRENCY...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Invalid login attempt
    console.log('🔹 1. Testing Invalid Credentials Rejection:');
    const invalidLogin = await request('POST', '/api/auth/login', {
      email: 'admin@weldorindustries.com',
      password: 'WrongPassword123',
    });
    assert(invalidLogin.status === 401 && invalidLogin.data?.success === false, 'Rejected incorrect password with 401 Unauthorized');

    // 2. Successful Login for Super Admin (Device A)
    console.log('\n🔹 2. Testing Super Admin Login on Device A (Workstation 1):');
    const loginA = await request('POST', '/api/auth/login', {
      email: 'admin@weldorindustries.com',
      password: 'Weldor@2026',
      deviceName: 'Chrome Workstation A (Office)',
    });
    const tokenA = loginA.data?.sessionToken;
    const userA = loginA.data?.user;
    assert(loginA.status === 200 && tokenA && userA?.roleName === 'Super Admin', `Device A logged in. Issued session token: ${tokenA?.slice(0, 20)}...`);

    // 3. Verify Session for Device A
    console.log('\n🔹 3. Testing Session Heartbeat for Device A:');
    const verifyA1 = await request('GET', '/api/auth/verify-session', null, {
      'x-session-token': tokenA,
      'x-user-id': userA.id,
    });
    assert(verifyA1.status === 200 && verifyA1.data?.active === true, 'Device A session is active and verified by server');

    // 4. Concurrent Login on Device B (Laptop / Home System) with same account
    console.log('\n🔹 4. Testing Concurrent Login on Device B (Chrome Laptop):');
    const loginB = await request('POST', '/api/auth/login', {
      email: 'admin@weldorindustries.com',
      password: 'Weldor@2026',
      deviceName: 'Chrome Laptop B (Home)',
    });
    const tokenB = loginB.data?.sessionToken;
    assert(loginB.status === 200 && tokenB && tokenB !== tokenA, `Device B logged in. Issued NEW session token: ${tokenB?.slice(0, 20)}...`);

    // 5. Verify Device B has the active session
    console.log('\n🔹 5. Verifying Device B Session is Active:');
    const verifyB = await request('GET', '/api/auth/verify-session', null, {
      'x-session-token': tokenB,
      'x-user-id': userA.id,
    });
    assert(verifyB.status === 200 && verifyB.data?.active === true, 'Device B holds the currently valid active session');

    // 6. Real-Time Heartbeat on Device A (Old Device) MUST receive SESSION_TERMINATED
    console.log('\n🔹 6. Testing Real-Time Invalidation / Auto-Logout on Device A:');
    const verifyA2 = await request('GET', '/api/auth/verify-session', null, {
      'x-session-token': tokenA,
      'x-user-id': userA.id,
    });
    assert(
      verifyA2.status === 401 && verifyA2.data?.error === 'SESSION_TERMINATED',
      `Device A token rejected! Server returned SESSION_TERMINATED: "${verifyA2.data?.message}"`
    );

    // 7. Test Clean Logout
    console.log('\n🔹 7. Testing Clean Logout:');
    const logoutRes = await request('POST', '/api/auth/logout', { userId: userA.id }, {
      'x-session-token': tokenB,
    });
    assert(logoutRes.status === 200 && logoutRes.data?.success === true, 'Device B logged out cleanly');

    const verifyAfterLogout = await request('GET', '/api/auth/verify-session', null, {
      'x-session-token': tokenB,
      'x-user-id': userA.id,
    });
    assert(verifyAfterLogout.status === 401, 'Terminated session verified as inactive (401)');

    console.log(`\n========================================================`);
    console.log(`🎉 AUTHENTICATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log(`========================================================\n`);

    if (failed > 0) process.exit(1);
    else process.exit(0);
  } catch (e) {
    console.error('Fatal auth test error:', e);
    process.exit(1);
  }
}

runAuthTests();
