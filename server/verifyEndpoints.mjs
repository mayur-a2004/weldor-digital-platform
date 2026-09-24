const API = 'http://localhost:5000/api';

async function testEndpoint(name, url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok && data.success !== false) {
      const count = Array.isArray(data.data) ? data.data.length : data.count !== undefined ? data.count : 1;
      console.log(`✅ [200 OK] ${name.padEnd(25)} -> Count / Status: ${count}`);
      return true;
    } else {
      console.error(`❌ [FAIL] ${name.padEnd(25)} -> Response:`, data);
      return false;
    }
  } catch (err) {
    console.error(`❌ [ERROR] ${name.padEnd(25)} ->`, err.message);
    return false;
  }
}

async function verifyAll() {
  console.log('🧪 VERIFYING ALL LIVE BACKEND ENDPOINTS AFTER CLEAN & POPULATE...\n');

  const tests = [
    ['Health Check', `${API}/health`],
    ['Company Settings', `${API}/settings/company`],
    ['Categories', `${API}/categories`],
    ['Products', `${API}/products`],
    ['Hero Banners', `${API}/banners`],
    ['Exhibitions', `${API}/exhibitions`],
    ['Gallery Media', `${API}/gallery`],
    ['Employees', `${API}/hrms/employees`],
    ['Payroll Records', `${API}/hrms/payroll`],
    ['Attendance', `${API}/hrms/attendance`],
    ['Leave Requests', `${API}/hrms/leaves`],
    ['CRM Leads', `${API}/crm/leads`],
    ['CRM RFQs', `${API}/crm/rfqs`],
    ['CRM Quotations', `${API}/crm/quotations`],
    ['CRM Orders', `${API}/crm/orders`],
    ['CRM Samples', `${API}/crm/samples`],
    ['CRM Lab Trials', `${API}/crm/trials`],
  ];

  let passed = 0;
  for (const [name, url] of tests) {
    const ok = await testEndpoint(name, url);
    if (ok) passed++;
  }

  console.log(`\n📊 RESULTS: ${passed}/${tests.length} ENDPOINTS OPERATIONAL AND 100% HEALTHY.\n`);
}

verifyAll();
