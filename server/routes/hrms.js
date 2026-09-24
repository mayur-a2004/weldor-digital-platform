import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const DEFAULT_SYSTEM_ROLES = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full system access across public site, CMS, CRM, HRMS, Payroll, security, RBAC, and integrations.',
    isSystem: true,
    scope: 'All',
    permissions: [
      { module: 'dashboard', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export', 'publish'] },
      { module: 'leads', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'rfqs', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'quotations', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'orders', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'employees', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'payroll', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'attendance', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'samples', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'trials', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve', 'export'] },
      { module: 'products', actions: ['view', 'create', 'edit', 'delete', 'publish', 'export'] },
      { module: 'cms', actions: ['view', 'create', 'edit', 'delete', 'publish', 'export'] },
      { module: 'exhibitions', actions: ['view', 'create', 'edit', 'delete', 'publish', 'export'] },
      { module: 'settings', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      { module: 'rbac', actions: ['view', 'create', 'edit', 'delete', 'assign', 'approve'] },
      { module: 'audit', actions: ['view', 'export'] },
    ]
  },
  {
    id: 'role-sales-manager',
    name: 'Sales Manager',
    description: 'Manages team leads, quotation approvals, pipeline targets, and performance reports.',
    isSystem: false,
    scope: 'Team',
    permissions: [
      { module: 'dashboard', actions: ['view', 'export'] },
      { module: 'leads', actions: ['view', 'create', 'edit', 'assign', 'export'] },
      { module: 'rfqs', actions: ['view', 'create', 'edit', 'assign', 'export'] },
      { module: 'quotations', actions: ['view', 'create', 'edit', 'approve', 'export'] },
      { module: 'orders', actions: ['view', 'create', 'edit', 'approve', 'export'] },
      { module: 'samples', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'trials', actions: ['view', 'create', 'edit'] },
      { module: 'products', actions: ['view'] }
    ]
  },
  {
    id: 'role-hr-manager',
    name: 'HR & Payroll Manager',
    description: 'Manages employee directory, biometric attendance, salary generation, and compliance.',
    isSystem: false,
    scope: 'All',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'employees', actions: ['view', 'create', 'edit', 'delete', 'approve', 'export'] },
      { module: 'payroll', actions: ['view', 'create', 'edit', 'approve', 'export'] },
      { module: 'attendance', actions: ['view', 'create', 'edit', 'approve', 'export'] },
      { module: 'audit', actions: ['view'] }
    ]
  },
  {
    id: 'role-sales-exec',
    name: 'Sales Executive',
    description: 'Assigned customer leads, client RFQs, and generating basic quotations.',
    isSystem: false,
    scope: 'Assigned',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'leads', actions: ['view', 'create', 'edit'] },
      { module: 'rfqs', actions: ['view', 'create', 'edit'] },
      { module: 'quotations', actions: ['view', 'create', 'edit'] },
      { module: 'samples', actions: ['view', 'create'] },
      { module: 'products', actions: ['view'] }
    ]
  },
  {
    id: 'role-quality-inspector',
    name: 'Quality Inspector & Lab Tech',
    description: 'Executes technical trials, validates sample metallurgy tolerances and test certificates.',
    isSystem: false,
    scope: 'Assigned',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'samples', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'trials', actions: ['view', 'create', 'edit', 'approve'] },
      { module: 'products', actions: ['view'] }
    ]
  }
];

// --- ROLES & RBAC ---
router.get('/roles', (req, res) => {
  let roles = db.get('roles', DEFAULT_SYSTEM_ROLES);
  if (!Array.isArray(roles) || roles.length === 0) {
    roles = DEFAULT_SYSTEM_ROLES;
    db.set('roles', roles);
  }
  res.json({ success: true, count: roles.length, data: roles });
});

router.post('/roles', (req, res) => {
  const roleData = {
    ...req.body,
    id: req.body.id || `role-${Date.now()}`,
    isSystem: false,
    scope: req.body.scope || 'Assigned',
    permissions: req.body.permissions || [],
  };
  let roles = db.get('roles', DEFAULT_SYSTEM_ROLES);
  if (!Array.isArray(roles)) roles = DEFAULT_SYSTEM_ROLES;
  roles.push(roleData);
  db.set('roles', roles);
  res.status(201).json({ success: true, message: 'Custom role created', data: roleData });
});

router.put('/roles/:id', (req, res) => {
  let roles = db.get('roles', DEFAULT_SYSTEM_ROLES);
  if (!Array.isArray(roles)) roles = DEFAULT_SYSTEM_ROLES;
  const index = roles.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Role not found' });
  
  // Super admin remains system role
  const isSuperAdmin = req.params.id === 'role-super-admin' || roles[index].name === 'Super Admin';
  roles[index] = {
    ...roles[index],
    ...req.body,
    isSystem: isSuperAdmin ? true : (roles[index].isSystem ?? false),
    updatedAt: new Date().toISOString()
  };
  db.set('roles', roles);
  res.json({ success: true, message: 'Role updated', data: roles[index] });
});

router.delete('/roles/:id', (req, res) => {
  if (req.params.id === 'role-super-admin') {
    return res.status(400).json({ success: false, message: 'Super Admin system role cannot be deleted' });
  }
  let roles = db.get('roles', DEFAULT_SYSTEM_ROLES);
  if (!Array.isArray(roles)) roles = DEFAULT_SYSTEM_ROLES;
  const filtered = roles.filter(r => r.id !== req.params.id && r.name !== 'Super Admin');
  db.set('roles', filtered);
  res.json({ success: true, message: 'Role deleted' });
});

// --- EMPLOYEES ---
router.get('/employees', (req, res) => {
  let employees = db.get('employees', []);
  if (!Array.isArray(employees)) employees = [];
  res.json({ success: true, count: employees.length, data: employees });
});

router.post('/employees', (req, res) => {
  const empData = {
    ...req.body,
    password: req.body.password || 'Weldor@2026',
    status: req.body.status || 'Active',
  };
  const newEmp = db.insert('employees', empData);
  res.status(201).json({ success: true, message: 'Employee onboarded', data: newEmp });
});

router.put('/employees/:id', (req, res) => {
  const updated = db.update('employees', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, message: 'Employee updated', data: updated });
});

router.delete('/employees/:id', (req, res) => {
  const deleted = db.delete('employees', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, message: 'Employee deleted' });
});

// --- PAYROLL ---
router.get('/payroll', (req, res) => {
  let payrolls = db.get('payrolls', []);
  if (!Array.isArray(payrolls)) payrolls = [];
  res.json({ success: true, count: payrolls.length, data: payrolls });
});

router.post('/payroll', (req, res) => {
  const rec = db.insert('payrolls', req.body);
  res.status(201).json({ success: true, message: 'Payroll record created', data: rec });
});

router.post('/payroll/bulk', (req, res) => {
  const records = req.body.records || (Array.isArray(req.body) ? req.body : []);
  let payrolls = db.get('payrolls', []);
  if (!Array.isArray(payrolls)) payrolls = [];

  const created = [];
  for (const r of records) {
    const existingIndex = payrolls.findIndex(p => p.id === r.id || (p.employeeId === r.employeeId && p.payrollMonth === r.payrollMonth && p.payrollYear === r.payrollYear));
    if (existingIndex >= 0) {
      payrolls[existingIndex] = { ...payrolls[existingIndex], ...r };
      created.push(payrolls[existingIndex]);
    } else {
      const item = { ...r, id: r.id || `pay-${Date.now()}-${Math.floor(Math.random()*1000)}` };
      payrolls.unshift(item);
      created.push(item);
    }
  }

  db.set('payrolls', payrolls);
  res.status(201).json({ success: true, message: `Processed ${created.length} payroll records`, data: created });
});

router.put('/payroll/:id', (req, res) => {
  const updated = db.update('payrolls', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Payroll record not found' });
  res.json({ success: true, message: 'Payroll record updated', data: updated });
});

router.delete('/payroll/:id', (req, res) => {
  const deleted = db.delete('payrolls', req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Payroll record not found' });
  res.json({ success: true, message: 'Payroll record deleted' });
});

// --- ATTENDANCE ---
router.get('/attendance', (req, res) => {
  let attendance = db.get('attendance', []);
  if (!Array.isArray(attendance)) attendance = [];
  res.json({ success: true, count: attendance.length, data: attendance });
});

router.post('/attendance', (req, res) => {
  const record = db.insert('attendance', req.body);
  res.status(201).json({ success: true, message: 'Attendance logged', data: record });
});

router.put('/attendance/:id', (req, res) => {
  const updated = db.update('attendance', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.json({ success: true, message: 'Attendance record updated', data: updated });
});

// --- LEAVES ---
router.get('/leaves', (req, res) => {
  let leaves = db.get('leaves', []);
  if (!Array.isArray(leaves)) leaves = [];
  res.json({ success: true, count: leaves.length, data: leaves });
});

router.post('/leaves', (req, res) => {
  const leave = db.insert('leaves', req.body);
  res.status(201).json({ success: true, message: 'Leave request submitted', data: leave });
});

router.put('/leaves/:id', (req, res) => {
  const updated = db.update('leaves', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Leave request not found' });
  res.json({ success: true, message: 'Leave request updated', data: updated });
});

export default router;
