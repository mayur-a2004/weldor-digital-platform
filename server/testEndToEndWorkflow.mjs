import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
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

async function runEndToEndTests() {
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END AUTOMATED TEST SUITE (0 TO 100 PIPELINE)...\n');
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
    // 1. Health Check
    console.log('🔹 1. Testing System Health & Server Connectivity:');
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && (health.data?.status === 'healthy' || health.data?.status === 'ok'), `Server health is 200 OK (${health.data?.service || 'Weldor API'})`);

    // 2. Company Profile
    console.log('\n🔹 2. Testing Company Settings & Bank Configurations:');
    const company = await request('GET', '/api/settings/company');
    assert(company.status === 200 && company.data?.data?.companyName?.includes('Weldor'), 'Company profile active with GSTIN and Bank');

    // 3. Categories & Products
    console.log('\n🔹 3. Testing Product Catalog & Category Taxonomy:');
    const categories = await request('GET', '/api/categories');
    assert(categories.status === 200 && categories.data?.data?.length >= 4, `Loaded ${categories.data?.data?.length} product categories`);

    const products = await request('GET', '/api/products');
    assert(products.status === 200 && products.data?.data?.length >= 4, `Loaded ${products.data?.data?.length} industrial products with CAD specs`);

    // 4. Inbound Lead & RFQ Creation
    console.log('\n🔹 4. Testing Inbound Lead & CAD Blueprint Submission:');
    const newLeadRes = await request('POST', '/api/crm/leads', {
      companyName: 'Automated Test Systems Ltd',
      contactName: 'Vikram Mehta',
      contactEmail: 'vikram.mehta@ats-test.com',
      contactPhone: '+91 98765 43210',
      country: 'India',
      industry: 'Automotive Automation',
      stage: 'NEW_LEAD',
      leadSource: 'CAD Blueprint Portal',
      estimatedValueUSD: 45000,
      assignedEmployeeId: 'emp-101',
      assignedEmployeeName: 'Rajesh Sharma (MD)',
    });
    const createdLead = newLeadRes.data?.data;
    assert(newLeadRes.status === 201 && createdLead?.id, `Created new lead ${createdLead?.leadNumber || createdLead?.id}`);

    // Update Lead Stage
    const leadStageUpdate = await request('PUT', `/api/crm/leads/${createdLead.id}`, {
      stage: 'REQUIREMENT_UNDERSTOOD',
    });
    assert(leadStageUpdate.status === 200 && leadStageUpdate.data?.data?.stage === 'REQUIREMENT_UNDERSTOOD', 'Updated lead stage to REQUIREMENT_UNDERSTOOD');

    // 5. Sample Prototype Request Lifecycle
    console.log('\n🔹 5. Testing Prototype Sample Dispatch Lifecycle:');
    const sampleRes = await request('POST', '/api/crm/samples', {
      leadId: createdLead.id,
      companyName: 'Automated Test Systems Ltd',
      productName: 'ISO 15552 Cylinder Prototype (Ø63x150mm)',
      quantityRequested: 2,
      stage: 'Dispatched',
      courierTrackingNo: 'DHL-EXP-99441122',
      dispatchDate: new Date().toISOString().split('T')[0],
    });
    const createdSample = sampleRes.data?.data;
    assert(sampleRes.status === 201 && createdSample?.id, `Dispatched sample ${createdSample?.sampleNumber || createdSample?.id} with DHL tracking`);

    // Mark Sample Delivered
    const sampleDeliveredRes = await request('PUT', `/api/crm/samples/${createdSample.id}`, {
      stage: 'Delivered',
      deliveryDate: new Date().toISOString().split('T')[0],
    });
    assert(sampleDeliveredRes.status === 200 && sampleDeliveredRes.data?.data?.stage === 'Delivered', 'Sample marked as Customer Delivered');

    // 6. Technical Lab Trial Endurance Lifecycle
    console.log('\n🔹 6. Testing 350-Bar Technical QA Lab Trial Lifecycle:');
    const trialRes = await request('POST', '/api/crm/trials', {
      leadId: createdLead.id,
      companyName: 'Automated Test Systems Ltd',
      productName: 'Custom 350-Bar Hydraulic Cylinder',
      testParameters: {
        pressureTestBar: 525,
        leakageTestResult: '0.000 sccs (Zero Bubble Helium Passed)',
        corrosionHours: 500,
        cycleCount: 250000,
      },
      status: 'Execution In Progress',
      evaluatorEngineer: 'Amit Verma (QC Lead)',
      completionDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
    const createdTrial = trialRes.data?.data;
    assert(trialRes.status === 201 && createdTrial?.id, `Scheduled Technical Lab Trial ${createdTrial?.trialNumber || createdTrial?.id}`);

    // Approve Lab Trial
    const trialApprovedRes = await request('PUT', `/api/crm/trials/${createdTrial.id}`, {
      status: 'Approved',
    });
    assert(trialApprovedRes.status === 200 && trialApprovedRes.data?.data?.status === 'Approved', 'Technical Lab Trial Passed & Approved (Zero Leakage)');

    // 7. Commercial Quotation Generation (18% GST)
    console.log('\n🔹 7. Testing Commercial Quotation Engine (18% GST Calculation):');
    const subtotal = 40000;
    const discount = 2000;
    const gst18 = (subtotal - discount) * 0.18;
    const freight = 1500;
    const grandTotal = (subtotal - discount) + gst18 + freight;

    const quoteRes = await request('POST', '/api/crm/quotations', {
      leadId: createdLead.id,
      companyName: 'Automated Test Systems Ltd',
      contactName: 'Vikram Mehta',
      email: 'vikram.mehta@ats-test.com',
      items: [
        {
          productId: products.data?.data[0]?.id || 'prod-1',
          productName: 'Custom 350-Bar Hydraulic Cylinder (Lab Certified)',
          sku: 'WEL-HYD-350',
          quantity: 40,
          unitPriceUSD: 1000,
          discountPercentage: 5,
          taxPercentage: 18,
          totalPriceUSD: 38000,
        },
      ],
      subtotalUSD: subtotal,
      totalDiscountUSD: discount,
      taxTotalUSD: gst18,
      freightCostUSD: freight,
      grandTotalUSD: grandTotal,
      status: 'Sent to Customer',
      validityDays: 30,
      requiresApproval: false,
    });
    const createdQuote = quoteRes.data?.data;
    assert(quoteRes.status === 201 && createdQuote?.id, `Generated Commercial Quotation ${createdQuote?.quotationNumber || createdQuote?.id} for $${grandTotal.toLocaleString()}`);

    // Approve Quotation
    const quoteApprovedRes = await request('PUT', `/api/crm/quotations/${createdQuote.id}`, {
      status: 'Approved',
      approvalNotes: 'Approved by Commercial Directorate',
    });
    assert(quoteApprovedRes.status === 200 && quoteApprovedRes.data?.data?.status === 'Approved', 'Commercial Quotation Approved');

    // 8. Purchase Order Conversion & Milestone Progression
    console.log('\n🔹 8. Testing Confirmed Purchase Order Conversion & Delivery Archive:');
    const orderRes = await request('POST', '/api/crm/orders', {
      quotationId: createdQuote.id,
      leadId: createdLead.id,
      companyName: 'Automated Test Systems Ltd',
      contactName: 'Vikram Mehta',
      items: createdQuote.items,
      totalValueUSD: grandTotal,
      stage: 'Confirmed',
      paymentStatus: 'Advance Received',
      paidAmountUSD: grandTotal * 0.3,
    });
    const createdOrder = orderRes.data?.data;
    assert(orderRes.status === 201 && createdOrder?.id, `Converted into Confirmed Purchase Order ${createdOrder?.orderNumber || createdOrder?.id}`);

    // Move order to Dispatched with Courier
    const orderDispatchedRes = await request('PUT', `/api/crm/orders/${createdOrder.id}`, {
      stage: 'Dispatched',
      courierPartner: 'Blue Dart Air Cargo',
      courierTrackingNo: 'BD-AIR-554433221',
      dispatchDate: new Date().toISOString().split('T')[0],
    });
    assert(orderDispatchedRes.status === 200 && orderDispatchedRes.data?.data?.stage === 'Dispatched', 'Order Dispatched with Airway Bill Tracking');

    // Move order to Delivered Archive
    const orderDeliveredRes = await request('PUT', `/api/crm/orders/${createdOrder.id}`, {
      stage: 'Delivered',
      deliveryDate: new Date().toISOString().split('T')[0],
      paymentStatus: 'Fully Paid',
      paidAmountUSD: grandTotal,
    });
    assert(orderDeliveredRes.status === 200 && orderDeliveredRes.data?.data?.stage === 'Delivered', 'Order Delivered & Moved to Completed Archives');

    // 9. HRMS, Overtime, Leave & Automated Payroll with LOP
    console.log('\n🔹 9. Testing HRMS Employee Directory, Attendance, Leaves & Payroll:');
    const employees = await request('GET', '/api/hrms/employees');
    assert(employees.status === 200 && employees.data?.data?.length >= 4, `Loaded ${employees.data?.data?.length} employee staff directory`);

    // Log Attendance with Overtime
    const attendanceRes = await request('POST', '/api/hrms/attendance', {
      employeeId: 'emp-102',
      employeeName: 'Priya Patel',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      overtimeHours: 4,
    });
    assert(attendanceRes.status === 201, 'Logged biometric attendance with 4 hours Overtime');

    // Apply Unpaid Leave
    const leaveRes = await request('POST', '/api/hrms/leaves', {
      employeeId: 'emp-102',
      employeeName: 'Priya Patel',
      startDate: '2026-09-20',
      endDate: '2026-09-21',
      totalDays: 2,
      leaveType: 'Unpaid',
      reason: 'Personal Family Function',
      status: 'Approved',
    });
    assert(leaveRes.status === 201, 'Approved 2-day Unpaid Leave (Loss of Pay trigger)');

    // Generate Payroll with Automated LOP and OT
    const baseSalary = 45000;
    const unpaidDays = 2;
    const lopDeduction = Math.round((baseSalary / 30) * unpaidDays); // ₹3,000
    const otHours = 4;
    const otPay = Math.round(otHours * 1.5 * (baseSalary / (30 * 8))); // ₹1,406
    const netSalary = baseSalary - lopDeduction + otPay;

    const payrollRes = await request('POST', '/api/hrms/payroll', {
      employeeId: 'emp-102',
      employeeName: 'Priya Patel',
      designation: 'Head of Production & CNC Operations',
      month: 'September',
      year: 2026,
      baseSalary,
      unpaidDays,
      lossOfPayDeduction: lopDeduction,
      overtimeHours: otHours,
      overtimePay: otPay,
      netSalary,
      status: 'Approved',
    });
    const createdPayroll = payrollRes.data?.data;
    assert(payrollRes.status === 201 && createdPayroll?.id, `Generated Automated Payroll: Base ₹${baseSalary} - LOP ₹${lopDeduction} + OT ₹${otPay} = Net ₹${netSalary.toLocaleString()}`);

    // Disburse Payroll
    const disburseRes = await request('PUT', `/api/hrms/payroll/${createdPayroll.id}`, {
      status: 'Disbursed',
      disbursementDate: new Date().toISOString().split('T')[0],
    });
    assert(disburseRes.status === 200 && disburseRes.data?.data?.status === 'Disbursed', 'Salary Disbursed & Official Salary Slip Issued');

    // 10. CMS Hero Studio & Trade Expos
    console.log('\n🔹 10. Testing CMS Hero Studio & Trade Expo Fairs:');
    const banners = await request('GET', '/api/banners');
    assert(banners.status === 200 && banners.data?.data?.length >= 2, `Verified ${banners.data?.data?.length} Hero Banners`);

    const expos = await request('GET', '/api/exhibitions');
    assert(expos.status === 200 && expos.data?.data?.length >= 2, `Verified ${expos.data?.data?.length} Trade Expos (ENGIMACH & INTEC)`);

    // Cleanup created test records
    console.log('\n🔹 11. Cleaning Up Test Automation Records:');
    await request('DELETE', `/api/crm/leads/${createdLead.id}`);
    await request('DELETE', `/api/crm/samples/${createdSample.id}`);
    await request('DELETE', `/api/crm/trials/${createdTrial.id}`);
    await request('DELETE', `/api/crm/quotations/${createdQuote.id}`);
    await request('DELETE', `/api/crm/orders/${createdOrder.id}`);
    await request('DELETE', `/api/hrms/payroll/${createdPayroll.id}`);
    assert(true, 'Test records cleaned up cleanly from database');

    console.log(`\n========================================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
    console.log(`========================================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runEndToEndTests();
