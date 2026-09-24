import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { 
  Role, 
  Employee, 
  Product, 
  ProductCategory, 
  Lead, 
  LeadStage, 
  RFQRequirement, 
  SampleRequest, 
  TechnicalTrial, 
  Quotation, 
  Order, 
  Exhibition, 
  GalleryMedia,
  AuditLog, 
  CRMModule, 
  PermissionAction,
  HeroBanner,
  PayrollRecord,
  AttendanceRecord,
  LeaveRequest,
  CompanySettings
} from '../types';
import { INITIAL_ROLES } from '../config/roles';

export type ViewMode = 
  | 'public-home'
  | 'public-products'
  | 'public-about'
  | 'public-contact'
  | 'public-gallery'
  | 'public-rfq'
  | 'public-exhibitions'
  | 'public-expo-landing'
  | 'auth-login'
  | 'crm-dashboard'
  | 'crm-leads'
  | 'crm-rfqs'
  | 'crm-samples'
  | 'crm-trials'
  | 'crm-quotations'
  | 'crm-invoices'
  | 'crm-orders'
  | 'crm-indiamart'
  | 'crm-bulk-studio'
  | 'crm-cms'
  | 'crm-products'
  | 'crm-categories'
  | 'crm-gallery'
  | 'crm-banners'
  | 'crm-exhibitions'
  | 'crm-employees'
  | 'crm-payroll'
  | 'crm-attendance'
  | 'crm-settings'
  | 'crm-rbac'
  | 'crm-audit';

const DEFAULT_EMPLOYEE: Employee = {
  id: 'emp-admin',
  employeeId: 'WEL-1001',
  employeeCode: 'ADM-001',
  name: 'Super Admin',
  fatherName: '',
  dateOfBirth: '1990-01-01',
  dateOfJoining: '2020-01-01',
  gender: 'Male',
  employmentType: 'Full-Time',
  designation: 'Managing Director / Super Admin',
  department: 'Executive Management',
  roleId: 'role-super-admin',
  roleName: 'Super Admin',
  reportingManager: 'Self',
  email: 'admin@weldorindustries.com',
  phone: '+91 98250 11223',
  salaryStructure: {
    baseSalary: 0,
    hra: 0,
    da: 0,
    specialAllowance: 0,
    conveyanceAllowance: 0,
    medicalAllowance: 0,
    pfDeductionEmployee: 0,
    pfDeductionEmployer: 0,
    professionalTax: 0,
    tdsTax: 0,
    grossMonthlySalary: 0,
    netMonthlySalary: 0,
    annualCTC: 0,
  },
  bankDetails: {
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    accountType: 'Salary',
  },
  territory: ['All'],
  productCategories: ['All'],
  scope: 'All',
  status: 'Active',
  avatarUrl: '',
};

const BLANK_SETTINGS: CompanySettings = {
  companyName: 'Weldor by Earth Metal Industries',
  brandName: 'WELDOR',
  legalName: 'Earth Metal Industries',
  cinNumber: '',
  gstin: '24AABCE1234F1Z5',
  panNumber: 'AABCE1234F',
  iecCode: '0812345678',
  msmeRegistrationNo: 'UDYAM-GJ-15-0012345',
  registeredOfficeAddress: {
    addressLine1: '588, G.I.D.C., Phase 2',
    addressLine2: 'Dared',
    city: 'Jamnagar',
    state: 'Gujarat',
    country: 'India',
    pincode: '361004',
  },
  primaryEmail: 'brm@weldorindustries.com',
  primaryPhone: '+91-87800 98088',
  websiteUrl: 'https://weldorindustries.com',
  bankAccounts: [],
  primaryBank: {
    bankName: 'HDFC Bank Ltd',
    accountName: 'Earth Metal Industries',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    branch: 'Dared GIDC, Jamnagar',
  },
  slaSettings: {
    leadResponseHours: 2,
    quoteApprovalThresholdUSD: 50000,
    autoAssignSalesLead: true,
    enableWhatsAppNotifications: true,
    enablePayrollReminderDays: 5,
  },
};

interface AppContextType {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  
  // Role & Scope Management
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  addRole: (role: Omit<Role, 'id'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  currentEmployee: Employee;
  setCurrentEmployee: (emp: Employee) => void;
  hasPermission: (module: CRMModule, action: PermissionAction) => boolean;

  // Authentication & Single Active Session State
  currentUser: Employee | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  isConcurrentLogoutAlertOpen: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: (reason?: 'USER_ACTION' | 'CONCURRENT_DEVICE_LOGIN') => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  closeConcurrentLogoutAlert: () => void;

  // Employee HRMS Management
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, emp: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Payroll Management
  payrolls: PayrollRecord[];
  addPayrollRecord: (rec: Omit<PayrollRecord, 'id'>) => void;
  updatePayrollRecord: (id: string, rec: Partial<PayrollRecord>) => void;
  deletePayrollRecord: (id: string) => void;
  generateMonthlyPayroll: (month: string, year: number) => void;
  disbursePayrollRecord: (id: string, ref?: string) => void;
  bulkDisbursePayroll: (month: string) => void;
  approvePayrollRecord: (id: string) => void;
  bulkApprovePayroll: (month: string) => void;

  // Attendance & Leaves
  attendance: AttendanceRecord[];
  logAttendance: (rec: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, rec: Partial<AttendanceRecord>) => void;
  leaveRequests: LeaveRequest[];
  applyLeaveRequest: (req: Omit<LeaveRequest, 'id'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status'], approvedBy?: string) => void;

  // Company Settings
  companySettings: CompanySettings;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;

  // Products & Categories CRUD
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  categories: ProductCategory[];
  addCategory: (category: Omit<ProductCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ProductCategory>) => void;
  deleteCategory: (id: string) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  compareList: Product[];
  toggleCompare: (p: Product) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  catalogModal: {
    isOpen: boolean;
    product?: Product | null;
    resourceType?: 'PRODUCT' | 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
    title?: string;
  } | null;
  openCatalogModal: (options: {
    product?: Product | null;
    resourceType?: 'PRODUCT' | 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
    title?: string;
  }) => void;
  closeCatalogModal: () => void;

  // Gallery Media CRUD
  galleryMedia: GalleryMedia[];
  addGalleryMedia: (item: Omit<GalleryMedia, 'id'>) => void;
  updateGalleryMedia: (id: string, item: Partial<GalleryMedia>) => void;
  deleteGalleryMedia: (id: string) => void;

  // Hero Banners CMS CRUD
  banners: HeroBanner[];
  addBanner: (banner: Omit<HeroBanner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<HeroBanner>) => void;
  deleteBanner: (id: string) => void;
  reorderBanners: (bannerIds: string[]) => void;
  toggleBannerStatus: (id: string) => void;

  // CRM Data & Handlers
  leads: Lead[];
  updateLeadStage: (leadId: string, newStage: LeadStage, lostReason?: string) => void;
  assignLead: (leadId: string, employeeId: string) => void;
  deleteLead: (leadId: string) => void;
  addPublicRFQLead: (rfqData: Partial<RFQRequirement> & { title: string; companyName: string; contactPerson: string; email: string; phone: string; country: string; technicalNotes?: string; cadFileUrl?: string }) => string;

  rfqs: RFQRequirement[];
  samples: SampleRequest[];
  createSampleRequest: (data: Partial<SampleRequest>) => Promise<SampleRequest>;
  updateSampleStage: (sampleId: string, stage: SampleRequest['stage']) => void;
  deleteSampleRequest: (sampleId: string) => void;

  trials: TechnicalTrial[];
  createTechnicalTrial: (data: Partial<TechnicalTrial>) => Promise<TechnicalTrial>;
  updateTrialStatus: (trialId: string, status: TechnicalTrial['status'], failureReason?: string) => void;
  deleteTechnicalTrial: (trialId: string) => void;

  quotations: Quotation[];
  createQuotationFromLead: (leadId: string, items: Quotation['items'], freight: number, validity: number) => Quotation;
  approveQuotation: (quotationId: string, notes?: string) => void;
  rejectQuotation: (quotationId: string, reason?: string) => void;
  deleteQuotation: (quotationId: string) => void;

  orders: Order[];
  convertQuotationToOrder: (quotationId: string) => Order;
  updateOrderStage: (orderId: string, newStage: Order['stage'], dispatchDetails?: { courierTrackingNo?: string; courierPartner?: string; dispatchDate?: string }) => void;
  deleteOrder: (orderId: string) => void;

  exhibitions: Exhibition[];
  addExhibition: (expo: Omit<Exhibition, 'id'>) => void;
  updateExhibition: (id: string, expo: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  selectedExpoSlug: string | null;
  setSelectedExpoSlug: (slug: string | null) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, targetId: string, details: string) => void;

  // Notification Toast State
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveViewState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('weldor_active_view') as ViewMode;
      if (saved) return saved;
    }
    return 'public-home';
  });

  const setActiveView = (view: ViewMode) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weldor_active_view', view);
    }
  };

  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [currentRole, setCurrentRole] = useState<Role>(INITIAL_ROLES[0]);

  // Authentication State with Single Active Session
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('weldor_session_token');
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('weldor_session_token');
      const saved = localStorage.getItem('weldor_current_user');
      if (token && saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return null;
  });

  const [employees, setEmployees] = useState<Employee[]>([DEFAULT_EMPLOYEE]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(() => currentUser || DEFAULT_EMPLOYEE);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConcurrentLogoutAlertOpen, setIsConcurrentLogoutAlertOpen] = useState(false);
  const isAuthenticated = !!(currentUser && sessionToken);

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [galleryMedia, setGalleryMedia] = useState<GalleryMedia[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);

  const [catalogModal, setCatalogModal] = useState<{
    isOpen: boolean;
    product?: Product | null;
    resourceType?: 'PRODUCT' | 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
    title?: string;
  } | null>(null);

  const openCatalogModal = (options: {
    product?: Product | null;
    resourceType?: 'PRODUCT' | 'MASTER_CATALOG' | 'VALVES_3D' | 'CYLINDER_SHEET' | 'CERT_PACKAGE';
    title?: string;
  }) => {
    setCatalogModal({
      isOpen: true,
      product: options.product || null,
      resourceType: options.resourceType || 'PRODUCT',
      title: options.title
    });
  };

  const closeCatalogModal = () => {
    setCatalogModal(null);
  };

  const [leads, setLeads] = useState<Lead[]>([]);
  const [rfqs, setRfqs] = useState<RFQRequirement[]>([]);
  const [samples, setSamples] = useState<SampleRequest[]>([]);
  const [trials, setTrials] = useState<TechnicalTrial[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExpoSlug, setSelectedExpoSlug] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // HRMS, Payroll & Settings State
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(BLANK_SETTINGS);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Load live data from Backend API on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [
          prodRes,
          catRes,
          expoRes,
          banRes,
          galRes,
          leadRes,
          rfqRes,
          quoteRes,
          orderRes,
          smpRes,
          trlRes,
          empRes,
          payRes,
          attRes,
          leaveRes,
          settRes,
          audRes,
          roleRes,
        ] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
          api.getExhibitions(),
          api.getBanners(),
          api.getGallery(),
          api.getLeads(),
          api.getRfqs(),
          api.getQuotations(),
          api.getOrders(),
          api.getSamples(),
          api.getTrials(),
          api.getEmployees(),
          api.getPayroll(),
          api.getAttendance(),
          api.getLeaves(),
          api.getSettings(),
          api.getAuditLogs(),
          api.getRoles(),
        ]);

        if (prodRes?.success && prodRes.data?.length > 0) setProducts(prodRes.data);
        if (catRes?.success && catRes.data?.length > 0) setCategories(catRes.data);
        if (expoRes?.success && expoRes.data?.length > 0) setExhibitions(expoRes.data);
        if (banRes?.success && banRes.data?.length > 0) setBanners(banRes.data);
        if (galRes?.success && galRes.data?.length > 0) setGalleryMedia(galRes.data);
        if (leadRes?.success && leadRes.data?.length > 0) setLeads(leadRes.data);
        if (rfqRes?.success && rfqRes.data?.length > 0) setRfqs(rfqRes.data);
        if (quoteRes?.success && quoteRes.data?.length > 0) setQuotations(quoteRes.data);
        if (orderRes?.success && orderRes.data?.length > 0) setOrders(orderRes.data);
        if (smpRes?.success && smpRes.data?.length > 0) setSamples(smpRes.data);
        if (trlRes?.success && trlRes.data?.length > 0) setTrials(trlRes.data);
        if (empRes?.success && empRes.data?.length > 0) setEmployees(empRes.data);
        if (payRes?.success && payRes.data?.length > 0) setPayrolls(payRes.data);
        if (attRes?.success && attRes.data?.length > 0) setAttendance(attRes.data);
        if (leaveRes?.success && leaveRes.data?.length > 0) setLeaveRequests(leaveRes.data);
        if (settRes?.success && settRes.data) setCompanySettings(settRes.data);
        if (audRes?.success && audRes.data?.length > 0) setAuditLogs(audRes.data);
        if (roleRes?.success && roleRes.data?.length > 0) {
          setRoles(roleRes.data);
          if (currentUser) {
            const matched = roleRes.data.find((r: Role) => r.name === currentUser.roleName || r.id === currentUser.roleId);
            if (matched) setCurrentRole(matched);
          }
        }
      } catch (err) {
        console.warn('Backend server offline or starting up, using local state.', err);
      }
    };

    fetchBackendData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const deviceName = typeof window !== 'undefined' && window.navigator?.userAgent 
        ? (window.navigator.userAgent.includes('Chrome') ? 'Google Chrome (Workstation)' : 'Web Browser') 
        : 'Enterprise Client';

      const res = await api.login({ email, password, deviceName });
      if (res?.success && res.sessionToken && res.user) {
        setSessionToken(res.sessionToken);
        setCurrentUser(res.user);
        setCurrentEmployee(res.user);

        // Find matching role
        const matchedRole = roles.find(r => r.name === res.user.roleName || r.id === res.user.roleId) || INITIAL_ROLES[0];
        setCurrentRole(matchedRole);

        if (typeof window !== 'undefined') {
          localStorage.setItem('weldor_session_token', res.sessionToken);
          localStorage.setItem('weldor_current_user', JSON.stringify(res.user));
        }

        showNotification(`Welcome back, ${res.user.name}! Authenticated with role: ${res.user.roleName || matchedRole.name}`, 'success');
        return { success: true };
      } else {
        return { success: false, message: res?.message || 'Invalid email or password.' };
      }
    } catch (e) {
      return { success: false, message: 'Server communication failed.' };
    }
  };

  const logout = () => {
    if (sessionToken && currentUser) {
      api.logout(sessionToken, currentUser.id).catch(() => {});
    }
    setSessionToken(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('weldor_session_token');
      localStorage.removeItem('weldor_current_user');
      localStorage.removeItem('weldor_active_view');
    }
    showNotification('Signed out from CRM portal.', 'info');
    setActiveView('auth-login');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeConcurrentLogoutAlert = () => setIsConcurrentLogoutAlertOpen(false);

  const hasPermission = (module: CRMModule, action: PermissionAction): boolean => {
    if (currentRole.name === 'Super Admin' || currentRole.id === 'role-super-admin') return true;
    const rule = currentRole.permissions?.find(p => p.module === module);
    return rule ? rule.actions.includes(action) : false;
  };

  const addRole = async (roleData: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role-${Date.now()}`,
      isSystem: false,
    };
    setRoles(prev => [...prev, newRole]);
    try {
      await api.createRole(newRole);
      addAuditLog('ROLE_CREATED', 'rbac', newRole.id, `Created custom security role "${newRole.name}" (${newRole.scope} Scope)`);
      showNotification(`Role "${newRole.name}" created successfully!`, 'success');
    } catch (e) {
      console.warn('Role creation sync error:', e);
    }
  };

  const updateRole = async (id: string, updatedFields: Partial<Role>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
    if (currentRole.id === id) {
      setCurrentRole(prev => ({ ...prev, ...updatedFields }));
    }
    try {
      await api.updateRole(id, updatedFields);
      addAuditLog('ROLE_UPDATED', 'rbac', id, `Updated permissions/settings for role ${id}`);
      showNotification('Role permissions saved!', 'success');
    } catch (e) {
      console.warn('Role update sync error:', e);
    }
  };

  const deleteRole = async (id: string) => {
    if (id === 'role-super-admin') {
      showNotification('Super Admin role is protected and cannot be deleted.', 'warning');
      return;
    }
    const roleToDelete = roles.find(r => r.id === id);
    setRoles(prev => prev.filter(r => r.id !== id));
    try {
      await api.deleteRole(id);
      addAuditLog('ROLE_DELETED', 'rbac', id, `Deleted custom security role "${roleToDelete?.name || id}"`);
      showNotification(`Role "${roleToDelete?.name || id}" deleted.`, 'info');
    } catch (e) {
      console.warn('Role delete sync error:', e);
    }
  };

  const addAuditLog = (action: string, module: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: currentEmployee.name,
      userRole: currentRole.name,
      action,
      module,
      targetId,
      ipAddress: '192.168.1.15',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
    api.createAuditLog(newLog).catch(() => {});
  };

  // Employee HRMS Handlers
  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = { ...emp, id: `emp-${Date.now()}` };
    setEmployees(prev => [newEmp, ...prev]);
    api.createEmployee(newEmp).catch(() => {});
    addAuditLog('EMPLOYEE_ONBOARDED', 'employees', newEmp.id, `Onboarded new staff ${newEmp.name} (${newEmp.employeeCode || newEmp.employeeId})`);
    showNotification(`Employee ${newEmp.name} registered successfully!`, 'success');
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
    api.updateEmployee(id, updatedFields).catch(() => {});
    addAuditLog('EMPLOYEE_UPDATED', 'employees', id, `Updated employee profile for ID ${id}`);
    showNotification(`Employee record updated!`, 'success');
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    api.deleteEmployee(id).catch(() => {});
    addAuditLog('EMPLOYEE_DELETED', 'employees', id, `Removed employee ${emp?.name || id}`);
    showNotification('Employee removed from directory', 'info');
  };

  // Payroll Handlers
  const addPayrollRecord = (rec: Omit<PayrollRecord, 'id'>) => {
    const newRec: PayrollRecord = { ...rec, id: `pay-${Date.now()}` };
    setPayrolls(prev => [newRec, ...prev]);
    api.createPayroll(newRec).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_CREATED', 'payroll', newRec.id, `Created manual payroll entry for ${newRec.employeeName}`);
    showNotification(`Salary slip for ${newRec.employeeName} added!`, 'success');
  };

  const updatePayrollRecord = (id: string, updatedFields: Partial<PayrollRecord>) => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    api.updatePayroll(id, updatedFields).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_UPDATED', 'payroll', id, `Updated payroll record for ID ${id}`);
    showNotification('Salary details updated!', 'success');
  };

  const deletePayrollRecord = (id: string) => {
    setPayrolls(prev => prev.filter(p => p.id !== id));
    api.deletePayroll(id).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_DELETED', 'payroll', id, `Deleted salary slip ID ${id}`);
    showNotification('Payroll slip deleted', 'info');
  };

  const generateMonthlyPayroll = async (month: string, year: number) => {
    const existingEmpIds = payrolls.filter(p => p.payrollMonth === month && p.payrollYear === year).map(p => p.employeeId);
    const existingMonthRecords = payrolls.filter(p => p.payrollMonth === month && p.payrollYear === year);

    const activeStaff = employees.filter(e => e.status !== 'Inactive');

    if (existingMonthRecords.length > 0 && existingEmpIds.length >= activeStaff.length) {
      const paidCount = existingMonthRecords.filter(r => r.status === 'Paid').length;
      const approvedCount = existingMonthRecords.filter(r => r.status === 'Approved').length;
      const draftCount = existingMonthRecords.filter(r => r.status === 'Draft').length;
      
      if (paidCount === existingMonthRecords.length) {
        showNotification(`All salaries for ${month} ${year} are already Disbursed / Paid!`, 'success');
      } else {
        showNotification(`Payroll for ${month} is already active: ${draftCount} Drafts, ${approvedCount} Approved, ${paidCount} Paid.`, 'info');
      }
      return;
    }

    const newRecords: PayrollRecord[] = activeStaff
      .filter(emp => !existingEmpIds.includes(emp.id))
      .map(emp => {
        const s = emp.salaryStructure || {
          baseSalary: 30000,
          hra: 12000,
          da: 6000,
          specialAllowance: 6000,
          conveyanceAllowance: 3000,
          medicalAllowance: 3000,
          pfDeductionEmployee: 3600,
          professionalTax: 200,
          tdsTax: 1500,
        };
        
        // Automated Leave Deductions (Loss of Pay calculation for approved unpaid/casual leaves)
        const empLeaves = leaveRequests.filter(l => l.employeeId === emp.id && l.status === 'Approved');
        const unpaidDays = empLeaves.reduce((sum, l) => sum + (Number(l.totalDays) || 0), 0);
        const leaveDeduction = Math.round((s.baseSalary / 30) * unpaidDays);
        const paidDays = Math.max(0, 30 - unpaidDays);

        // Automated Overtime (OT) Pay Calculation (1.5x hourly rate based on 8hr shifts)
        const empAttendance = attendance.filter(a => a.employeeId === emp.id);
        const otHours = empAttendance.reduce((sum, a) => sum + (Number(a.overtimeHours) || 0), 0);
        const otRate = Math.max(250, Math.round((s.baseSalary / 30 / 8) * 1.5));
        const otPay = otHours * otRate;

        // Gross Earnings with OT
        const gross = s.baseSalary + s.hra + s.da + s.specialAllowance + s.conveyanceAllowance + s.medicalAllowance + otPay;
        
        // Total Statutory + Attendance Deductions
        const totalDed = (s.pfDeductionEmployee || 0) + (s.professionalTax || 0) + (s.tdsTax || 0) + leaveDeduction;
        const net = Math.max(0, gross - totalDed);

        return {
          id: `pay-${Date.now()}-${emp.id}`,
          payrollMonth: month,
          payrollYear: year,
          employeeId: emp.id,
          employeeCode: emp.employeeCode || emp.employeeId,
          employeeName: emp.name,
          department: emp.department,
          designation: emp.designation,
          bankName: emp.bankDetails?.bankName || 'HDFC Bank Ltd',
          bankAccountNumber: emp.bankDetails?.accountNumber || '',
          ifscCode: emp.bankDetails?.ifscCode || '',
          panNumber: emp.panNumber || 'APPLIED',
          workingDays: 30,
          paidDays: paidDays,
          unpaidLeaves: unpaidDays,
          overtimeHours: otHours,
          overtimeRate: otRate,
          overtimePay: otPay,
          performanceBonus: 0,
          baseSalary: s.baseSalary,
          hra: s.hra,
          da: s.da,
          specialAllowance: s.specialAllowance,
          conveyanceAllowance: s.conveyanceAllowance,
          medicalAllowance: s.medicalAllowance,
          grossEarnings: gross,
          pfDeduction: s.pfDeductionEmployee || 0,
          professionalTax: s.professionalTax || 0,
          tdsTax: s.tdsTax || 0,
          leaveDeduction: leaveDeduction,
          otherDeductions: 0,
          totalDeductions: totalDed,
          netPayable: net,
          status: 'Draft',
          paymentMode: 'NEFT / RTGS',
          remarks: `Automated payroll for ${month}${unpaidDays > 0 ? ` (Deducted ${unpaidDays}d LOP: ₹${leaveDeduction.toLocaleString()})` : ''}${otHours > 0 ? ` (+${otHours}h OT: ₹${otPay.toLocaleString()})` : ''}`
        };
      });

    if (newRecords.length === 0) {
      showNotification(`Payroll for ${month} ${year} already generated for all staff!`, 'info');
      return;
    }

    setPayrolls(prev => [...newRecords, ...prev]);
    api.bulkCreatePayroll(newRecords).catch(err => console.warn('Payroll backend sync:', err));
    addAuditLog('PAYROLL_GENERATED', 'payroll', `${month}-${year}`, `Generated ${newRecords.length} payroll slips for ${month}`);
    showNotification(`Generated ${newRecords.length} employee payslips for ${month}!`, 'success');
  };

  const approvePayrollRecord = (id: string) => {
    setPayrolls(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
    api.updatePayroll(id, { status: 'Approved' }).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_APPROVED', 'payroll', id, `Approved salary slip ${id}`);
    showNotification('Salary slip approved for bank disbursal!', 'success');
  };

  const bulkApprovePayroll = (month: string) => {
    const draftRecords = payrolls.filter(p => p.payrollMonth === month && p.status === 'Draft');
    if (draftRecords.length === 0) {
      showNotification(`No draft payslips found to approve for ${month}.`, 'info');
      return;
    }
    setPayrolls(prev => prev.map(p => (p.payrollMonth === month && p.status === 'Draft') ? {
      ...p,
      status: 'Approved'
    } : p));

    draftRecords.forEach(r => {
      api.updatePayroll(r.id, { status: 'Approved' }).catch(err => console.warn('Payroll API error:', err));
    });

    addAuditLog('PAYROLL_BULK_APPROVED', 'payroll', month, `Approved ${draftRecords.length} payslips for ${month}`);
    showNotification(`Approved ${draftRecords.length} payslips for ${month}!`, 'success');
  };

  const disbursePayrollRecord = (id: string, ref?: string) => {
    const txRef = ref || `CMS-DISB-${Date.now()}`;
    const timestamp = new Date().toISOString();
    setPayrolls(prev => prev.map(p => p.id === id ? {
      ...p,
      status: 'Paid',
      transactionReference: txRef,
      disbursedAt: timestamp
    } : p));
    api.updatePayroll(id, {
      status: 'Paid',
      transactionReference: txRef,
      disbursedAt: timestamp
    }).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_DISBURSED', 'payroll', id, `Disbursed salary slip with Ref: ${txRef}`);
    showNotification(`Salary marked as Disbursed / Paid!`, 'success');
  };

  const bulkDisbursePayroll = (month: string) => {
    const txBatch = `CMS-BATCH-NEFT-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const recordsToUpdate = payrolls.filter(p => p.payrollMonth === month && p.status !== 'Paid');
    
    setPayrolls(prev => prev.map(p => (p.payrollMonth === month && p.status !== 'Paid') ? {
      ...p,
      status: 'Paid',
      transactionReference: txBatch,
      disbursedAt: timestamp
    } : p));

    recordsToUpdate.forEach(r => {
      api.updatePayroll(r.id, {
        status: 'Paid',
        transactionReference: txBatch,
        disbursedAt: timestamp
      }).catch(err => console.warn('Payroll API error:', err));
    });

    addAuditLog('PAYROLL_BULK_DISBURSED', 'payroll', month, `Bulk disbursed all approved payslips for ${month} via Batch Ref: ${txBatch}`);
    showNotification(`All salaries for ${month} disbursed successfully!`, 'success');
  };

  // Attendance & Leaves Handlers
  const logAttendance = (rec: Omit<AttendanceRecord, 'id'>) => {
    const newRec: AttendanceRecord = { ...rec, id: `att-${Date.now()}` };
    setAttendance(prev => [newRec, ...prev]);
    api.createAttendance(newRec).catch(() => {});
    addAuditLog('ATTENDANCE_LOGGED', 'attendance', newRec.id, `Logged attendance for ${newRec.employeeName}`);
    showNotification(`Attendance logged for ${newRec.employeeName}`, 'success');
  };

  const updateAttendance = (id: string, rec: Partial<AttendanceRecord>) => {
    setAttendance(prev => prev.map(a => a.id === id ? { ...a, ...rec } : a));
    api.updateAttendance(id, rec).catch(() => {});
    showNotification('Attendance record updated', 'success');
  };

  const applyLeaveRequest = (req: Omit<LeaveRequest, 'id'>) => {
    const newReq: LeaveRequest = { ...req, id: `lev-${Date.now()}` };
    setLeaveRequests(prev => [newReq, ...prev]);
    api.createLeave(newReq).catch(() => {});
    addAuditLog('LEAVE_APPLIED', 'attendance', newReq.id, `Applied for leave by ${newReq.employeeName}`);
    showNotification('Leave application submitted for approval!', 'success');
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveRequest['status'], approvedBy?: string) => {
    setLeaveRequests(prev => prev.map(l => l.id === id ? {
      ...l,
      status,
      approvedBy: approvedBy || currentEmployee.name
    } : l));
    api.updateLeave(id, { status, approvedBy }).catch(() => {});
    addAuditLog('LEAVE_STATUS_CHANGED', 'attendance', id, `Leave ${id} marked as ${status}`);
    showNotification(`Leave application marked as ${status}!`, 'success');
  };

  // Settings Handlers
  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings(prev => ({ ...prev, ...settings }));
    api.updateSettings(settings).catch(() => {});
    addAuditLog('COMPANY_SETTINGS_UPDATED', 'settings', 'company', `Updated enterprise company profile & banking`);
    showNotification('Company settings saved successfully!', 'success');
  };

  // Product CRUD
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = { ...p, id: `prod-${Date.now()}` };
    setProducts(prev => [newProd, ...prev]);
    api.createProduct(newProd).catch(() => {});
    addAuditLog('PRODUCT_CREATED', 'products', newProd.id, `Created product ${newProd.name} (${newProd.sku})`);
    showNotification(`Product "${newProd.name}" added to catalog successfully!`, 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    api.updateProduct(id, updatedFields).catch(() => {});
    addAuditLog('PRODUCT_UPDATED', 'products', id, `Updated product details for ID ${id}`);
    showNotification(`Product details updated!`, 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    api.deleteProduct(id).catch(() => {});
    addAuditLog('PRODUCT_DELETED', 'products', id, `Deleted product ${prod?.name || id}`);
    showNotification(`Product removed from catalog.`, 'warning');
  };

  // Category CRUD
  const addCategory = (c: Omit<ProductCategory, 'id'>) => {
    const newCat: ProductCategory = { ...c, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
    api.createCategory(newCat).catch(() => {});
    addAuditLog('CATEGORY_CREATED', 'products', newCat.id, `Created category ${newCat.name}`);
    showNotification(`Category "${newCat.name}" created successfully!`, 'success');
  };

  const updateCategory = (id: string, updatedFields: Partial<ProductCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    api.updateCategory(id, updatedFields).catch(() => {});
    addAuditLog('CATEGORY_UPDATED', 'products', id, `Updated category details for ID ${id}`);
    showNotification(`Category updated successfully!`, 'success');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setCategories(prev => prev.filter(c => c.id !== id));
    api.deleteCategory(id).catch(() => {});
    addAuditLog('CATEGORY_DELETED', 'products', id, `Deleted category ${cat?.name || id}`);
    showNotification(`Category removed.`, 'warning');
  };

  // Gallery Media CRUD
  const addGalleryMedia = (item: Omit<GalleryMedia, 'id'>) => {
    const newItem: GalleryMedia = { ...item, id: `gal-${Date.now()}`, createdAt: new Date().toISOString() };
    setGalleryMedia(prev => [newItem, ...prev]);
    api.createGallery(newItem).catch(() => {});
    addAuditLog('GALLERY_ADDED', 'cms', newItem.id, `Added gallery item ${newItem.title}`);
    showNotification(`Media asset "${newItem.title}" added to gallery!`, 'success');
  };

  const updateGalleryMedia = (id: string, updatedFields: Partial<GalleryMedia>) => {
    setGalleryMedia(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    api.updateGallery(id, updatedFields).catch(() => {});
    addAuditLog('GALLERY_UPDATED', 'cms', id, `Updated gallery item ID ${id}`);
    showNotification(`Media asset updated successfully!`, 'success');
  };

  const deleteGalleryMedia = (id: string) => {
    setGalleryMedia(prev => prev.filter(m => m.id !== id));
    api.deleteGallery(id).catch(() => {});
    addAuditLog('GALLERY_DELETED', 'cms', id, `Deleted gallery item ${id}`);
    showNotification(`Media asset deleted.`, 'warning');
  };

  // Hero Banners CMS CRUD
  const addBanner = (banner: Omit<HeroBanner, 'id'>) => {
    const newBanner: HeroBanner = {
      ...banner,
      id: `ban-${Date.now()}`,
      createdAt: new Date().toISOString(),
      displayOrder: banner.displayOrder || banners.length + 1
    };
    setBanners(prev => [...prev, newBanner]);
    api.createBanner(newBanner).catch(() => {});
    addAuditLog('BANNER_CREATED', 'cms', newBanner.id, `Created hero banner slide "${newBanner.title}" with effect ${newBanner.transitionEffect}`);
    showNotification(`Hero banner slide "${newBanner.title}" created successfully!`, 'success');
  };

  const updateBanner = (id: string, updatedFields: Partial<HeroBanner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updatedFields } : b));
    api.updateBanner(id, updatedFields).catch(() => {});
    addAuditLog('BANNER_UPDATED', 'cms', id, `Updated hero banner slide ID ${id}`);
    showNotification(`Hero banner slide updated successfully!`, 'success');
  };

  const deleteBanner = (id: string) => {
    const banner = banners.find(b => b.id === id);
    setBanners(prev => prev.filter(b => b.id !== id));
    api.deleteBanner(id).catch(() => {});
    addAuditLog('BANNER_DELETED', 'cms', id, `Deleted hero banner slide "${banner?.title || id}"`);
    showNotification(`Hero banner slide deleted.`, 'warning');
  };

  const reorderBanners = (bannerIds: string[]) => {
    setBanners(prev => {
      const bannerMap = new Map(prev.map(b => [b.id, b]));
      return bannerIds.map((id, index) => {
        const item = bannerMap.get(id);
        return item ? { ...item, displayOrder: index + 1 } : null;
      }).filter(Boolean) as HeroBanner[];
    });
    api.reorderBanners(bannerIds).catch(() => {});
    addAuditLog('BANNERS_REORDERED', 'cms', 'hero-slider', `Reordered hero slider sequence`);
    showNotification(`Banner display sequence reordered!`, 'success');
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(prev => prev.map(b => {
      if (b.id === id) {
        const nextState = !b.active;
        api.updateBanner(id, { active: nextState }).catch(() => {});
        addAuditLog('BANNER_STATUS_TOGGLED', 'cms', id, `Toggled banner active status to ${nextState}`);
        showNotification(`Banner ${nextState ? 'Activated' : 'Deactivated'}.`, nextState ? 'success' : 'info');
        return { ...b, active: nextState };
      }
      return b;
    }));
  };

  // Exhibition CRUD
  const addExhibition = (expo: Omit<Exhibition, 'id'>) => {
    const newExpo: Exhibition = { ...expo, id: `expo-${Date.now()}` };
    setExhibitions(prev => [newExpo, ...prev]);
    api.createExhibition(newExpo).catch(() => {});
    addAuditLog('EXHIBITION_CREATED', 'exhibitions', newExpo.id, `Created exhibition ${newExpo.title}`);
    showNotification(`Exhibition event "${newExpo.title}" published!`, 'success');
  };

  const updateExhibition = (id: string, updatedExpo: Partial<Exhibition>) => {
    setExhibitions(prev => prev.map(expo => {
      if (expo.id === id) {
        return { ...expo, ...updatedExpo };
      }
      return expo;
    }));
    api.updateExhibition(id, updatedExpo).catch(() => {});
    addAuditLog('EXHIBITION_UPDATED', 'exhibitions', id, `Updated exhibition details for ${id}`);
    showNotification(`Exhibition updated successfully!`, 'success');
  };

  const deleteExhibition = (id: string) => {
    const target = exhibitions.find(e => e.id === id);
    setExhibitions(prev => prev.filter(expo => expo.id !== id));
    api.deleteExhibition(id).catch(() => {});
    addAuditLog('EXHIBITION_DELETED', 'exhibitions', id, `Deleted exhibition: ${target?.title || id}`);
    showNotification(`Exhibition deleted successfully!`, 'info');
  };

  // Order Lifecycle & Dispatch Status Progressor
  const updateOrderStage = (
    orderId: string, 
    newStage: Order['stage'], 
    dispatchDetails?: { courierTrackingNo?: string; courierPartner?: string; dispatchDate?: string }
  ) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          stage: newStage,
          ...(dispatchDetails?.courierTrackingNo ? { courierTrackingNo: dispatchDetails.courierTrackingNo } : {}),
          ...(dispatchDetails?.courierPartner ? { courierPartner: dispatchDetails.courierPartner } : {}),
          ...(dispatchDetails?.dispatchDate ? { dispatchDate: dispatchDetails.dispatchDate } : {}),
        };
      }
      return ord;
    }));
    api.updateOrder(orderId, { stage: newStage, ...dispatchDetails }).catch(() => {});
    addAuditLog('ORDER_STAGE_UPDATED', 'orders', orderId, `Updated order ${orderId} stage to ${newStage}`);
    showNotification(`Order stage updated to "${newStage}"!`, 'success');
  };

  const toggleCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(prev => prev.filter(p => p.id !== product.id));
      showNotification(`Removed ${product.name} from comparison.`, 'info');
    } else {
      if (compareList.length >= 4) {
        showNotification('You can compare a maximum of 4 products at once.', 'warning');
        return;
      }
      setCompareList(prev => [...prev, product]);
      showNotification(`Added ${product.name} to comparison tray.`, 'success');
    }
  };

  const updateLeadStage = (leadId: string, newStage: LeadStage, lostReason?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedActivity = {
          id: `act-${Date.now()}`,
          leadId,
          timestamp: new Date().toISOString(),
          type: 'Status_Change' as const,
          performedBy: `${currentEmployee.name} (${currentRole.name})`,
          description: `Changed stage from ${lead.stage} to ${newStage}${lostReason ? `. Lost Reason: ${lostReason}` : ''}`,
        };
        return {
          ...lead,
          stage: newStage,
          lostReason: lostReason || lead.lostReason,
          updatedAt: new Date().toISOString(),
          activities: [updatedActivity, ...lead.activities],
        };
      }
      return lead;
    }));
    api.updateLead(leadId, { stage: newStage, lostReason }).catch(() => {});
    addAuditLog('LEAD_STAGE_UPDATED', 'leads', leadId, `Updated lead stage to ${newStage}`);
    showNotification(`Lead stage updated to ${newStage.replace(/_/g, ' ')}`, 'success');
  };

  const assignLead = (leadId: string, employeeId: string) => {
    const targetEmp = employees.find(e => e.id === employeeId);
    if (!targetEmp) return;
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedActivity = {
          id: `act-${Date.now()}`,
          leadId,
          timestamp: new Date().toISOString(),
          type: 'Status_Change' as const,
          performedBy: currentEmployee.name,
          description: `Reassigned lead to ${targetEmp.name} (${targetEmp.department})`,
        };
        return {
          ...lead,
          assignedEmployeeId: targetEmp.id,
          assignedEmployeeName: targetEmp.name,
          updatedAt: new Date().toISOString(),
          activities: [updatedActivity, ...lead.activities],
        };
      }
      return lead;
    }));
    api.updateLead(leadId, { assignedEmployeeId: targetEmp.id, assignedEmployeeName: targetEmp.name }).catch(() => {});
    addAuditLog('LEAD_REASSIGNED', 'leads', leadId, `Reassigned lead to ${targetEmp.name}`);
    showNotification(`Lead assigned to ${targetEmp.name}`, 'info');
  };

  const addPublicRFQLead = (rfqData: Partial<RFQRequirement> & { title: string; companyName: string; contactPerson: string; email: string; phone: string; country: string; technicalNotes?: string; cadFileUrl?: string }): string => {
    const leadId = `lead-${Date.now()}`;
    const leadNumber = `WEL-LD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: Lead = {
      id: leadId,
      leadNumber,
      title: rfqData.title || `RFQ: ${rfqData.companyName} Component Requirement`,
      companyName: rfqData.companyName,
      contactName: rfqData.contactPerson,
      contactEmail: rfqData.email,
      contactPhone: rfqData.phone,
      country: rfqData.country,
      city: 'Industrial Zone',
      source: rfqData.drawingFileName ? 'RFQ / Drawing Upload' : 'Product Enquiry',
      stage: 'NEW_LEAD',
      priority: 'High',
      assignedEmployeeId: 'emp-102',
      assignedEmployeeName: 'Rajesh Sharma',
      categoryName: rfqData.categoryName || 'Custom Components',
      expectedQuantity: rfqData.targetQuantity || 100,
      estimatedValueUSD: (rfqData.targetQuantity || 100) * 120,
      technicalNotes: rfqData.technicalNotes || 'Submitted via Weldor Digital Acquisition Portal',
      drawingFile: rfqData.drawingFileName ? {
        name: rfqData.drawingFileName,
        size: 'PDF / CAD Blueprint',
        type: 'CAD/PDF',
        url: rfqData.cadFileUrl || '#',
      } : undefined,
      slaDeadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
      isSlaViolated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activities: [
        {
          id: `act-${Date.now()}`,
          leadId,
          timestamp: new Date().toISOString(),
          type: 'Note',
          performedBy: `${rfqData.contactPerson} (Customer)`,
          description: `Submitted B2B RFQ with ${rfqData.drawingFileName ? 'CAD Drawing Upload' : 'Technical Specifications'}`,
        },
      ],
    };

    setLeads(prev => [newLead, ...prev]);
    api.submitPublicRFQ(rfqData).catch(() => {});

    const newRfq: RFQRequirement = {
      id: `rfq-${Date.now()}`,
      leadId,
      requirementType: rfqData.drawingFileName ? 'Custom Engineering' : 'Standard Product',
      categoryName: rfqData.categoryName || 'General',
      targetQuantity: rfqData.targetQuantity || 100,
      targetUnit: 'PCS',
      materialPreference: rfqData.materialPreference || 'Standard Weldor Spec',
      drawingFileName: rfqData.drawingFileName,
      cadFileUrl: rfqData.cadFileUrl,
      companyName: rfqData.companyName,
      contactPerson: rfqData.contactPerson,
      email: rfqData.email,
      phone: rfqData.phone,
      country: rfqData.country,
      preferredResponse: (rfqData.preferredResponse as any) || 'Email',
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };
    setRfqs(prev => [newRfq, ...prev]);

    addAuditLog('PUBLIC_RFQ_SUBMITTED', 'crm', newLead.id, `Received public RFQ from ${rfqData.companyName} (${rfqData.email}) with ${rfqData.drawingFileName || 'specs'}`);
    showNotification(`RFQ Submitted! Lead ID: ${leadNumber}. Assigned to Sales Manager with 2-hour SLA.`, 'success');
    return leadNumber;
  };

  const createSampleRequest = async (data: Partial<SampleRequest>): Promise<SampleRequest> => {
    const newSample: SampleRequest = {
      id: `smp-${Date.now()}`,
      sampleNumber: `SMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      leadId: data.leadId || `lead-${Date.now()}`,
      companyName: data.companyName || 'Enterprise Client',
      productName: data.productName || 'Precision Valve / Cylinder Prototype',
      quantityRequested: data.quantityRequested || 1,
      stage: (data.stage as any) || 'Requested',
      courierTrackingNo: data.courierTrackingNo || '',
      dispatchDate: data.dispatchDate,
      deliveryDate: data.deliveryDate,
      feedbackNotes: data.feedbackNotes,
      createdAt: new Date().toISOString(),
    };

    setSamples(prev => [newSample, ...prev]);
    try {
      const res = await api.createSample(newSample);
      if (res?.data?.id) {
        newSample.id = res.data.id;
      }
    } catch (e) {
      console.warn('API sync failed for sample creation', e);
    }
    addAuditLog('SAMPLE_CREATED', 'samples', newSample.id, `Created sample request ${newSample.sampleNumber} for ${newSample.companyName}`);
    showNotification(`Sample prototype request ${newSample.sampleNumber} created!`, 'success');
    return newSample;
  };

  const updateSampleStage = (sampleId: string, stage: SampleRequest['stage']) => {
    setSamples(prev => prev.map(s => s.id === sampleId ? { ...s, stage } : s));
    api.updateSample(sampleId, { stage }).catch(() => {});
    addAuditLog('SAMPLE_STAGE_UPDATED', 'samples', sampleId, `Updated sample ${sampleId} stage to ${stage}`);
    showNotification(`Sample status updated to ${stage}`, 'success');
  };

  const deleteSampleRequest = (sampleId: string) => {
    setSamples(prev => prev.filter(s => s.id !== sampleId));
    api.deleteSample(sampleId).catch(() => {});
    addAuditLog('SAMPLE_DELETED', 'samples', sampleId, `Deleted sample ${sampleId}`);
    showNotification('Sample prototype removed from records.', 'warning');
  };

  const createTechnicalTrial = async (data: Partial<TechnicalTrial>): Promise<TechnicalTrial> => {
    const newTrial: TechnicalTrial = {
      id: `tria-${Date.now()}`,
      trialNumber: `TRL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      leadId: data.leadId || `lead-${Date.now()}`,
      companyName: data.companyName || 'Industrial Client',
      productName: data.productName || '350-Bar Hydraulic Cylinder / Valve',
      testParameters: {
        pressureTestBar: data.testParameters?.pressureTestBar || 525,
        leakageTestResult: data.testParameters?.leakageTestResult || '0.000 sccs (Zero Bubble Helium Test)',
        corrosionHours: data.testParameters?.corrosionHours || 500,
        cycleCount: data.testParameters?.cycleCount || 250000,
      },
      status: (data.status as any) || 'Execution In Progress',
      failureReason: data.failureReason,
      evaluatorEngineer: data.evaluatorEngineer || currentEmployee.name || 'Amit Verma (QC Lead)',
      completionDate: data.completionDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    };

    setTrials(prev => [newTrial, ...prev]);
    try {
      const res = await api.createTrial(newTrial);
      if (res?.data?.id) {
        newTrial.id = res.data.id;
      }
    } catch (e) {
      console.warn('API sync failed for trial creation', e);
    }
    addAuditLog('TRIAL_CREATED', 'trials', newTrial.id, `Created technical trial ${newTrial.trialNumber} for ${newTrial.companyName}`);
    showNotification(`Technical Lab Trial ${newTrial.trialNumber} scheduled!`, 'success');
    return newTrial;
  };

  const updateTrialStatus = (trialId: string, status: TechnicalTrial['status'], failureReason?: string) => {
    setTrials(prev => prev.map(t => t.id === trialId ? { ...t, status, failureReason } : t));
    api.updateTrial(trialId, { status, failureReason }).catch(() => {});
    addAuditLog('TRIAL_STATUS_UPDATED', 'trials', trialId, `Updated trial ${trialId} status to ${status}`);
    showNotification(`Technical Trial status updated to ${status}`, 'success');
  };

  const deleteTechnicalTrial = (trialId: string) => {
    setTrials(prev => prev.filter(t => t.id !== trialId));
    api.deleteTrial(trialId).catch(() => {});
    addAuditLog('TRIAL_DELETED', 'trials', trialId, `Deleted trial ${trialId}`);
    showNotification('Technical Trial removed from workspace.', 'warning');
  };

  const createQuotationFromLead = (leadId: string, items: Quotation['items'], freight: number, validity: number): Quotation => {
    const lead = leads.find(l => l.id === leadId);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPriceUSD, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.quantity * item.unitPriceUSD * (item.discountPercentage / 100)), 0);
    const taxTotal = (subtotal - totalDiscount) * 0.18;
    const grandTotal = subtotal - totalDiscount + taxTotal + freight;

    const requiresApproval = grandTotal > 50000 || items.some(i => i.discountPercentage > 10);

    const newQuotation: Quotation = {
      id: `quote-${Date.now()}`,
      quotationNumber: `WEL-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId,
      companyName: lead ? lead.companyName : 'B2B Client',
      contactName: lead ? lead.contactName : 'Purchasing Dept',
      email: lead ? lead.contactEmail : 'purchasing@client.com',
      items,
      subtotalUSD: subtotal,
      totalDiscountUSD: totalDiscount,
      taxTotalUSD: taxTotal,
      freightCostUSD: freight,
      grandTotalUSD: grandTotal,
      paymentTerms: '30% Advance, 70% against Shipping Documents',
      deliveryTerms: 'Ex-Factory Weldor Plant / FOB',
      validityDays: validity,
      status: requiresApproval ? 'Pending Manager Approval' : 'Sent to Customer',
      requiresApproval,
      createdAt: new Date().toISOString(),
      sentAt: requiresApproval ? undefined : new Date().toISOString(),
    };

    setQuotations(prev => [newQuotation, ...prev]);
    api.createQuotation(newQuotation).catch(() => {});

    if (lead) {
      updateLeadStage(leadId, requiresApproval ? 'QUOTATION_APPROVAL' : 'QUOTATION_SENT');
    }

    addAuditLog('QUOTATION_CREATED', 'quotations', newQuotation.id, `Created quotation ${newQuotation.quotationNumber} for $${grandTotal.toLocaleString()}`);
    showNotification(`Quotation ${newQuotation.quotationNumber} generated successfully!`, 'success');
    return newQuotation;
  };

  const approveQuotation = (quotationId: string, notes?: string) => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quotationId) {
        return {
          ...q,
          status: 'Approved',
          approvalNotes: notes || `Approved by ${currentEmployee.name} (${currentRole.name})`,
          sentAt: new Date().toISOString(),
        };
      }
      return q;
    }));

    api.updateQuotation(quotationId, {
      status: 'Approved',
      approvalNotes: notes || `Approved by ${currentEmployee.name} (${currentRole.name})`,
      sentAt: new Date().toISOString(),
    }).catch(() => {});

    const quote = quotations.find(q => q.id === quotationId);
    if (quote) {
      updateLeadStage(quote.leadId, 'QUOTATION_SENT');
    }

    addAuditLog('QUOTATION_APPROVED', 'quotations', quotationId, `Approved quotation ${quotationId}`);
    showNotification('Quotation approved and released to customer!', 'success');
  };

  const convertQuotationToOrder = (quotationId: string): Order => {
    const quote = quotations.find(q => q.id === quotationId);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `WEL-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      quotationId,
      leadId: quote ? quote.leadId : '',
      companyName: quote ? quote.companyName : 'Customer',
      contactName: quote ? quote.contactName : 'Contact',
      items: quote ? quote.items.map(i => ({
        productId: i.productId,
        productName: i.productName,
        sku: i.sku,
        quantity: i.quantity,
        unitPriceUSD: i.unitPriceUSD,
        totalPriceUSD: i.totalPriceUSD,
      })) : [],
      totalValueUSD: quote ? quote.grandTotalUSD : 0,
      stage: 'Confirmed',
      expectedDeliveryDate: new Date(Date.now() + 14 * 86400 * 1000).toISOString().split('T')[0],
      isRepeatOrder: false,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    api.createOrder(newOrder).catch(() => {});

    if (quote) {
      updateLeadStage(quote.leadId, 'WON');
    }

    addAuditLog('ORDER_CONVERTED', 'orders', newOrder.id, `Converted quotation ${quotationId} into confirmed order ${newOrder.orderNumber}`);
    showNotification(`Order ${newOrder.orderNumber} confirmed & sent to production queue!`, 'success');
    return newOrder;
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    api.deleteOrder(orderId).catch(() => {});
    addAuditLog('ORDER_DELETED', 'orders', orderId, `Deleted order ${orderId}`);
    showNotification('Order removed from registry.', 'warning');
  };

  const rejectQuotation = (quotationId: string, reason?: string) => {
    setQuotations(prev => prev.map(q => {
      if (q.id === quotationId) {
        return {
          ...q,
          status: 'Rejected',
          approvalNotes: reason || `Marked as Rejected / Revision Requested by ${currentEmployee.name}`,
        };
      }
      return q;
    }));
    api.updateQuotation(quotationId, {
      status: 'Rejected',
      approvalNotes: reason || `Marked as Rejected / Revision Requested by ${currentEmployee.name}`,
    }).catch(() => {});
    addAuditLog('QUOTATION_REJECTED', 'quotations', quotationId, `Rejected quotation ${quotationId}: ${reason || 'Revision needed'}`);
    showNotification('Quotation status updated to Rejected / Needs Revision.', 'warning');
  };

  const deleteQuotation = (quotationId: string) => {
    setQuotations(prev => prev.filter(q => q.id !== quotationId));
    api.deleteQuotation(quotationId).catch(() => {});
    addAuditLog('QUOTATION_DELETED', 'quotations', quotationId, `Deleted quotation ${quotationId}`);
    showNotification('Quotation permanently removed.', 'warning');
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    api.deleteLead(leadId).catch(() => {});
    addAuditLog('LEAD_DELETED', 'leads', leadId, `Deleted lead ${leadId}`);
    showNotification('Lead removed from CRM pipeline.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentRole,
        setCurrentRole,
        roles,
        setRoles,
        addRole,
        updateRole,
        deleteRole,
        employees,
        setEmployees,
        currentEmployee,
        setCurrentEmployee,
        hasPermission,
        currentUser,
        sessionToken,
        isAuthenticated,
        isLoginModalOpen,
        isConcurrentLogoutAlertOpen,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
        closeConcurrentLogoutAlert,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        payrolls,
        addPayrollRecord,
        updatePayrollRecord,
        deletePayrollRecord,
        generateMonthlyPayroll,
        disbursePayrollRecord,
        bulkDisbursePayroll,
        approvePayrollRecord,
        bulkApprovePayroll,
        attendance,
        logAttendance,
        updateAttendance,
        leaveRequests,
        applyLeaveRequest,
        updateLeaveRequestStatus,
        companySettings,
        updateCompanySettings,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        selectedProduct,
        setSelectedProduct,
        compareList,
        toggleCompare,
        isCompareOpen,
        setIsCompareOpen,
        catalogModal,
        openCatalogModal,
        closeCatalogModal,
        galleryMedia,
        addGalleryMedia,
        updateGalleryMedia,
        deleteGalleryMedia,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        reorderBanners,
        toggleBannerStatus,
        leads,
        updateLeadStage,
        assignLead,
        deleteLead,
        addPublicRFQLead,
        rfqs,
        samples,
        createSampleRequest,
        updateSampleStage,
        deleteSampleRequest,
        trials,
        createTechnicalTrial,
        updateTrialStatus,
        deleteTechnicalTrial,
        quotations,
        createQuotationFromLead,
        approveQuotation,
        rejectQuotation,
        deleteQuotation,
        orders,
        convertQuotationToOrder,
        updateOrderStage,
        deleteOrder,
        exhibitions,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        selectedExpoSlug,
        setSelectedExpoSlug,
        auditLogs,
        addAuditLog,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
