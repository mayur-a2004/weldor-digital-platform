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
  }
];

// --- ROLES & RBAC ---
router.get('/roles', async (req, res) => {
  try {
    let roles = await db.get('roles', DEFAULT_SYSTEM_ROLES);
    if (!Array.isArray(roles) || roles.length === 0) {
      roles = DEFAULT_SYSTEM_ROLES;
      await db.set('roles', roles);
    }
    res.json({ success: true, count: roles.length, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch roles', error: err.message });
  }
});

router.post('/roles', async (req, res) => {
  try {
    const role = await db.insert('roles', req.body);
    res.status(201).json({ success: true, message: 'Role created', data: role });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create role', error: err.message });
  }
});

router.put('/roles/:id', async (req, res) => {
  try {
    const updated = await db.update('roles', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Role not found' });
    res.json({ success: true, message: 'Role updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update role', error: err.message });
  }
});

router.delete('/roles/:id', async (req, res) => {
  try {
    const deleted = await db.delete('roles', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Role not found' });
    res.json({ success: true, message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete role', error: err.message });
  }
});

// --- EMPLOYEES ---
router.get('/employees', async (req, res) => {
  try {
    let employees = await db.get('employees', []);
    if (!Array.isArray(employees)) employees = [];
    res.json({ success: true, count: employees.length, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch employees', error: err.message });
  }
});

router.post('/employees', async (req, res) => {
  try {
    const employee = await db.insert('employees', req.body);
    res.status(201).json({ success: true, message: 'Employee onboarded', data: employee });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create employee', error: err.message });
  }
});

router.put('/employees/:id', async (req, res) => {
  try {
    const updated = await db.update('employees', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee profile updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update employee', error: err.message });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const deleted = await db.delete('employees', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.json({ success: true, message: 'Employee removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete employee', error: err.message });
  }
});

// --- PAYROLL ---
router.get('/payroll', async (req, res) => {
  try {
    let payroll = await db.get('payrolls', []);
    if (!Array.isArray(payroll)) payroll = [];
    res.json({ success: true, count: payroll.length, data: payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch payroll', error: err.message });
  }
});

router.post('/payroll', async (req, res) => {
  try {
    const record = await db.insert('payrolls', req.body);
    res.status(201).json({ success: true, message: 'Payroll record created', data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create payroll', error: err.message });
  }
});

router.put('/payroll/:id', async (req, res) => {
  try {
    const updated = await db.update('payrolls', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.json({ success: true, message: 'Payroll record updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update payroll', error: err.message });
  }
});

router.delete('/payroll/:id', async (req, res) => {
  try {
    const deleted = await db.delete('payrolls', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Payroll record not found' });
    res.json({ success: true, message: 'Payroll record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete payroll', error: err.message });
  }
});

// Bulk payroll operations
router.post('/payroll/bulk', async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records)) {
      return res.status(400).json({ success: false, message: 'records array is required' });
    }
    const results = [];
    for (const record of records) {
      const inserted = await db.insert('payrolls', record);
      results.push(inserted);
    }
    res.status(201).json({ success: true, message: `${results.length} payroll records created`, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to bulk create payroll', error: err.message });
  }
});

// --- ATTENDANCE & LEAVES ---
router.get('/attendance', async (req, res) => {
  try {
    let attendance = await db.get('attendances', []);
    if (!Array.isArray(attendance)) attendance = [];
    res.json({ success: true, count: attendance.length, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch attendance', error: err.message });
  }
});

router.post('/attendance', async (req, res) => {
  try {
    const record = await db.insert('attendances', req.body);
    res.status(201).json({ success: true, message: 'Attendance logged', data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to log attendance', error: err.message });
  }
});

router.put('/attendance/:id', async (req, res) => {
  try {
    const updated = await db.update('attendances', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance record updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update attendance', error: err.message });
  }
});

router.delete('/attendance/:id', async (req, res) => {
  try {
    const deleted = await db.delete('attendances', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Attendance record not found' });
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete attendance', error: err.message });
  }
});

router.get('/leaves', async (req, res) => {
  try {
    let leaves = await db.get('leaves', []);
    if (!Array.isArray(leaves)) leaves = [];
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch leaves', error: err.message });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const leave = await db.insert('leaves', req.body);
    res.status(201).json({ success: true, message: 'Leave request submitted', data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit leave', error: err.message });
  }
});

router.put('/leaves/:id', async (req, res) => {
  try {
    const updated = await db.update('leaves', req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Leave request not found' });
    res.json({ success: true, message: 'Leave status updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update leave', error: err.message });
  }
});

router.delete('/leaves/:id', async (req, res) => {
  try {
    const deleted = await db.delete('leaves', req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Leave request not found' });
    res.json({ success: true, message: 'Leave request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete leave', error: err.message });
  }
});

export default router;
