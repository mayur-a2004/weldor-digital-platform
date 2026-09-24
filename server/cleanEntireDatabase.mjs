import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function cleanEntireDatabase() {
  console.log('🧹 COMPLETELY WIPING ALL DATABASE COLLECTIONS & MOCK/SEED DATA...');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const collections = [
    'categories',
    'products',
    'banners',
    'exhibitions',
    'gallery',
    'leads',
    'rfqs',
    'quotations',
    'orders',
    'samples',
    'trials',
    'payrolls',
    'attendance',
    'leaves',
    'auditLogs',
    'audit_logs'
  ];

  for (const col of collections) {
    fs.writeFileSync(path.join(DATA_DIR, `${col}.json`), JSON.stringify([], null, 2), 'utf-8');
    console.log(`  🗑️ Cleared: ${col}.json -> []`);
  }

  // Blank settings
  fs.writeFileSync(path.join(DATA_DIR, 'settings.json'), JSON.stringify({}, null, 2), 'utf-8');
  console.log('  🗑️ Reset: settings.json -> {}');

  // Clean uploads directory
  if (fs.existsSync(UPLOADS_DIR)) {
    const uploadFiles = fs.readdirSync(UPLOADS_DIR);
    for (const file of uploadFiles) {
      const filePath = path.join(UPLOADS_DIR, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
        console.log(`  🗑️ Removed upload file: ${file}`);
      }
    }
  }

  // Retain ONLY the root Super Admin account for administrative access
  const superAdminOnly = [
    {
      id: 'emp-root-superadmin',
      employeeId: 'WEL-1001',
      employeeCode: 'WLD-001',
      name: 'Super Admin',
      fatherName: '',
      dateOfBirth: '1985-01-01',
      dateOfJoining: new Date().toISOString().split('T')[0],
      gender: 'Male',
      employmentType: 'Full-Time',
      designation: 'Managing Director & Platform Administrator',
      department: 'Executive Management',
      roleId: 'role-super-admin',
      roleName: 'Super Admin',
      reportingManager: 'Board of Directors',
      email: 'admin@weldorindustries.com',
      password: 'Weldor@2026',
      phone: '+91 98250 11223',
      bankDetails: {
        bankName: 'State Bank of India',
        accountNumber: '',
        ifscCode: '',
        branch: 'Metoda GIDC, Rajkot',
        accountType: 'Salary'
      },
      salaryStructure: {
        baseSalary: 100000,
        hra: 40000,
        da: 20000,
        specialAllowance: 20000,
        conveyanceAllowance: 3000,
        medicalAllowance: 3000,
        pfDeductionEmployee: 12000,
        pfDeductionEmployer: 12000,
        professionalTax: 200,
        tdsTax: 15000,
        grossMonthlySalary: 186000,
        netMonthlySalary: 158800,
        annualCTC: 2376000
      },
      territory: ['All'],
      productCategories: ['All'],
      scope: 'All',
      status: 'Active',
      avatarUrl: '',
      address: {
        currentAddress: 'GIDC Industrial Area',
        city: 'Rajkot',
        state: 'Gujarat',
        pincode: '360021'
      },
      createdAt: new Date().toISOString()
    }
  ];

  fs.writeFileSync(path.join(DATA_DIR, 'employees.json'), JSON.stringify(superAdminOnly, null, 2), 'utf-8');
  console.log('  👤 Configured: employees.json -> [1 Root Super Admin]');

  console.log('\n✨ ALL DATABASE FILES, FAKE, MOCK, AND SEED DATA HAVE BEEN COMPLETELY CLEANED!');
}

cleanEntireDatabase();
