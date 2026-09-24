import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Users, 
  Key, 
  Trash2, 
  Edit3, 
  Save, 
  Sparkles, 
  AlertTriangle,
  X,
  Check,
  Layers,
  FileCheck,
  Eye,
  Sliders
} from 'lucide-react';
import { Role, RoleScope, PermissionAction, CRMModule, Employee } from '../../types';

interface ModuleConfig {
  id: CRMModule;
  label: string;
  description: string;
}

const ALL_CRM_MODULES: ModuleConfig[] = [
  { id: 'dashboard', label: 'Executive Dashboard', description: 'Access KPI metrics, revenue charts, and operational summaries.' },
  { id: 'leads', label: 'Leads & Sales Kanban', description: 'Manage sales pipeline, client stages, and lead assignments.' },
  { id: 'rfqs', label: 'RFQs & CAD Inquiries', description: 'Process customer requests for quote and CAD drawing specs.' },
  { id: 'quotations', label: 'Quotation Engine', description: 'Create, review, approve, and send official commercial quotes.' },
  { id: 'orders', label: 'Orders & B2B Dispatch', description: 'Track production orders, invoices, and logistics courier tracking.' },
  { id: 'employees', label: 'Employee Directory & HRMS', description: 'Manage staff profiles, KYC documents, CTC salary structures, and letters.' },
  { id: 'payroll', label: 'Salary Roll & Payslips', description: 'Calculate monthly payroll, attendance deductions, and bank disbursals.' },
  { id: 'attendance', label: 'Attendance & Leave Logs', description: 'Record daily shifts, overtime hours, and approve leave requests.' },
  { id: 'samples', label: 'Sample Request Cycle', description: 'Process sample requests, lab validations, and test coupons.' },
  { id: 'trials', label: 'Technical Lab Trials', description: 'Conduct metallurgy trials, hardness checks, and test reports.' },
  { id: 'products', label: 'Product Catalog & CAD', description: 'Manage technical product specifications, models, and categories.' },
  { id: 'cms', label: 'Website CMS & Banners', description: 'Update homepage hero banners, image gallery, and marketing content.' },
  { id: 'exhibitions', label: 'Exhibitions & Expos', description: 'Publish upcoming trade fairs, booth numbers, and QR visitor forms.' },
  { id: 'settings', label: 'Company Settings & Banking', description: 'Edit corporate legal details, bank accounts, and SLA thresholds.' },
  { id: 'rbac', label: 'Security & RBAC Matrix', description: 'Configure custom roles, access scopes, and module permissions.' },
  { id: 'audit', label: 'Security Audit Logs', description: 'Review chronological user activity and session security logs.' },
];

const ALL_ACTIONS: { id: PermissionAction; label: string }[] = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'approve', label: 'Approve' },
  { id: 'export', label: 'Export' },
  { id: 'publish', label: 'Publish' },
  { id: 'assign', label: 'Assign' },
];

export const RBACManager: React.FC = () => {
  const { 
    roles, 
    addRole, 
    updateRole, 
    deleteRole, 
    employees, 
    updateEmployee, 
    showNotification,
    hasPermission,
    currentRole
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'staff'>('matrix');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'role-super-admin');

  // Custom Role Modal state
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleScope, setNewRoleScope] = useState<RoleScope>('Assigned');
  const [roleTemplate, setRoleTemplate] = useState<'custom' | 'sales' | 'ops' | 'readonly'>('custom');

  // Edit Role Info Modal state
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Deleting confirmation
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = (module: CRMModule, action: PermissionAction) => {
    if (selectedRole.name === 'Super Admin') {
      showNotification('Super Admin role has full permanent system access.', 'info');
      return;
    }

    const currentPermissions = selectedRole.permissions || [];
    const ruleIndex = currentPermissions.findIndex(p => p.module === module);

    let updatedPermissions = [...currentPermissions];

    if (ruleIndex >= 0) {
      const existingActions = updatedPermissions[ruleIndex].actions;
      if (existingActions.includes(action)) {
        updatedPermissions[ruleIndex] = {
          ...updatedPermissions[ruleIndex],
          actions: existingActions.filter(a => a !== action)
        };
      } else {
        updatedPermissions[ruleIndex] = {
          ...updatedPermissions[ruleIndex],
          actions: [...existingActions, action]
        };
      }
    } else {
      updatedPermissions.push({ module, actions: [action] });
    }

    updateRole(selectedRole.id, { permissions: updatedPermissions });
  };

  const handleToggleAllForModule = (module: CRMModule) => {
    if (selectedRole.name === 'Super Admin') return;

    const currentPermissions = selectedRole.permissions || [];
    const rule = currentPermissions.find(p => p.module === module);
    const hasAll = rule && rule.actions.length === ALL_ACTIONS.length;

    let updatedPermissions = currentPermissions.filter(p => p.module !== module);

    if (!hasAll) {
      updatedPermissions.push({
        module,
        actions: ALL_ACTIONS.map(a => a.id)
      });
    }

    updateRole(selectedRole.id, { permissions: updatedPermissions });
  };

  const handleSelectAllRolePermissions = () => {
    if (selectedRole.name === 'Super Admin') return;

    const fullPermissions = ALL_CRM_MODULES.map(m => ({
      module: m.id,
      actions: ALL_ACTIONS.map(a => a.id)
    }));

    updateRole(selectedRole.id, { permissions: fullPermissions });
    showNotification(`Granted all permissions to ${selectedRole.name}!`, 'success');
  };

  const handleClearAllRolePermissions = () => {
    if (selectedRole.name === 'Super Admin') {
      showNotification('Super Admin permissions cannot be cleared.', 'warning');
      return;
    }

    updateRole(selectedRole.id, { permissions: [] });
    showNotification(`Cleared all permissions for ${selectedRole.name}`, 'info');
  };

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      showNotification('Please provide a role name.', 'warning');
      return;
    }

    let initialPermissions: { module: CRMModule; actions: PermissionAction[] }[] = [];

    if (roleTemplate === 'sales') {
      initialPermissions = [
        { module: 'dashboard', actions: ['view', 'export'] },
        { module: 'leads', actions: ['view', 'create', 'edit', 'assign', 'export'] },
        { module: 'rfqs', actions: ['view', 'create', 'edit', 'assign'] },
        { module: 'quotations', actions: ['view', 'create', 'edit', 'approve'] },
        { module: 'orders', actions: ['view', 'create', 'edit'] },
        { module: 'samples', actions: ['view', 'create'] },
        { module: 'products', actions: ['view'] },
      ];
    } else if (roleTemplate === 'ops') {
      initialPermissions = [
        { module: 'dashboard', actions: ['view'] },
        { module: 'employees', actions: ['view', 'create', 'edit'] },
        { module: 'payroll', actions: ['view', 'create', 'edit'] },
        { module: 'attendance', actions: ['view', 'create', 'edit', 'approve'] },
      ];
    } else if (roleTemplate === 'readonly') {
      initialPermissions = ALL_CRM_MODULES.map(m => ({
        module: m.id,
        actions: ['view'] as PermissionAction[]
      }));
    }

    await addRole({
      name: newRoleName.trim(),
      description: newRoleDescription.trim() || `Custom defined role: ${newRoleName.trim()}`,
      scope: newRoleScope,
      isSystem: false,
      permissions: initialPermissions,
    });

    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDescription('');
    setNewRoleScope('Assigned');
  };

  const handleSaveRoleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    await updateRole(editingRole.id, {
      name: editingRole.name,
      description: editingRole.description,
      scope: editingRole.scope,
    });

    setIsEditRoleModalOpen(false);
    setEditingRole(null);
  };

  const handleStaffRoleChange = (emp: Employee, newRoleId: string) => {
    const targetRole = roles.find(r => r.id === newRoleId);
    if (!targetRole) return;

    updateEmployee(emp.id, {
      roleId: targetRole.id,
      roleName: targetRole.name as any,
      scope: targetRole.scope
    });
    showNotification(`Assigned role "${targetRole.name}" to ${emp.name}`, 'success');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-900">
      
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-orange-400 font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>ENTERPRISE RBAC & ACCESS CONTROL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Role Permission Matrix & Custom RBAC
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Create custom roles, assign granular module permissions (View, Create, Edit, Delete, Approve, Export, Publish, Assign), and assign staff access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-xs font-mono">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'matrix' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Role Matrix ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'staff' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              Staff Assignment ({employees.length})
            </button>
          </div>

          {/* Create Custom Role Button */}
          {hasPermission('rbac', 'create') && (
            <button
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Custom Role</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Roles Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                System & Custom Roles ({roles.length}):
              </h3>
            </div>

            <div className="space-y-2.5">
              {roles.map(r => {
                const isSelected = selectedRole?.id === r.id;
                const isSuperAdmin = r.name === 'Super Admin' || r.id === 'role-super-admin';
                const assignedCount = employees.filter(e => e.roleId === r.id || e.roleName === r.name).length;

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoleId(r.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-orange-50/90 border-orange-400 shadow-sm ring-2 ring-orange-400/50'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{r.name}</h4>
                          {isSuperAdmin && (
                            <span className="text-[9px] font-mono bg-purple-100 text-purple-800 border border-purple-300 px-1.5 py-0.2 rounded font-bold">
                              Root Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{r.description}</p>
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 border ${
                        r.scope === 'All' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        r.scope === 'Team' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {r.scope} Scope
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>{assignedCount} Staff Assigned</span>

                      {!isSuperAdmin && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setEditingRole({ ...r });
                              setIsEditRoleModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded cursor-pointer"
                            title="Edit Role Scope / Name"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setDeletingRoleId(r.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete Custom Role"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granular Permission Action Matrix */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Header with Quick Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Permission Matrix: <span className="text-orange-600">{selectedRole.name}</span>
                  </h3>
                  <span className="text-xs font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-md">
                    {selectedRole.scope} Scope Visibility
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole.name === 'Super Admin' 
                    ? 'Super Admin has permanent full master permissions across all modules.'
                    : 'Check or uncheck granular permissions below. Changes are saved automatically to the database.'}
                </p>
              </div>

              {selectedRole.name !== 'Super Admin' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSelectAllRolePermissions}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold border border-slate-300 transition-colors cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleClearAllRolePermissions}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-mono font-bold border border-slate-300 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Permission Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-mono border-b border-slate-200">
                    <th className="py-3 px-4 font-bold min-w-[200px]">CRM MODULE</th>
                    {ALL_ACTIONS.map(act => (
                      <th key={act.id} className="py-3 px-2 text-center uppercase font-bold text-[10.5px]">
                        {act.label}
                      </th>
                    ))}
                    {selectedRole.name !== 'Super Admin' && (
                      <th className="py-3 px-3 text-right font-bold text-[10.5px]">Row</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ALL_CRM_MODULES.map(mod => {
                    const rule = selectedRole.permissions?.find(p => p.module === mod.id);
                    const activeActions = selectedRole.name === 'Super Admin' 
                      ? ALL_ACTIONS.map(a => a.id) 
                      : (rule ? rule.actions : []);
                    const isAllChecked = ALL_ACTIONS.every(a => activeActions.includes(a.id));

                    return (
                      <tr key={mod.id} className="hover:bg-slate-50/70 transition-colors">
                        
                        {/* Module Name & Info */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{mod.label}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{mod.description}</p>
                        </td>

                        {/* Action Checkboxes */}
                        {ALL_ACTIONS.map(act => {
                          const isChecked = activeActions.includes(act.id);
                          const isDisabled = selectedRole.name === 'Super Admin';

                          return (
                            <td key={act.id} className="py-3 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={() => handleTogglePermission(mod.id, act.id)}
                                className={`rounded border-slate-300 text-orange-600 focus:ring-orange-500 w-4 h-4 ${
                                  isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                              />
                            </td>
                          );
                        })}

                        {/* Row Toggle */}
                        {selectedRole.name !== 'Super Admin' && (
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleAllForModule(mod.id)}
                              className="text-[10px] font-mono text-orange-700 hover:text-orange-900 font-bold underline cursor-pointer"
                            >
                              {isAllChecked ? 'Clear' : 'All'}
                            </button>
                          </td>
                        )}

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Auto-saved to database on check/uncheck.</span>
              </span>
              <span>Total Active Modules: {ALL_CRM_MODULES.length}</span>
            </div>

          </div>

        </div>
      ) : (
        /* STAFF ROLE ASSIGNMENT TAB */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Employee Security Role Assignment Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reassign employee roles and visibility scopes in real-time. Changes immediately apply to employee logins.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
              {employees.length} Employees Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono font-bold">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Designation</th>
                  <th className="py-3 px-4">Current Assigned Role</th>
                  <th className="py-3 px-4">Visibility Scope</th>
                  <th className="py-3 px-4 text-right">Reassign Security Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const empRole = roles.find(r => r.id === emp.roleId || r.name === emp.roleName) || roles[0];
                  
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {emp.avatarUrl ? (
                            <img src={emp.avatarUrl} alt={emp.name} className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                              {emp.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900">{emp.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{emp.designation}</p>
                        <span className="text-[10.5px] text-slate-500 font-mono">{emp.department}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-orange-900 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                          {empRole.name}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10.5px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {empRole.scope} Visibility
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <select
                          value={empRole.id}
                          onChange={e => handleStaffRoleChange(emp, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none cursor-pointer"
                        >
                          {roles.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({r.scope})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE CUSTOM ROLE MODAL */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Create New Custom Security Role</h3>
                <p className="text-xs text-slate-400 mt-0.5">Define custom role name, scope, and template permissions.</p>
              </div>
              <button onClick={() => setIsCreateRoleModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quality Inspector, CNC Lead, Accountant"
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what this role is responsible for in the company..."
                  value={newRoleDescription}
                  onChange={e => setNewRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data Visibility Scope</label>
                  <select
                    value={newRoleScope}
                    onChange={e => setNewRoleScope(e.target.value as RoleScope)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="All">All Scope (Full Company)</option>
                    <option value="Team">Team Scope (Department)</option>
                    <option value="Assigned">Assigned Scope (Assigned Leads/Tasks)</option>
                    <option value="Own">Own Scope (Own Records Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Starter Template</label>
                  <select
                    value={roleTemplate}
                    onChange={e => setRoleTemplate(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="custom">Blank (Configure Manually)</option>
                    <option value="sales">Sales & Commercial Focused</option>
                    <option value="ops">HR & Operations Focused</option>
                    <option value="readonly">Read-Only View All</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save & Configure Matrix
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {isEditRoleModalOpen && editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Edit Role: {editingRole.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update role title and visibility scope.</p>
              </div>
              <button onClick={() => setIsEditRoleModalOpen(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleEdit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  value={editingRole.name}
                  onChange={e => setEditingRole(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingRole.description}
                  onChange={e => setEditingRole(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Data Visibility Scope</label>
                <select
                  value={editingRole.scope}
                  onChange={e => setEditingRole(prev => prev ? { ...prev, scope: e.target.value as RoleScope } : null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-slate-900 font-medium cursor-pointer"
                >
                  <option value="All">All Scope (Full Company)</option>
                  <option value="Team">Team Scope (Department)</option>
                  <option value="Assigned">Assigned Scope (Assigned Leads/Tasks)</option>
                  <option value="Own">Own Scope (Own Records Only)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingRoleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900">Delete Custom Role?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this custom role? Employees assigned to this role will fallback to the default role.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingRoleId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteRole(deletingRoleId);
                  setDeletingRoleId(null);
                  setSelectedRoleId(roles[0]?.id || 'role-super-admin');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Delete Role
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
