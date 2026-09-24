import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

const API = 'http://localhost:5000/api';

async function post(endpoint, data) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function put(endpoint, data) {
  const res = await fetch(`${API}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await res.json();
}

async function cleanAll() {
  console.log('🧹 Clearing all collections in server/data directory...');
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
    'employees',
    'payrolls',
    'attendance',
    'leaves',
    'audit_logs'
  ];

  for (const col of collections) {
    fs.writeFileSync(path.join(DATA_DIR, `${col}.json`), JSON.stringify([], null, 2), 'utf-8');
  }

  // Blank settings
  fs.writeFileSync(path.join(DATA_DIR, 'settings.json'), JSON.stringify({}, null, 2), 'utf-8');
  console.log('✅ Clean complete. All database files reset to empty.');
}

async function main() {
  await cleanAll();

  console.log('\n🚀 Populating realistic manufacturing platform data step-by-step...\n');

  // 1. Company Settings
  console.log('1️⃣ Setting Up Company Profile & Industrial Settings...');
  await put('/settings/company', {
    companyName: 'Weldor Industries Pvt. Ltd.',
    brandName: 'WELDOR PRECISION',
    legalName: 'Weldor Industries Private Limited',
    cinNumber: 'U29253GJ2012PTC071234',
    gstin: '24AAACW4921K1ZX',
    panNumber: 'AAACW4921K',
    iecCode: '0812049281',
    msmeRegistrationNo: 'UDYAM-GJ-20-0089214',
    registeredOfficeAddress: {
      addressLine1: 'Plot No. 12/B, Phase II, GIDC Industrial Estate',
      addressLine2: 'Metoda, Lodhika Industrial Corridor',
      city: 'Rajkot',
      state: 'Gujarat',
      country: 'India',
      pincode: '360021',
    },
    primaryEmail: 'info@weldorindustries.com',
    primaryPhone: '+91 2827 287100',
    websiteUrl: 'https://weldorindustries.com',
    primaryBank: {
      bankName: 'State Bank of India',
      accountName: 'Weldor Industries Pvt. Ltd. - Industrial Current Account',
      accountNumber: '304918239012',
      ifscCode: 'SBIN0003821',
      branch: 'GIDC Metoda Branch, Rajkot',
    },
    slaSettings: {
      leadResponseHours: 2,
      quoteApprovalThresholdUSD: 50000,
      autoAssignSalesLead: true,
      enableWhatsAppNotifications: true,
      enablePayrollReminderDays: 5,
    },
  });

  // 2. Categories
  console.log('2️⃣ Adding Product Categories...');
  const cat1 = await post('/categories', {
    name: 'Precision Pneumatic Cylinders',
    slug: 'pneumatic-cylinders',
    description: 'ISO 15552 & ISO 6432 standard heavy-duty pneumatic cylinders with hard chrome-plated piston rods and polyurethane sealing for high-velocity industrial cycles.',
    iconName: 'Wind',
    productCount: 24,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['ISO 15552 Standard Cylinders', 'Compact ISO 21287 Cylinders', 'Miniature ISO 6432 Cylinders', 'Guided Slide Cylinders'],
    seoKeywords: ['pneumatic cylinder manufacturer rajkot', 'iso 15552 cylinder india', 'double acting air cylinder'],
    seoMetaTitle: 'Precision ISO Pneumatic Cylinders Manufacturer | Weldor Industries',
    seoMetaDescription: 'High performance ISO pneumatic cylinders with polyurethane seals and hard chrome plated piston rods.'
  });

  const cat2 = await post('/categories', {
    name: 'Directional Control Valves',
    slug: 'directional-control-valves',
    description: 'High-frequency 5/2, 5/3, and 3/2 solenoid valves with IP65 encapsulated coils, NAMUR mountings, and CNC-machined aluminum manifold sub-bases.',
    iconName: 'Sliders',
    productCount: 32,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['5/2 Way Solenoid Valves', '5/3 Center Closed Valves', 'NAMUR Standard Actuator Valves', 'Manifold Sub-base Systems'],
    seoKeywords: ['solenoid valve rajkot', '5 2 way valve manufacturer', 'pneumatic manifold valve'],
    seoMetaTitle: 'Industrial Pneumatic Solenoid Valves | Weldor Industries',
    seoMetaDescription: 'Precision 5/2 and 5/3 pneumatic solenoid valves designed for harsh manufacturing environments.'
  });

  const cat3 = await post('/categories', {
    name: 'High-Pressure Hydraulic Actuators',
    slug: 'hydraulic-actuators',
    description: 'Heavy-duty 350-Bar & 700-Bar hydraulic tie-rod cylinders, rotary torque actuators, and precision fluid power components with zero-leakage seals.',
    iconName: 'Droplets',
    productCount: 18,
    featured: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['350-Bar Tie-Rod Cylinders', 'Mill Type Heavy Cylinders', 'Rotary Hydraulic Actuators'],
    seoKeywords: ['hydraulic cylinder rajkot', '350 bar hydraulic actuator', 'heavy duty cylinder'],
    seoMetaTitle: 'Heavy-Duty High Pressure Hydraulic Cylinders | Weldor Industries',
    seoMetaDescription: 'Industrial 350-bar tie-rod hydraulic cylinders with precision honed tubes.'
  });

  const cat4 = await post('/categories', {
    name: 'Brass Quick Connect Fittings & Couplers',
    slug: 'fittings-couplers',
    description: 'CNC turned brass and stainless steel push-in fittings, one-touch pneumatic connectors, and quick-release high-pressure fluid couplings.',
    iconName: 'Layers',
    productCount: 45,
    featured: false,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    subCategories: ['Push-in Brass Fittings', 'Quick Disconnect Couplers', 'Flow Control Throttle Valves'],
    seoKeywords: ['pneumatic brass fitting rajkot', 'push in coupler india', 'one touch tube connector'],
    seoMetaTitle: 'Precision Brass Pneumatic Couplers & Fittings | Weldor Industries',
    seoMetaDescription: 'Corrosion resistant nickel plated brass push-in fittings and quick connect fluid couplers.'
  });

  // 3. Products
  console.log('3️⃣ Adding Industrial Catalog Products...');
  const prod1 = await post('/products', {
    sku: 'WLD-CYL-ISO15552-80X200',
    name: 'ISO 15552 Standard Double-Acting Pneumatic Cylinder (Ø80 x 200mm)',
    category: 'Precision Pneumatic Cylinders',
    categoryId: cat1.id,
    brand: 'WELDOR PRECISION',
    modelNumber: 'WLD-15552-80-200',
    tagline: 'Heavy-duty industrial air cylinder with adjustable end-position cushioning.',
    description: 'Engineered in accordance with ISO 15552 international standards. Features hard chrome plated steel piston rod, high-tensile extruded aluminum body, and self-lubricating polyurethane seals for over 5 million trouble-free cycles.',
    bulletPoints: [
      'Bore: Ø80 mm | Stroke: 200 mm | Working Pressure: 1.5 to 10 Bar',
      'Hard chrome plated C45 carbon steel piston rod with rolled threads',
      'Adjustable pneumatic cushioning on both ends for shock absorption',
      'Integrated magnetic piston for non-contact reed switch sensing',
      'Operating temperature: -20°C to +80°C with standard NBR/PU seals'
    ],
    industries: ['Heavy Engineering', 'Automotive Assembly', 'Packaging Machinery', 'Robotic Handling'],
    applications: ['Press Line Clamping', 'Pick & Place Transfer', 'Conveyor Sorting'],
    materials: ['Extruded Aluminum Alloy 6063-T6', 'C45 Hard Chrome Plated Steel', 'Polyurethane Sealing'],
    specifications: [
      { label: 'Bore Size', value: '80', unit: 'mm', category: 'Dimensions' },
      { label: 'Stroke Length', value: '200', unit: 'mm', category: 'Dimensions' },
      { label: 'Operating Pressure', value: '1.5 - 10', unit: 'Bar', category: 'Operating Parameters' },
      { label: 'Proof Pressure', value: '15', unit: 'Bar', category: 'Operating Parameters' },
      { label: 'Port Size', value: 'G 3/8"', category: 'Connection' },
      { label: 'Cushioning', value: 'Adjustable on both ends (24mm length)', category: 'Features' }
    ],
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    priceUSD: 85,
    priceINR: 7140,
    certifications: ['ISO 9001:2015', 'CE Certified', 'RoHS Compliant'],
    minOrderQty: 5,
    standardLeadTimeDays: 7,
    inStock: true,
    seoKeywords: ['iso 15552 cylinder 80mm', 'pneumatic cylinder 80x200', 'air cylinder supplier rajkot'],
  });

  const prod2 = await post('/products', {
    sku: 'WLD-VLV-52-G14-24VDC',
    name: '5/2 Way High-Frequency Pneumatic Solenoid Valve (G 1/4", 24V DC)',
    category: 'Directional Control Valves',
    categoryId: cat2.id,
    brand: 'WELDOR PRECISION',
    modelNumber: 'WLD-52-G14-D24',
    tagline: 'High-speed pilot-operated directional spool valve with manual override.',
    description: 'Designed for high-frequency switching operations up to 5 cycles/sec. Features IP65 epoxy resin encapsulated solenoid coil with LED indicator, low power consumption (3W), and CNC precision-lapped aluminum spool.',
    bulletPoints: [
      'Configuration: 5 Ports / 2 Positions | Port Size: G 1/4" BSPP',
      'Coil Voltage: 24V DC (Optional 220V AC) | Power: 3.0 Watts',
      'Response Time: < 20 ms | Max Operating Frequency: 5 Hz',
      'Manual override with lockable push-turn slot for commissioning',
      'Corrosion resistant anodized black aluminum casing'
    ],
    industries: ['Automotive Lines', 'CNC Tool Changers', 'Textile Machinery', 'Pharma Packaging'],
    applications: ['Actuator Direction Control', 'Automated Clamping', 'Air Ejection'],
    materials: ['Die-Cast Aluminum ADC12', 'HNBR Spool Seals', 'Copper Enamelled Coil'],
    specifications: [
      { label: 'Port Size', value: 'G 1/4"', category: 'Connection' },
      { label: 'Flow Rate (Cv)', value: '1.4 (1400 L/min)', unit: 'L/min', category: 'Flow' },
      { label: 'Pressure Range', value: '1.5 - 8.0', unit: 'Bar', category: 'Operating Parameters' },
      { label: 'Coil Voltage', value: '24V DC', category: 'Electrical' },
      { label: 'Protection Class', value: 'IP65 with DIN 43650 Connector', category: 'Electrical' }
    ],
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
    ],
    priceUSD: 22,
    priceINR: 1848,
    certifications: ['CE Certified', 'IP65', 'RoHS'],
    minOrderQty: 10,
    standardLeadTimeDays: 3,
    inStock: true,
    seoKeywords: ['5 2 way solenoid valve 24vdc', 'pneumatic valve rajkot', 'g 1 4 solenoid valve'],
  });

  const prod3 = await post('/products', {
    sku: 'WLD-ENG-HYD-350BAR-CUSTOM',
    name: 'Custom 350-Bar Heavy Duty Tie-Rod Hydraulic Cylinder (Ø100 x 400mm)',
    category: 'High-Pressure Hydraulic Actuators',
    categoryId: cat3.id,
    brand: 'WELDOR PRECISION',
    modelNumber: 'WLD-HYD-350B-100-400',
    tagline: 'Engineered for extreme shock loads and continuous high-pressure industrial duty.',
    description: 'Built with micro-honed ST52 cold drawn steel tubes (Ra < 0.2 µm) and induction hardened, hard chrome plated 42CrMo4 steel rod. Equipped with Hallite/Parker multi-lip Chevron packing for zero leakage under 350 Bar peak pressure.',
    bulletPoints: [
      'Operating Pressure: 350 Bar (5000 PSI) | Test Proof: 525 Bar',
      'Induction hardened 42CrMo4 piston rod with 30 µm hard chrome plating',
      'Seamless cold-drawn ST52 steel barrel honed to Ra 0.2 µm finish',
      'Dual port SAE Flange / G 1/2" with integrated counterbalance safety valve option',
      'Suitable for heavy hydraulic presses, steel mill rolls, and power turbines'
    ],
    industries: ['Steel Plants', 'Thermal Power', 'Heavy Hydraulic Presses', 'Mining Equipment'],
    applications: ['Hydraulic Press Ram', 'Ladle Tilting', 'Heavy Die Clamping'],
    materials: ['ST52 Honed Steel Tube', '42CrMo4 Induction Hardened Rod', 'Hallite Chevron Seals'],
    specifications: [
      { label: 'Bore Size', value: '100', unit: 'mm', category: 'Dimensions' },
      { label: 'Stroke', value: '400', unit: 'mm', category: 'Dimensions' },
      { label: 'Working Pressure', value: '350', unit: 'Bar', category: 'Operating Parameters' },
      { label: 'Proof Test Pressure', value: '525', unit: 'Bar', category: 'Operating Parameters' },
      { label: 'Rod Diameter', value: '56', unit: 'mm', category: 'Dimensions' }
    ],
    featured: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    priceUSD: 1550,
    priceINR: 130200,
    certifications: ['ISO 9001:2015', 'Hydrostatic Test Certificate Level 3.1'],
    minOrderQty: 1,
    standardLeadTimeDays: 14,
    inStock: true,
    seoKeywords: ['350 bar hydraulic cylinder', 'heavy press cylinder rajkot', 'mill type hydraulic cylinder'],
  });

  const prod4 = await post('/products', {
    sku: 'WLD-FIT-PC08-02-BR',
    name: 'Nickel-Plated Brass Push-In Straight Fitting (8mm Tube x G 1/4" Thread)',
    category: 'Brass Quick Connect Fittings & Couplers',
    categoryId: cat4.id,
    brand: 'WELDOR PRECISION',
    modelNumber: 'WLD-PC-08-02',
    tagline: 'High-tensile brass push-in fitting with Teflon thread sealant.',
    description: 'Precision CNC turned from IS-319 Grade I extruded brass with electrolytic nickel plating. Provides secure grip on PU and Nylon tubing up to 16 Bar without scratching.',
    bulletPoints: [
      'Tube Outer Diameter: 8 mm | Thread: G 1/4" Male BSPT with pre-applied sealant',
      'Max Pressure: 16 Bar (230 PSI) | Working Temp: -10°C to +80°C',
      'Full nickel-plated brass body for corrosion and chemical resistance',
      'Stainless steel 304 collet teeth with POM release button'
    ],
    industries: ['Pneumatic Assembly', 'Machine Tool Building', 'Automotive'],
    applications: ['Air Line Distribution', 'Valve Manifold Plumbings'],
    materials: ['IS-319 Grade I Brass', 'NBR O-Ring', 'SS304 Gripping Ring'],
    specifications: [
      { label: 'Tube OD', value: '8', unit: 'mm', category: 'Connection' },
      { label: 'Thread Size', value: 'G 1/4"', category: 'Connection' },
      { label: 'Pressure Rating', value: '16', unit: 'Bar', category: 'Operating Parameters' }
    ],
    featured: false,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    priceUSD: 2.84,
    priceINR: 238,
    certifications: ['RoHS Compliant'],
    minOrderQty: 50,
    standardLeadTimeDays: 2,
    inStock: true,
    seoKeywords: ['8mm brass push in fitting', 'pneumatic connector g1 4', 'air fitting supplier'],
  });

  // 4. Hero Banners CMS
  console.log('4️⃣ Adding Hero Banners for Studio CMS...');
  await post('/banners', {
    badge: 'INDUSTRY 4.0 READY • ISO 9001:2015 CERTIFIED',
    title: 'High-Precision Pneumatics & Hydraulic Automation Systems',
    highlightText: 'Engineered for Zero Failure Tolerances',
    subtitle: 'German Sealing Technology & 100% CMM Tested Tolerances',
    description: 'Direct OEM manufacturer of ISO 15552 pneumatic cylinders, 5/2 directional solenoid manifold valves, and 350-Bar heavy hydraulic actuators for tier-1 industrial assembly lines.',
    bgImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    productImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    productSku: 'WLD-CYL-ISO15552-80X200',
    productName: 'ISO 15552 Heavy Cylinder (Ø80x200mm)',
    transitionEffect: 'zoom',
    overlayTheme: 'dark-glass',
    primaryBtnText: 'Explore Catalog',
    primaryBtnAction: 'public-products',
    secondaryBtnText: 'Upload CAD Blueprint for RFQ',
    secondaryBtnAction: 'public-rfq',
    stats: [
      { label: 'Production Output', value: '50,000+ Units/Mo' },
      { label: 'Tolerance Accuracy', value: '±0.005 mm' },
      { label: 'Export Destinations', value: '28+ Countries' }
    ],
    features: ['5 Million Cycle Endurance', '100% Helium Leak Tested', 'Same-Day Dispatch for Standard SKUs'],
    active: true,
    displayOrder: 1,
    autoplayDurationSec: 6,
  });

  await post('/banners', {
    badge: 'UPCOMING TRADE EXPO • HALL 3, BOOTH C-18',
    title: 'Experience Live Robotic Automation at ENGIMACH 2026',
    highlightText: 'Booth C-18, Exhibition Center, Gandhinagar',
    subtitle: 'Witness 5-Axis CNC Precision & Fast Valve Manifolds',
    description: 'Join Weldor Industries at Asia’s premier engineering expo. Meet our chief application engineers and get instant commercial contract pricing on bulk OEM requirements.',
    bgImageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    productImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    productSku: 'WLD-VLV-52-G14-24VDC',
    productName: 'High-Frequency 5/2 Solenoid Valve',
    transitionEffect: 'parallax-slide',
    overlayTheme: 'orange-tech',
    primaryBtnText: 'Book VIP Booth Slot',
    primaryBtnAction: 'public-exhibitions',
    secondaryBtnText: 'Download Product Spec PDF',
    secondaryBtnAction: 'public-products',
    stats: [
      { label: 'Live Demo Workcells', value: '4 Active Bays' },
      { label: 'Booth Area', value: '180 Sq. Mtrs' },
      { label: 'Technical Specialists', value: '12 On-Site' }
    ],
    features: ['Live Pressure Burst Tests', 'Exclusive Expo Spot Discounts', 'Free CAD Engineering Consultations'],
    active: true,
    displayOrder: 2,
    autoplayDurationSec: 6,
  });

  // 5. Exhibitions
  console.log('5️⃣ Adding Industrial Exhibitions & Trade Fairs...');
  await post('/exhibitions', {
    title: 'ENGIMACH 2026 — 17th International Engineering & Machine Tool Exhibition',
    subtitle: 'Asia’s Premier Industrial Automation & Fluid Power Expo',
    location: 'Helipad Exhibition Centre, Gandhinagar, Gujarat',
    fullAddress: 'Sector 17, Helipad Ground, Gandhinagar - 382017, Gujarat, India',
    city: 'Gandhinagar',
    country: 'India',
    startDate: '2026-11-25',
    endDate: '2026-11-29',
    hallNumber: 'Hall 3 (Pneumatics & Hydraulics Pavilion)',
    boothNumber: 'Booth C-18',
    description: 'Showcasing Weldor’s latest generation ISO 15552 smart pneumatic cylinders with integrated IO-Link position transmitters, 700-bar ultra-high pressure hydraulic manifolds, and robotic MIG welding positioners.',
    keyHighlights: [
      'Live endurance testing at 10 Bar cycling with instant data telemetry',
      'Launch of Next-Gen Compact ISO 21287 Short-Stroke Cylinders',
      'B2B OEM Distributor Meet & Annual Contract Pricing Desks'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    showcasedCategoryIds: [cat1.id, cat2.id, cat3.id],
    qrSlug: 'engimach-2026',
    leadsCapturedCount: 48,
    featured: true,
    status: 'Upcoming',
  });

  await post('/exhibitions', {
    title: 'INTEC 2026 — International Machine Tools & Industrial Trade Fair',
    subtitle: 'South India’s Leading Industrial Technology Conclave',
    location: 'CODISSIA Trade Fair Complex, Coimbatore, Tamil Nadu',
    city: 'Coimbatore',
    country: 'India',
    startDate: '2026-12-10',
    endDate: '2026-12-14',
    hallNumber: 'Hall B',
    boothNumber: 'Booth B-42',
    description: 'Highlighting precision brass fluid connectors, pneumatic throttle valves, and high-pressure manifold blocks for textile and CNC machine tool manufacturing.',
    keyHighlights: [
      'High-Pressure Leakage Demonstration Bay',
      'Customized Valve Manifold Engineering Clinic'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    showcasedCategoryIds: [cat2.id, cat4.id],
    qrSlug: 'intec-2026',
    leadsCapturedCount: 22,
    featured: false,
    status: 'Upcoming',
  });

  // 6. Gallery Media
  console.log('6️⃣ Adding Factory Floor & R&D Quality Media...');
  await post('/gallery', {
    title: '5-Axis CNC Machining of Valve Manifold Blocks',
    category: 'CNC Machining',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    caption: 'Mazan 5-Axis Vertical Machining Center producing aerospace-grade aluminum manifold blocks with ±0.005mm bore tolerances.',
    tags: ['CNC Machining', '5-Axis', 'Manifold', 'Precision Tolerance'],
  });

  await post('/gallery', {
    title: 'Automated Robotic Seam Welding Cell',
    category: 'Robotic Cell',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
    caption: 'KUKA 6-Axis robotic welding arm executing zero-spatter circumferential welds on high-pressure hydraulic cylinder caps.',
    tags: ['Robotics', 'Welding Cell', 'Automated Seam', 'Cylinder Fabrication'],
  });

  await post('/gallery', {
    title: '525-Bar Hydrostatic Burst & Pressure Hold Test Bay',
    category: 'Testing Bays',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    caption: 'Computerized hydrostatic test bench logging digital pressure decay curves for Level 3.1 quality certification.',
    tags: ['Hydrostatic Testing', 'Quality Assurance', 'Pressure Hold', 'Certificates'],
  });

  // 7. Employees (HRMS)
  console.log('7️⃣ Adding Employees with Real CTC Structures...');
  const emp1 = await post('/hrms/employees', {
    employeeId: 'WEL-1001',
    employeeCode: 'WLD-001',
    name: 'Vikram Mehta',
    fatherName: 'Kantilal Mehta',
    dateOfBirth: '1982-04-15',
    dateOfJoining: '2015-06-01',
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: 'Managing Director & Chief Technical Officer',
    department: 'Executive Management',
    roleId: 'role-super-admin',
    roleName: 'Super Admin',
    reportingManager: 'Board of Directors',
    email: 'vikram.mehta@weldorindustries.com',
    password: 'Weldor@2026',
    phone: '+91 98250 11223',
    panNumber: 'AAAPM9921M',
    aadhaarNumber: '7829-4401-9218',
    uanNumber: '100921849201',
    pfNumber: 'GJ/RAJ/008921/001',
    bankDetails: {
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200049182391',
      ifscCode: 'HDFC0000006',
      branch: 'Navrangpura, Ahmedabad',
      accountType: 'Salary',
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
      annualCTC: 2376000,
    },
    territory: ['All'],
    productCategories: ['All'],
    scope: 'All',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    address: {
      currentAddress: 'B-402, Royal Palms, Kalawad Road',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
    emergencyContact: {
      name: 'Radhika Mehta',
      relation: 'Spouse',
      phone: '+91 98250 88771',
    },
  });

  const emp2 = await post('/hrms/employees', {
    employeeId: 'WEL-1002',
    employeeCode: 'WLD-002',
    name: 'Rajesh Sharma',
    fatherName: 'Dinanath Sharma',
    dateOfBirth: '1988-08-20',
    dateOfJoining: '2018-03-15',
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: 'Head of Production & CNC Engineering',
    department: 'Production & CNC',
    roleId: 'role-operations-head',
    roleName: 'Operations Head',
    reportingManager: 'Vikram Mehta',
    email: 'rajesh.sharma@weldorindustries.com',
    password: 'Rajesh@123',
    phone: '+91 98251 33445',
    panNumber: 'BKLPS4412K',
    aadhaarNumber: '8910-3342-9912',
    uanNumber: '100849201948',
    pfNumber: 'GJ/RAJ/008921/002',
    bankDetails: {
      bankName: 'State Bank of India',
      accountNumber: '30491823941',
      ifscCode: 'SBIN0003821',
      branch: 'Metoda GIDC, Rajkot',
      accountType: 'Salary',
    },
    salaryStructure: {
      baseSalary: 60000,
      hra: 24000,
      da: 12000,
      specialAllowance: 12000,
      conveyanceAllowance: 3000,
      medicalAllowance: 3000,
      pfDeductionEmployee: 7200,
      pfDeductionEmployer: 7200,
      professionalTax: 200,
      tdsTax: 5000,
      grossMonthlySalary: 114000,
      netMonthlySalary: 101600,
      annualCTC: 1454400,
    },
    territory: ['Plant Floor'],
    productCategories: ['All'],
    scope: 'Assigned',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    address: {
      currentAddress: 'A-12, GIDC Residential Colony',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360021',
    },
    emergencyContact: {
      name: 'Sunita Sharma',
      relation: 'Spouse',
      phone: '+91 98251 77665',
    },
  });

  const emp3 = await post('/hrms/employees', {
    employeeId: 'WEL-1003',
    employeeCode: 'WLD-003',
    name: 'Priya Patel',
    fatherName: 'Girishbhai Patel',
    dateOfBirth: '1993-11-12',
    dateOfJoining: '2020-07-01',
    gender: 'Female',
    employmentType: 'Full-Time',
    designation: 'Senior Sales & Export Account Manager',
    department: 'Sales & BD',
    roleId: 'role-sales-head',
    roleName: 'Sales Head',
    reportingManager: 'Vikram Mehta',
    email: 'priya.patel@weldorindustries.com',
    password: 'Priya@123',
    phone: '+91 98252 55667',
    panNumber: 'CPAPP8823J',
    aadhaarNumber: '6621-9984-1123',
    uanNumber: '100781920394',
    pfNumber: 'GJ/RAJ/008921/003',
    bankDetails: {
      bankName: 'ICICI Bank Ltd',
      accountNumber: '002401589123',
      ifscCode: 'ICIC0000024',
      branch: 'Yagnik Road, Rajkot',
      accountType: 'Salary',
    },
    salaryStructure: {
      baseSalary: 45000,
      hra: 18000,
      da: 9000,
      specialAllowance: 9000,
      conveyanceAllowance: 3000,
      medicalAllowance: 3000,
      pfDeductionEmployee: 5400,
      pfDeductionEmployer: 5400,
      professionalTax: 200,
      tdsTax: 3000,
      grossMonthlySalary: 87000,
      netMonthlySalary: 78400,
      annualCTC: 1108800,
    },
    territory: ['India', 'Germany', 'USA', 'UAE'],
    productCategories: ['All'],
    scope: 'All',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    address: {
      currentAddress: '302, Shivalik Heights, 150 Feet Ring Road',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360007',
    },
    emergencyContact: {
      name: 'Girishbhai Patel',
      relation: 'Father',
      phone: '+91 98252 11229',
    },
  });

  const emp4 = await post('/hrms/employees', {
    employeeId: 'WEL-1004',
    employeeCode: 'WLD-004',
    name: 'Amit Verma',
    fatherName: 'Suresh Verma',
    dateOfBirth: '1995-02-28',
    dateOfJoining: '2022-01-10',
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: 'Quality Control & Metallurgy Lead',
    department: 'Quality Control',
    roleId: 'role-quality-mgr',
    roleName: 'Quality Control Manager',
    reportingManager: 'Rajesh Sharma',
    email: 'amit.verma@weldorindustries.com',
    password: 'Amit@123',
    phone: '+91 98253 77889',
    panNumber: 'DVAPV7712L',
    aadhaarNumber: '4412-8823-9901',
    uanNumber: '100671829304',
    pfNumber: 'GJ/RAJ/008921/004',
    bankDetails: {
      bankName: 'Axis Bank Ltd',
      accountNumber: '91802004918239',
      ifscCode: 'UTIB0000120',
      branch: 'Tagore Road, Rajkot',
      accountType: 'Salary',
    },
    salaryStructure: {
      baseSalary: 40000,
      hra: 16000,
      da: 8000,
      specialAllowance: 8000,
      conveyanceAllowance: 3000,
      medicalAllowance: 3000,
      pfDeductionEmployee: 4800,
      pfDeductionEmployer: 4800,
      professionalTax: 200,
      tdsTax: 2000,
      grossMonthlySalary: 78000,
      netMonthlySalary: 71000,
      annualCTC: 993600,
    },
    territory: ['QA Testing Bays'],
    productCategories: ['All'],
    scope: 'Assigned',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    address: {
      currentAddress: 'Flat 104, Tulsi Enclave, Mota Mava',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
    emergencyContact: {
      name: 'Kavita Verma',
      relation: 'Spouse',
      phone: '+91 98253 22334',
    },
  });

  // 8. Attendance & Overtime
  console.log('8️⃣ Logging Employee Biometric Attendance & Overtime...');
  await post('/hrms/attendance', {
    employeeId: emp2.id,
    employeeName: 'Rajesh Sharma',
    department: 'Production & CNC',
    date: '2026-09-18',
    checkIn: '08:45',
    checkOut: '20:45',
    totalHours: 12,
    overtimeHours: 3.5,
    status: 'Present',
    shift: 'Morning General (09:00 - 18:00)',
  });

  await post('/hrms/attendance', {
    employeeId: emp4.id,
    employeeName: 'Amit Verma',
    department: 'Quality Control',
    date: '2026-09-18',
    checkIn: '08:55',
    checkOut: '20:15',
    totalHours: 11.3,
    overtimeHours: 2.5,
    status: 'Present',
    shift: 'Morning General (09:00 - 18:00)',
  });

  // 9. Leave Requests (Trigger for automated Loss of Pay LOP)
  console.log('9️⃣ Adding Approved Leave Request (Triggers LOP Salary Deduction)...');
  await post('/hrms/leaves', {
    employeeId: emp3.id,
    employeeName: 'Priya Patel',
    department: 'Sales & BD',
    leaveType: 'Unpaid Leave',
    startDate: '2026-09-08',
    endDate: '2026-09-09',
    totalDays: 2,
    reason: 'Personal family emergency outside Rajkot',
    status: 'Approved',
    approvedBy: 'Vikram Mehta',
    appliedAt: '2026-09-07T10:30:00.000Z',
  });

  // 10. Payroll Run for September 2026
  console.log('🔟 Generating Automated September 2026 Payroll with LOP & OT...');
  await post('/hrms/payroll', {
    payrollMonth: 'September 2026',
    payrollYear: 2026,
    employeeId: emp1.id,
    employeeCode: 'WLD-001',
    employeeName: 'Vikram Mehta',
    department: 'Executive Management',
    designation: 'Managing Director & CTO',
    bankName: 'HDFC Bank Ltd',
    bankAccountNumber: '50200049182391',
    ifscCode: 'HDFC0000006',
    panNumber: 'AAAPM9921M',
    workingDays: 30,
    paidDays: 30,
    unpaidLeaves: 0,
    overtimeHours: 0,
    overtimeRate: 0,
    overtimePay: 0,
    performanceBonus: 0,
    baseSalary: 100000,
    hra: 40000,
    da: 20000,
    specialAllowance: 20000,
    conveyanceAllowance: 3000,
    medicalAllowance: 3000,
    grossEarnings: 186000,
    pfDeduction: 12000,
    professionalTax: 200,
    tdsTax: 15000,
    leaveDeduction: 0,
    otherDeductions: 0,
    totalDeductions: 27200,
    netPayable: 158800,
    status: 'Approved',
    paymentMode: 'NEFT / RTGS',
    remarks: 'Automated executive payroll for September 2026',
  });

  await post('/hrms/payroll', {
    payrollMonth: 'September 2026',
    payrollYear: 2026,
    employeeId: emp2.id,
    employeeCode: 'WLD-002',
    employeeName: 'Rajesh Sharma',
    department: 'Production & CNC',
    designation: 'Head of Production & CNC Engineering',
    bankName: 'State Bank of India',
    bankAccountNumber: '30491823941',
    ifscCode: 'SBIN0003821',
    panNumber: 'BKLPS4412K',
    workingDays: 30,
    paidDays: 30,
    unpaidLeaves: 0,
    overtimeHours: 8,
    overtimeRate: 375, // (60000 / 30 / 8) * 1.5 = 375
    overtimePay: 3000,
    performanceBonus: 0,
    baseSalary: 60000,
    hra: 24000,
    da: 12000,
    specialAllowance: 12000,
    conveyanceAllowance: 3000,
    medicalAllowance: 3000,
    grossEarnings: 117000,
    pfDeduction: 7200,
    professionalTax: 200,
    tdsTax: 5000,
    leaveDeduction: 0,
    otherDeductions: 0,
    totalDeductions: 12400,
    netPayable: 104600,
    status: 'Approved',
    paymentMode: 'NEFT / RTGS',
    remarks: 'Automated payroll with +8h OT (₹3,000) for export production run',
  });

  await post('/hrms/payroll', {
    payrollMonth: 'September 2026',
    payrollYear: 2026,
    employeeId: emp3.id,
    employeeCode: 'WLD-003',
    employeeName: 'Priya Patel',
    department: 'Sales & BD',
    designation: 'Senior Sales & Export Account Manager',
    bankName: 'ICICI Bank Ltd',
    bankAccountNumber: '002401589123',
    ifscCode: 'ICIC0000024',
    panNumber: 'CPAPP8823J',
    workingDays: 30,
    paidDays: 28,
    unpaidLeaves: 2,
    overtimeHours: 0,
    overtimeRate: 281,
    overtimePay: 0,
    performanceBonus: 0,
    baseSalary: 45000,
    hra: 18000,
    da: 9000,
    specialAllowance: 9000,
    conveyanceAllowance: 3000,
    medicalAllowance: 3000,
    grossEarnings: 87000,
    pfDeduction: 5400,
    professionalTax: 200,
    tdsTax: 3000,
    leaveDeduction: 3000, // (45000 / 30) * 2 = 3000 LOP
    otherDeductions: 0,
    totalDeductions: 11600,
    netPayable: 75400,
    status: 'Approved',
    paymentMode: 'NEFT / RTGS',
    remarks: 'Automated payroll with 2-day LOP deduction (-₹3,000)',
  });

  // 11. Inbound Leads & RFQs
  console.log('1️⃣1️⃣ Ingesting B2B Inbound Inquiries & CAD RFQs...');
  const lead1 = await post('/crm/leads', {
    companyName: 'Larsen & Toubro Heavy Engineering',
    contactName: 'Sunil Nair',
    contactEmail: 'sunil.nair@ltts.com',
    contactPhone: '+91 98200 44912',
    requirementDescription: 'Procurement of 450 units of ISO 15552 standard pneumatic cylinders (Ø80x200mm) under quarterly blanket purchase order agreement.',
    estimatedValueUSD: 38250,
    stage: 'WON',
    priority: 'High',
    source: 'Website Drawing Upload',
    assignedToEmployeeId: emp3.id,
    assignedToEmployeeName: 'Priya Patel',
    isRepeatClient: true,
  });

  const lead2 = await post('/crm/leads', {
    companyName: 'Tata Motors Commercial Vehicles',
    contactName: 'Amit Deshmukh',
    contactEmail: 'amit.deshmukh@tatamotors.com',
    contactPhone: '+91 98220 88912',
    requirementDescription: 'Supply of 1,200 units 5/2 way high-frequency solenoid valves with G 1/4" ports and 24V DC encapsulated coils for chassis assembly conveyor line.',
    estimatedValueUSD: 26400,
    stage: 'PROPOSAL_SENT',
    priority: 'High',
    source: 'Direct RFQ Form',
    assignedToEmployeeId: emp3.id,
    assignedToEmployeeName: 'Priya Patel',
    isRepeatClient: true,
  });

  const lead3 = await post('/crm/leads', {
    companyName: 'Thermax Global Power Division',
    contactName: 'Rohit Kulkarni',
    contactEmail: 'rohit.kulkarni@thermaxglobal.com',
    contactPhone: '+91 98901 33441',
    requirementDescription: 'Custom engineering prototype requirement: 12 units of 350-Bar heavy hydraulic cylinders with integrated linear position sensors for power plant boiler damper actuation.',
    estimatedValueUSD: 18600,
    stage: 'NEW_LEAD',
    priority: 'Urgent',
    source: 'CAD Drawing Upload',
    assignedToEmployeeId: emp3.id,
    assignedToEmployeeName: 'Priya Patel',
    isRepeatClient: false,
  });

  const lead4 = await post('/crm/leads', {
    companyName: 'Bharat Heavy Electricals Ltd. (BHEL)',
    contactName: 'Pradeep Joshi',
    contactEmail: 'pradeep.j@bhel.in',
    contactPhone: '+91 98110 55672',
    requirementDescription: 'Annual recurring requirement for 5,000 pcs of nickel-plated brass push-in fittings (8mm Tube x G 1/4" thread) for steam turbine instrumentation lines.',
    estimatedValueUSD: 14200,
    stage: 'WON',
    priority: 'Medium',
    source: 'Exhibition Inquiry',
    assignedToEmployeeId: emp3.id,
    assignedToEmployeeName: 'Priya Patel',
    isRepeatClient: true,
  });

  // 12. RFQ Blueprint Attachment
  console.log('1️⃣2️⃣ Attaching CAD Blueprint to RFQ Engine...');
  await post('/crm/rfqs', {
    rfqNumber: 'RFQ-2026-0914',
    leadId: lead3.id,
    companyName: 'Thermax Global Power Division',
    contactPerson: 'Rohit Kulkarni',
    email: 'rohit.kulkarni@thermaxglobal.com',
    phone: '+91 98901 33441',
    country: 'India',
    title: '350-Bar Damper Actuator Hydraulic Cylinder CAD Drawing',
    technicalNotes: 'CAD Step File attached. Material specified: ST52 Honed tube with 42CrMo4 chrome plated rod. Requires 525-Bar hydro test certification.',
    cadFileUrl: 'https://weldorindustries.com/drawings/WLD-ENG-HYD-350BAR-CUSTOM-REV2.step',
    quantity: 12,
    targetPriceUSD: 1550,
    preferredResponse: 'Email',
    status: 'Engineering Evaluated',
  });

  // 13. Commercial Quotations
  console.log('1️⃣3️⃣ Generating Official Commercial Quotations...');
  const quote1 = await post('/crm/quotations', {
    quotationNumber: 'QT-2026-0891',
    leadId: lead1.id,
    companyName: 'Larsen & Toubro Heavy Engineering',
    contactName: 'Sunil Nair',
    email: 'sunil.nair@ltts.com',
    items: [
      {
        id: 'item-1',
        productId: prod1.id,
        productName: prod1.name,
        sku: prod1.sku,
        quantity: 450,
        unitPriceUSD: 85,
        discountPercentage: 5,
        taxPercentage: 18,
        totalPriceUSD: 36337.5,
      }
    ],
    subtotalUSD: 38250,
    totalDiscountUSD: 1912.5,
    taxTotalUSD: 6540.75,
    freightCostUSD: 500,
    grandTotalUSD: 43378.25,
    paymentTerms: '30 Days Net from Delivery',
    deliveryTerms: 'Ex-Works Metoda Plant (FOB Mundra Port for Export)',
    validityDays: 30,
    status: 'Approved',
    requiresApproval: false,
    createdAt: '2026-09-10T11:00:00.000Z',
    sentAt: '2026-09-10T14:30:00.000Z',
    acceptedAt: '2026-09-12T09:15:00.000Z',
  });

  const quote2 = await post('/crm/quotations', {
    quotationNumber: 'QT-2026-0892',
    leadId: lead2.id,
    companyName: 'Tata Motors Commercial Vehicles',
    contactName: 'Amit Deshmukh',
    email: 'amit.deshmukh@tatamotors.com',
    items: [
      {
        id: 'item-2',
        productId: prod2.id,
        productName: prod2.name,
        sku: prod2.sku,
        quantity: 1200,
        unitPriceUSD: 22,
        discountPercentage: 8,
        taxPercentage: 18,
        totalPriceUSD: 24288,
      }
    ],
    subtotalUSD: 26400,
    totalDiscountUSD: 2112,
    taxTotalUSD: 4371.84,
    freightCostUSD: 350,
    grandTotalUSD: 29009.84,
    paymentTerms: '100% Against Dispatch Manifest',
    deliveryTerms: 'Door Delivery to Tata Motors Pune Plant',
    validityDays: 30,
    status: 'Sent to Customer',
    requiresApproval: false,
    createdAt: '2026-09-15T10:00:00.000Z',
    sentAt: '2026-09-15T16:00:00.000Z',
  });

  // 14. Orders & Dispatches (Active + Delivered Archive)
  console.log('1️⃣4️⃣ Generating Confirmed Purchase Orders & Dispatch Manifests...');
  // Order 1: In QC Inspection
  await post('/crm/orders', {
    orderNumber: 'ORD-2026-104',
    quotationId: quote2.id,
    leadId: lead2.id,
    companyName: 'Tata Motors Commercial Vehicles',
    contactName: 'Amit Deshmukh',
    items: [
      {
        productId: prod2.id,
        productName: prod2.name,
        sku: prod2.sku,
        quantity: 1200,
        unitPriceUSD: 20.24,
        totalPriceUSD: 24288,
      }
    ],
    totalValueUSD: 29009.84,
    totalAmountUSD: 29009.84,
    stage: 'QC Inspection',
    status: 'In Production',
    shippingAddress: 'Chassis Assembly Shop No. 4, Tata Motors Ltd, Pimpri, Pune - 411018, Maharashtra',
    isRepeatOrder: true,
    createdAt: '2026-09-14T09:00:00.000Z',
  });

  // Order 2: Dispatched with Airway Bill
  await post('/crm/orders', {
    orderNumber: 'ORD-2026-103',
    quotationId: quote1.id,
    leadId: lead1.id,
    companyName: 'Larsen & Toubro Heavy Engineering',
    contactName: 'Sunil Nair',
    items: [
      {
        productId: prod1.id,
        productName: prod1.name,
        sku: prod1.sku,
        quantity: 450,
        unitPriceUSD: 80.75,
        totalPriceUSD: 36337.5,
      }
    ],
    totalValueUSD: 43378.25,
    totalAmountUSD: 43378.25,
    stage: 'Dispatched',
    status: 'Dispatched',
    carrierName: 'Blue Dart Express (Air Cargo)',
    trackingNumber: 'BLUEDART-AIR-99214482',
    dispatchDate: '2026-09-17',
    estimatedDeliveryDate: '2026-09-20',
    shippingAddress: 'L&T Heavy Engineering Complex, Gate No. 5, Powai, Mumbai - 400072',
    isRepeatOrder: true,
    createdAt: '2026-09-11T10:00:00.000Z',
  });

  // Order 3: Delivered (will be in completed archive)
  await post('/crm/orders', {
    orderNumber: 'ORD-2026-101',
    quotationId: 'QT-2026-0880',
    leadId: lead4.id,
    companyName: 'Bharat Heavy Electricals Ltd. (BHEL)',
    contactName: 'Pradeep Joshi',
    items: [
      {
        productId: prod4.id,
        productName: prod4.name,
        sku: prod4.sku,
        quantity: 5000,
        unitPriceUSD: 2.84,
        totalPriceUSD: 14200,
      }
    ],
    totalValueUSD: 16756,
    totalAmountUSD: 16756,
    stage: 'Delivered',
    status: 'Delivered',
    carrierName: 'V-Trans Logistics India Ltd.',
    trackingNumber: 'VTRANS-RAJ-4481290',
    dispatchDate: '2026-09-02',
    estimatedDeliveryDate: '2026-09-06',
    shippingAddress: 'Turbine Fabrication Bay, BHEL Heavy Electrical Plant, Ranipur, Haridwar - 249403',
    isRepeatOrder: true,
    createdAt: '2026-08-28T09:00:00.000Z',
  });

  // 15. Sample Requests & Lab Trials
  console.log('1️⃣5️⃣ Adding Sample Dispatches & Lab Testing Workspaces...');
  await post('/crm/samples', {
    sampleNumber: 'SMP-2026-018',
    leadId: lead1.id,
    companyName: 'Larsen & Toubro Heavy Engineering',
    productName: 'ISO 15552 Cylinder Prototype (Ø80x200mm)',
    quantityRequested: 2,
    stage: 'Dispatched',
    courierTrackingNo: 'DHL-EXP-88219034',
    dispatchDate: '2026-09-16',
    estimatedDeliveryDate: '2026-09-19',
  });

  await post('/crm/trials', {
    trialNumber: 'TRL-2026-009',
    leadId: lead3.id,
    companyName: 'Thermax Global Power Division',
    productName: 'Custom 350-Bar Hydraulic Cylinder Damper Actuator',
    testParameters: {
      pressureTestBar: 525,
      leakageTestResult: '0.000 sccs (Zero Bubble Helium Mass Spec Passed)',
      corrosionHours: 500,
      cycleCount: 250000,
    },
    status: 'Execution In Progress',
    evaluatorEngineer: 'Amit Verma (QC & Metallurgy Lead)',
  });

  console.log('\n🎉 ALL CLEAN MANUFACTURING DATA POPULATED SUCCESSFULLY AND INTEGRATED END-TO-END!\n');
}

main().catch(err => {
  console.error('Error populating data:', err);
  process.exit(1);
});
