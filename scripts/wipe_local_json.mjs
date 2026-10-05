import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  path.join(__dirname, '..', 'server', 'data'),
  path.join(__dirname, '..', 'weldor-digital', 'server', 'data')
];

const emptyArrayCollections = [
  'products', 'categories', 'leads', 'rfqs', 'quotations',
  'orders', 'invoices', 'samples', 'trials', 'exhibitions',
  'gallery', 'banners', 'payroll', 'payrolls', 'attendance',
  'attendances', 'leaves', 'auditLogs', 'audit_logs'
];

const SUPER_ADMIN_EMPLOYEE = [
  {
    id: 'emp-root-superadmin',
    employeeId: 'WEL-1001',
    employeeCode: 'WLD-001',
    name: 'Super Admin',
    designation: 'Managing Director & Platform Administrator',
    department: 'Executive Management',
    roleId: 'role-super-admin',
    roleName: 'Super Admin',
    email: 'admin@weldorindustries.com',
    password: 'Weldor@2026',
    phone: '+91 98250 11223',
    status: 'Active',
    scope: 'All',
    salaryStructure: {
      baseSalary: 100000,
      hra: 40000,
      da: 20000,
      specialAllowance: 20000,
      conveyanceAllowance: 3000,
      medicalAllowance: 3000,
      grossMonthlySalary: 186000,
      netMonthlySalary: 158800,
      annualCTC: 2376000
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SUPER_ADMIN_USER = [
  {
    id: 'usr_admin_1',
    username: 'admin',
    email: 'admin@weldorindustries.com',
    name: 'Super Admin',
    role: 'Super Admin',
    avatar: '/weldor-logo.png',
    password: 'Weldor@2026'
  }
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;

  for (const name of emptyArrayCollections) {
    const file = path.join(dir, `${name}.json`);
    fs.writeFileSync(file, '[]', 'utf8');
    console.log(`Reset ${file} to []`);
  }

  const empFile = path.join(dir, 'employees.json');
  fs.writeFileSync(empFile, JSON.stringify(SUPER_ADMIN_EMPLOYEE, null, 2), 'utf8');
  console.log(`Preserved Super Admin in ${empFile}`);

  const userFile = path.join(dir, 'users.json');
  fs.writeFileSync(userFile, JSON.stringify(SUPER_ADMIN_USER, null, 2), 'utf8');
  console.log(`Preserved Super Admin in ${userFile}`);
}

console.log('✅ Local JSON databases successfully wiped!');
