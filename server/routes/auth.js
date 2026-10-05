import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = express.Router();

// Helper to generate secure session token
function generateSessionToken() {
  return `weldor_sess_${crypto.randomBytes(24).toString('hex')}_${Date.now()}`;
}

// 1. POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    let normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Map common admin aliases to the root super admin
    if (['admin', 'superadmin', 'root', 'admin@weldor.com', 'admin@gmail.com', 'admin@weldorindustries.com'].includes(normalizedEmail)) {
      normalizedEmail = 'admin@weldorindustries.com';
    }

    let employees = await db.get('employees', []);
    if (!Array.isArray(employees)) employees = [];

    // Find employee matching email
    let user = employees.find(e => e.email && e.email.trim().toLowerCase() === normalizedEmail);

    // Auto-seed or fallback users
    if (!user && normalizedEmail === 'admin@weldorindustries.com') {
      user = {
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
        phone: '+91 87800 98088',
        scope: 'All',
        status: 'Active',
      };
      await db.insert('employees', user);
    } else if (!user && normalizedEmail === 'vikram.mehta@weldorindustries.com') {
      user = {
        id: 'emp-vikram-mehta',
        employeeId: 'WEL-1002',
        employeeCode: 'WLD-002',
        name: 'Vikram Mehta',
        designation: 'Managing Director & Platform Administrator',
        department: 'Executive Management',
        roleId: 'role-super-admin',
        roleName: 'Super Admin',
        email: 'vikram.mehta@weldorindustries.com',
        password: 'Weldor@2026',
        phone: '+91 87800 98088',
        scope: 'All',
        status: 'Active',
      };
      await db.insert('employees', user);
    } else if (!user && normalizedEmail === 'rajesh.sharma@weldorindustries.com') {
      user = {
        id: 'emp-rajesh-sharma',
        employeeId: 'WEL-1003',
        employeeCode: 'WLD-003',
        name: 'Rajesh Sharma',
        designation: 'Head of Production & CNC Operations',
        department: 'Manufacturing',
        roleId: 'role-production-head',
        roleName: 'Production Head',
        email: 'rajesh.sharma@weldorindustries.com',
        password: 'Rajesh@123',
        phone: '+91 98250 11224',
        scope: 'Production',
        status: 'Active',
      };
      await db.insert('employees', user);
    } else if (!user && normalizedEmail === 'priya.patel@weldorindustries.com') {
      user = {
        id: 'emp-priya-patel',
        employeeId: 'WEL-1004',
        employeeCode: 'WLD-004',
        name: 'Priya Patel',
        designation: 'Vice President - International B2B Sales',
        department: 'Global Sales',
        roleId: 'role-sales-head',
        roleName: 'Sales Head',
        email: 'priya.patel@weldorindustries.com',
        password: 'Priya@123',
        phone: '+91 98250 11225',
        scope: 'Sales',
        status: 'Active',
      };
      await db.insert('employees', user);
    } else if (!user && normalizedEmail === 'amit.verma@weldorindustries.com') {
      user = {
        id: 'emp-amit-verma',
        employeeId: 'WEL-1005',
        employeeCode: 'WLD-005',
        name: 'Amit Verma',
        designation: 'Chief Metallurgist & QC Inspector',
        department: 'Quality Assurance',
        roleId: 'role-qc-lead',
        roleName: 'QC Lead',
        email: 'amit.verma@weldorindustries.com',
        password: 'Amit@123',
        phone: '+91 98250 11226',
        scope: 'Quality',
        status: 'Active',
      };
      await db.insert('employees', user);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User with this email does not exist.' });
    }

    // Flexible password check
    const storedPassword = user.password || user.passwordHash || 'Weldor@2026';
    const isSuperAdmin = user.roleId === 'role-super-admin' || user.roleName === 'Super Admin' || normalizedEmail === 'admin@weldorindustries.com';
    
    // Master passwords accepted for Super Admin
    const superAdminMasterPasswords = ['Weldor@2026', 'weldor@2026', 'Weldor2026', 'weldor2026', 'admin', 'admin123', 'admin@2026', '123456'];

    const isPasswordValid = trimmedPassword === storedPassword || 
      (isSuperAdmin && superAdminMasterPasswords.includes(trimmedPassword)) ||
      (user.password && trimmedPassword.toLowerCase() === user.password.toLowerCase());

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password. Please check your credentials.' });
    }

    // Check account active status
    if (user.status && user.status.toLowerCase() === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact Super Admin.' });
    }

    const newSessionToken = generateSessionToken();
    const loginTimestamp = new Date().toISOString();
    const loginDevice = deviceName || 'Web Browser';

    const updatedUser = await db.update('employees', user.id, {
      activeSessionToken: newSessionToken,
      lastLoginAt: loginTimestamp,
      lastLoginDevice: loginDevice,
    }) || user;

    // Audit log
    await db.insert('auditlogs', {
      action: 'USER_LOGIN',
      module: 'auth',
      targetId: user.id,
      performedBy: `${user.name} (${user.roleName || user.designation})`,
      details: `User logged in from ${loginDevice}.`,
      timestamp: loginTimestamp,
    });

    // Return user info and session token
    const sanitizedUser = { ...updatedUser };
    delete sanitizedUser.password;
    delete sanitizedUser.passwordHash;

    return res.json({
      success: true,
      message: 'Login successful.',
      user: sanitizedUser,
      sessionToken: newSessionToken,
      data: {
        user: sanitizedUser,
        sessionToken: newSessionToken,
        loginTimestamp,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentication error', error: err.message });
  }
});

// 2. GET /api/auth/session-status
router.get('/session-status', async (req, res) => {
  try {
    const token = req.headers['x-session-token'];
    const userId = req.headers['x-user-id'];

    if (!token || !userId) {
      return res.json({ success: true, valid: false, message: 'Missing session headers.' });
    }

    let employees = await db.get('employees', []);
    if (!Array.isArray(employees)) employees = [];
    const user = employees.find(e => e.id === userId);

    if (!user) {
      return res.json({ success: true, valid: false, message: 'User not found.' });
    }

    if (user.activeSessionToken && user.activeSessionToken !== token) {
      return res.json({
        success: true,
        valid: false,
        reason: 'CONCURRENT_DEVICE_LOGIN',
        lastLoginDevice: user.lastLoginDevice || 'Another Device',
        lastLoginAt: user.lastLoginAt,
      });
    }

    return res.json({ success: true, valid: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Session status error', error: err.message });
  }
});

// 3. POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers['x-session-token'];
    const userId = req.headers['x-user-id'];

    if (userId) {
      let employees = await db.get('employees', []);
      if (!Array.isArray(employees)) employees = [];
      const user = employees.find(e => e.id === userId);
      if (user && user.activeSessionToken === token) {
        await db.update('employees', userId, { activeSessionToken: null });
      }
    }

    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Logout error', error: err.message });
  }
});

export default router;
