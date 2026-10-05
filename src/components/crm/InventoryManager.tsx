import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Boxes, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Warehouse, 
  FileSpreadsheet, 
  History, 
  SlidersHorizontal,
  X,
  Package,
  Layers,
  IndianRupee,
  DollarSign,
  Info,
  Check
} from 'lucide-react';
import type { InventoryItem, InventoryStockLog, InventoryUnit } from '../../types';
import * as XLSX from 'xlsx';

export const InventoryManager: React.FC = () => {
  const { 
    inventory, 
    inventoryLogs, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    clearAllInventory,
    bulkDeleteInventory,
    adjustInventoryStock, 
    bulkImportInventory,
    showNotification,
    currentEmployee
  } = useApp();

  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'INTERNAL_ONLY' | 'PUBLIC_ONLY'>('ALL');
  const [sortBy, setSortBy] = useState<'NAME' | 'STOCK_LOW' | 'STOCK_HIGH' | 'VALUE_HIGH' | 'SKU'>('STOCK_LOW');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [itemForAdjustment, setItemForAdjustment] = useState<InventoryItem | null>(null);
  const [adjustType, setAdjustType] = useState<'INWARD' | 'ADJUSTMENT_DAMAGE' | 'ADJUSTMENT_AUDIT'>('INWARD');
  const [adjustQty, setAdjustQty] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjustRef, setAdjustRef] = useState<string>('');

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCsvText, setImportCsvText] = useState<string>('');
  const [importParsedCount, setImportParsedCount] = useState<number | null>(null);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [historyItemId, setHistoryItemId] = useState<string | null>(null);

  const [deleteItemTarget, setDeleteItemTarget] = useState<InventoryItem | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'CATALOG' | 'REPORT'>('CATALOG');

  // Form State for Add / Edit Item
  const initialFormState: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'> = {
    sku: '',
    name: '',
    category: 'MIG Consumables & Spares',
    hsnCode: '85159000',
    unit: 'PCS',
    unitPriceINR: 150,
    unitPriceUSD: 1.80,
    costPriceINR: 90,
    gstRatePct: 18,
    currentStock: 50,
    minStockAlert: 15,
    isPublic: false,
    warehouseLocation: 'Jamnagar Plant Godown A - Rack B1',
    supplierName: 'Earth Metal Industries In-House',
    description: ''
  };

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>>(initialFormState);

  // Categories list extracted from current inventory
  const categories = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach(i => {
      if (i.category) set.add(i.category);
    });
    return Array.from(set).sort();
  }, [inventory]);

  // Summary Metrics including Cost Valuation and Margins
  const metrics = useMemo(() => {
    let totalStockQty = 0;
    let totalValuationINR = 0;
    let totalValuationUSD = 0;
    let totalCostValuationINR = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let internalOnly = 0;

    inventory.forEach(item => {
      const stock = Number(item.currentStock) || 0;
      totalStockQty += stock;
      totalValuationINR += stock * (Number(item.unitPriceINR) || 0);
      totalValuationUSD += stock * (Number(item.unitPriceUSD) || 0);
      totalCostValuationINR += stock * (Number(item.costPriceINR || item.unitPriceINR * 0.6) || 0);

      if (stock <= 0) {
        outOfStock++;
      } else if (stock <= item.minStockAlert) {
        lowStock++;
      }

      if (!item.isPublic) {
        internalOnly++;
      }
    });

    return {
      totalItems: inventory.length,
      totalStockQty,
      totalValuationINR,
      totalValuationUSD,
      totalCostValuationINR,
      estimatedGodownProfitINR: Math.max(0, totalValuationINR - totalCostValuationINR),
      inStock: inventory.length - outOfStock,
      lowStock,
      outOfStock,
      internalOnly
    };
  }, [inventory]);

  // Category Breakdown for Audit Report
  const categoryReport = useMemo(() => {
    const map = new Map<string, { count: number; totalStock: number; valuationINR: number; valuationUSD: number; lowStockCount: number; outOfStockCount: number }>();
    inventory.forEach(item => {
      const cat = item.category || 'General';
      const prev = map.get(cat) || { count: 0, totalStock: 0, valuationINR: 0, valuationUSD: 0, lowStockCount: 0, outOfStockCount: 0 };
      const stock = Number(item.currentStock) || 0;
      const valINR = stock * (Number(item.unitPriceINR) || 0);
      const valUSD = stock * (Number(item.unitPriceUSD) || 0);
      prev.count += 1;
      prev.totalStock += stock;
      prev.valuationINR += valINR;
      prev.valuationUSD += valUSD;
      if (stock <= 0) prev.outOfStockCount += 1;
      else if (stock <= item.minStockAlert) prev.lowStockCount += 1;
      map.set(cat, prev);
    });
    return Array.from(map.entries()).map(([category, stats]) => ({
      category,
      ...stats
    })).sort((a, b) => b.valuationINR - a.valuationINR);
  }, [inventory]);

  // Urgent shortage items requiring reorder / manufacture
  const criticalShortageItems = useMemo(() => {
    return inventory.filter(i => i.currentStock <= i.minStockAlert).sort((a, b) => a.currentStock - b.currentStock);
  }, [inventory]);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesHsn = item.hsnCode?.toLowerCase().includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        const matchesLoc = item.warehouseLocation?.toLowerCase().includes(q);
        if (!matchesSku && !matchesName && !matchesHsn && !matchesCat && !matchesLoc) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Tab filter
      if (activeTab === 'IN_STOCK' && (item.currentStock <= 0 || item.currentStock <= item.minStockAlert)) return false;
      if (activeTab === 'LOW_STOCK' && (item.currentStock <= 0 || item.currentStock > item.minStockAlert)) return false;
      if (activeTab === 'OUT_OF_STOCK' && item.currentStock > 0) return false;
      if (activeTab === 'INTERNAL_ONLY' && item.isPublic) return false;
      if (activeTab === 'PUBLIC_ONLY' && !item.isPublic) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'STOCK_LOW') return a.currentStock - b.currentStock;
      if (sortBy === 'STOCK_HIGH') return b.currentStock - a.currentStock;
      if (sortBy === 'VALUE_HIGH') {
        return (b.currentStock * b.unitPriceINR) - (a.currentStock * a.unitPriceINR);
      }
      if (sortBy === 'SKU') return a.sku.localeCompare(b.sku);
      return a.name.localeCompare(b.name);
    });
  }, [inventory, searchQuery, selectedCategory, activeTab, sortBy]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      ...initialFormState,
      sku: `WLD-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-4)}`
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      hsnCode: item.hsnCode,
      unit: item.unit,
      unitPriceINR: item.unitPriceINR,
      unitPriceUSD: item.unitPriceUSD,
      costPriceINR: item.costPriceINR || 0,
      gstRatePct: item.gstRatePct,
      currentStock: item.currentStock,
      minStockAlert: item.minStockAlert,
      isPublic: item.isPublic,
      warehouseLocation: item.warehouseLocation || '',
      supplierName: item.supplierName || '',
      description: item.description || ''
    });
    setIsAddEditModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sku.trim() || !formData.name.trim()) {
      showNotification('SKU and Product Name are mandatory!', 'warning');
      return;
    }

    if (editingItem) {
      updateInventoryItem(editingItem.id, formData);
    } else {
      addInventoryItem(formData);
    }
    setIsAddEditModalOpen(false);
  };

  // Quick Inward / Adjust Open
  const handleOpenAdjust = (item: InventoryItem, defaultType: 'INWARD' | 'ADJUSTMENT_DAMAGE' = 'INWARD') => {
    setItemForAdjustment(item);
    setAdjustType(defaultType);
    setAdjustQty(defaultType === 'INWARD' ? 20 : 5);
    setAdjustReason(defaultType === 'INWARD' ? 'Purchase Delivery Inward' : 'Godown physical stock audit');
    setAdjustRef(`REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsAdjustModalOpen(true);
  };

  // Submit Stock Adjustment
  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForAdjustment || adjustQty <= 0) return;

    const delta = adjustType === 'INWARD' ? Math.abs(adjustQty) : -Math.abs(adjustQty);
    adjustInventoryStock(
      itemForAdjustment.id, 
      delta, 
      adjustType, 
      adjustReason, 
      adjustRef
    );
    setIsAdjustModalOpen(false);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'SKU',
      'Name',
      'Category',
      'HSN Code',
      'Unit',
      'Unit Price INR',
      'Unit Price USD',
      'Cost Price INR',
      'GST %',
      'Current Stock',
      'Min Alert Level',
      'Stock Status',
      'Is Public Website',
      'Warehouse Location',
      'Supplier',
      'Total Valuation INR'
    ];

    const rows = inventory.map(item => [
      `"${item.sku.replace(/"/g, '""')}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${(item.category || '').replace(/"/g, '""')}"`,
      `"${item.hsnCode || ''}"`,
      item.unit,
      item.unitPriceINR,
      item.unitPriceUSD,
      item.costPriceINR || 0,
      item.gstRatePct,
      item.currentStock,
      item.minStockAlert,
      `"${item.status}"`,
      item.isPublic ? 'YES' : 'NO (Internal B2B Spares)',
      `"${(item.warehouseLocation || '').replace(/"/g, '""')}"`,
      `"${(item.supplierName || '').replace(/"/g, '""')}"`,
      item.currentStock * item.unitPriceINR
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Weldor_Inventory_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    showNotification('Master Inventory CSV exported successfully!', 'success');
  };

  // Sample CSV Template Download with UTF-8 BOM (Guaranteed .csv extension)
  const handleDownloadSampleCSV = () => {
    const csvContent = '\uFEFF' + [
      'sku,name,category,hsnCode,unit,unitPriceINR,unitPriceUSD,costPriceINR,gstRatePct,currentStock,minStockAlert,isPublic,warehouseLocation,supplierName,description',
      'WLD-TIP-1.0-M6,"MIG Contact Tip 1.0mm CuCrZr M6","MIG Consumables & Spares",85159000,PCS,45,0.55,25,18,500,100,FALSE,"Jamnagar Godown A - Rack B12","Earth Metal Industries In-House","Heavy-duty copper contact tip for MIG torches"',
      'WLD-NOZ-250A,"MIG Gas Nozzle 250A Conical","MIG Consumables & Spares",85159000,PCS,180,2.15,110,18,40,15,FALSE,"Jamnagar Godown A - Bin C02","Earth Metal Industries Pressings","Conical gas shielding nozzle"',
      'WLD-VALV-12V,"Direct Solenoid Valve 12V DC 1/8""","Pneumatic Automation Valves",84818030,PCS,1250,15.00,800,18,12,5,FALSE,"Automation Assembly Rack E1","Earth Pneumatics Sub-Assembly","Compact pilot-operated solenoid valve"',
      'WLD-FT-8MM,"Brass Male Push-In 8mm OD x 1/8"" BSPT","Brass Pneumatic Fittings",74122019,PCS,58,0.70,32,18,1200,200,TRUE,"Jamnagar Brass Yard Bay 2","Earth Metal Jamnagar Foundry","Nickel-plated precision brass push-in fitting"',
      'WLD-ROD-HEX20,"Brass Hex Rod CW617N 20mm (3 Mtr)","Raw Materials & Extrusions",74072110,KG,690,8.25,590,18,25,10,FALSE,"Raw Yard Bay 1","Earth Extrusions Plant","High-machinability forging grade brass rod"'
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'weldor_inventory_sample.csv');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    showNotification('✅ Sample CSV template downloaded as weldor_inventory_sample.csv', 'success');
  };

  // Sample Genuine Microsoft Excel Template (.xls SpreadsheetML)
  const handleDownloadSampleExcel = () => {
    const excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#E65100" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Data">
   <Font ss:FontName="Calibri" ss:Size="11"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Number">
   <Font ss:FontName="Calibri" ss:Size="11"/>
   <NumberFormat ss:Format="#,##0.00"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Integer">
   <Font ss:FontName="Calibri" ss:Size="11"/>
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="InventoryMaster">
  <Table ss:DefaultRowHeight="20">
   <Row ss:Height="24" ss:StyleID="Header">
    <Cell><Data ss:Type="String">sku</Data></Cell>
    <Cell><Data ss:Type="String">name</Data></Cell>
    <Cell><Data ss:Type="String">category</Data></Cell>
    <Cell><Data ss:Type="String">hsnCode</Data></Cell>
    <Cell><Data ss:Type="String">unit</Data></Cell>
    <Cell><Data ss:Type="String">unitPriceINR</Data></Cell>
    <Cell><Data ss:Type="String">unitPriceUSD</Data></Cell>
    <Cell><Data ss:Type="String">costPriceINR</Data></Cell>
    <Cell><Data ss:Type="String">gstRatePct</Data></Cell>
    <Cell><Data ss:Type="String">currentStock</Data></Cell>
    <Cell><Data ss:Type="String">minStockAlert</Data></Cell>
    <Cell><Data ss:Type="String">isPublic</Data></Cell>
    <Cell><Data ss:Type="String">warehouseLocation</Data></Cell>
    <Cell><Data ss:Type="String">supplierName</Data></Cell>
    <Cell><Data ss:Type="String">description</Data></Cell>
   </Row>
   <Row ss:StyleID="Data">
    <Cell><Data ss:Type="String">WLD-TIP-1.0-M6</Data></Cell>
    <Cell><Data ss:Type="String">MIG Contact Tip 1.0mm CuCrZr M6</Data></Cell>
    <Cell><Data ss:Type="String">MIG Consumables &amp; Spares</Data></Cell>
    <Cell><Data ss:Type="String">85159000</Data></Cell>
    <Cell><Data ss:Type="String">PCS</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">45.00</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">0.55</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">25.00</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">500</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">100</Data></Cell>
    <Cell><Data ss:Type="String">FALSE</Data></Cell>
    <Cell><Data ss:Type="String">Jamnagar Godown A - Rack B12</Data></Cell>
    <Cell><Data ss:Type="String">Earth Metal Industries In-House</Data></Cell>
    <Cell><Data ss:Type="String">Heavy-duty copper contact tip for MIG torches</Data></Cell>
   </Row>
   <Row ss:StyleID="Data">
    <Cell><Data ss:Type="String">WLD-NOZ-250A</Data></Cell>
    <Cell><Data ss:Type="String">MIG Gas Nozzle 250A Conical</Data></Cell>
    <Cell><Data ss:Type="String">MIG Consumables &amp; Spares</Data></Cell>
    <Cell><Data ss:Type="String">85159000</Data></Cell>
    <Cell><Data ss:Type="String">PCS</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">180.00</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">2.15</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">110.00</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">40</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">15</Data></Cell>
    <Cell><Data ss:Type="String">FALSE</Data></Cell>
    <Cell><Data ss:Type="String">Jamnagar Godown A - Bin C02</Data></Cell>
    <Cell><Data ss:Type="String">Earth Metal Industries Pressings</Data></Cell>
    <Cell><Data ss:Type="String">Conical gas shielding nozzle</Data></Cell>
   </Row>
   <Row ss:StyleID="Data">
    <Cell><Data ss:Type="String">WLD-VALV-12V</Data></Cell>
    <Cell><Data ss:Type="String">Direct Solenoid Valve 12V DC 1/8&quot;</Data></Cell>
    <Cell><Data ss:Type="String">Pneumatic Automation Valves</Data></Cell>
    <Cell><Data ss:Type="String">84818030</Data></Cell>
    <Cell><Data ss:Type="String">PCS</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">1250.00</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">15.00</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">800.00</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">12</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">5</Data></Cell>
    <Cell><Data ss:Type="String">FALSE</Data></Cell>
    <Cell><Data ss:Type="String">Automation Assembly Rack E1</Data></Cell>
    <Cell><Data ss:Type="String">Earth Pneumatics Sub-Assembly</Data></Cell>
    <Cell><Data ss:Type="String">Compact pilot-operated solenoid valve</Data></Cell>
   </Row>
   <Row ss:StyleID="Data">
    <Cell><Data ss:Type="String">WLD-FT-8MM</Data></Cell>
    <Cell><Data ss:Type="String">Brass Male Push-In 8mm OD x 1/8&quot; BSPT</Data></Cell>
    <Cell><Data ss:Type="String">Brass Pneumatic Fittings</Data></Cell>
    <Cell><Data ss:Type="String">74122019</Data></Cell>
    <Cell><Data ss:Type="String">PCS</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">58.00</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">0.70</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">32.00</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">18</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">1200</Data></Cell>
    <Cell ss:StyleID="Integer"><Data ss:Type="Number">200</Data></Cell>
    <Cell><Data ss:Type="String">TRUE</Data></Cell>
    <Cell><Data ss:Type="String">Jamnagar Brass Yard Bay 2</Data></Cell>
    <Cell><Data ss:Type="String">Earth Metal Jamnagar Foundry</Data></Cell>
    <Cell><Data ss:Type="String">Nickel-plated precision brass push-in fitting</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([excelXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'weldor_inventory_sample.xls');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    showNotification('✅ Microsoft Excel spreadsheet template downloaded as weldor_inventory_sample.xls', 'success');
  };

  // Robust RFC 4180 delimiter parser (supporting comma, tab/TSV, quotes, and Excel/Tally structures)
  const parseDelimitedData = (rawText: string) => {
    const rawLines = rawText.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (rawLines.length === 0) return [];

    const isTab = rawLines[0].includes('\t');

    const parseLine = (text: string): string[] => {
      if (isTab) {
        return text.split('\t').map(s => s.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      }
      const result: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      return result;
    };

    // Helper to clean numbers with commas, currency symbols, and units (e.g. "1,200.00 NOS", "₹ 45.00 / PCS")
    const cleanNumber = (val: string): number => {
      if (!val) return 0;
      const stripped = val.replace(/,/g, '').replace(/[^0-9.-]/g, ' ').trim().split(/\s+/)[0];
      const n = parseFloat(stripped);
      return isNaN(n) ? 0 : n;
    };

    // Find the actual header line by searching the first 15 lines (skips Tally title rows)
    let headerRowIdx = -1;
    let header: string[] = [];

    for (let r = 0; r < Math.min(15, rawLines.length); r++) {
      const candidateCols = parseLine(rawLines[r]).map(h => h.trim().toLowerCase());
      const hasNameOrParticulars = candidateCols.some(c => /particulars|item\s*name|product|material|name|description/i.test(c));
      const hasSku = candidateCols.some(c => /sku|part.*no|item.*code|code/i.test(c));
      const hasQtyOrBalance = candidateCols.some(c => /qty|quantity|balance|closing|stock/i.test(c));
      const hasRateOrPrice = candidateCols.some(c => /rate|price|mrp|amount|value/i.test(c));

      if (hasNameOrParticulars || (hasSku && hasQtyOrBalance) || (hasQtyOrBalance && hasRateOrPrice)) {
        headerRowIdx = r;
        header = candidateCols;
        break;
      }
    }

    if (headerRowIdx === -1) {
      headerRowIdx = 0;
      header = parseLine(rawLines[0]).map(h => h.trim().toLowerCase());
    }

    // Check if next row contains subheaders (e.g., in Tally "Closing Balance" is followed by "Quantity", "Rate", "Value")
    if (headerRowIdx + 1 < rawLines.length) {
      const nextCols = parseLine(rawLines[headerRowIdx + 1]).map(h => h.trim().toLowerCase());
      const hasSubHeaders = nextCols.some(c => /qty|quantity|rate|value|inward|outward|closing/i.test(c));
      if (hasSubHeaders) {
        header = header.map((h, idx) => {
          const sub = nextCols[idx] || '';
          return `${h} ${sub}`.trim();
        });
        headerRowIdx += 1;
      }
    }

    const skuIdx = header.findIndex(h => /^(sku|part\s*no|item\s*code|code)$/i.test(h) || (/sku/i.test(h) && !/desc/i.test(h)));
    const nameIdx = header.findIndex(h => /particulars|item\s*name|product\s*name|item\s*desc|item|product|description|name|material/i.test(h));

    if (nameIdx === -1 && skuIdx === -1) {
      return null;
    }

    const getCol = (cols: string[], pattern: RegExp) => {
      const idx = header.findIndex(h => pattern.test(h));
      return idx !== -1 && cols[idx] !== undefined ? cols[idx].trim() : '';
    };

    const parsedItems: any[] = [];
    for (let i = headerRowIdx + 1; i < rawLines.length; i++) {
      const cleanCols = parseLine(rawLines[i]);
      const rawName = (nameIdx !== -1 ? cleanCols[nameIdx] : cleanCols[skuIdx]) || '';
      const name = rawName.trim();

      // Skip empty rows, header repeats, or summary / total rows
      if (!name || /^(total|grand\s*total|sub\s*total|opening\s*balance|closing\s*balance|particulars)$/i.test(name)) {
        continue;
      }

      // Resolve or auto-generate SKU if file has no SKU column (like Tally StkGrpSum)
      let sku = skuIdx !== -1 ? (cleanCols[skuIdx] || '').trim() : '';
      if (!sku) {
        const slug = name
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .trim()
          .split(/\s+/)
          .slice(0, 3)
          .join('-')
          .toUpperCase();
        sku = slug ? `WLD-${slug}-${i}` : `WLD-ITEM-${1000 + i}`;
      }

      // Quantity resolution
      const rawQty = getCol(cleanCols, /closing.*(qty|quantity)|quantity|qty|current.*stock|stock.*qty|in.*stock|balance/i) || '0';
      const currentStock = cleanNumber(rawQty);

      // Price / Rate resolution
      const rawRate = getCol(cleanCols, /closing.*rate|rate|price.*inr|unit.*price|price|mrp|cost.*inr|cost/i) || '0';
      const unitPriceINR = cleanNumber(rawRate);

      // Unit resolution (PCS, NOS, KGS, MTR, etc.)
      let unit = getCol(cleanCols, /unit|uom|units/i);
      if (!unit) {
        const unitMatch = rawQty.match(/[0-9.,\s]+([a-zA-Z]+)$/);
        unit = unitMatch ? unitMatch[1].toUpperCase() : 'PCS';
      }

      parsedItems.push({
        sku,
        name,
        category: getCol(cleanCols, /category|group|stock\s*group|under|class/i) || 'MIG Consumables & Spares',
        hsnCode: getCol(cleanCols, /hsn|sac/i) || '85159000',
        unit: (unit || 'PCS').toUpperCase(),
        unitPriceINR: unitPriceINR,
        unitPriceUSD: parseFloat(getCol(cleanCols, /price.*usd|usd/i) || '0') || Number((unitPriceINR / 85).toFixed(2)),
        costPriceINR: cleanNumber(getCol(cleanCols, /cost.*inr|cost/i)) || Number((unitPriceINR * 0.7).toFixed(2)),
        gstRatePct: cleanNumber(getCol(cleanCols, /gst|tax/i)) || 18,
        currentStock: currentStock,
        minStockAlert: cleanNumber(getCol(cleanCols, /min.*alert|alert.*level|threshold|reorder/i)) || 10,
        isPublic: /true|yes|1|public/i.test(getCol(cleanCols, /is.*public|public|catalog/i)),
        warehouseLocation: getCol(cleanCols, /warehouse|location|rack|godown/i) || 'Jamnagar Plant Godown A - Rack B1',
        supplierName: getCol(cleanCols, /supplier|vendor|mfg/i) || 'Earth Metal Industries In-House',
        description: getCol(cleanCols, /desc|specification|note/i) || name
      });
    }

    return parsedItems;
  };

  // Parse and Bulk Import
  const handleProcessImport = () => {
    if (!importCsvText.trim()) {
      showNotification('Please paste CSV / Excel text or select a file first!', 'warning');
      return;
    }

    const items = parseDelimitedData(importCsvText);
    if (items === null) {
      showNotification('Could not detect product rows! Please ensure columns have "Name" or "Particulars".', 'warning');
      return;
    }

    if (items.length === 0) {
      showNotification('No valid items found in CSV/Excel data! Please check format.', 'warning');
      return;
    }

    bulkImportInventory(items);
    setIsImportModalOpen(false);
    setImportCsvText('');
    setImportParsedCount(null);
    showNotification(`🎉 Successfully imported ${items.length} inventory items!`, 'success');
  };

  // Read uploaded Excel (.xlsx, .xls, .ods) or CSV / TXT file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.ods') || 
                      file.type.includes('spreadsheet') || file.type.includes('excel');

      if (isExcel) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          showNotification('Excel workbook does not contain any sheets!', 'warning');
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert sheet to clean CSV text (no binary junk!)
        const csvText = XLSX.utils.sheet_to_csv(worksheet, { blankrows: false });
        setImportCsvText(csvText);
        
        const parsed = parseDelimitedData(csvText);
        setImportParsedCount(parsed ? parsed.length : 0);
        showNotification(`✅ Successfully loaded ${file.name} (${parsed ? parsed.length : 0} items detected)`, 'success');
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setImportCsvText(content);
          const parsed = parseDelimitedData(content);
          setImportParsedCount(parsed ? parsed.length : 0);
          showNotification(`✅ Loaded ${file.name} (${parsed ? parsed.length : 0} items detected)`, 'success');
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      console.error('Error reading inventory file:', err);
      showNotification(`Failed to read Excel/CSV file: ${err.message || 'Unknown format'}`, 'warning');
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white shadow-xs">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-mono tracking-tight">
                  Warehouse & Inventory Hub
                </h1>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  Live Stock Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized B2B catalog for internal spares, consumables, raw materials & website products. Auto-deducted on dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('CATALOG')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'CATALOG'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 text-orange-600" />
              <span>Stock Catalog</span>
            </button>
            <button
              onClick={() => setViewMode('REPORT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'REPORT'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Valuation & Audit Report</span>
            </button>
          </div>

          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all shadow-xs"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Stock Ledger Logs ({inventoryLogs.length})</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>Bulk CSV / Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {inventory.length > 0 && (
            <button
              type="button"
              onClick={() => setIsClearAllModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Empty entire inventory table and delete all items"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Clear All Stock ({inventory.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Product / Spare</span>
          </button>
        </div>
      </div>

      {/* Out of Stock & Low Stock Banner if any items trigger it */}
      {(metrics.outOfStock > 0 || metrics.lowStock > 0) && (
        <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border border-amber-300/80 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Inventory Threshold Notifications ({metrics.outOfStock + metrics.lowStock} Action Required)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {metrics.outOfStock > 0 && (
                  <span className="font-bold text-red-700 mr-3">
                    🔴 {metrics.outOfStock} items OUT OF STOCK (Cannot dispatch)
                  </span>
                )}
                {metrics.lowStock > 0 && (
                  <span className="font-semibold text-amber-800">
                    🟡 {metrics.lowStock} items at or below reorder threshold
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {metrics.outOfStock > 0 && (
              <button
                onClick={() => setActiveTab('OUT_OF_STOCK')}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-red-700 transition-all"
              >
                View Out of Stock ({metrics.outOfStock})
              </button>
            )}
            {metrics.lowStock > 0 && (
              <button
                onClick={() => setActiveTab('LOW_STOCK')}
                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-amber-700 transition-all"
              >
                View Low Stock ({metrics.lowStock})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Total SKUs */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total SKUs</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {metrics.totalItems}
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            {metrics.totalStockQty.toLocaleString('en-IN')} units in godown
          </span>
        </div>

        {/* Card 2: Total Valuation */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Stock Valuation</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            ₹{(metrics.totalValuationINR / 100000).toFixed(2)}L
          </p>
          <span className="text-[10px] text-slate-500 font-medium">
            ~${metrics.totalValuationUSD.toLocaleString('en-US')} USD
          </span>
        </div>

        {/* Card 3: In Stock */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider font-mono">In Stock</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900 font-mono mt-1">
            {metrics.inStock}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">
            Ready for instant dispatch
          </span>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className={`p-4 bg-white rounded-2xl border shadow-xs ${metrics.lowStock > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono">Low Stock Alert</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900 font-mono mt-1">
            {metrics.lowStock}
          </p>
          <span className="text-[10px] text-amber-700 font-medium">
            Under minimum threshold
          </span>
        </div>

        {/* Card 5: Out of Stock */}
        <div className={`p-4 bg-white rounded-2xl border shadow-xs ${metrics.outOfStock > 0 ? 'border-red-300 bg-red-50/40' : 'border-slate-200/80'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider font-mono">Out of Stock</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-900 font-mono mt-1">
            {metrics.outOfStock}
          </p>
          <span className="text-[10px] text-red-700 font-medium">
            0 units available in racks
          </span>
        </div>

        {/* Card 6: Internal B2B Spares */}
        <div className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-xs bg-indigo-50/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider font-mono">Internal Spares</span>
            <EyeOff className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-900 font-mono mt-1">
            {metrics.internalOnly}
          </p>
          <span className="text-[10px] text-indigo-700 font-medium">
            Hidden from public site
          </span>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Items ({metrics.totalItems})
          </button>

          <button
            onClick={() => setActiveTab('IN_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'IN_STOCK'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Stock ({metrics.inStock - metrics.lowStock})
          </button>

          <button
            onClick={() => setActiveTab('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'LOW_STOCK'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🟡 Low Stock Alert ({metrics.lowStock})
          </button>

          <button
            onClick={() => setActiveTab('OUT_OF_STOCK')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'OUT_OF_STOCK'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔴 Out of Stock ({metrics.outOfStock})
          </button>

          <button
            onClick={() => setActiveTab('INTERNAL_ONLY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'INTERNAL_ONLY'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔒 Internal Spares Only ({metrics.internalOnly})
          </button>

          <button
            onClick={() => setActiveTab('PUBLIC_ONLY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PUBLIC_ONLY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🌐 Public Website ({metrics.totalItems - metrics.internalOnly})
          </button>
        </div>

        {/* Search, Category & Sort Bar */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by SKU, Part Name, HSN code, Rack Location..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium text-slate-700"
            >
              <option value="All">All Categories ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-medium text-slate-700"
            >
              <option value="STOCK_LOW">Stock: Lowest First (Urgent)</option>
              <option value="STOCK_HIGH">Stock: Highest First</option>
              <option value="VALUE_HIGH">Highest Total Valuation</option>
              <option value="SKU">Sort by SKU Code</option>
              <option value="NAME">Sort by Product Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW MODE 1: CATALOG & LIVE LEDGER TABLE                  */}
      {/* ========================================================= */}
      {viewMode === 'CATALOG' ? (
        <div className="space-y-3">
          {/* Batch Actions Bar for selected rows */}
          {selectedItemIds.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-red-50/90 border border-red-200 rounded-2xl animate-in fade-in duration-150">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-red-100 text-red-700 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-bold text-red-950 font-mono">
                    {selectedItemIds.length} of {filteredItems.length} items selected
                  </span>
                  <p className="text-[11px] text-red-700">Delete only these checked products from inventory</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemIds([])}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Deselect All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedItemIds.length} selected items?`)) {
                      bulkDeleteInventory(selectedItemIds);
                      setSelectedItemIds([]);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected ({selectedItemIds.length})</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && selectedItemIds.length === filteredItems.length}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedItemIds(filteredItems.map(i => i.id));
                        } else {
                          setSelectedItemIds([]);
                        }
                      }}
                      className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Item & SKU Code</th>
                  <th className="py-3.5 px-3">Category & HSN</th>
                  <th className="py-3.5 px-3">Unit Price (₹ / $)</th>
                  <th className="py-3.5 px-4 text-center">In-Hand Stock Level</th>
                  <th className="py-3.5 px-3">Godown Rack</th>
                  <th className="py-3.5 px-3">Total Value</th>
                  <th className="py-3.5 px-4 text-right">Quick Stock Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Boxes className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-700">No inventory products found</p>
                      <p className="text-xs text-slate-500 mt-0.5">Try adjusting your filters or search query</p>
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const isOutOfStock = item.currentStock <= 0;
                    const isLowStock = !isOutOfStock && item.currentStock <= item.minStockAlert;
                    const totalValuationINR = item.currentStock * item.unitPriceINR;
                    const isSelected = selectedItemIds.includes(item.id);

                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? 'bg-orange-50/40' : isOutOfStock ? 'bg-red-50/20' : isLowStock ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedItemIds(prev => [...prev, item.id]);
                              } else {
                                setSelectedItemIds(prev => prev.filter(id => id !== item.id));
                              }
                            }}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>

                        {/* SKU & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              isOutOfStock 
                                ? 'bg-red-100 text-red-700' 
                                : isLowStock 
                                  ? 'bg-amber-100 text-amber-700' 
                                  : 'bg-slate-100 text-slate-700'
                            }`}>
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                                  {item.sku}
                                </span>

                                {item.isPublic ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                    <Eye className="w-3 h-3" /> Public Catalog
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                                    <EyeOff className="w-3 h-3" /> Internal B2B Spares
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-bold text-slate-900 mt-1 max-w-sm">
                                {item.name}
                              </p>

                              {item.description && (
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & HSN */}
                        <td className="py-3.5 px-3">
                          <p className="text-xs font-semibold text-slate-800">{item.category}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                            <span>HSN: {item.hsnCode || '85159000'}</span>
                            <span>•</span>
                            <span>GST {item.gstRatePct}%</span>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-3.5 px-3">
                          <p className="text-xs font-bold text-slate-900 font-mono">
                            ₹{item.unitPriceINR.toLocaleString('en-IN')} <span className="text-[10px] font-normal text-slate-500">/{item.unit}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            ${item.unitPriceUSD.toFixed(2)} USD
                          </p>
                        </td>

                        {/* In-Hand Stock Level */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                                OUT OF STOCK
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                                LOW STOCK ALERT
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                In Stock
                              </span>
                            )}

                            <p className="text-sm font-mono font-extrabold text-slate-900 mt-1">
                              {item.currentStock.toLocaleString('en-IN')} <span className="text-[10px] font-bold text-slate-500">{item.unit}</span>
                            </p>

                            <p className="text-[10px] text-slate-500 font-mono">
                              Alert threshold: &le; {item.minStockAlert} {item.unit}
                            </p>
                          </div>
                        </td>

                        {/* Warehouse Location */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1 text-slate-700">
                            <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-xs truncate max-w-[140px]" title={item.warehouseLocation || 'Jamnagar Central'}>
                              {item.warehouseLocation || 'Jamnagar Central'}
                            </span>
                          </div>
                          {item.supplierName && (
                            <p className="text-[10.5px] text-slate-500 truncate max-w-[140px] mt-0.5">
                              Mfg: {item.supplierName}
                            </p>
                          )}
                        </td>

                        {/* Total Valuation */}
                        <td className="py-3.5 px-3">
                          <p className="text-xs font-mono font-bold text-slate-900">
                            ₹{totalValuationINR.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            ${(item.currentStock * item.unitPriceUSD).toFixed(1)} USD
                          </p>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenAdjust(item, 'INWARD')}
                              title="+ Inward Stock"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenAdjust(item, 'ADJUSTMENT_DAMAGE')}
                              title="Adjust / Outward Stock"
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
                            >
                              <ArrowDownRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleOpenEditModal(item)}
                              title="Edit Item Details"
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setDeleteItemTarget(item)}
                              title="Delete Item"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ) : (
        /* ========================================================= */
        /* VIEW MODE 2: STOCK VALUATION & AUDIT REPORT               */
        /* ========================================================= */
        <div className="space-y-6">
          {/* Report Header Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl shadow-lg border border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500 text-white uppercase tracking-wider">
                    Official Godown Audit Report
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white font-mono mt-1 tracking-tight">
                  Inventory Valuation & Godown Health Summary
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Complete statutory audit of in-hand materials, godown asset valuation, cost margin & shortage requisition.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report CSV</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Print Audit Slip</span>
                </button>
              </div>
            </div>

            {/* Financial Health Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">Total Godown Asset Value</p>
                <p className="text-xl font-black text-amber-400 font-mono mt-1">₹{metrics.totalValuationINR.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">${metrics.totalValuationUSD.toLocaleString('en-US', { maximumFractionDigits: 1 })} USD</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">Estimated Cost Valuation</p>
                <p className="text-xl font-black text-slate-200 font-mono mt-1">₹{metrics.totalCostValuationINR.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5 font-bold">Est. Margin: ₹{metrics.estimatedGodownProfitINR.toLocaleString('en-IN')}</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">Physical Units in Racks</p>
                <p className="text-xl font-black text-white font-mono mt-1">{metrics.totalStockQty.toLocaleString('en-IN')} units</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">Across {metrics.totalItems} unique SKUs</p>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <p className="text-[11px] font-mono text-slate-400 uppercase font-bold">Stock Reorder Status</p>
                <p className="text-xl font-black text-rose-400 font-mono mt-1">{criticalShortageItems.length} Shortages</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{metrics.outOfStock} Zero Stock • {metrics.lowStock} Below Alert</p>
              </div>
            </div>
          </div>

          {/* Category Valuation Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">Category-wise Asset Valuation & Stock Share</h3>
                <p className="text-xs text-slate-500">Distribution of capital tied up across product categories</p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">{categoryReport.length} Active Categories</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/60 text-slate-600 font-bold border-b border-slate-200 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Category Name</th>
                    <th className="py-3 px-3 text-center">SKU Count</th>
                    <th className="py-3 px-3 text-right">Physical Stock Units</th>
                    <th className="py-3 px-3 text-right">Asset Valuation (INR)</th>
                    <th className="py-3 px-3 text-right">Asset Valuation (USD)</th>
                    <th className="py-3 px-3 text-center">Health Status</th>
                    <th className="py-3 px-4 text-center">Share of Godown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium font-mono">
                  {categoryReport.map(cat => {
                    const sharePct = metrics.totalValuationINR > 0 
                      ? Math.round((cat.valuationINR / metrics.totalValuationINR) * 100) 
                      : 0;

                    return (
                      <tr key={cat.category} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-sans font-bold text-slate-900">{cat.category}</td>
                        <td className="py-3 px-3 text-center">{cat.count} SKUs</td>
                        <td className="py-3 px-3 text-right font-bold">{cat.totalStock.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-right font-bold text-slate-900">₹{cat.valuationINR.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-right text-slate-600">${cat.valuationUSD.toFixed(1)}</td>
                        <td className="py-3 px-3 text-center">
                          {cat.outOfStockCount > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                              {cat.outOfStockCount} Out of Stock
                            </span>
                          ) : cat.lowStockCount > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              {cat.lowStockCount} Low Alert
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(100, sharePct)}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold w-8">{sharePct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Urgent Shortage & Restock Requisition */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-red-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-red-950 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Critical Restock & Shortage Requisition List</span>
                </h3>
                <p className="text-xs text-red-700">Items requiring immediate purchase order or factory production batch</p>
              </div>
              <span className="text-xs font-mono font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                {criticalShortageItems.length} Products Need Restock
              </span>
            </div>

            {criticalShortageItems.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">All godown stocks are above alert thresholds!</p>
                <p className="text-xs text-slate-500">No urgent purchasing or inward batch required at this moment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-center">In-Hand Stock</th>
                      <th className="py-3 px-3 text-center">Alert Level</th>
                      <th className="py-3 px-3 text-center">Deficit Qty</th>
                      <th className="py-3 px-3">Preferred Supplier</th>
                      <th className="py-3 px-3 text-right">Est. Restock Cost</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {criticalShortageItems.map(item => {
                      const deficit = Math.max(item.minStockAlert * 2 - item.currentStock, 10);
                      const estCost = deficit * (item.costPriceINR || item.unitPriceINR * 0.6);

                      return (
                        <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                          <td className="py-3 px-4 font-sans">
                            <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1.5">
                              {item.sku}
                            </span>
                            <span className="font-bold text-slate-900">{item.name}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-sans">{item.category}</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              item.currentStock <= 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                            }`}>
                              {item.currentStock} {item.unit}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center text-slate-600">&le; {item.minStockAlert} {item.unit}</td>
                          <td className="py-3 px-3 text-center font-bold text-red-600">+{deficit} {item.unit}</td>
                          <td className="py-3 px-3 text-slate-600 font-sans">{item.supplierName || 'Earth Metal In-House'}</td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">₹{Math.round(estCost).toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setItemForAdjustment(item);
                                setAdjustType('INWARD');
                                setAdjustQty(deficit);
                                setAdjustReason('Shortage replenishment restock');
                                setAdjustRef(`PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
                                setIsAdjustModalOpen(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all"
                            >
                              + Inward Stock
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bulk Selection Action Bar */}
      {selectedItemIds.length > 0 && viewMode === 'CATALOG' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in slide-in-from-bottom duration-200">
          <span className="text-xs font-mono font-bold text-amber-400">
            {selectedItemIds.length} item{selectedItemIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="h-4 w-px bg-slate-700" />
          <button
            onClick={() => setIsBulkDeleteModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Selected ({selectedItemIds.length})</span>
          </button>
          <button
            onClick={() => setSelectedItemIds([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SINGLE ITEM DELETE CONFIRMATION                    */}
      {/* ========================================================= */}
      {deleteItemTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-red-50 border-b border-red-100 flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-950 font-mono">Delete Inventory Item</h3>
                <p className="text-xs text-red-700 mt-0.5">Are you sure you want to permanently remove this product from the warehouse ledger?</p>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-mono text-[11px] font-bold text-slate-500">SKU: {deleteItemTarget.sku}</p>
                <p className="font-bold text-slate-900 text-sm">{deleteItemTarget.name}</p>
                <div className="flex items-center gap-2 text-slate-600 text-[11px] pt-1">
                  <span>Category: {deleteItemTarget.category}</span>
                  <span>•</span>
                  <span>Stock: {deleteItemTarget.currentStock} {deleteItemTarget.unit}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500">
                ⚠️ Warning: Deleting this item will remove it from all warehouse calculations, quotations, and invoice suggestions.
              </p>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteItemTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteInventoryItem(deleteItemTarget.id);
                    setDeleteItemTarget(null);
                    setSelectedItemIds(prev => prev.filter(id => id !== deleteItemTarget.id));
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all"
                >
                  Yes, Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BULK DELETE CONFIRMATION                           */}
      {/* ========================================================= */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-red-50 border-b border-red-100 flex items-start gap-3">
              <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-xs shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-950 font-mono">Bulk Delete Products</h3>
                <p className="text-xs text-red-700 mt-0.5">You are about to delete {selectedItemIds.length} selected items permanently.</p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-700">
                This will delete all <strong>{selectedItemIds.length}</strong> selected products and their associated stock entries from the godown ledger.
              </p>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    selectedItemIds.forEach(id => deleteInventoryItem(id));
                    setSelectedItemIds([]);
                    setIsBulkDeleteModalOpen(false);
                    showNotification(`Deleted ${selectedItemIds.length} products from inventory!`, 'success');
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all"
                >
                  Delete {selectedItemIds.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT INVENTORY ITEM                        */}
      {/* ========================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-orange-500 text-white rounded-xl shadow-xs">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-mono">
                    {editingItem ? 'Edit Inventory Item' : 'Add New Product / Internal Spare'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Precision stock item for quotations, invoices, dispatch & godown audits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Internal B2B vs Public Catalog Toggle */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    {formData.isPublic ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4 text-indigo-600" />}
                    <h4 className="text-xs font-bold text-slate-900">
                      {formData.isPublic ? 'Public Website Product' : 'Private B2B / Internal Spares Only (Recommended)'}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {formData.isPublic 
                      ? 'Visible to public buyers on website catalog, and usable in CRM.'
                      : 'Hidden from public website. Strictly available for internal CRM Quotation, Invoice, and Godown Stock tracking.'}
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* SKU & Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Part Code / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="e.g. WLD-TIP-1.2"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono font-bold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Product / Spare Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. MIG Contact Tip 1.2mm CuCrZr Heavy-Duty"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Category & HSN Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. MIG Consumables"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    HSN / Tariff Code
                  </label>
                  <input
                    type="text"
                    value={formData.hsnCode}
                    onChange={e => setFormData({ ...formData, hsnCode: e.target.value })}
                    placeholder="e.g. 85159000"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Unit of Measure
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value as InventoryUnit })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="MTR">MTR (Meters)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="SET">SET (Sets)</option>
                    <option value="ROLL">ROLL (Rolls)</option>
                    <option value="PACK">PACK (Packs)</option>
                  </select>
                </div>
              </div>

              {/* Pricing & GST */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Selling Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPriceINR}
                    onChange={e => {
                      const inr = parseFloat(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        unitPriceINR: inr,
                        unitPriceUSD: Math.round((inr / 85) * 100) / 100
                      });
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Export Price ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPriceUSD}
                    onChange={e => setFormData({ ...formData, unitPriceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    Purchase/Mfg Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPriceINR || 0}
                    onChange={e => setFormData({ ...formData, costPriceINR: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono mb-1">
                    GST Rate %
                  </label>
                  <select
                    value={formData.gstRatePct}
                    onChange={e => setFormData({ ...formData, gstRatePct: parseInt(e.target.value) || 18 })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 font-bold"
                  >
                    <option value="18">18% Standard GST</option>
                    <option value="12">12% Concessional GST</option>
                    <option value="5">5% Essential GST</option>
                    <option value="28">28% High GST</option>
                    <option value="0">0% Exempt</option>
                  </select>
                </div>
              </div>

              {/* Stock Levels & Alert Thresholds */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 bg-amber-50/40 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 uppercase font-mono mb-1">
                    Current In-Hand Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-black text-slate-900"
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    Setting to 0 will instantly trigger the 🔴 "Out of Stock" alert badge.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-900 uppercase font-mono mb-1">
                    Low Stock Reorder Alert Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.minStockAlert}
                    onChange={e => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono font-bold text-amber-950"
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    When stock drops &le; this level, system triggers 🟡 "Low Stock" badge.
                  </p>
                </div>
              </div>

              {/* Godown Location & Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Warehouse Godown Location / Rack
                  </label>
                  <input
                    type="text"
                    value={formData.warehouseLocation || ''}
                    onChange={e => setFormData({ ...formData, warehouseLocation: e.target.value })}
                    placeholder="e.g. Jamnagar Godown 1 - Rack B04"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                    Manufacturer / Supplier Dept
                  </label>
                  <input
                    type="text"
                    value={formData.supplierName || ''}
                    onChange={e => setFormData({ ...formData, supplierName: e.target.value })}
                    placeholder="e.g. Earth Metal CNC Brass Bay"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Technical Specifications / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Material grade, threading, torch compatibility, application notes..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-xs transition-all"
                >
                  {editingItem ? 'Save Updates' : 'Add Item to Inventory'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INWARD / ADJUST STOCK                            */}
      {/* ========================================================= */}
      {isAdjustModalOpen && itemForAdjustment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl text-white shadow-xs ${
                  adjustType === 'INWARD' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}>
                  {adjustType === 'INWARD' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">
                    {adjustType === 'INWARD' ? 'Stock Inward (Purchase/Mfg)' : 'Stock Adjustment / Outward'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {itemForAdjustment.sku}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="p-5 space-y-4">
              
              {/* Product Info Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-900">{itemForAdjustment.name}</p>
                <div className="flex items-center justify-between text-xs font-mono mt-1 text-slate-600">
                  <span>Current Balance: <strong>{itemForAdjustment.currentStock} {itemForAdjustment.unit}</strong></span>
                  <span>Alert Level: &le; {itemForAdjustment.minStockAlert}</span>
                </div>
              </div>

              {/* Inward vs Outward selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Movement Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('INWARD')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      adjustType === 'INWARD'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    + Stock Inward
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('ADJUSTMENT_DAMAGE')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      adjustType !== 'INWARD'
                        ? 'bg-amber-50 text-amber-800 border-amber-400 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    - Deduct / Audit
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Quantity ({itemForAdjustment.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={e => setAdjustQty(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-base font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Resulting Balance Projection */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-semibold">New Stock Balance:</span>
                <span className={`text-sm font-black ${
                  (adjustType === 'INWARD' ? itemForAdjustment.currentStock + adjustQty : itemForAdjustment.currentStock - adjustQty) <= 0
                    ? 'text-red-600'
                    : 'text-emerald-700'
                }`}>
                  {Math.max(0, adjustType === 'INWARD' 
                    ? itemForAdjustment.currentStock + adjustQty 
                    : itemForAdjustment.currentStock - adjustQty
                  )} {itemForAdjustment.unit}
                </span>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  Reason / Notes
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  placeholder="e.g. GRN from Foundry / Audit scrap write-off"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* PO or Batch Ref */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono mb-1">
                  PO / Batch / Invoice Reference
                </label>
                <input
                  type="text"
                  value={adjustRef}
                  onChange={e => setAdjustRef(e.target.value)}
                  placeholder="e.g. PO-2026-904"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all ${
                    adjustType === 'INWARD'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  Record Stock {adjustType === 'INWARD' ? 'Inward' : 'Deduction'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: BULK IMPORT (CSV / EXCEL)                        */}
      {/* ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">
                    Bulk Import Inventory (CSV / Excel)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Upload or paste comma-separated stock data with SKU, Name, Quantity & Pricing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Template Download Help & Auto-Fill Demo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs">
                <div>
                  <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>Need standard columns?</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold">CSV / Excel Format</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">Download our verified master template or load demo rows immediately.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleData = `sku,name,category,hsnCode,unit,unitPriceINR,unitPriceUSD,costPriceINR,gstRatePct,currentStock,minStockAlert,isPublic,warehouseLocation,supplierName,description
WLD-TIP-1.0-M6,MIG Contact Tip 1.0mm CuCrZr M6,MIG Consumables & Spares,85159000,PCS,45,0.55,25,18,500,100,FALSE,Jamnagar Godown A - Rack B12,Earth Metal Industries,Heavy-duty copper contact tip
WLD-NOZ-250A,MIG Gas Nozzle 250A Conical,MIG Consumables & Spares,85159000,PCS,180,2.15,110,18,40,15,FALSE,Jamnagar Godown A - Bin C02,Earth Metal Industries,Shielding gas nozzle
WLD-VALV-12V,Direct Solenoid Valve 12V 1/8",Pneumatic Automation Valves,84818030,PCS,1250,15.00,800,18,12,5,FALSE,Automation Rack E1,Earth Pneumatics,Compact solenoid valve
WLD-FT-8MM,Brass Push-In Male 8mm x 1/8",Brass Pneumatic Fittings,74122019,PCS,58,0.70,32,18,1200,200,TRUE,Brass Yard Bay 2,Earth Metal Jamnagar,Brass pneumatic connector`;
                      setImportCsvText(sampleData);
                      setImportParsedCount(4);
                      showNotification('✅ 4 sample demo inventory products loaded into box! Click "Process & Import Items" to test.', 'info');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>⚡ Fill Demo Rows</span>
                  </button>

                  {/* Native Microsoft Excel Template Download */}
                  <button
                    type="button"
                    onClick={handleDownloadSampleExcel}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                    title="Download genuine Microsoft Excel spreadsheet template"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel (.XLS)</span>
                  </button>

                  {/* Standard CSV Template Download */}
                  <button
                    type="button"
                    onClick={handleDownloadSampleCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
                    title="Download standard CSV format template"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV (.CSV)</span>
                  </button>
                </div>
              </div>

              {/* File Upload Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase font-mono">
                    Upload Excel (.xlsx, .xls) or CSV File
                  </label>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                    Auto-detects Tally & Excel sheets
                  </span>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.tsv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                />
                <p className="text-[10.5px] text-slate-500 mt-1">
                  Supports native Excel (.xlsx / .xls), Tally Stock Group Summary exports, and comma/tab-separated CSV.
                </p>
              </div>

              {/* Raw CSV Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase font-mono">
                    Or Paste CSV Data Directly
                  </label>
                  {importParsedCount !== null && (
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      {importParsedCount} rows detected
                    </span>
                  )}
                </div>
                <textarea
                  rows={6}
                  value={importCsvText}
                  onChange={e => {
                    setImportCsvText(e.target.value);
                    const lines = e.target.value.trim().split(/\r?\n/);
                    setImportParsedCount(Math.max(0, lines.length - 1));
                  }}
                  placeholder="sku,name,category,hsnCode,unit,unitPriceINR,unitPriceUSD,currentStock,minStockAlert,isPublic&#10;WLD-TIP-1.2,MIG Contact Tip 1.2mm,MIG Consumables,85159000,PCS,48,0.60,100,20,FALSE"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 rounded-xl shadow-xs"
                >
                  Process & Import Items
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DRAWER: STOCK MOVEMENT AUDIT LOGS                         */}
      {/* ========================================================= */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-800 text-white rounded-xl shadow-xs">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">
                    Stock Ledger & Dispatch Logs
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Audit trail of inward, dispatch deduction & physical audits
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {inventoryLogs.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-700">No stock movement logs recorded yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">Logs appear automatically on stock inward or order dispatch</p>
                </div>
              ) : (
                inventoryLogs.map(log => {
                  const targetItem = inventory.find(i => i.id === log.itemId);
                  const isPositive = log.deltaQuantity > 0;

                  return (
                    <div 
                      key={log.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            log.changeType === 'INWARD'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : log.changeType === 'DISPATCH'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {log.changeType}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {targetItem?.sku || 'UNKNOWN-SKU'}
                          </span>
                        </div>

                        <span className={`text-sm font-mono font-black ${
                          isPositive ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {isPositive ? `+${log.deltaQuantity}` : log.deltaQuantity}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-800">
                        {targetItem?.name || 'Inventory Product'}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
                        <span>Reason: {log.reason} {log.referenceNumber ? `(${log.referenceNumber})` : ''}</span>
                        <span>Bal: {log.remainingStock}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>By: {log.performedBy}</span>
                        <span>{new Date(log.timestamp).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CONFIRM CLEAR ALL STOCK INVENTORY               */}
      {/* ========================================================= */}
      {isClearAllModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-red-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  DANGER ZONE • पूरा स्टॉक डिलीट
                </span>
                <h3 className="text-base font-black text-slate-900 font-heading">
                  Clear Entire Inventory Stock?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Are you sure you want to delete <strong>all {inventory.length} items</strong> from the stock catalog? This will completely empty your inventory table.
                </p>
                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3 text-left space-y-1">
                  <p className="font-bold flex items-center gap-1 text-amber-900">
                    <Info className="w-3.5 h-3.5" />
                    <span>Quick Recovery:</span>
                  </p>
                  <p>You can re-import your inventory anytime using the <strong>Bulk CSV / Excel</strong> button.</p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsClearAllModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAllInventory();
                    setSelectedItemIds([]);
                    setIsClearAllModalOpen(false);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete & Clear All ({inventory.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: CONFIRM SINGLE ITEM DELETE                       */}
      {/* ========================================================= */}
      {deleteItemTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono">
                  Delete Inventory Item?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Are you sure you want to remove <strong>"{deleteItemTarget.name}"</strong>?
                </p>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  SKU: <span className="font-bold text-slate-800">{deleteItemTarget.sku}</span> | In Stock: {deleteItemTarget.currentStock} {deleteItemTarget.unit}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteItemTarget(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteInventoryItem(deleteItemTarget.id);
                    setSelectedItemIds(prev => prev.filter(id => id !== deleteItemTarget.id));
                    setDeleteItemTarget(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
