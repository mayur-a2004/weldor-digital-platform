import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { 
  Role, 
  Employee, 
  Product, 
  ProductCategory, 
  Lead, 
  LeadStage, 
  LeadActivity,
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
  CompanySettings,
  InventoryItem,
  InventoryStockLog
} from '../types';
import { INITIAL_ROLES } from '../config/roles';
import { 
  OFFICIAL_WELDOR_PRODUCTS, 
  OFFICIAL_WELDOR_CATEGORIES, 
  OFFICIAL_WELDOR_BANNERS,
  OFFICIAL_WELDOR_GALLERY,
  OFFICIAL_WELDOR_EXHIBITIONS
} from '../config/catalogData';
import { INITIAL_INVENTORY_ITEMS } from '../config/inventoryData';

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
  | 'crm-inventory'
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
  | 'crm-audit'
  | 'crm-reports';

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
  legalEntityName: 'Earth Metal Industries',
  cinNumber: '',
  gstin: '24AABCE1234F1Z5',
  gstinNumber: '24AABCE1234F1Z5',
  panNumber: 'AABCE1234F',
  iecCode: '0812345678',
  msmeRegistrationNo: 'UDYAM-GJ-15-0012345',
  registeredOffice: 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
  factoryPlantAddress: 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
  registeredOfficeAddress: {
    addressLine1: '588, G.I.D.C., Phase 2',
    addressLine2: 'Dared',
    city: 'Jamnagar',
    state: 'Gujarat',
    country: 'India',
    pincode: '361004',
  },
  primaryEmail: 'brm@weldorindustries.com',
  supportEmail: 'brm@weldorindustries.com',
  primaryPhone: '+91-87800 98088',
  salesPhone: '+91-87800 98088',
  websiteUrl: 'https://weldorindustries.com',
  fiscalYear: '2026-2027',
  bankAccounts: [],
  primaryBank: {
    bankName: 'HDFC Bank Ltd',
    accountName: 'Earth Metal Industries',
    accountNumber: '50200012345678',
    ifscCode: 'HDFC0001234',
    branch: 'Dared GIDC, Jamnagar',
  },
  defaultTerms: {
    paymentTerms: '50% Advance against Proforma, Balance before Dispatch',
    deliveryTerms: 'Ex-Factory Jamnagar / Ready Dispatch within 7-10 Business Days',
    validityDays: 30,
    warrantyTerms: '12 Months replacement warranty against manufacturing defects',
    packagingTerms: 'Export Standard Heavy-Duty Wooden Case with VCI Bag',
    inspectionTerms: '100% In-House Hydrostatic & Flame Test with EN 10204 3.1 MTC',
    generalTerms: '1. GST @ 18% Extra as applicable.\n2. Freight, Transit Insurance, and Octroi extra at actuals.\n3. Goods once sold will not be taken back unless approved.\n4. All disputes are subject to Jamnagar (Gujarat) jurisdiction only.',
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
  deleteRFQ: (id: string) => void;
  samples: SampleRequest[];
  createSampleRequest: (data: Partial<SampleRequest>) => Promise<SampleRequest>;
  updateSampleStage: (sampleId: string, stage: SampleRequest['stage']) => void;
  deleteSampleRequest: (sampleId: string) => void;

  trials: TechnicalTrial[];
  createTechnicalTrial: (data: Partial<TechnicalTrial>) => Promise<TechnicalTrial>;
  updateTrialStatus: (trialId: string, status: TechnicalTrial['status'], failureReason?: string) => void;
  deleteTechnicalTrial: (trialId: string) => void;

  quotations: Quotation[];
  createQuotationFromLead: (
    leadId: string, 
    items: Quotation['items'], 
    freight: number, 
    validity: number, 
    customerMeta?: { 
      companyName?: string; 
      contactName?: string; 
      email?: string; 
      phone?: string; 
      billingAddress?: string; 
      gstin?: string; 
      state?: string;
      buyerName?: string;
      buyerEmail?: string;
      buyerPhone?: string;
      destinationCountry?: string;
    }
  ) => Quotation;
  addCommercialQuotation: (quotation: any) => void;
  approveQuotation: (quotationId: string, notes?: string) => void;
  rejectQuotation: (quotationId: string, reason?: string) => void;
  deleteQuotation: (quotationId: string) => void;

  orders: Order[];
  convertQuotationToOrder: (quotationId: string, quotationData?: any) => Order;
  updateOrderStage: (orderId: string, newStage: Order['stage'], dispatchDetails?: { courierTrackingNo?: string; courierPartner?: string; dispatchDate?: string }) => void;
  deleteOrder: (orderId: string) => void;

  invoices: any[];
  addInvoice: (invoice: any) => Promise<void>;
  updateInvoice: (id: string, invoice: any) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  exhibitions: Exhibition[];
  addExhibition: (expo: Omit<Exhibition, 'id'>) => void;
  updateExhibition: (id: string, expo: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  selectedExpoSlug: string | null;
  setSelectedExpoSlug: (slug: string | null) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, targetId: string, details: string) => void;

  // Inventory & Stock Management
  inventory: InventoryItem[];
  inventoryLogs: InventoryStockLog[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  clearAllInventory: () => void;
  bulkDeleteInventory: (ids: string[]) => void;
  adjustInventoryStock: (id: string, deltaQty: number, type: InventoryStockLog['changeType'], reason: string, referenceNumber?: string) => void;
  bulkImportInventory: (items: any[]) => { successCount: number; errorCount: number };
  lowStockCount: number;
  outOfStockCount: number;

  // Notification Toast State
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// One-time cache migration: Cleanses stale/mock local storage keys to ensure 100% MongoDB accuracy
const CACHE_VERSION = 'weldor_v7_clean_slate_superadmin_only';
if (typeof window !== 'undefined') {
  try {
    const currentVer = localStorage.getItem('weldor_cache_version');
    if (currentVer !== CACHE_VERSION) {
      const token = localStorage.getItem('weldor_session_token');
      const user = localStorage.getItem('weldor_current_user');
      [
        'weldor_leads', 'weldor_rfqs', 'weldor_quotations', 'weldor_orders',
        'weldor_invoices', 'weldor_commercial_quotes',
        'weldor_samples', 'weldor_trials', 'weldor_payrolls',
        'weldor_attendance', 'weldor_leaves', 'weldor_audit', 'weldor_wal',
        'weldor_employees', 'weldor_exhibitions'
      ].forEach(k => localStorage.removeItem(k));
      if (token) localStorage.setItem('weldor_session_token', token);
      if (user) localStorage.setItem('weldor_current_user', user);
      localStorage.setItem('weldor_cache_version', CACHE_VERSION);
    }
  } catch (e) {}
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveViewState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname.includes('/crm') || pathname.includes('/admin')) {
        const token = localStorage.getItem('weldor_session_token');
        const user = localStorage.getItem('weldor_current_user');
        return token && user ? 'crm-dashboard' : 'auth-login';
      }
      const saved = localStorage.getItem('weldor_active_view') as ViewMode;
      if (saved) return saved;
    }
    return 'public-home';
  });

  const setActiveView = (view: ViewMode) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      localStorage.setItem('weldor_active_view', view);
      if (view.startsWith('crm-') || view === 'auth-login') {
        if (!window.location.pathname.startsWith('/crm')) {
          window.history.pushState(null, '', '/crm');
        }
      } else if (view.startsWith('public-')) {
        if (window.location.pathname !== '/') {
          window.history.pushState(null, '', '/');
        }
      }
    }
  };

  // Local cache persistence helpers for seamless offline & refresh support
  const loadLocal = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && fallback.length > 0 && Array.isArray(parsed) && parsed.length === 0) {
        return fallback;
      }
      if (key === 'weldor_products' && Array.isArray(parsed)) {
        const cleaned = parsed.filter((p: any) => p && p.id && !String(p.id).startsWith('prod_'));
        if (cleaned.length > 0) return cleaned as unknown as T;
        return fallback;
      }
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const saveLocal = (key: string, data: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };

  // ─── Write-Ahead Log (WAL) ──────────────────────────────────────────────────
  // Every user edit is registered here with a client-side timestamp.
  // On refresh, WAL entries ALWAYS override what the backend returns.
  // This completely prevents the backend's server-side updatedAt from winning
  // over fresh user edits (backend stamps updatedAt AFTER network round-trip,
  // so it always appears "newer" — WAL bypasses this entirely).
  const WAL_KEY = 'weldor_wal';
  type WalEntry = { collection: string; id: string; data: any; clientTs: number; op: 'upsert' | 'delete' };

  const walGet = (): WalEntry[] => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(WAL_KEY) || '[]'); } catch { return []; }
  };
  const walAdd = (entry: WalEntry) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = walGet().filter(e => !(e.collection === entry.collection && e.id === entry.id));
      localStorage.setItem(WAL_KEY, JSON.stringify([entry, ...existing].slice(0, 2000)));
    } catch {}
  };
  const walRemoveSynced = (collection: string, ids: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      const idSet = new Set(ids);
      const filtered = walGet().filter(e => !(e.collection === collection && idSet.has(e.id)));
      localStorage.setItem(WAL_KEY, JSON.stringify(filtered));
    } catch {}
  };

  // Apply WAL entries on top of an array — WAL always wins
  const applyWal = <T extends { id?: string }>(collection: string, dataArray: T[]): T[] => {
    const wal = walGet().filter(e => e.collection === collection);
    if (wal.length === 0) return dataArray;
    const map = new Map<string, T>((dataArray || []).filter(i => i && i.id).map(i => [i.id!, i]));
    wal.forEach(entry => {
      if (entry.op === 'delete') {
        map.delete(entry.id);
      } else {
        const existing = map.get(entry.id) || ({} as T);
        map.set(entry.id, { ...existing, ...entry.data, id: entry.id } as T);
      }
    });
    return Array.from(map.values());
  };

  // Register a write to the WAL (called on every add/update/delete)
  const walRegister = (collection: string, id: string, data: any, op: 'upsert' | 'delete' = 'upsert') => {
    walAdd({ collection, id, data, clientTs: Date.now(), op });
  };

  // Smart merge: union of WAL-applied backend data + local array, sorted by createdAt desc
  const mergeArrayData = <T extends { id?: string; updatedAt?: string; createdAt?: string }>(
    backendData: T[],
    localData: T[],
    collection?: string
  ): T[] => {
    // Apply WAL over backend first (WAL always wins over backend)
    const walApplied = collection ? applyWal<T>(collection, backendData) : backendData;
    const merged = new Map<string, T>();
    // Start with WAL-applied backend
    walApplied.forEach(item => { if (item && item.id) merged.set(item.id, item); });
    // Overlay local items that are NOT in backend (locally-added items not yet synced)
    (localData || []).forEach(item => {
      if (!item || !item.id) return;
      if (!merged.has(item.id)) {
        merged.set(item.id, item); // Local-only item
      }
    });
    // Double check WAL deletes to guarantee deleted items never resurface
    if (collection) {
      const walDeletes = walGet().filter(e => e.collection === collection && e.op === 'delete');
      walDeletes.forEach(d => merged.delete(d.id));
    }
    // Sort: newest first (by createdAt, preserving natural UI order)
    const result = Array.from(merged.values());
    result.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta; // descending (newest first)
    });
    return result;
  };

  const loadLocalWithWal = <T extends { id?: string; createdAt?: string }>(key: string, fallback: T[], collection: string): T[] => {
    const loaded = loadLocal(key, fallback);
    const walApplied = applyWal<T>(collection, Array.isArray(loaded) ? loaded : fallback);
    walApplied.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    return walApplied;
  };

  const [roles, setRoles] = useState<Role[]>(() => loadLocal('weldor_roles', INITIAL_ROLES));
  const [currentRole, setCurrentRole] = useState<Role>(() => loadLocal('weldor_roles', INITIAL_ROLES)[0] || INITIAL_ROLES[0]);

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

  const normalizeEmployee = (e: Employee): Employee => {
    if (!e || typeof e !== 'object') return e;
    return {
      ...e,
      name: e.name || 'Employee',
      email: e.email || '',
      employeeId: e.employeeId || e.id || 'WEL-1001',
      employeeCode: e.employeeCode || '',
      designation: e.designation || 'Staff',
      department: e.department || 'General',
      status: e.status || 'Active',
      roleId: e.roleId || 'role-super-admin',
      roleName: e.roleName || 'Super Admin',
    };
  };

  const [employees, setEmployees] = useState<Employee[]>(() => 
    loadLocalWithWal('weldor_employees', [DEFAULT_EMPLOYEE], 'employees').map(normalizeEmployee)
  );
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(() => currentUser || DEFAULT_EMPLOYEE);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isConcurrentLogoutAlertOpen, setIsConcurrentLogoutAlertOpen] = useState(false);
  const isAuthenticated = !!(currentUser && sessionToken);

  const normalizeProduct = (p: Product): Product => {
    if (!p || typeof p !== 'object') return p;
    return {
      ...p,
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
      bulletPoints: Array.isArray(p.bulletPoints) ? p.bulletPoints : [],
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      industries: Array.isArray(p.industries) ? p.industries : [],
      applications: Array.isArray(p.applications) ? p.applications : [],
      materials: Array.isArray(p.materials) ? p.materials : [],
    };
  };

  const normalizeCategory = (c: ProductCategory): ProductCategory => {
    if (!c || typeof c !== 'object') return c;
    return {
      ...c,
      subCategories: Array.isArray(c.subCategories) ? c.subCategories : [],
    };
  };

  const normalizeExhibition = (e: Exhibition): Exhibition => {
    if (!e || typeof e !== 'object') return e;
    return {
      ...e,
      keyHighlights: Array.isArray(e.keyHighlights) ? e.keyHighlights : [],
      galleryImages: Array.isArray(e.galleryImages) ? e.galleryImages : [],
    };
  };

  const normalizeRFQ = (r: RFQRequirement): RFQRequirement => {
    if (!r || typeof r !== 'object') return r;
    const rAny = r as any;
    return {
      ...r,
      companyName: r.companyName || (rAny.title ? rAny.title.replace(/^RFQ:\s*/i, '') : '') || 'Enterprise Client',
      contactPerson: r.contactPerson || 'Purchasing Lead',
      email: r.email || '',
      phone: r.phone || '',
      country: r.country || 'India',
      categoryName: r.categoryName || 'Pneumatic Automation',
      targetQuantity: Number(r.targetQuantity) || 50,
      targetUnit: r.targetUnit || 'PCS',
      materialPreference: r.materialPreference || 'Standard ISO Spec',
      pressureRating: r.pressureRating || 'Standard ISO',
      requirementType: r.requirementType || 'Custom OEM Drawing',
      status: r.status || 'Pending Review',
    };
  };

  const normalizeLead = (l: Lead): Lead => {
    if (!l || typeof l !== 'object') return l;
    const lAny = l as any;
    const leadId = l.id || `lead-${Date.now()}`;
    const company = l.companyName || (lAny.title ? lAny.title.replace(/^RFQ:\s*/i, '') : '') || 'Enterprise Client';
    const contact = l.contactName || lAny.contactPerson || 'Procurement Lead';
    return {
      ...l,
      id: leadId,
      leadNumber: l.leadNumber || `WEL-LD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: l.title || `Inquiry: ${company}`,
      companyName: company,
      contactName: contact,
      contactEmail: l.contactEmail || lAny.email || 'inquiry@weldorindustries.com',
      contactPhone: l.contactPhone || lAny.phone || '+91 98250 11223',
      country: l.country || 'India',
      city: l.city || 'Ahmedabad',
      source: l.source || 'Product Enquiry',
      stage: (l.stage as LeadStage) || 'NEW_LEAD',
      priority: l.priority || (lAny.urgency === 'HIGH' ? 'Urgent' : 'Medium'),
      assignedEmployeeId: l.assignedEmployeeId || lAny.assignedTo || 'emp-root-superadmin',
      assignedEmployeeName: l.assignedEmployeeName || lAny.assignedToName || 'Super Admin',
      categoryName: l.categoryName || 'Pneumatic Automation',
      expectedQuantity: Number(l.expectedQuantity) || Number(lAny.targetQuantity) || 100,
      estimatedValueUSD: typeof l.estimatedValueUSD === 'number' && !isNaN(l.estimatedValueUSD) ? l.estimatedValueUSD : 15000,
      drawingFile: l.drawingFile || (lAny.cadFileUrl ? {
        name: lAny.drawingFileName || 'Engineering_Drawing_Rev1.pdf',
        size: '3.4 MB',
        type: 'CAD/PDF',
        url: lAny.cadFileUrl || '#'
      } : undefined),
      technicalNotes: l.technicalNotes || lAny.technicalRequirements || 'Direct inquiry with technical specifications.',
      slaDeadline: l.slaDeadline || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      isSlaViolated: Boolean(l.isSlaViolated),
      createdAt: l.createdAt || new Date().toISOString(),
      updatedAt: l.updatedAt || new Date().toISOString(),
      activities: (() => {
        const rawActs = l.activities;
        if (Array.isArray(rawActs) && rawActs.length > 0) return rawActs;
        if (rawActs && typeof rawActs === 'object') {
          const vals = Object.values(rawActs) as LeadActivity[];
          if (vals.length > 0) return vals;
        }
        return [
          {
            id: `act-${leadId}`,
            leadId,
            timestamp: l.createdAt || new Date().toISOString(),
            type: 'Note' as const,
            performedBy: contact,
            description: l.technicalNotes || lAny.technicalRequirements || 'Inbound inquiry received with CAD/technical specification.'
          }
        ];
      })()
    };
  };

  const [categories, setCategories] = useState<ProductCategory[]>(() => 
    loadLocalWithWal('weldor_categories', OFFICIAL_WELDOR_CATEGORIES, 'categories').map(normalizeCategory)
  );
  const [products, setProducts] = useState<Product[]>(() => 
    loadLocalWithWal('weldor_products', OFFICIAL_WELDOR_PRODUCTS, 'products').map(normalizeProduct)
  );
  const [galleryMedia, setGalleryMedia] = useState<GalleryMedia[]>(() => loadLocalWithWal('weldor_gallery', OFFICIAL_WELDOR_GALLERY, 'gallery'));
  const [banners, setBanners] = useState<HeroBanner[]>(() => loadLocalWithWal('weldor_banners', OFFICIAL_WELDOR_BANNERS, 'banners'));
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

  const [leads, setLeads] = useState<Lead[]>(() => {
    const loaded = loadLocalWithWal<Lead>('weldor_leads', [], 'leads')
      .filter((l: any) => l && (l.companyName || l.contactName || l.contactEmail || l.title));
    return loaded.map(normalizeLead);
  });
  const [rfqs, setRfqs] = useState<RFQRequirement[]>(() => 
    loadLocalWithWal<RFQRequirement>('weldor_rfqs', [], 'rfqs')
      .filter((r: any) => r && (r.companyName || r.email || r.title || r.contactPerson))
      .map(normalizeRFQ)
  );
  const [samples, setSamples] = useState<SampleRequest[]>(() => loadLocalWithWal('weldor_samples', [], 'samples'));
  const [trials, setTrials] = useState<TechnicalTrial[]>(() => loadLocalWithWal('weldor_trials', [], 'trials'));
  const [quotations, setQuotations] = useState<Quotation[]>(() => loadLocalWithWal('weldor_quotations', [], 'quotations'));
  
  // Master Inventory & B2B Spares Ledger
  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    loadLocalWithWal<InventoryItem>('weldor_inventory', INITIAL_INVENTORY_ITEMS, 'inventory')
  );
  const [inventoryLogs, setInventoryLogs] = useState<InventoryStockLog[]>(() => 
    loadLocalWithWal<InventoryStockLog>('weldor_inventory_logs', [], 'inventory_logs')
  );

  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = loadLocalWithWal<Order>('weldor_orders', [], 'orders');
    const seenIds = new Set<string>();
    const seenNumbers = new Set<string>();
    const seenQuoteIds = new Set<string>();
    const seenSignatures = new Set<string>();
    const deduped: Order[] = [];

    for (const ord of raw) {
      if (!ord || !ord.id) continue;
      const num = (ord.orderNumber || '').trim().toUpperCase();
      const qId = (ord.quotationId || '').trim();
      const sig = `${(ord.companyName || '').trim()}_${ord.totalValueUSD}_${(ord.items || []).length}`;

      if (seenIds.has(ord.id)) continue;
      if (num && seenNumbers.has(num)) continue;
      if (qId && seenQuoteIds.has(qId)) continue;
      if (sig && (ord.companyName || '').trim() && seenSignatures.has(sig)) continue;

      seenIds.add(ord.id);
      if (num) seenNumbers.add(num);
      if (qId) seenQuoteIds.add(qId);
      if ((ord.companyName || '').trim()) seenSignatures.add(sig);
      deduped.push(ord);
    }

    // Auto-heal missing buyer details, item lists, and totals from commercial quotations
    let commercialQuotes: any[] = [];
    try {
      const qRaw = localStorage.getItem('weldor_commercial_quotes');
      if (qRaw) commercialQuotes = JSON.parse(qRaw);
    } catch (e) {}

    const healedOrders = deduped.map(ord => {
      const qId = ord.quotationId;
      const matchedQ = commercialQuotes.find((q: any) => q.id === qId || q.quotationNumber === qId) as any;
      if (matchedQ) {
        const cName = (!ord.companyName || ord.companyName === 'Customer') 
          ? (matchedQ.buyer?.companyName || matchedQ.companyName || ord.companyName || 'Enterprise Client')
          : ord.companyName;

        const pName = (!ord.contactName || ord.contactName === 'Contact')
          ? (matchedQ.buyer?.contactName || matchedQ.contactName || ord.contactName || 'Purchasing Dept')
          : ord.contactName;

        const rawItems = (ord.items && ord.items.length > 0 && ord.items[0].productName) ? ord.items : (matchedQ.items || []);
        const items = rawItems.map((i: any) => ({
          productId: i.productId || i.id || `prod-${Math.random()}`,
          productName: i.productName || i.description || 'Precision Consumable',
          sku: i.sku || 'WEL-SKU',
          quantity: Number(i.quantity) || 1,
          unit: i.unit || 'PCS',
          unitPriceUSD: Number(i.unitPriceUSD || i.unitPrice) || 0,
          totalPriceUSD: Number(i.totalPriceUSD || i.totalUSD) || ((Number(i.quantity) || 1) * (Number(i.unitPriceUSD || i.unitPrice) || 0)),
          hsnCode: i.hsnCode || '84122100'
        }));

        const grandTotalINR = (ord as any).grandTotalINR || matchedQ.grandTotalINR || (matchedQ.grandTotalUSD ? Math.round(Number(matchedQ.grandTotalUSD) * 85) : 0);
        const totalValueUSD = Number(matchedQ.grandTotalUSD) || (grandTotalINR ? Math.round(grandTotalINR / 85) : ord.totalValueUSD);

        return {
          ...ord,
          companyName: cName,
          contactName: pName,
          buyer: matchedQ.buyer || (ord as any).buyer,
          gstin: (ord as any).gstin || matchedQ.buyer?.gstin || '',
          state: (ord as any).state || matchedQ.buyer?.state || '',
          stateCode: (ord as any).stateCode || matchedQ.buyer?.stateCode || '',
          billingAddress: (ord as any).billingAddress || matchedQ.buyer?.billingAddress || '',
          shippingAddress: (ord as any).shippingAddress || matchedQ.buyer?.shippingAddress || 'Client Factory Gate',
          items,
          totalValueUSD,
          grandTotalINR,
          taxableTotalUSD: Number(matchedQ.taxableTotalUSD) || (ord as any).taxableTotalUSD,
          totalTaxUSD: Number(matchedQ.totalTaxUSD) || (ord as any).totalTaxUSD,
          freightCostUSD: Number(matchedQ.freightCostUSD) || (ord as any).freightCostUSD,
          packagingCostUSD: Number(matchedQ.packagingCostUSD) || (ord as any).packagingCostUSD
        };
      }
      return ord;
    });

    saveLocal('weldor_orders', healedOrders);
    return healedOrders;
  });
  const [invoices, setInvoices] = useState<any[]>(() => loadLocalWithWal('weldor_invoices', [], 'invoices'));
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(() => loadLocalWithWal('weldor_exhibitions', OFFICIAL_WELDOR_EXHIBITIONS, 'exhibitions'));
  const [selectedExpoSlug, setSelectedExpoSlug] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadLocalWithWal('weldor_audit', [], 'audit'));

  // HRMS, Payroll & Settings State
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(() => loadLocalWithWal('weldor_payrolls', [], 'payrolls'));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadLocalWithWal('weldor_attendance', [], 'attendances'));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => loadLocalWithWal('weldor_leaves', [], 'leaves'));
  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => loadLocal('weldor_settings', BLANK_SETTINGS));

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Load live data from Backend API on mount with resilient allSettled
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const results = await Promise.allSettled([
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
          api.getInvoices(),
        ]);

        const [
          prodRes, catRes, expoRes, banRes, galRes,
          leadRes, rfqRes, quoteRes, orderRes, smpRes,
          trlRes, empRes, payRes, attRes, leaveRes,
          settRes, audRes, roleRes, invRes
        ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

        // Smart sync: merge backend + local with WAL enforcement
        const smartSync = <T extends { id?: string; updatedAt?: string; createdAt?: string }>(
          res: { success: boolean; data: T[] } | null,
          localKey: string,
          currentLocal: T[],
          setter: React.Dispatch<React.SetStateAction<T[]>>,
          collection: string
        ) => {
          const normalizeItem = (item: T): T => {
            if (collection === 'products') return normalizeProduct(item as unknown as Product) as unknown as T;
            if (collection === 'categories') return normalizeCategory(item as unknown as ProductCategory) as unknown as T;
            if (collection === 'exhibitions') return normalizeExhibition(item as unknown as Exhibition) as unknown as T;
            if (collection === 'employees') return normalizeEmployee(item as unknown as Employee) as unknown as T;
            if (collection === 'rfqs') return normalizeRFQ(item as unknown as RFQRequirement) as unknown as T;
            if (collection === 'leads') return normalizeLead(item as unknown as Lead) as unknown as T;
            return item;
          };

          if (!res?.success || !Array.isArray(res.data)) {
            const walApplied = applyWal<T>(collection, currentLocal).map(normalizeItem);
            setter(walApplied);
            saveLocal(localKey, walApplied);
            return;
          }

          // 1. Normalize backend data
          const validData = res.data.filter((item: any) => {
            if (!item) return false;
            if (collection === 'leads') return Boolean(item.companyName || item.contactName || item.contactEmail || item.title);
            if (collection === 'rfqs') return Boolean(item.companyName || item.email || item.title || item.contactPerson);
            return true;
          }).map(normalizeItem);

          // 2. Apply WAL over backend (local fresh edits always win)
          const walAppliedBackend = applyWal<T>(collection, validData);

          // 3. Merge locally added items that have not yet reached the backend (prevents data loss on slow network/refresh)
          const mergedMap = new Map<string, T>();
          walAppliedBackend.forEach(item => {
            if (item && item.id) mergedMap.set(item.id, item);
          });

          (currentLocal || []).forEach(localItem => {
            if (localItem && localItem.id && !mergedMap.has(localItem.id)) {
              mergedMap.set(localItem.id, normalizeItem(localItem));
            }
          });

          // 4. Enforce WAL deletes so deleted items never re-appear
          const walDeletes = walGet().filter(e => e.collection === collection && e.op === 'delete');
          walDeletes.forEach(d => mergedMap.delete(d.id));

          // 5. Automatic Deduplication Guard: ensures single records never duplicate
          const seenDocNumbers = new Set<string>();
          const seenQuotationIds = new Set<string>();
          const seenSignatures = new Set<string>();
          const dedupedList: T[] = [];
          for (const item of mergedMap.values()) {
            const anyItem = item as any;
            const docNum = anyItem.quotationNumber || anyItem.invoiceNumber || anyItem.orderNumber || anyItem.sampleNumber || anyItem.trialNumber;
            if (docNum) {
              if (seenDocNumbers.has(docNum)) continue;
              seenDocNumbers.add(docNum);
            }
            if (collection === 'orders') {
              const qId = (anyItem.quotationId || '').trim();
              const sig = `${(anyItem.companyName || '').trim()}_${anyItem.totalValueUSD}_${(anyItem.items || []).length}`;
              if (qId && seenQuotationIds.has(qId)) continue;
              if (sig && seenSignatures.has(sig)) continue;
              if (qId) seenQuotationIds.add(qId);
              seenSignatures.add(sig);
            }
            dedupedList.push(item);
          }

          const finalData = (dedupedList.length === 0 && collection === 'employees')
            ? [DEFAULT_EMPLOYEE] as unknown as T[]
            : dedupedList.map(normalizeItem);

          setter(finalData);
          saveLocal(localKey, finalData);
        };

        smartSync(prodRes, 'weldor_products', products, setProducts, 'products');
        smartSync(catRes, 'weldor_categories', categories, setCategories, 'categories');
        smartSync(expoRes, 'weldor_exhibitions', exhibitions, setExhibitions, 'exhibitions');
        smartSync(banRes, 'weldor_banners', banners, setBanners, 'banners');
        smartSync(galRes, 'weldor_gallery', galleryMedia, setGalleryMedia, 'gallery');
        smartSync(leadRes, 'weldor_leads', leads, setLeads, 'leads');
        smartSync(rfqRes, 'weldor_rfqs', rfqs, setRfqs, 'rfqs');
        smartSync(quoteRes, 'weldor_quotations', quotations, setQuotations, 'quotations');
        smartSync(orderRes, 'weldor_orders', orders, setOrders, 'orders');
        smartSync(invRes, 'weldor_invoices', invoices, setInvoices, 'invoices');
        smartSync(smpRes, 'weldor_samples', samples, setSamples, 'samples');
        smartSync(trlRes, 'weldor_trials', trials, setTrials, 'trials');
        smartSync(empRes, 'weldor_employees', employees, setEmployees, 'employees');
        smartSync(payRes, 'weldor_payrolls', payrolls, setPayrolls, 'payrolls');
        smartSync(attRes, 'weldor_attendance', attendance, setAttendance, 'attendances');
        smartSync(leaveRes, 'weldor_leaves', leaveRequests, setLeaveRequests, 'leaves');
        smartSync(audRes, 'weldor_audit', auditLogs, setAuditLogs, 'audit');

        // Settings: single object → deep merge (backend wins for keys it knows about, local keeps the rest)
        if (settRes?.success && settRes.data && typeof settRes.data === 'object' && Object.keys(settRes.data).length > 0) {
          const d = settRes.data;
          const legal = d.legalEntityName || d.legalName;
          const gstin = d.gstinNumber || d.gstin;
          const email = d.supportEmail || d.primaryEmail;
          const phone = d.salesPhone || d.primaryPhone;
          const regOffice = d.registeredOffice || (d.registeredOfficeAddress ? `${d.registeredOfficeAddress.addressLine1 || ''}, ${d.registeredOfficeAddress.city || ''}, ${d.registeredOfficeAddress.state || ''} - ${d.registeredOfficeAddress.pincode || ''}` : undefined);
          const factory = d.factoryPlantAddress || regOffice;

          setCompanySettings(prev => {
            const mergedSettings = { 
              ...prev, 
              ...d,
              ...(legal ? { legalEntityName: legal, legalName: legal } : {}),
              ...(gstin ? { gstinNumber: gstin, gstin: gstin } : {}),
              ...(email ? { supportEmail: email, primaryEmail: email } : {}),
              ...(phone ? { salesPhone: phone, primaryPhone: phone } : {}),
              ...(regOffice ? { registeredOffice: regOffice } : {}),
              ...(factory ? { factoryPlantAddress: factory } : {}),
            };
            saveLocal('weldor_settings', mergedSettings);
            return mergedSettings;
          });
        }

        // Roles: server is authoritative (roles are structured system data)
        if (roleRes?.success && Array.isArray(roleRes.data) && roleRes.data.length > 0) {
          smartSync(roleRes, 'weldor_roles', roles, setRoles, 'roles');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const user = res?.data?.user || res?.user;
      const token = res?.data?.sessionToken || res?.sessionToken || res?.token;

      if (res?.success && token && user) {
        setSessionToken(token);
        setCurrentUser(user);
        setCurrentEmployee(user);

        // Find matching role
        const matchedRole = roles.find(r => r.name === user.roleName || r.id === user.roleId) || INITIAL_ROLES[0];
        setCurrentRole(matchedRole);

        if (typeof window !== 'undefined') {
          localStorage.setItem('weldor_session_token', token);
          localStorage.setItem('weldor_current_user', JSON.stringify(user));
          localStorage.setItem('weldor_active_view', 'crm-dashboard');
        }

        showNotification(`Welcome back, ${user.name}! Authenticated with role: ${user.roleName || matchedRole.name}`, 'success');
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
    setRoles(prev => {
      const next = [...prev, newRole];
      saveLocal('weldor_roles', next);
      return next;
    });
    try {
      await api.createRole(newRole);
      addAuditLog('ROLE_CREATED', 'rbac', newRole.id, `Created custom security role "${newRole.name}" (${newRole.scope} Scope)`);
      showNotification(`Role "${newRole.name}" created successfully!`, 'success');
    } catch (e) {
      console.warn('Role creation sync error:', e);
    }
  };

  const updateRole = async (id: string, updatedFields: Partial<Role>) => {
    setRoles(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updatedFields } : r);
      saveLocal('weldor_roles', next);
      return next;
    });
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
    setRoles(prev => {
      const next = prev.filter(r => r.id !== id);
      saveLocal('weldor_roles', next);
      return next;
    });
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
    walRegister('employees', newEmp.id, newEmp, 'upsert');
    setEmployees(prev => {
      const next = [newEmp, ...prev];
      saveLocal('weldor_employees', next);
      return next;
    });
    api.createEmployee(newEmp).catch(e => console.warn('Employee create API error:', e));
    addAuditLog('EMPLOYEE_ONBOARDED', 'employees', newEmp.id, `Onboarded new staff ${newEmp.name} (${newEmp.employeeCode || newEmp.employeeId})`);
    showNotification(`Employee ${newEmp.name} registered successfully!`, 'success');
  };

  const updateEmployee = (id: string, updatedFields: Partial<Employee>) => {
    walRegister('employees', id, updatedFields, 'upsert');
    setEmployees(prev => {
      const next = prev.map(e => e.id === id ? { ...e, ...updatedFields } : e);
      saveLocal('weldor_employees', next);
      return next;
    });
    api.updateEmployee(id, updatedFields).catch(e => console.warn('Employee update API error:', e));
    addAuditLog('EMPLOYEE_UPDATED', 'employees', id, `Updated employee profile for ID ${id}`);
    showNotification(`Employee record updated!`, 'success');
  };

  const deleteEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    walRegister('employees', id, {}, 'delete');
    setEmployees(prev => {
      const next = prev.filter(e => e.id !== id);
      saveLocal('weldor_employees', next);
      return next;
    });
    api.deleteEmployee(id).catch(e => console.warn('Employee delete API error:', e));
    addAuditLog('EMPLOYEE_DELETED', 'employees', id, `Removed employee ${emp?.name || id}`);
    showNotification('Employee removed from directory', 'info');
  };

  // Payroll Handlers
  const addPayrollRecord = (rec: Omit<PayrollRecord, 'id'>) => {
    const newRec: PayrollRecord = { ...rec, id: `pay-${Date.now()}` };
    walRegister('payrolls', newRec.id, newRec, 'upsert');
    setPayrolls(prev => {
      const next = [newRec, ...prev];
      saveLocal('weldor_payrolls', next);
      return next;
    });
    api.createPayroll(newRec).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_CREATED', 'payroll', newRec.id, `Created manual payroll entry for ${newRec.employeeName}`);
    showNotification(`Salary slip for ${newRec.employeeName} added!`, 'success');
  };

  const updatePayrollRecord = (id: string, updatedFields: Partial<PayrollRecord>) => {
    walRegister('payrolls', id, updatedFields, 'upsert');
    setPayrolls(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      saveLocal('weldor_payrolls', next);
      return next;
    });
    api.updatePayroll(id, updatedFields).catch(err => console.warn('Payroll API error:', err));
    addAuditLog('PAYROLL_UPDATED', 'payroll', id, `Updated payroll record for ID ${id}`);
    showNotification('Salary details updated!', 'success');
  };

  const deletePayrollRecord = (id: string) => {
    walRegister('payrolls', id, {}, 'delete');
    setPayrolls(prev => {
      const next = prev.filter(p => p.id !== id);
      saveLocal('weldor_payrolls', next);
      return next;
    });
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

    newRecords.forEach(r => walRegister('payrolls', r.id, r, 'upsert'));
    setPayrolls(prev => {
      const next = [...newRecords, ...prev];
      saveLocal('weldor_payrolls', next);
      return next;
    });
    api.bulkCreatePayroll(newRecords).catch(err => console.warn('Payroll backend sync:', err));
    addAuditLog('PAYROLL_GENERATED', 'payroll', `${month}-${year}`, `Generated ${newRecords.length} payroll slips for ${month}`);
    showNotification(`Generated ${newRecords.length} employee payslips for ${month}!`, 'success');
  };

  const approvePayrollRecord = (id: string) => {
    walRegister('payrolls', id, { status: 'Approved' }, 'upsert');
    setPayrolls(prev => {
      const next = prev.map(p => p.id === id ? { ...p, status: 'Approved' as const } : p);
      saveLocal('weldor_payrolls', next);
      return next;
    });
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
    draftRecords.forEach(r => walRegister('payrolls', r.id, { status: 'Approved' }, 'upsert'));
    setPayrolls(prev => {
      const next = prev.map(p => (p.payrollMonth === month && p.status === 'Draft') ? {
        ...p,
        status: 'Approved' as const
      } : p);
      saveLocal('weldor_payrolls', next);
      return next;
    });

    draftRecords.forEach(r => {
      api.updatePayroll(r.id, { status: 'Approved' }).catch(err => console.warn('Payroll API error:', err));
    });

    addAuditLog('PAYROLL_BULK_APPROVED', 'payroll', month, `Approved ${draftRecords.length} payslips for ${month}`);
    showNotification(`Approved ${draftRecords.length} payslips for ${month}!`, 'success');
  };

  const disbursePayrollRecord = (id: string, ref?: string) => {
    const txRef = ref || `CMS-DISB-${Date.now()}`;
    const timestamp = new Date().toISOString();
    walRegister('payrolls', id, { status: 'Paid', transactionReference: txRef, disbursedAt: timestamp }, 'upsert');
    setPayrolls(prev => {
      const next = prev.map(p => p.id === id ? {
        ...p,
        status: 'Paid' as const,
        transactionReference: txRef,
        disbursedAt: timestamp
      } : p);
      saveLocal('weldor_payrolls', next);
      return next;
    });
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
    recordsToUpdate.forEach(r => walRegister('payrolls', r.id, { status: 'Paid', transactionReference: txBatch, disbursedAt: timestamp }, 'upsert'));
    
    setPayrolls(prev => {
      const next = prev.map(p => (p.payrollMonth === month && p.status !== 'Paid') ? {
        ...p,
        status: 'Paid' as const,
        transactionReference: txBatch,
        disbursedAt: timestamp
      } : p);
      saveLocal('weldor_payrolls', next);
      return next;
    });

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
    walRegister('attendances', newRec.id, newRec, 'upsert');
    setAttendance(prev => {
      const next = [newRec, ...prev];
      saveLocal('weldor_attendance', next);
      return next;
    });
    api.createAttendance(newRec).catch(() => {});
    addAuditLog('ATTENDANCE_LOGGED', 'attendance', newRec.id, `Logged attendance for ${newRec.employeeName}`);
    showNotification(`Attendance logged for ${newRec.employeeName}`, 'success');
  };

  const updateAttendance = (id: string, rec: Partial<AttendanceRecord>) => {
    walRegister('attendances', id, rec, 'upsert');
    setAttendance(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...rec } : a);
      saveLocal('weldor_attendance', next);
      return next;
    });
    api.updateAttendance(id, rec).catch(() => {});
    showNotification('Attendance record updated', 'success');
  };

  const applyLeaveRequest = (req: Omit<LeaveRequest, 'id'>) => {
    const newReq: LeaveRequest = { ...req, id: `lev-${Date.now()}` };
    walRegister('leaves', newReq.id, newReq, 'upsert');
    setLeaveRequests(prev => {
      const next = [newReq, ...prev];
      saveLocal('weldor_leaves', next);
      return next;
    });
    api.createLeave(newReq).catch(() => {});
    addAuditLog('LEAVE_APPLIED', 'attendance', newReq.id, `Applied for leave by ${newReq.employeeName}`);
    showNotification('Leave application submitted for approval!', 'success');
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveRequest['status'], approvedBy?: string) => {
    walRegister('leaves', id, { status, approvedBy: approvedBy || currentEmployee.name }, 'upsert');
    setLeaveRequests(prev => {
      const next = prev.map(l => l.id === id ? {
        ...l,
        status,
        approvedBy: approvedBy || currentEmployee.name
      } : l);
      saveLocal('weldor_leaves', next);
      return next;
    });
    api.updateLeave(id, { status, approvedBy }).catch(() => {});
    addAuditLog('LEAVE_STATUS_CHANGED', 'attendance', id, `Leave ${id} marked as ${status}`);
    showNotification(`Leave application marked as ${status}!`, 'success');
  };

  // Settings Handlers
  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings(prev => {
      const legal = settings.legalEntityName || settings.legalName || prev.legalEntityName || prev.legalName || 'Earth Metal Industries';
      const gstin = settings.gstinNumber || settings.gstin || prev.gstinNumber || prev.gstin || '24AABCE1234F1Z5';
      const email = settings.supportEmail || settings.primaryEmail || prev.supportEmail || prev.primaryEmail || 'brm@weldorindustries.com';
      const phone = settings.salesPhone || settings.primaryPhone || prev.salesPhone || prev.primaryPhone || '+91-87800 98088';
      const regOffice = settings.registeredOffice || prev.registeredOffice || 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India';
      const factory = settings.factoryPlantAddress || prev.factoryPlantAddress || regOffice;

      const next: CompanySettings = { 
        ...prev, 
        ...settings,
        legalEntityName: legal,
        legalName: legal,
        gstinNumber: gstin,
        gstin: gstin,
        supportEmail: email,
        primaryEmail: email,
        salesPhone: phone,
        primaryPhone: phone,
        registeredOffice: regOffice,
        factoryPlantAddress: factory,
      };
      saveLocal('weldor_settings', next);
      walRegister('settings', 'company', next, 'upsert');
      return next;
    });
    api.updateSettings(settings).catch(() => {});
    addAuditLog('COMPANY_SETTINGS_UPDATED', 'settings', 'company', `Updated enterprise company profile & banking`);
    showNotification('Company settings saved successfully and synchronized across CRM!', 'success');
  };

  // Product CRUD
  const addProduct = (p: Omit<Product, 'id'>) => {
    const now = new Date().toISOString();
    const newProd: Product = { ...p, id: `prod-${Date.now()}`, createdAt: p.createdAt || now, updatedAt: now };
    walRegister('products', newProd.id, newProd, 'upsert');
    setProducts(prev => {
      const next = [newProd, ...prev];
      saveLocal('weldor_products', next);
      return next;
    });
    api.createProduct(newProd).catch(e => console.warn('Product create API error:', e));
    addAuditLog('PRODUCT_CREATED', 'products', newProd.id, `Created product ${newProd.name} (${newProd.sku})`);
    showNotification(`Product "${newProd.name}" added to catalog successfully!`, 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updatedAt = new Date().toISOString();
    walRegister('products', id, { ...updatedFields, updatedAt }, 'upsert');
    setProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updatedFields, updatedAt } : p);
      saveLocal('weldor_products', next);
      return next;
    });
    api.updateProduct(id, updatedFields).catch(e => console.warn('Product update API error:', e));
    addAuditLog('PRODUCT_UPDATED', 'products', id, `Updated product details for ID ${id}`);
    showNotification(`Product details updated!`, 'success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    walRegister('products', id, {}, 'delete');
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      saveLocal('weldor_products', next);
      return next;
    });
    api.deleteProduct(id).catch(e => console.warn('Product delete API error:', e));
    addAuditLog('PRODUCT_DELETED', 'products', id, `Deleted product ${prod?.name || id}`);
    showNotification(`Product removed from catalog.`, 'warning');
  };

  // Category CRUD
  const addCategory = (c: Omit<ProductCategory, 'id'>) => {
    const now = new Date().toISOString();
    const newCat: ProductCategory = { ...c, id: `cat-${Date.now()}`, createdAt: (c as any).createdAt || now, updatedAt: now };
    walRegister('categories', newCat.id, newCat, 'upsert');
    setCategories(prev => {
      const next = [...prev, newCat];
      saveLocal('weldor_categories', next);
      return next;
    });
    api.createCategory(newCat).catch(e => console.warn('Category create API error:', e));
    addAuditLog('CATEGORY_CREATED', 'products', newCat.id, `Created category ${newCat.name}`);
    showNotification(`Category "${newCat.name}" created successfully!`, 'success');
  };

  const updateCategory = (id: string, updatedFields: Partial<ProductCategory>) => {
    const updatedAt = new Date().toISOString();
    walRegister('categories', id, { ...updatedFields, updatedAt }, 'upsert');
    setCategories(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updatedFields, updatedAt } : c);
      saveLocal('weldor_categories', next);
      return next;
    });
    api.updateCategory(id, updatedFields).catch(e => console.warn('Category update API error:', e));
    addAuditLog('CATEGORY_UPDATED', 'products', id, `Updated category details for ID ${id}`);
    showNotification(`Category updated successfully!`, 'success');
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    walRegister('categories', id, {}, 'delete');
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id);
      saveLocal('weldor_categories', next);
      return next;
    });
    api.deleteCategory(id).catch(e => console.warn('Category delete API error:', e));
    addAuditLog('CATEGORY_DELETED', 'products', id, `Deleted category ${cat?.name || id}`);
    showNotification(`Category removed.`, 'warning');
  };

  // Gallery Media CRUD
  const addGalleryMedia = (item: Omit<GalleryMedia, 'id'>) => {
    const newItem: GalleryMedia = { ...item, id: `gal-${Date.now()}`, createdAt: new Date().toISOString() };
    walRegister('gallery', newItem.id, newItem, 'upsert');
    setGalleryMedia(prev => {
      const next = [newItem, ...prev];
      saveLocal('weldor_gallery', next);
      return next;
    });
    api.createGallery(newItem).catch(e => console.warn('Gallery create API error:', e));
    addAuditLog('GALLERY_ADDED', 'cms', newItem.id, `Added gallery item ${newItem.title}`);
    showNotification(`Media asset "${newItem.title}" added to gallery!`, 'success');
  };

  const updateGalleryMedia = (id: string, updatedFields: Partial<GalleryMedia>) => {
    const updatedAt = new Date().toISOString();
    walRegister('gallery', id, { ...updatedFields, updatedAt }, 'upsert');
    setGalleryMedia(prev => {
      const next = prev.map(m => m.id === id ? { ...m, ...updatedFields, updatedAt } : m);
      saveLocal('weldor_gallery', next);
      return next;
    });
    api.updateGallery(id, updatedFields).catch(e => console.warn('Gallery update API error:', e));
    addAuditLog('GALLERY_UPDATED', 'cms', id, `Updated gallery item ID ${id}`);
    showNotification(`Media asset updated successfully!`, 'success');
  };

  const deleteGalleryMedia = (id: string) => {
    walRegister('gallery', id, {}, 'delete');
    setGalleryMedia(prev => {
      const next = prev.filter(m => m.id !== id);
      saveLocal('weldor_gallery', next);
      return next;
    });
    api.deleteGallery(id).catch(e => console.warn('Gallery delete API error:', e));
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
    walRegister('banners', newBanner.id, newBanner, 'upsert');
    setBanners(prev => {
      const next = [...prev, newBanner];
      saveLocal('weldor_banners', next);
      return next;
    });
    api.createBanner(newBanner).catch(e => console.warn('Banner create API error:', e));
    addAuditLog('BANNER_CREATED', 'cms', newBanner.id, `Created hero banner slide "${newBanner.title}" with effect ${newBanner.transitionEffect}`);
    showNotification(`Hero banner slide "${newBanner.title}" created successfully!`, 'success');
  };

  const updateBanner = (id: string, updatedFields: Partial<HeroBanner>) => {
    const updatedAt = new Date().toISOString();
    walRegister('banners', id, { ...updatedFields, updatedAt }, 'upsert');
    setBanners(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updatedFields, updatedAt } : b);
      saveLocal('weldor_banners', next);
      return next;
    });
    api.updateBanner(id, updatedFields).catch(e => console.warn('Banner update API error:', e));
    addAuditLog('BANNER_UPDATED', 'cms', id, `Updated hero banner slide ID ${id}`);
    showNotification(`Hero banner slide updated successfully!`, 'success');
  };

  const deleteBanner = (id: string) => {
    const banner = banners.find(b => b.id === id);
    walRegister('banners', id, {}, 'delete');
    setBanners(prev => {
      const next = prev.filter(b => b.id !== id);
      saveLocal('weldor_banners', next);
      return next;
    });
    api.deleteBanner(id).catch(e => console.warn('Banner delete API error:', e));
    addAuditLog('BANNER_DELETED', 'cms', id, `Deleted hero banner slide "${banner?.title || id}"`);
    showNotification(`Hero banner slide deleted.`, 'warning');
  };

  const reorderBanners = (bannerIds: string[]) => {
    bannerIds.forEach((id, index) => {
      walRegister('banners', id, { displayOrder: index + 1 }, 'upsert');
    });
    setBanners(prev => {
      const bannerMap = new Map(prev.map(b => [b.id, b]));
      const next = bannerIds.map((id, index) => {
        const item = bannerMap.get(id);
        return item ? { ...item, displayOrder: index + 1 } : null;
      }).filter(Boolean) as HeroBanner[];
      saveLocal('weldor_banners', next);
      return next;
    });
    api.reorderBanners(bannerIds).catch(e => console.warn('Banner reorder API error:', e));
    addAuditLog('BANNERS_REORDERED', 'cms', 'hero-slider', `Reordered hero slider sequence`);
    showNotification(`Banner display sequence reordered!`, 'success');
  };

  const toggleBannerStatus = (id: string) => {
    const b = banners.find(item => item.id === id);
    if (b) {
      walRegister('banners', id, { active: !b.active }, 'upsert');
    }
    setBanners(prev => {
      const next = prev.map(b => {
        if (b.id === id) {
          const nextState = !b.active;
          api.updateBanner(id, { active: nextState }).catch(() => {});
          addAuditLog('BANNER_STATUS_TOGGLED', 'cms', id, `Toggled banner active status to ${nextState}`);
          showNotification(`Banner ${nextState ? 'Activated' : 'Deactivated'}.`, nextState ? 'success' : 'info');
          return { ...b, active: nextState };
        }
        return b;
      });
      saveLocal('weldor_banners', next);
      return next;
    });
  };

  // Exhibition CRUD
  const addExhibition = (expo: Omit<Exhibition, 'id'>) => {
    const newExpo: Exhibition = { ...expo, id: `expo-${Date.now()}` };
    walRegister('exhibitions', newExpo.id, newExpo, 'upsert');
    setExhibitions(prev => {
      const next = [newExpo, ...prev];
      saveLocal('weldor_exhibitions', next);
      return next;
    });
    api.createExhibition(newExpo).catch(e => console.warn('Exhibition create API error:', e));
    addAuditLog('EXHIBITION_CREATED', 'exhibitions', newExpo.id, `Created exhibition ${newExpo.title}`);
    showNotification(`Exhibition event "${newExpo.title}" published!`, 'success');
  };

  const updateExhibition = (id: string, updatedExpo: Partial<Exhibition>) => {
    const updatedAt = new Date().toISOString();
    walRegister('exhibitions', id, { ...updatedExpo, updatedAt }, 'upsert');
    setExhibitions(prev => {
      const next = prev.map(expo => {
        if (expo.id === id) {
          return { ...expo, ...updatedExpo, updatedAt };
        }
        return expo;
      });
      saveLocal('weldor_exhibitions', next);
      return next;
    });
    api.updateExhibition(id, updatedExpo).catch(e => console.warn('Exhibition update API error:', e));
    addAuditLog('EXHIBITION_UPDATED', 'exhibitions', id, `Updated exhibition details for ${id}`);
    showNotification(`Exhibition updated successfully!`, 'success');
  };

  const deleteExhibition = (id: string) => {
    const target = exhibitions.find(e => e.id === id);
    walRegister('exhibitions', id, {}, 'delete');
    setExhibitions(prev => {
      const next = prev.filter(expo => expo.id !== id);
      saveLocal('weldor_exhibitions', next);
      return next;
    });
    api.deleteExhibition(id).catch(e => console.warn('Exhibition delete API error:', e));
    addAuditLog('EXHIBITION_DELETED', 'exhibitions', id, `Deleted exhibition: ${target?.title || id}`);
    showNotification(`Exhibition deleted successfully!`, 'info');
  };

  // Order Lifecycle & Dispatch Status Progressor
  const updateOrderStage = (
    orderId: string, 
    newStage: Order['stage'], 
    dispatchDetails?: { courierTrackingNo?: string; courierPartner?: string; dispatchDate?: string }
  ) => {
    const updatedAt = new Date().toISOString();
    walRegister('orders', orderId, { stage: newStage, updatedAt, ...(dispatchDetails || {}) }, 'upsert');
    setOrders(prev => {
      const next = prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            stage: newStage,
            updatedAt,
            ...(dispatchDetails?.courierTrackingNo ? { courierTrackingNo: dispatchDetails.courierTrackingNo } : {}),
            ...(dispatchDetails?.courierPartner ? { courierPartner: dispatchDetails.courierPartner } : {}),
            ...(dispatchDetails?.dispatchDate ? { dispatchDate: dispatchDetails.dispatchDate } : {}),
          };
        }
        return ord;
      });
      saveLocal('weldor_orders', next);
      return next;
    });
    api.updateOrder(orderId, { stage: newStage, ...dispatchDetails }).catch(() => {});
    addAuditLog('ORDER_STAGE_UPDATED', 'orders', orderId, `Updated order ${orderId} stage to ${newStage}`);
    showNotification(`Order stage updated to "${newStage}"!`, 'success');

    // Automatic Inventory Deduction upon Dispatch or Delivery
    if (newStage === 'Dispatched' || newStage === 'Delivered') {
      const targetOrder = orders.find(o => o.id === orderId);
      if (targetOrder && Array.isArray(targetOrder.items) && targetOrder.items.length > 0) {
        setInventory(prevInv => {
          let inventoryChanged = false;
          const nextInv = prevInv.map(invItem => {
            const matchedItem = targetOrder.items.find((it: any) => 
              (it.sku && it.sku.trim().toUpperCase() === invItem.sku.trim().toUpperCase()) ||
              (it.productName && it.productName.trim().toLowerCase() === invItem.name.trim().toLowerCase())
            );
            if (matchedItem) {
              const qty = Number(matchedItem.quantity) || 0;
              if (qty > 0) {
                inventoryChanged = true;
                const newStock = Math.max(0, invItem.currentStock - qty);
                const minAlert = invItem.minStockAlert;
                const status: InventoryItem['status'] = newStock <= 0 ? 'Out of Stock' : newStock <= minAlert ? 'Low Stock' : 'In Stock';
                const updatedItem: InventoryItem = { ...invItem, currentStock: newStock, status, lastUpdated: new Date().toISOString() };
                walRegister('inventory', updatedItem.id, updatedItem, 'upsert');

                const logEntry: InventoryStockLog = {
                  id: `inv-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  itemId: invItem.id,
                  timestamp: new Date().toISOString(),
                  changeType: 'DISPATCH',
                  deltaQuantity: -qty,
                  remainingStock: newStock,
                  reason: `Dispatched against Order ${targetOrder.orderNumber}`,
                  performedBy: currentEmployee?.name || 'Dispatch Logistics',
                  referenceNumber: targetOrder.orderNumber
                };
                walRegister('inventory_logs', logEntry.id, logEntry, 'upsert');
                setInventoryLogs(logs => {
                  const nextLogs = [logEntry, ...logs];
                  saveLocal('weldor_inventory_logs', nextLogs);
                  return nextLogs;
                });

                if (newStock === 0) {
                  showNotification(`🚨 CRITICAL: Item "${invItem.name}" is now OUT OF STOCK!`, 'warning');
                } else if (newStock <= minAlert) {
                  showNotification(`⚠️ LOW STOCK ALERT: Item "${invItem.name}" stock reduced to ${newStock} units.`, 'warning');
                }
                return updatedItem;
              }
            }
            return invItem;
          });
          if (inventoryChanged) {
            saveLocal('weldor_inventory', nextInv);
          }
          return nextInv;
        });
      }
    }
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
    walRegister('leads', leadId, { stage: newStage, lostReason, updatedAt: new Date().toISOString() }, 'upsert');
    setLeads(prev => {
      const next = prev.map(lead => {
        if (lead.id === leadId) {
          const updatedActivity = {
            id: `act-${Date.now()}`,
            leadId,
            timestamp: new Date().toISOString(),
            type: 'Status_Change' as const,
            performedBy: `${currentEmployee.name} (${currentRole.name})`,
            description: `Changed stage from ${lead.stage} to ${newStage}${lostReason ? `. Lost Reason: ${lostReason}` : ''}`,
          };
          const existingActivities: LeadActivity[] = Array.isArray(lead.activities) 
            ? lead.activities 
            : (lead.activities && typeof lead.activities === 'object' ? (Object.values(lead.activities) as LeadActivity[]) : []);

          return {
            ...lead,
            stage: newStage,
            lostReason: lostReason || lead.lostReason,
            updatedAt: new Date().toISOString(),
            activities: [updatedActivity, ...existingActivities],
          };
        }
        return lead;
      });
      saveLocal('weldor_leads', next);
      return next;
    });
    api.updateLead(leadId, { stage: newStage, lostReason }).catch(() => {});
    addAuditLog('LEAD_STAGE_UPDATED', 'leads', leadId, `Updated lead stage to ${newStage}`);
    showNotification(`Lead stage updated to ${newStage.replace(/_/g, ' ')}`, 'success');
  };

  const assignLead = (leadId: string, employeeId: string) => {
    const targetEmp = employees.find(e => e.id === employeeId);
    if (!targetEmp) return;
    walRegister('leads', leadId, { assignedEmployeeId: targetEmp.id, assignedEmployeeName: targetEmp.name, updatedAt: new Date().toISOString() }, 'upsert');
    setLeads(prev => {
      const next = prev.map(lead => {
        if (lead.id === leadId) {
          const updatedActivity: LeadActivity = {
            id: `act-${Date.now()}`,
            leadId,
            timestamp: new Date().toISOString(),
            type: 'Status_Change' as const,
            performedBy: currentEmployee.name,
            description: `Reassigned lead to ${targetEmp.name} (${targetEmp.department})`,
          };

          const existingActivities: LeadActivity[] = Array.isArray(lead.activities) 
            ? lead.activities 
            : (lead.activities && typeof lead.activities === 'object' ? (Object.values(lead.activities) as LeadActivity[]) : []);

          return {
            ...lead,
            assignedEmployeeId: targetEmp.id,
            assignedEmployeeName: targetEmp.name,
            updatedAt: new Date().toISOString(),
            activities: [updatedActivity, ...existingActivities],
          };
        }
        return lead;
      });
      saveLocal('weldor_leads', next);
      return next;
    });
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

    walRegister('leads', newLead.id, newLead, 'upsert');
    setLeads(prev => {
      const next = [newLead, ...prev];
      saveLocal('weldor_leads', next);
      return next;
    });
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
    walRegister('rfqs', newRfq.id, newRfq, 'upsert');
    setRfqs(prev => {
      const next = [newRfq, ...prev];
      saveLocal('weldor_rfqs', next);
      return next;
    });

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

    walRegister('samples', newSample.id, newSample, 'upsert');
    setSamples(prev => {
      const next = [newSample, ...prev];
      saveLocal('weldor_samples', next);
      return next;
    });
    try {
      const res = await api.createSample(newSample);
      if (res?.data?.id) {
        newSample.id = res.data.id;
        walRegister('samples', newSample.id, newSample, 'upsert');
      }
    } catch (e) {
      console.warn('API sync failed for sample creation', e);
    }
    addAuditLog('SAMPLE_CREATED', 'samples', newSample.id, `Created sample request ${newSample.sampleNumber} for ${newSample.companyName}`);
    showNotification(`Sample prototype request ${newSample.sampleNumber} created!`, 'success');
    return newSample;
  };

  const updateSampleStage = (sampleId: string, stage: SampleRequest['stage']) => {
    walRegister('samples', sampleId, { stage }, 'upsert');
    setSamples(prev => {
      const next = prev.map(s => s.id === sampleId ? { ...s, stage } : s);
      saveLocal('weldor_samples', next);
      return next;
    });
    api.updateSample(sampleId, { stage }).catch(() => {});
    addAuditLog('SAMPLE_STAGE_UPDATED', 'samples', sampleId, `Updated sample ${sampleId} stage to ${stage}`);
    showNotification(`Sample status updated to ${stage}`, 'success');
  };

  const deleteSampleRequest = (sampleId: string) => {
    walRegister('samples', sampleId, {}, 'delete');
    setSamples(prev => {
      const next = prev.filter(s => s.id !== sampleId);
      saveLocal('weldor_samples', next);
      return next;
    });
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

    walRegister('trials', newTrial.id, newTrial, 'upsert');
    setTrials(prev => {
      const next = [newTrial, ...prev];
      saveLocal('weldor_trials', next);
      return next;
    });
    try {
      const res = await api.createTrial(newTrial);
      if (res?.data?.id) {
        newTrial.id = res.data.id;
        walRegister('trials', newTrial.id, newTrial, 'upsert');
      }
    } catch (e) {
      console.warn('API sync failed for trial creation', e);
    }
    addAuditLog('TRIAL_CREATED', 'trials', newTrial.id, `Created technical trial ${newTrial.trialNumber} for ${newTrial.companyName}`);
    showNotification(`Technical Lab Trial ${newTrial.trialNumber} scheduled!`, 'success');
    return newTrial;
  };

  const updateTrialStatus = (trialId: string, status: TechnicalTrial['status'], failureReason?: string) => {
    walRegister('trials', trialId, { status, failureReason }, 'upsert');
    setTrials(prev => {
      const next = prev.map(t => t.id === trialId ? { ...t, status, failureReason } : t);
      saveLocal('weldor_trials', next);
      return next;
    });
    api.updateTrial(trialId, { status, failureReason }).catch(() => {});
    addAuditLog('TRIAL_STATUS_UPDATED', 'trials', trialId, `Updated trial ${trialId} status to ${status}`);
    showNotification(`Technical Trial status updated to ${status}`, 'success');
  };

  const deleteTechnicalTrial = (trialId: string) => {
    walRegister('trials', trialId, {}, 'delete');
    setTrials(prev => {
      const next = prev.filter(t => t.id !== trialId);
      saveLocal('weldor_trials', next);
      return next;
    });
    api.deleteTrial(trialId).catch(() => {});
    addAuditLog('TRIAL_DELETED', 'trials', trialId, `Deleted trial ${trialId}`);
    showNotification('Technical Trial removed from workspace.', 'warning');
  };

  const createQuotationFromLead = (
    leadId: string, 
    items: Quotation['items'], 
    freight: number, 
    validity: number,
    customerMeta?: { 
      companyName?: string; 
      contactName?: string; 
      email?: string; 
      phone?: string; 
      billingAddress?: string; 
      gstin?: string; 
      state?: string;
      buyerName?: string;
      buyerEmail?: string;
      buyerPhone?: string;
      destinationCountry?: string;
    }
  ): Quotation => {
    const lead = leads.find(l => l.id === leadId);
    const companyName = customerMeta?.companyName || (lead ? lead.companyName : '') || 'B2B Client';
    const contactName = customerMeta?.contactName || customerMeta?.buyerName || (lead ? lead.contactName : '') || 'Purchasing Dept';
    const email = customerMeta?.email || customerMeta?.buyerEmail || (lead ? lead.contactEmail : '') || 'purchasing@client.com';
    const phone = customerMeta?.phone || customerMeta?.buyerPhone || (lead ? lead.contactPhone : '') || '+91 98000 00000';
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPriceUSD, 0);
    const totalDiscount = items.reduce((sum, item) => sum + (item.quantity * item.unitPriceUSD * (item.discountPercentage / 100)), 0);
    const taxTotal = (subtotal - totalDiscount) * 0.18;
    const grandTotal = subtotal - totalDiscount + taxTotal + freight;

    const requiresApproval = grandTotal > 50000 || items.some(i => i.discountPercentage > 10);

    const newQuotation: any = {
      id: `quote-${Date.now()}`,
      quotationNumber: `WEL-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId,
      companyName,
      contactName,
      email,
      seller: {
        companyName: companySettings.legalEntityName || companySettings.companyName || 'Earth Metal Industries',
        address: companySettings.factoryPlantAddress || companySettings.registeredOffice || 'Plot No. 588, G.I.D.C. Phase 2, Dared, Jamnagar – 361004, Gujarat, India',
        gstin: companySettings.gstinNumber || companySettings.gstin || '24AABCE1234F1Z5',
        pan: companySettings.panNumber || 'AABCE1234F',
        state: 'Gujarat',
        stateCode: '24',
        email: companySettings.supportEmail || companySettings.primaryEmail || 'brm@weldorindustries.com',
        phone: companySettings.salesPhone || companySettings.primaryPhone || '+91-87800 98088',
        bankName: companySettings.primaryBank?.bankName || 'HDFC Bank Ltd',
        accountNo: companySettings.primaryBank?.accountNumber || '50200012345678',
        ifscCode: companySettings.primaryBank?.ifscCode || 'HDFC0001234',
        branch: companySettings.primaryBank?.branch || 'Dared Industrial Estate Branch, Jamnagar'
      },
      buyer: {
        companyName,
        contactName,
        designation: 'Procurement Head',
        billingAddress: customerMeta?.billingAddress || 'Industrial Area, India',
        shippingAddress: customerMeta?.billingAddress || 'Factory Gate, India',
        gstin: customerMeta?.gstin || '24AAACE1234P1ZV',
        state: customerMeta?.state || 'Gujarat',
        stateCode: '24',
        email,
        phone
      },
      taxType: 'INTER_STATE',
      gstRatePct: 18,
      agent: { hasAgent: false, agentName: '', agentPhone: '', commissionType: 'PERCENT', commissionRate: 0, commissionAmountUSD: 0 },
      items,
      subtotalUSD: subtotal,
      totalDiscountUSD: totalDiscount,
      taxTotalUSD: taxTotal,
      taxableTotalUSD: subtotal - totalDiscount,
      cgstTotalUSD: 0,
      sgstTotalUSD: 0,
      igstTotalUSD: taxTotal,
      freightCostUSD: freight,
      packagingCostUSD: 0,
      grandTotalUSD: grandTotal,
      grandTotalINR: Math.round(grandTotal * 87.0),
      paymentTerms: companySettings.defaultTerms?.paymentTerms || '50% Advance against Proforma, Balance before Dispatch',
      deliveryTerms: companySettings.defaultTerms?.deliveryTerms || 'Ex-Factory Jamnagar / Ready Dispatch in 7-10 Days',
      validityDays: companySettings.defaultTerms?.validityDays || validity,
      warrantyTerms: companySettings.defaultTerms?.warrantyTerms || '12 Months replacement warranty against manufacturing defects',
      packagingTerms: companySettings.defaultTerms?.packagingTerms || 'Export Standard Heavy-Duty Wooden Case with VCI Bag',
      inspectionTerms: companySettings.defaultTerms?.inspectionTerms || '100% In-House Hydrostatic & Flame Test with EN 10204 3.1 MTC',
      status: requiresApproval ? 'Pending Manager Approval' : 'Approved',
      requiresApproval,
      createdAt: new Date().toISOString(),
      expiryDate: new Date(Date.now() + (companySettings.defaultTerms?.validityDays || validity) * 86400000).toISOString().split('T')[0],
      sentAt: requiresApproval ? undefined : new Date().toISOString(),
    };

    walRegister('quotations', newQuotation.id, newQuotation, 'upsert');
    setQuotations(prev => {
      const filtered = prev.filter(q => q.id !== newQuotation.id && q.quotationNumber !== newQuotation.quotationNumber);
      const next = [newQuotation, ...filtered];
      saveLocal('weldor_quotations', next);
      return next;
    });

    try {
      const existingCommercial = JSON.parse(localStorage.getItem('weldor_commercial_quotes') || '[]');
      const filteredCommercial = existingCommercial.filter((q: any) => q.id !== newQuotation.id && q.quotationNumber !== newQuotation.quotationNumber);
      localStorage.setItem('weldor_commercial_quotes', JSON.stringify([newQuotation, ...filteredCommercial]));
    } catch (e) {}

    api.createQuotation(newQuotation).catch(() => {});

    if (lead) {
      updateLeadStage(leadId, requiresApproval ? 'QUOTATION_APPROVAL' : 'QUOTATION_SENT');
    }

    addAuditLog('QUOTATION_CREATED', 'quotations', newQuotation.id, `Created quotation ${newQuotation.quotationNumber} for ₹${Math.round(grandTotal * 85).toLocaleString('en-IN')}`);
    showNotification(`Quotation ${newQuotation.quotationNumber} generated successfully!`, 'success');
    return newQuotation;
  };

  const addCommercialQuotation = (quotation: any) => {
    if (!quotation || !quotation.id) return;
    walRegister('quotations', quotation.id, quotation, 'upsert');
    setQuotations(prev => {
      const filtered = prev.filter(q => q.id !== quotation.id && (q as any).quotationNumber !== quotation.quotationNumber);
      const next = [quotation, ...filtered];
      saveLocal('weldor_quotations', next);
      return next;
    });

    try {
      const existingCommercial = JSON.parse(localStorage.getItem('weldor_commercial_quotes') || '[]');
      const filteredCommercial = existingCommercial.filter((q: any) => q.id !== quotation.id && q.quotationNumber !== quotation.quotationNumber);
      localStorage.setItem('weldor_commercial_quotes', JSON.stringify([quotation, ...filteredCommercial]));
    } catch (e) {}

    api.createQuotation(quotation).catch(() => {});
    addAuditLog('QUOTATION_CREATED', 'quotations', quotation.id, `Created quotation ${quotation.quotationNumber}`);
  };

  const approveQuotation = (quotationId: string, notes?: string) => {
    walRegister('quotations', quotationId, {
      status: 'Approved',
      approvalNotes: notes || `Approved by ${currentEmployee.name} (${currentRole.name})`,
      sentAt: new Date().toISOString(),
    }, 'upsert');
    setQuotations(prev => {
      const next = prev.map(q => {
        if (q.id === quotationId) {
          return {
            ...q,
            status: 'Approved' as const,
            approvalNotes: notes || `Approved by ${currentEmployee.name} (${currentRole.name})`,
            sentAt: new Date().toISOString(),
          };
        }
        return q;
      });
      saveLocal('weldor_quotations', next);
      return next;
    });

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

  const convertQuotationToOrder = (quotationId: string, quotationData?: any): Order => {
    // 1. Find the quotation from passed parameter, state or localStorage
    let quote = quotationData || quotations.find(q => q.id === quotationId || (q as any).quotationNumber === quotationId);
    if (!quote) {
      try {
        const raw = localStorage.getItem('weldor_commercial_quotes');
        if (raw) {
          const parsed = JSON.parse(raw);
          quote = parsed.find((q: any) => q.id === quotationId || q.quotationNumber === quotationId);
        }
      } catch (e) {}
    }

    // 2. Guard against duplicate order creation if an order already exists for this quote
    const existing = orders.find(o => 
      (quotationId && o.quotationId === quotationId) || 
      (quote?.quotationNumber && o.quotationId === quote.quotationNumber)
    );
    if (existing) {
      showNotification(`Order ${existing.orderNumber} already exists for this quotation!`, 'info');
      return existing;
    }

    const companyName = 
      quote?.buyer?.companyName || 
      quote?.companyName || 
      'Enterprise Client';

    const contactName = 
      quote?.buyer?.contactName || 
      quote?.contactName || 
      'Purchasing Dept';

    const gstin = quote?.buyer?.gstin || quote?.gstin || '';
    const state = quote?.buyer?.state || quote?.state || '';
    const stateCode = quote?.buyer?.stateCode || quote?.stateCode || '';
    const billingAddress = quote?.buyer?.billingAddress || quote?.billingAddress || '';
    const shippingAddress = quote?.buyer?.shippingAddress || quote?.shippingAddress || billingAddress || 'Client Factory Gate, India';

    const grandTotalINR = Number(quote?.grandTotalINR) || (quote?.grandTotalUSD ? Math.round(Number(quote.grandTotalUSD) * 85) : 0);
    const grandTotalUSD = Number(quote?.grandTotalUSD) || (grandTotalINR ? Math.round(grandTotalINR / 85) : 0);
    const taxableTotalUSD = Number(quote?.taxableTotalUSD) || Math.round(grandTotalUSD / 1.18);
    const totalTaxUSD = Number(quote?.totalTaxUSD) || (grandTotalUSD - taxableTotalUSD);
    const freightCostUSD = Number(quote?.freightCostUSD) || 0;
    const packagingCostUSD = Number(quote?.packagingCostUSD) || 0;

    const rawItems = Array.isArray(quote?.items) ? quote.items : [];
    const items = rawItems.map((i: any) => ({
      productId: i.productId || i.id || `prod-${Math.random()}`,
      productName: i.productName || i.description || 'Precision Industrial Consumable',
      sku: i.sku || 'WEL-SKU',
      quantity: Number(i.quantity) || 1,
      unit: i.unit || 'PCS',
      unitPriceUSD: Number(i.unitPriceUSD || i.unitPrice) || 0,
      totalPriceUSD: Number(i.totalPriceUSD || i.totalUSD) || ((Number(i.quantity) || 1) * (Number(i.unitPriceUSD || i.unitPrice) || 0)),
      hsnCode: i.hsnCode || '84122100'
    }));

    const newOrder: any = {
      id: `ord-${Date.now()}`,
      orderNumber: `WEL-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      quotationId: quote?.id || quotationId,
      quotationNumber: quote?.quotationNumber || quotationId,
      leadId: quote ? quote.leadId : '',
      companyName,
      contactName,
      gstin,
      state,
      stateCode,
      billingAddress,
      shippingAddress,
      buyer: quote?.buyer || {
        companyName,
        contactName,
        gstin,
        state,
        stateCode,
        billingAddress,
        shippingAddress
      },
      items,
      totalValueUSD: grandTotalUSD,
      grandTotalINR,
      taxableTotalUSD,
      totalTaxUSD,
      freightCostUSD,
      packagingCostUSD,
      stage: 'Confirmed',
      expectedDeliveryDate: new Date(Date.now() + 14 * 86400 * 1000).toISOString().split('T')[0],
      isRepeatOrder: false,
      createdAt: new Date().toISOString(),
    };

    walRegister('orders', newOrder.id, newOrder, 'upsert');
    setOrders(prev => {
      if (prev.some(o => o.id === newOrder.id || (newOrder.quotationId && o.quotationId === newOrder.quotationId))) {
        return prev;
      }
      const next = [newOrder, ...prev];
      saveLocal('weldor_orders', next);
      return next;
    });
    api.createOrder(newOrder).catch(() => {});

    if (quote) {
      if (quote.leadId) updateLeadStage(quote.leadId, 'WON');
      setQuotations(prev => {
        const next = prev.map(q => q.id === quotationId ? { ...q, status: 'Accepted' as any } : q);
        saveLocal('weldor_quotations', next);
        return next;
      });
    }

    addAuditLog('ORDER_CONVERTED', 'orders', newOrder.id, `Converted quotation ${quotationId} into confirmed order ${newOrder.orderNumber} for ${companyName}`);
    showNotification(`Order ${newOrder.orderNumber} confirmed & sent to production queue!`, 'success');
    return newOrder;
  };

  const deleteOrder = (orderId: string) => {
    const target = orders.find(o => o.id === orderId);
    walRegister('orders', orderId, {}, 'delete');
    if (target?.orderNumber) {
      walRegister('orders', target.orderNumber, {}, 'delete');
    }
    setOrders(prev => {
      const next = prev.filter(o => {
        if (o.id === orderId) return false;
        if (target?.quotationId && o.quotationId === target.quotationId) return false;
        if (target?.orderNumber && o.orderNumber === target.orderNumber) return false;
        if (target?.companyName && target?.totalValueUSD && o.companyName === target.companyName && o.totalValueUSD === target.totalValueUSD) return false;
        return true;
      });
      saveLocal('weldor_orders', next);
      return next;
    });
    api.deleteOrder(orderId).catch(() => {});

    // If linked to a quotation, reset quotation status so it's not permanently stuck as Accepted
    if (target?.quotationId) {
      setQuotations(prevQuotes => {
        const nextQuotes = prevQuotes.map(q => q.id === target.quotationId ? { ...q, status: 'Approved' as any } : q);
        saveLocal('weldor_quotations', nextQuotes);
        return nextQuotes;
      });
    }

    addAuditLog('ORDER_DELETED', 'orders', orderId, `Deleted order ${orderId} (${target?.orderNumber || ''})`);
    showNotification(`Order ${target?.orderNumber || orderId} removed from registry.`, 'warning');
  };

  const rejectQuotation = (quotationId: string, reason?: string) => {
    walRegister('quotations', quotationId, {
      status: 'Rejected',
      approvalNotes: reason || `Marked as Rejected / Revision Requested by ${currentEmployee.name}`,
    }, 'upsert');
    setQuotations(prev => {
      const next = prev.map(q => {
        if (q.id === quotationId) {
          return {
            ...q,
            status: 'Rejected' as const,
            approvalNotes: reason || `Marked as Rejected / Revision Requested by ${currentEmployee.name}`,
          };
        }
        return q;
      });
      saveLocal('weldor_quotations', next);
      return next;
    });
    api.updateQuotation(quotationId, {
      status: 'Rejected',
      approvalNotes: reason || `Marked as Rejected / Revision Requested by ${currentEmployee.name}`,
    }).catch(() => {});
    addAuditLog('QUOTATION_REJECTED', 'quotations', quotationId, `Rejected quotation ${quotationId}: ${reason || 'Revision needed'}`);
    showNotification('Quotation status updated to Rejected / Needs Revision.', 'warning');
  };

  const deleteQuotation = (quotationId: string) => {
    const target = quotations.find(q => q.id === quotationId);
    walRegister('quotations', quotationId, {}, 'delete');
    if (target?.quotationNumber) {
      walRegister('quotations', target.quotationNumber, {}, 'delete');
    }
    setQuotations(prev => {
      const next = prev.filter(q => {
        if (q.id === quotationId) return false;
        if (target?.quotationNumber && (q as any).quotationNumber === target.quotationNumber) return false;
        return true;
      });
      saveLocal('weldor_quotations', next);
      return next;
    });

    try {
      const raw = localStorage.getItem('weldor_commercial_quotes');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((q: any) => q.id !== quotationId && q.quotationNumber !== target?.quotationNumber && q.quotationNumber !== quotationId);
          localStorage.setItem('weldor_commercial_quotes', JSON.stringify(filtered));
        }
      }
    } catch (e) {}

    api.deleteQuotation(quotationId).catch(() => {});
    addAuditLog('QUOTATION_DELETED', 'quotations', quotationId, `Deleted quotation ${quotationId}`);
    showNotification('Quotation permanently removed.', 'warning');
  };

  const deleteLead = (leadId: string) => {
    walRegister('leads', leadId, {}, 'delete');
    setLeads(prev => {
      const next = prev.filter(l => l.id !== leadId);
      saveLocal('weldor_leads', next);
      return next;
    });
    api.deleteLead(leadId).catch(() => {});
    addAuditLog('LEAD_DELETED', 'leads', leadId, `Deleted lead ${leadId}`);
    showNotification('Lead removed from CRM pipeline.', 'warning');
  };

  const deleteRFQ = (rfqId: string) => {
    walRegister('rfqs', rfqId, {}, 'delete');
    setRfqs(prev => {
      const next = prev.filter(r => r.id !== rfqId);
      saveLocal('weldor_rfqs', next);
      return next;
    });
    api.deleteRfq(rfqId).catch(() => {});
    addAuditLog('RFQ_DELETED', 'rfqs', rfqId, `Deleted RFQ inquiry ${rfqId}`);
    showNotification('RFQ inquiry removed from workspace.', 'warning');
  };

  const addInvoice = async (invoice: any) => {
    walRegister('invoices', invoice.id, invoice, 'upsert');
    setInvoices(prev => {
      const filtered = prev.filter(inv => inv.id !== invoice.id && inv.invoiceNumber !== invoice.invoiceNumber);
      const next = [invoice, ...filtered];
      saveLocal('weldor_invoices', next);
      return next;
    });
    api.createInvoice(invoice).catch(() => {});
    addAuditLog('INVOICE_CREATED', 'invoices', invoice.id, `Created invoice ${invoice.invoiceNumber}`);
    showNotification(`Invoice ${invoice.invoiceNumber} recorded and saved to database!`, 'success');
  };

  const updateInvoice = async (id: string, invoice: any) => {
    walRegister('invoices', id, invoice, 'upsert');
    setInvoices(prev => {
      const next = prev.map(inv => inv.id === id ? { ...inv, ...invoice } : inv);
      saveLocal('weldor_invoices', next);
      return next;
    });
    api.updateInvoice(id, invoice).catch(() => {});
    addAuditLog('INVOICE_UPDATED', 'invoices', id, `Updated invoice ${id}`);
  };

  const deleteInvoice = async (id: string) => {
    const target = invoices.find(inv => inv.id === id);
    walRegister('invoices', id, {}, 'delete');
    if (target?.invoiceNumber) {
      walRegister('invoices', target.invoiceNumber, {}, 'delete');
    }
    setInvoices(prev => {
      const next = prev.filter(inv => {
        if (inv.id === id) return false;
        if (target?.invoiceNumber && inv.invoiceNumber === target.invoiceNumber) return false;
        if (target?.orderId && inv.orderId === target.orderId) return false;
        return true;
      });
      saveLocal('weldor_invoices', next);
      return next;
    });
    api.deleteInvoice(id).catch(() => {});
    addAuditLog('INVOICE_DELETED', 'invoices', id, `Deleted invoice ${id} (${target?.invoiceNumber || ''})`);
    showNotification(`Invoice ${target?.invoiceNumber || id} removed.`, 'info');
  };

  // Inventory Management Handlers & Reactive Low/Out of Stock Computations
  const lowStockCount = inventory.filter(i => i.currentStock > 0 && i.currentStock <= i.minStockAlert).length;
  const outOfStockCount = inventory.filter(i => i.currentStock <= 0).length;

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    const now = new Date().toISOString();
    const currentStock = Number(itemData.currentStock) || 0;
    const minAlert = Number(itemData.minStockAlert) || 10;
    const status: InventoryItem['status'] = currentStock <= 0 ? 'Out of Stock' : currentStock <= minAlert ? 'Low Stock' : 'In Stock';
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      currentStock,
      minStockAlert: minAlert,
      status,
      lastUpdated: now
    };
    walRegister('inventory', newItem.id, newItem, 'upsert');
    setInventory(prev => {
      const filtered = prev.filter(i => i.id !== newItem.id && i.sku.trim().toUpperCase() !== newItem.sku.trim().toUpperCase());
      const next = [newItem, ...filtered];
      saveLocal('weldor_inventory', next);
      return next;
    });

    if (currentStock > 0) {
      const logEntry: InventoryStockLog = {
        id: `inv-log-${Date.now()}`,
        itemId: newItem.id,
        timestamp: now,
        changeType: 'INWARD',
        deltaQuantity: currentStock,
        remainingStock: currentStock,
        reason: 'Initial Opening Stock Entry',
        performedBy: currentEmployee?.name || 'Administrator',
        referenceNumber: 'INITIAL-OPENING'
      };
      walRegister('inventory_logs', logEntry.id, logEntry, 'upsert');
      setInventoryLogs(logs => {
        const nextLogs = [logEntry, ...logs];
        saveLocal('weldor_inventory_logs', nextLogs);
        return nextLogs;
      });
    }

    addAuditLog('INVENTORY_ITEM_CREATED', 'inventory', newItem.id, `Created inventory item: ${newItem.name} (${newItem.sku})`);
    showNotification(`Item "${newItem.name}" added to inventory catalog!`, 'success');
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    const now = new Date().toISOString();
    setInventory(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, ...updates, lastUpdated: now };
          const curStock = Number(updated.currentStock) || 0;
          const minStock = Number(updated.minStockAlert) || 0;
          updated.status = curStock <= 0 ? 'Out of Stock' : curStock <= minStock ? 'Low Stock' : 'In Stock';
          walRegister('inventory', id, updated, 'upsert');
          return updated;
        }
        return item;
      });
      saveLocal('weldor_inventory', next);
      return next;
    });
    addAuditLog('INVENTORY_ITEM_UPDATED', 'inventory', id, `Updated inventory item ${id}`);
    showNotification(`Inventory item details updated successfully!`, 'success');
  };

  const deleteInventoryItem = (id: string) => {
    const target = inventory.find(i => i.id === id);
    walRegister('inventory', id, {}, 'delete');
    setInventory(prev => {
      const next = prev.filter(i => i.id !== id);
      saveLocal('weldor_inventory', next);
      return next;
    });
    addAuditLog('INVENTORY_ITEM_DELETED', 'inventory', id, `Deleted inventory item: ${target?.name || id}`);
    showNotification(`Item "${target?.name || id}" removed from inventory.`, 'warning');
  };

  const clearAllInventory = () => {
    setInventory(prev => {
      for (const item of prev) {
        walRegister('inventory', item.id, item, 'delete');
      }
      saveLocal('weldor_inventory', []);
      return [];
    });
    setInventoryLogs(logs => {
      const clearLog: InventoryStockLog = {
        id: `inv-log-${Date.now()}`,
        itemId: 'all',
        timestamp: new Date().toISOString(),
        changeType: 'ADJUSTMENT_AUDIT',
        deltaQuantity: 0,
        remainingStock: 0,
        reason: 'Entire inventory wiped / cleared by administrator',
        performedBy: currentEmployee?.name || 'Super Admin',
        referenceNumber: 'BULK_CLEAR'
      };
      const nextLogs = [clearLog, ...logs];
      saveLocal('weldor_inventory_logs', nextLogs);
      return nextLogs;
    });
    addAuditLog('INVENTORY_ALL_DELETED', 'inventory', 'all', 'Emptied all inventory stock items');
    showNotification('All inventory items have been deleted and cleared!', 'warning');
  };

  const bulkDeleteInventory = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setInventory(prev => {
      const remaining: InventoryItem[] = [];
      for (const item of prev) {
        if (idSet.has(item.id)) {
          walRegister('inventory', item.id, item, 'delete');
        } else {
          remaining.push(item);
        }
      }
      saveLocal('weldor_inventory', remaining);
      return remaining;
    });
    addAuditLog('INVENTORY_BULK_DELETED', 'inventory', ids.join(','), `Deleted ${ids.length} inventory items`);
    showNotification(`Deleted ${ids.length} items from inventory.`, 'warning');
  };

  const adjustInventoryStock = (
    id: string, 
    deltaQty: number, 
    type: InventoryStockLog['changeType'], 
    reason: string, 
    referenceNumber?: string
  ) => {
    const now = new Date().toISOString();
    let updatedItem: InventoryItem | null = null;
    let newStock = 0;

    setInventory(prev => {
      const next = prev.map(item => {
        if (item.id === id) {
          newStock = Math.max(0, item.currentStock + deltaQty);
          const minAlert = item.minStockAlert;
          const status: InventoryItem['status'] = newStock <= 0 ? 'Out of Stock' : newStock <= minAlert ? 'Low Stock' : 'In Stock';
          updatedItem = { ...item, currentStock: newStock, status, lastUpdated: now };
          walRegister('inventory', id, updatedItem, 'upsert');
          return updatedItem;
        }
        return item;
      });
      saveLocal('weldor_inventory', next);
      return next;
    });

    if (updatedItem) {
      const logEntry: InventoryStockLog = {
        id: `inv-log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        itemId: id,
        timestamp: now,
        changeType: type,
        deltaQuantity: deltaQty,
        remainingStock: newStock,
        reason: reason || (deltaQty > 0 ? 'Stock Inward' : 'Stock Adjustment'),
        performedBy: currentEmployee?.name || 'Godown Manager',
        referenceNumber: referenceNumber || ''
      };
      walRegister('inventory_logs', logEntry.id, logEntry, 'upsert');
      setInventoryLogs(logs => {
        const nextLogs = [logEntry, ...logs];
        saveLocal('weldor_inventory_logs', nextLogs);
        return nextLogs;
      });

      if (newStock === 0) {
        showNotification(`🚨 ALERT: "${(updatedItem as InventoryItem).name}" is now OUT OF STOCK!`, 'warning');
      } else if (newStock <= (updatedItem as InventoryItem).minStockAlert) {
        showNotification(`⚠️ LOW STOCK: "${(updatedItem as InventoryItem).name}" has only ${newStock} units left!`, 'warning');
      } else {
        showNotification(`Stock updated: ${deltaQty > 0 ? `+${deltaQty}` : deltaQty} (New Balance: ${newStock})`, 'success');
      }
    }
  };

  const bulkImportInventory = (newItems: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    const now = new Date().toISOString();

    setInventory(prev => {
      const existingMap = new Map(prev.map(i => [i.sku.trim().toUpperCase(), i]));
      for (const raw of newItems) {
        if (!raw.sku || !raw.name) {
          errorCount++;
          continue;
        }
        const skuKey = String(raw.sku).trim().toUpperCase();
        const curStock = Number(raw.currentStock) || 0;
        const minAlert = Number(raw.minStockAlert) || 10;
        const status: InventoryItem['status'] = curStock <= 0 ? 'Out of Stock' : curStock <= minAlert ? 'Low Stock' : 'In Stock';
        
        const existing = existingMap.get(skuKey);
        const itemObj: InventoryItem = {
          id: existing ? existing.id : `inv-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          sku: String(raw.sku).trim(),
          name: String(raw.name).trim(),
          category: String(raw.category || 'General Spares & Consumables').trim(),
          hsnCode: String(raw.hsnCode || '85159000').trim(),
          unit: (['PCS', 'KG', 'MTR', 'BOX', 'SET', 'ROLL', 'PACK'].includes(raw.unit?.toUpperCase()) ? raw.unit.toUpperCase() : 'PCS') as any,
          unitPriceINR: Number(raw.unitPriceINR) || 0,
          unitPriceUSD: Number(raw.unitPriceUSD) || (Number(raw.unitPriceINR) ? Math.round(Number(raw.unitPriceINR) / 85 * 100) / 100 : 0),
          costPriceINR: Number(raw.costPriceINR) || 0,
          gstRatePct: Number(raw.gstRatePct) || 18,
          currentStock: curStock,
          minStockAlert: minAlert,
          isPublic: Boolean(raw.isPublic === true || String(raw.isPublic).toLowerCase() === 'true'),
          warehouseLocation: String(raw.warehouseLocation || 'Jamnagar Central Godown').trim(),
          status,
          supplierName: String(raw.supplierName || 'Earth Metal Industries').trim(),
          description: String(raw.description || '').trim(),
          lastUpdated: now
        };
        walRegister('inventory', itemObj.id, itemObj, 'upsert');
        existingMap.set(skuKey, itemObj);
        successCount++;
      }
      const next = Array.from(existingMap.values());
      saveLocal('weldor_inventory', next);
      return next;
    });

    showNotification(`Bulk Import complete: ${successCount} items processed${errorCount > 0 ? `, ${errorCount} skipped` : ''}!`, 'success');
    return { successCount, errorCount };
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
        deleteRFQ,
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
        addCommercialQuotation,
        approveQuotation,
        rejectQuotation,
        deleteQuotation,
        orders,
        convertQuotationToOrder,
        updateOrderStage,
        deleteOrder,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        inventory,
        inventoryLogs,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        clearAllInventory,
        bulkDeleteInventory,
        adjustInventoryStock,
        bulkImportInventory,
        lowStockCount,
        outOfStockCount,
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
