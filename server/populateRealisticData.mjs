// Script to populate realistic production data through real Express API endpoints
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

async function main() {
  console.log('🚀 Starting realistic manufacturing data population via Live API...');

  // 1. Company Settings
  console.log('1. Setting Company Profile & SLA Settings...');
  await put('/settings/company', {
    companyName: 'Weldor Industries Private Limited',
    brandName: 'WELDOR PRECISION',
    legalName: 'Weldor Industries Private Limited',
    cinNumber: 'U29253GJ1998PTC034120',
    gstin: '24AABCV8912K1Z4',
    panNumber: 'AABCV8912K',
    iecCode: '0898012456',
    msmeRegistrationNo: 'UDYAM-GJ-20-0019284',
    registeredOfficeAddress: {
      addressLine1: 'Plot No. 2408/A, GIDC Industrial Estate, Phase 3',
      addressLine2: 'Metoda, Lodhika Industrial Corridor',
      city: 'Rajkot',
      state: 'Gujarat',
      country: 'India',
      pincode: '360021',
    },
    primaryEmail: 'sales@weldorindustries.com',
    primaryPhone: '+91 98250 11223',
    websiteUrl: 'https://weldorindustries.com',
    primaryBank: {
      bankName: 'State Bank of India',
      accountName: 'Weldor Industries Pvt. Ltd. - Industrial Current Account',
      accountNumber: '304918239012',
      ifscCode: 'SBIN0003821',
      branch: 'GIDC Metoda Industrial Branch, Rajkot',
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
  console.log('2. Creating Product Categories...');
  const cat1 = await post('/categories', {
    name: 'Pneumatic Automation',
    slug: 'pneumatic-automation',
    description: 'ISO 15552 & ISO 6432 standard pneumatic cylinders, high-cycle solenoid manifold valves, and magnetic rotary actuators for high-speed assembly automation.',
    iconName: 'Wind',
    productCount: 45,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['Standard ISO Cylinders', 'Compact Short-Stroke Cylinders', 'Rotary Actuators', 'Solenoid Manifold Valves', 'FRL Air Preparation Units'],
    seoKeywords: ['pneumatic cylinder manufacturer rajkot', 'iso 15552 cylinder india', 'automation rotary actuator oem'],
    seoMetaTitle: 'Pneumatic Automation Cylinders & Solenoids | Weldor Industries',
    seoMetaDescription: 'Precision pneumatic ISO cylinders and pneumatic rotary actuators manufactured with German sealing technology.'
  });

  const cat2 = await post('/categories', {
    name: 'High Pressure Hydraulics',
    slug: 'high-pressure-hydraulics',
    description: 'Ultra-heavy-duty 700 Bar hydraulic cylinders, proportional directional valves, power packs, and hydraulic press manifolds tested under 1.5x proof pressure.',
    iconName: 'Droplets',
    productCount: 38,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['700 Bar Heavy Cylinders', 'Hydraulic Directional Control Valves', 'Hydraulic Power Units (HPU)', 'Custom Press Manifold Blocks', 'Hydrostatic Testing Benches'],
    seoKeywords: ['700 bar hydraulic cylinder', 'industrial hydraulic valves', 'hydraulic press manifold manufacturer'],
    seoMetaTitle: '700 Bar High Pressure Hydraulic Cylinders & Valves | Weldor',
    seoMetaDescription: 'Heavy-duty 700 bar hydraulic cylinders and manifold assemblies with zero leakage and hard chrome plated rods.'
  });

  const cat3 = await post('/categories', {
    name: 'Welding Automation & Fixtures',
    slug: 'welding-automation',
    description: 'Robotic MIG/TIG torch positioners, heavy seam welding column-and-boom manipulators, and pneumatic clamping fixtures designed for zero distortion.',
    iconName: 'Flame',
    productCount: 26,
    featured: true,
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['Robotic Welding Torches', 'Rotary Welding Positioners', 'Pneumatic Clamping Fixtures', 'Seam Welding Manipulators', 'Anti-Spatter Protection Cells'],
    seoKeywords: ['welding automation fixtures', 'robotic mig torch india', 'welding positioner manufacturer'],
    seoMetaTitle: 'Welding Automation Systems & Precision Fixtures | Weldor',
    seoMetaDescription: 'High precision robotic welding fixtures and heavy positioners for automotive and boiler manufacturing.'
  });

  const cat4 = await post('/categories', {
    name: '5-Axis CNC Machined Parts',
    slug: '5-axis-cnc-machined-parts',
    description: 'Tight-tolerance customized CNC turned and milled components, aerospace manifold bodies, and defense-grade precision shafts machined with ±0.005mm accuracy.',
    iconName: 'Cpu',
    productCount: 64,
    featured: true,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['Aerospace Manifold Blocks', 'Precision Splined Shafts', 'Stainless Steel Valve Bodies', 'Hardened CNC Bushings', 'Custom OEM Assemblies'],
    seoKeywords: ['5 axis cnc machining rajkot', 'aerospace cnc manifold india', 'precision turned parts oem'],
    seoMetaTitle: '5-Axis CNC Precision Machining & Milling | Weldor Industries',
    seoMetaDescription: 'World-class 5-axis DMG Mori and Mazak CNC machining facility delivering ±5 micron tolerances.'
  });

  const cat5 = await post('/categories', {
    name: 'Fire & Cryogenic Safety Valves',
    slug: 'fire-safety-valves',
    description: 'UL-listed and API 607 fire-safe deluge control valves, high-temperature pressure relief valves, and cryogenic fluid regulation systems.',
    iconName: 'Zap',
    productCount: 18,
    featured: false,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    subCategories: ['Deluge Fire Control Valves', 'Pressure Relief Safety Valves', 'Cryogenic Globe Valves', 'Flame Arrestor Assemblies'],
    seoKeywords: ['fire safe valve api 607', 'deluge valve manufacturer', 'cryogenic valve oem'],
    seoMetaTitle: 'UL Listed Fire & Cryogenic Safety Valves | Weldor',
    seoMetaDescription: 'Certified fire-safe valves tested under extreme thermal gradients for refineries and oil & gas terminals.'
  });

  // 3. Products
  console.log('3. Populating Core Industrial Products...');
  await post('/products', {
    sku: 'WEL-PNC-15552-100',
    name: 'Heavy-Duty ISO 15552 Pneumatic Cylinder (Ø100mm Bore)',
    category: 'Pneumatic Automation',
    categoryId: cat1.data.id,
    subCategory: 'Standard ISO Cylinders',
    tagline: 'High-cycle industrial automation cylinder with magnetic piston and adjustable cushioning.',
    description: 'Precision engineered pneumatic cylinder built to ISO 15552 standards. Features an anodized aluminum profile barrel, stainless steel hard-chrome piston rod, Viton high-temperature seals, and magnetic reed switch slots.',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    cadModelUrl: '/uploads/file-1789665096290-56620049.pdf',
    brochurePdfUrl: '/uploads/file-1789665096290-56620049.pdf',
    priceINR: 14500,
    priceUSD: 175,
    minOrderQty: 5,
    stockQuantity: 42,
    inStock: true,
    leadTimeDays: 7,
    warrantyMonths: 24,
    standards: ['ISO 15552', 'DIN 24335', 'CE Certified', 'RoHS Compliant'],
    industries: ['Automotive', 'Packaging', 'Automation & Robotics', 'Pharmaceutical'],
    keywords: ['iso 15552 cylinder', 'pneumatic actuator', '100mm bore cylinder'],
    specifications: [
      { label: 'Bore Diameter', value: '100 mm' },
      { label: 'Stroke Range', value: '25 mm - 1000 mm (Customizable)' },
      { label: 'Operating Pressure', value: '1.0 to 10.0 Bar' },
      { label: 'Proof Pressure', value: '15.0 Bar' },
      { label: 'Temperature Range', value: '-20°C to +80°C (High Temp Viton)' },
      { label: 'Piston Rod Material', value: 'EN8 Hard Chrome Plated (25µm)' },
      { label: 'Cushioning', value: 'Adjustable pneumatic cushioning both ends' }
    ]
  });

  await post('/products', {
    sku: 'WEL-HYV-700B-MAN',
    name: '700 Bar High-Pressure Hydraulic Manifold Control Block',
    category: 'High Pressure Hydraulics',
    categoryId: cat2.data.id,
    subCategory: 'Custom Press Manifold Blocks',
    tagline: 'Zero-leakage forged steel hydraulic manifold designed for 700 Bar continuous press cycles.',
    description: 'Forged alloy steel manifold block CNC cross-drilled and deep-hole drilled to precision DIN 24340 interfaces. Integrated with cartridge relief valves and counterbalance checks for heavy forging and sheet hydroforming presses.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    cadModelUrl: '/uploads/file-1789665096290-56620049.pdf',
    brochurePdfUrl: '/uploads/file-1789665096290-56620049.pdf',
    priceINR: 68000,
    priceUSD: 820,
    minOrderQty: 2,
    stockQuantity: 18,
    inStock: true,
    leadTimeDays: 14,
    warrantyMonths: 36,
    standards: ['ISO 4401-08', 'DIN 24340', '100% Hydrostatic Tested', 'ASME B31.3'],
    industries: ['Heavy Machinery', 'Automotive', 'Oil & Gas', 'Steel Mills'],
    keywords: ['700 bar hydraulic block', 'press manifold', 'hydraulic valve block'],
    specifications: [
      { label: 'Max Operating Pressure', value: '700 Bar (10,150 PSI)' },
      { label: 'Proof Test Pressure', value: '1050 Bar (100% Hydrostatic Verified)' },
      { label: 'Flow Capacity', value: 'Up to 350 LPM' },
      { label: 'Material', value: 'AISI 4140 Quenched & Tempered Forged Steel' },
      { label: 'Surface Treatment', value: 'Electroless Nickel Plating (ENP 25µm)' },
      { label: 'Internal Port Finish', value: 'Ra 0.4 µm Honed Channels' }
    ]
  });

  await post('/products', {
    sku: 'WEL-ROB-WLD-MIG500',
    name: '500A Water-Cooled Robotic MIG Welding Torch & Positioner Cell',
    category: 'Welding Automation & Fixtures',
    categoryId: cat3.data.id,
    subCategory: 'Robotic Welding Torches',
    tagline: 'Continuous 100% duty cycle robotic MIG torch with anti-collision crash sensor.',
    description: 'Engineered for robotic automation lines. Equipped with dual-circuit water cooling, high-conductive copper-zirconium contact tips, and a precision mechanical crash protection clutch with rapid TCP repeatability (±0.05 mm).',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80'
    ],
    priceINR: 42500,
    priceUSD: 510,
    minOrderQty: 1,
    stockQuantity: 25,
    inStock: true,
    leadTimeDays: 5,
    warrantyMonths: 18,
    standards: ['IEC 60974-7', 'CE Marked', 'ISO 9001:2015'],
    industries: ['Automotive', 'Heavy Machinery', 'Boiler & Pressure Vessel'],
    keywords: ['robotic mig torch', 'water cooled torch 500a', 'welding automation'],
    specifications: [
      { label: 'Rated Current', value: '500A CO2 / 450A Mixed Gas @ 100% Duty' },
      { label: 'Wire Diameter Range', value: '0.8 mm - 1.6 mm' },
      { label: 'Cooling System', value: 'Dual Flow High-Velocity Water Cooling' },
      { label: 'TCP Repeatability', value: '±0.05 mm' },
      { label: 'Crash Sensor Deflection', value: 'Max 10° Omnidirectional' }
    ]
  });

  await post('/products', {
    sku: 'WEL-5AX-AERO-MF01',
    name: '5-Axis CNC Machined Aerospace Fuel Manifold Body',
    category: '5-Axis CNC Machined Parts',
    categoryId: cat4.data.id,
    subCategory: 'Aerospace Manifold Blocks',
    tagline: 'Ultra-precision AL 7075-T6 monolithic fuel regulation manifold with CMM inspection report.',
    description: 'Monolithic single-setup 5-axis CNC machined aircraft fuel control body. Machined from solid aerospace grade billet with micro-drilled cross passages, helicoil threads, and mil-spec hard anodized coating.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    ],
    priceINR: 32000,
    priceUSD: 390,
    minOrderQty: 10,
    stockQuantity: 60,
    inStock: true,
    leadTimeDays: 21,
    warrantyMonths: 24,
    standards: ['AS9100D Compliant', 'MIL-A-8625 Type III', '100% Zeiss CMM Inspected'],
    industries: ['Aerospace', 'Defense', 'High-Speed Rail'],
    keywords: ['aerospace manifold 5 axis', 'cnc al 7075', 'precision aircraft component'],
    specifications: [
      { label: 'Material Grade', value: 'Aerospace Alloy AL 7075-T651' },
      { label: 'Machining Tolerance', value: '±0.005 mm (5 Microns)' },
      { label: 'Surface Roughness', value: 'Ra 0.4 µm throughout all cavities' },
      { label: 'Testing Protocol', value: '100% CMM 3D Scan + Fluorescent Dye Penetrant' },
      { label: 'Hard Anodizing', value: 'MIL-A-8625 Type III Class 2 Black' }
    ]
  });

  // 4. Hero Banners
  console.log('4. Creating Interactive Hero Banners...');
  await post('/banners', {
    badge: 'ISO 9001:2015 Certified OEM/ODM Manufacturer',
    title: 'High-Precision Pneumatic & Hydraulic Systems',
    highlightText: 'Engineering Zero-Defect Fluid Power Automation',
    subtitle: '700 Bar Hydraulics • ISO 15552 Cylinders • 5-Axis CNC Machining',
    description: 'Weldor Industries manufactures high-pressure hydraulic manifolds, pneumatic automation cylinders, and aerospace components at our Metoda, Rajkot manufacturing plant.',
    bgImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80',
    productImageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    productSku: 'WEL-PNC-15552-100',
    productName: 'Heavy-Duty ISO 15552 Pneumatic Cylinder',
    transitionEffect: 'zoom',
    overlayTheme: 'dark-glass',
    primaryBtnText: 'Explore 200+ Catalog',
    primaryBtnAction: 'public-products',
    secondaryBtnText: 'Upload CAD Blueprint',
    secondaryBtnAction: 'public-rfq',
    features: ['5-Axis DMG Mori CNC Machining', '100% Hydrostatic Pressure Proof Tested', 'Direct Export to 24+ Countries'],
    stats: [
      { label: 'Tolerance Accuracy', value: '±0.005mm' },
      { label: 'Max Hydrostatic Test', value: '700 Bar' },
      { label: 'Direct Exports', value: '24+ Countries' }
    ],
    active: true,
    displayOrder: 1,
    autoplayDurationSec: 6
  });

  await post('/banners', {
    badge: 'Heavy Industry Engineering & Press Automation',
    title: '700 Bar Ultra-High Pressure Manifolds',
    highlightText: 'Engineered for Zero Leakage Under 10,000 PSI',
    subtitle: 'High-Strength Forged Alloy Steel with Electroless Nickel Plating',
    description: 'Customized hydraulic valve blocks and power packs for forging presses, steel rolling mills, and subsea hydraulic tools with complete material test certificates (EN 10204 3.1).',
    bgImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    productImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    productSku: 'WEL-HYV-700B-MAN',
    productName: '700 Bar Hydraulic Manifold Block',
    transitionEffect: 'kenburns',
    overlayTheme: 'orange-tech',
    primaryBtnText: 'Inspect Hydraulic Manifolds',
    primaryBtnAction: 'public-products',
    secondaryBtnText: 'Request Commercial RFQ',
    secondaryBtnAction: 'public-rfq',
    features: ['1050 Bar Hydrostatic Verification', 'Cartridge Logic Integration', 'EN 10204 3.1 Mill Certs'],
    stats: [
      { label: 'Operating Pressure', value: '700 Bar' },
      { label: 'Burst Safety Factor', value: '4:1 Ratio' },
      { label: 'Flow Rate', value: '350 LPM' }
    ],
    active: true,
    displayOrder: 2,
    autoplayDurationSec: 6
  });

  await post('/banners', {
    badge: 'Defense & Aerospace Precision Machining',
    title: '5-Axis Simultaneous CNC Machining',
    highlightText: 'Complex Contours & Micron Level Accuracy',
    subtitle: 'Zeiss 3D CMM Quality Lab • DMG Mori & Mazak Fleet',
    description: 'From titanium aerospace valves to aircraft fuel manifold assemblies, we provide single-setup multi-axis CNC milling with complete surface crack inspection and CMM validation reports.',
    bgImageUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
    productImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    productSku: 'WEL-5AX-AERO-MF01',
    productName: '5-Axis CNC Aerospace Fuel Manifold',
    transitionEffect: 'parallax-slide',
    overlayTheme: 'blueprint-navy',
    primaryBtnText: 'Explore CNC Capabilities',
    primaryBtnAction: 'public-about',
    secondaryBtnText: 'Submit 3D STEP File',
    secondaryBtnAction: 'public-rfq',
    features: ['Zeiss 3D CMM Measurement', 'Titanium & AL 7075-T6', 'AS9100D Certified Process'],
    stats: [
      { label: 'Spindle Speed', value: '20,000 RPM' },
      { label: 'Axis Precision', value: '0.002 mm' },
      { label: 'CMM Resolution', value: '0.1 Micron' }
    ],
    active: true,
    displayOrder: 3,
    autoplayDurationSec: 6
  });

  // 5. Exhibitions
  console.log('5. Registering Industrial Trade Exhibitions...');
  await post('/exhibitions', {
    title: 'IMTEX 2027 — International Machine Tool Exhibition',
    subtitle: 'South East Asia Largest Metal Forming & Automation Expo',
    location: 'Bangalore International Exhibition Centre (BIEC)',
    city: 'Bangalore',
    country: 'India',
    startDate: '2027-01-21',
    endDate: '2027-01-27',
    hallNumber: 'Hall 4 (Automation Pavillion)',
    boothNumber: 'Stall B-118',
    description: 'Live demonstration of 700 Bar hydraulic press control manifolds, synchronized pneumatic multi-axis indexing cells, and robotic welding torch anti-collision demos.',
    keyHighlights: [
      'Live demonstration of 700 Bar electro-hydraulic proportional manifolds',
      'Instant 3D CAD STEP file blueprint reviews with Engineering Directors',
      'Exclusive OEM distributor partnership agreements and commercial discounting'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    brochurePdfUrl: '/uploads/file-1789665096290-56620049.pdf',
    showcasedCategoryIds: [cat1.data.id, cat2.data.id],
    qrSlug: 'imtex-2027-bangalore',
    featured: true,
    status: 'Upcoming',
    autoArchivePassedDate: true
  });

  await post('/exhibitions', {
    title: 'Hannover Messe 2027 — World Industrial Technology Fair',
    subtitle: 'Global Stage for Smart Manufacturing & Industry 4.0',
    location: 'Hannover Fairgrounds (Messegelände)',
    city: 'Hannover',
    country: 'Germany',
    startDate: '2027-04-12',
    endDate: '2027-04-16',
    hallNumber: 'Hall 16 (Fluid Power & Motion)',
    boothNumber: 'Stand C-42',
    description: 'Showcasing Weldor European export range of CE-certified pneumatic cylinders, ATEX-approved safety valves, and high-precision CNC titanium components.',
    keyHighlights: [
      'Global launch of ultra-compact IO-Link smart pneumatic manifolds',
      '1-on-1 technical meetings for European OEM machine builders',
      'Direct container shipping logistics briefing from Port of Mundra'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    brochurePdfUrl: '/uploads/file-1789665096290-56620049.pdf',
    showcasedCategoryIds: [cat1.data.id, cat4.data.id],
    qrSlug: 'hannover-messe-2027',
    featured: true,
    status: 'Upcoming',
    autoArchivePassedDate: true
  });

  await post('/exhibitions', {
    title: 'Engimach 2025 Industrial Trade Show (Past Edition)',
    subtitle: 'Gujarat Premier Engineering & Manufacturing Expo',
    location: 'Helipad Exhibition Ground, Gandhinagar',
    city: 'Gandhinagar',
    country: 'India',
    startDate: '2025-12-03',
    endDate: '2025-12-07',
    hallNumber: 'Hall 2 (Hydraulics & Pneumatics)',
    boothNumber: 'Stall H2-A04',
    description: 'Over 850+ industrial visitors engaged with our live 500-ton hydraulic cylinder testing rig. Signed MoUs with 14 automotive Tier-1 suppliers.',
    keyHighlights: [
      '850+ Engineering delegates visited stall',
      '14 High-volume OEM supply contracts signed',
      'Won Best Technical Exhibit Display Award'
    ],
    bannerImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrls: ['https://www.w3schools.com/html/mov_bbb.mp4'],
    brochurePdfUrl: '/uploads/file-1789665096290-56620049.pdf',
    showcasedCategoryIds: [cat2.data.id, cat3.data.id],
    qrSlug: 'engimach-2025',
    featured: false,
    status: 'Past Exhibition',
    autoArchivePassedDate: true
  });

  // 6. Gallery Media
  console.log('6. Adding Factory Floor & Machining Gallery Media...');
  await post('/gallery', {
    title: '5-Axis DMG Mori High-Speed Machining Center in Action',
    category: 'CNC Machining',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
    caption: 'Simultaneous 5-axis milling of complex hydraulic manifold ports with ±0.005mm tolerance.',
    tags: ['CNC', '5-Axis', 'DMG Mori', 'Machining']
  });

  await post('/gallery', {
    title: 'Hydrostatic Pressure Testing Bay (Up to 1000 Bar)',
    category: 'Testing Bays',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    caption: '100% pressure verification of heavy hydraulic cylinders using calibrated digital pressure transducers.',
    tags: ['Hydrostatic Testing', 'Quality', 'Zero Leakage']
  });

  await post('/gallery', {
    title: 'Robotic MIG Welding Automation Cell',
    category: 'Robotic Cell',
    type: 'Video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80',
    videoDuration: '02:45',
    caption: 'Automated 6-axis robotic arm performing continuous seam welding on heavy pressure vessels.',
    tags: ['Robotic Welding', 'Automation', 'MIG Torch']
  });

  await post('/gallery', {
    title: 'Zeiss 3D CMM Coordinate Measuring Quality Lab',
    category: 'R&D Quality Lab',
    type: 'Photo',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    caption: 'Temperature controlled Zeiss CMM room delivering micron-level dimensional verification reports.',
    tags: ['Zeiss CMM', 'Inspection', 'AS9100D']
  });

  // 7. HRMS Employees
  console.log('7. Onboarding Core Organizational Staff & Managers...');
  const emp1 = await post('/hrms/employees', {
    employeeId: 'WEL-1001',
    employeeCode: 'DIR-001',
    name: 'Vikram Mehta',
    fatherName: 'Harish Mehta',
    dateOfBirth: '1982-06-14',
    dateOfJoining: '2012-03-01',
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: 'Vice President & Head of Sales',
    department: 'Sales & BD',
    roleId: 'role-sales-manager',
    roleName: 'Sales Manager',
    reportingManager: 'Managing Director',
    email: 'vikram.mehta@weldorindustries.com',
    phone: '+91 98250 11224',
    panNumber: 'BMYPM1290K',
    aadhaarNumber: '4829-1029-3910',
    uanNumber: '100918239012',
    pfNumber: 'GJ/RAJ/0038192/001',
    salaryStructure: {
      baseSalary: 110000,
      hra: 44000,
      da: 15000,
      specialAllowance: 25000,
      conveyanceAllowance: 8000,
      medicalAllowance: 5000,
      pfDeductionEmployee: 13200,
      pfDeductionEmployer: 13200,
      professionalTax: 200,
      tdsTax: 16500,
      grossMonthlySalary: 207000,
      netMonthlySalary: 177100,
      annualCTC: 2642400
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountNumber: '50100238192012',
      ifscCode: 'HDFC0000123',
      branch: 'Yagnik Road, Rajkot',
      accountType: 'Salary'
    },
    territory: ['Western India', 'Europe & Export'],
    productCategories: ['All'],
    scope: 'Team',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  });

  const emp2 = await post('/hrms/employees', {
    employeeId: 'WEL-1002',
    employeeCode: 'ENG-014',
    name: 'Rajesh Sharma',
    fatherName: 'Kishore Sharma',
    dateOfBirth: '1989-11-20',
    dateOfJoining: '2018-07-15',
    gender: 'Male',
    employmentType: 'Full-Time',
    designation: 'Senior Hydraulic Design Engineer',
    department: 'Engineering & R&D',
    roleId: 'role-sales-executive',
    roleName: 'Engineering',
    reportingManager: 'Vikram Mehta',
    email: 'rajesh.sharma@weldorindustries.com',
    phone: '+91 98250 44556',
    panNumber: 'CRDPS4412M',
    aadhaarNumber: '7819-2019-4820',
    uanNumber: '100819230914',
    pfNumber: 'GJ/RAJ/0038192/014',
    salaryStructure: {
      baseSalary: 65000,
      hra: 26000,
      da: 8000,
      specialAllowance: 12000,
      conveyanceAllowance: 4000,
      medicalAllowance: 3000,
      pfDeductionEmployee: 7800,
      pfDeductionEmployer: 7800,
      professionalTax: 200,
      tdsTax: 6200,
      grossMonthlySalary: 118000,
      netMonthlySalary: 103800,
      annualCTC: 1509600
    },
    bankDetails: {
      bankName: 'ICICI Bank',
      accountNumber: '028101592019',
      ifscCode: 'ICIC0000281',
      branch: 'Kalawad Road, Rajkot',
      accountType: 'Salary'
    },
    territory: ['All'],
    productCategories: ['High Pressure Hydraulics'],
    scope: 'Assigned',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  });

  const emp3 = await post('/hrms/employees', {
    employeeId: 'WEL-1003',
    employeeCode: 'HR-002',
    name: 'Pooja Dave',
    fatherName: 'Ramesh Dave',
    dateOfBirth: '1993-04-10',
    dateOfJoining: '2020-01-10',
    gender: 'Female',
    employmentType: 'Full-Time',
    designation: 'HR & Payroll Operations Lead',
    department: 'HR & Admin',
    roleId: 'role-hr-manager',
    roleName: 'HR & Payroll Manager',
    reportingManager: 'Managing Director',
    email: 'pooja.dave@weldorindustries.com',
    phone: '+91 98250 88771',
    panNumber: 'AQZPD8921R',
    aadhaarNumber: '3910-4829-1092',
    uanNumber: '100719283910',
    pfNumber: 'GJ/RAJ/0038192/025',
    salaryStructure: {
      baseSalary: 50000,
      hra: 20000,
      da: 6000,
      specialAllowance: 10000,
      conveyanceAllowance: 3000,
      medicalAllowance: 2500,
      pfDeductionEmployee: 6000,
      pfDeductionEmployer: 6000,
      professionalTax: 200,
      tdsTax: 3500,
      grossMonthlySalary: 91500,
      netMonthlySalary: 81800,
      annualCTC: 1170000
    },
    bankDetails: {
      bankName: 'Axis Bank',
      accountNumber: '918010049281920',
      ifscCode: 'UTIB0000492',
      branch: 'Limda Chowk, Rajkot',
      accountType: 'Salary'
    },
    territory: ['All'],
    productCategories: ['All'],
    scope: 'All',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  });

  // 8. CRM Leads & Inbound RFQs
  console.log('8. Generating Live CRM Leads & Engineering RFQs with attached Blueprints...');
  const lead1 = await post('/crm/leads', {
    leadNumber: 'WEL-LD-2026-1048',
    title: 'Custom Hydraulic 700 Bar Press Cylinder Requirement',
    companyName: 'Larsen & Toubro Heavy Engineering Ltd.',
    contactName: 'Manoj Joshi',
    contactEmail: 'm.joshi@lntheavy.com',
    contactPhone: '+91 98220 33445',
    country: 'India',
    city: 'Hazira, Surat',
    source: 'RFQ / Drawing Upload',
    stage: 'NEW_LEAD',
    priority: 'Urgent',
    assignedEmployeeId: emp1.data.id,
    assignedEmployeeName: emp1.data.name,
    categoryName: 'High Pressure Hydraulics',
    expectedQuantity: 24,
    estimatedValueUSD: 52000,
    technicalNotes: 'Customer uploaded 2D PDF & 3D STEP drawing for custom forging press cylinder with 2-hour SLA guarantee.',
    drawingFile: {
      name: 'L_and_T_Forging_Cylinder_Rev4.pdf',
      size: '4.2 MB',
      type: 'application/pdf',
      url: '/uploads/file-1789665096290-56620049.pdf'
    },
    slaDeadline: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    isSlaViolated: false,
    activities: [
      {
        id: `act-${Date.now()}-1`,
        leadId: 'lead-1',
        timestamp: new Date().toISOString(),
        type: 'Note',
        performedBy: 'Manoj Joshi (Purchasing Lead)',
        description: 'Uploaded engineering PDF drawing. High-temperature Viton sealing requested.'
      }
    ]
  });

  const lead2 = await post('/crm/leads', {
    leadNumber: 'WEL-LD-2026-2091',
    title: 'Bulk ISO 15552 Cylinders Supply for Packaging Line',
    companyName: 'Tata Consumer Products Ltd.',
    contactName: 'Sanjay Deshmukh',
    contactEmail: 'sanjay.d@tataconsumer.com',
    contactPhone: '+91 98250 88992',
    country: 'India',
    city: 'Pune',
    source: 'Website Public RFQ',
    stage: 'QUOTATION_SENT',
    priority: 'High',
    assignedEmployeeId: emp1.data.id,
    assignedEmployeeName: emp1.data.name,
    categoryName: 'Pneumatic Automation',
    expectedQuantity: 150,
    estimatedValueUSD: 28500,
    technicalNotes: 'Requirement for high-speed tea packaging line with magnetic sensors and stainless steel rods.',
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    isSlaViolated: false,
    activities: [
      {
        id: `act-${Date.now()}-2`,
        leadId: 'lead-2',
        timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
        type: 'Quotation_Sent',
        performedBy: emp1.data.name,
        description: 'Generated and emailed formal commercial quotation WEL-QT-2026-4819 for 150 PCS.'
      }
    ]
  });

  // 8.1 Create corresponding RFQ records in CRM RFQ Queue
  await post('/crm/rfqs', {
    leadId: lead1.data.id,
    leadNumber: lead1.data.leadNumber,
    companyName: lead1.data.companyName,
    contactPerson: lead1.data.contactName,
    email: lead1.data.contactEmail,
    phone: lead1.data.contactPhone,
    country: lead1.data.country,
    categoryName: lead1.data.categoryName,
    requirementType: 'Custom OEM Drawing',
    targetQuantity: lead1.data.expectedQuantity,
    targetUnit: 'PCS',
    materialPreference: 'Forged 42CrMo4 Steel / Viton Seals',
    pressureRating: '700 Bar Rated',
    drawingFileName: 'L_and_T_Forging_Cylinder_Rev4.pdf',
    drawingFileUrl: '/uploads/file-1789665096290-56620049.pdf',
    cadFileUrl: '/uploads/file-1789665096290-56620049.pdf',
    technicalNotes: lead1.data.technicalNotes,
    status: 'Pending Technical Review',
    createdAt: new Date().toISOString()
  });

  await post('/crm/rfqs', {
    leadId: lead2.data.id,
    leadNumber: lead2.data.leadNumber,
    companyName: lead2.data.companyName,
    contactPerson: lead2.data.contactName,
    email: lead2.data.contactEmail,
    phone: lead2.data.contactPhone,
    country: lead2.data.country,
    categoryName: lead2.data.categoryName,
    requirementType: 'Standard Product Modification',
    targetQuantity: lead2.data.expectedQuantity,
    targetUnit: 'PCS',
    materialPreference: 'Anodized Aluminum 6061-T6 Body / SS304 Piston Rod',
    pressureRating: '16 Bar Operating',
    drawingFileName: 'Tata_Packaging_Cylinder_Spec.pdf',
    drawingFileUrl: '/uploads/file-1789665096290-56620049.pdf',
    cadFileUrl: '/uploads/file-1789665096290-56620049.pdf',
    technicalNotes: lead2.data.technicalNotes,
    status: 'Quote Generated',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString()
  });

  // 9. Quotations
  console.log('9. Creating Commercial Line-Item Quotations...');
  await post('/crm/quotations', {
    leadId: lead2.data.id,
    leadNumber: lead2.data.leadNumber,
    companyName: lead2.data.companyName,
    contactName: lead2.data.contactName,
    email: lead2.data.contactEmail,
    items: [
      {
        id: `item-${Date.now()}-1`,
        productId: 'prod-pnc-01',
        productName: 'Heavy-Duty ISO 15552 Pneumatic Cylinder (Ø100mm)',
        sku: 'WEL-PNC-15552-100',
        quantity: 150,
        unitPriceUSD: 175,
        discountPercentage: 8,
        taxPercentage: 18,
        totalPriceUSD: 24150
      }
    ],
    subtotalUSD: 24150,
    taxTotalUSD: 4347,
    freightCostUSD: 850,
    grandTotalUSD: 29347,
    paymentTerms: '30% Advance, 70% against Proforma Invoice before Dispatch',
    deliveryTerms: 'Ex-Works Metoda (FOB Mundra Port for exports)',
    validityDays: 30,
    requiresApproval: false,
    status: 'Sent to Customer',
    approvalNotes: 'Standard volume pricing approved by Regional Sales Lead.'
  });

  // 10. Orders
  console.log('10. Creating Confirmed Production Orders & Tracking...');
  await post('/crm/orders', {
    leadId: lead2.data.id,
    quotationNumber: 'WEL-QT-2026-3091',
    companyName: 'Siemens Industrial Turbomachinery Ltd.',
    contactName: 'Alexander Vance',
    email: 'a.vance@siemens.com',
    totalAmountUSD: 48200,
    stage: 'CNC_MACHINING',
    expectedDeliveryDate: '2026-10-15',
    courierPartner: 'DHL Global Forwarding',
    courierTrackingNo: 'DHL-EX-9928194012',
    dispatchDate: '2026-10-12',
    lineItems: [
      {
        productName: '5-Axis CNC Aerospace Fuel Manifold Body',
        sku: 'WEL-5AX-AERO-MF01',
        quantity: 120,
        unitPriceUSD: 390
      }
    ]
  });

  // 11. Samples & Trials
  console.log('11. Creating Prototype Sample Requests & Laboratory Trials...');
  await post('/crm/samples', {
    sampleNumber: 'WEL-SMP-2026-102',
    leadId: lead1.data.id,
    companyName: 'Bharat Heavy Electricals Ltd. (BHEL)',
    productName: '700 Bar High-Pressure Cartridge Relief Valve',
    quantityRequested: 2,
    stage: 'Dispatched',
    courierPartner: 'BlueDart Express',
    courierTrackingNo: 'BLUEDART-882910492',
    dispatchDate: '2026-09-15'
  });

  await post('/crm/trials', {
    trialNumber: 'WEL-TRL-2026-049',
    leadId: lead1.data.id,
    companyName: 'Bharat Heavy Electricals Ltd. (BHEL)',
    productName: '700 Bar High-Pressure Cartridge Relief Valve',
    status: 'In Testing',
    completionDate: '2026-09-22',
    evaluatorEngineer: 'Rajesh Sharma (Senior QA & Design Lead)',
    testParameters: {
      pressureTestBar: 1050,
      leakageTestResult: '0.00 cc/min (Zero Bubble Helium Tested)',
      corrosionHours: 720,
      dimensionalAccuracy: '±0.003 mm'
    }
  });

  // 12. Payroll Records
  console.log('12. Generating Monthly Payroll & Salary Slips...');
  await post('/hrms/payroll', {
    payrollMonth: 'September 2026',
    payrollYear: 2026,
    employeeId: emp1.data.id,
    employeeCode: emp1.data.employeeCode,
    employeeName: emp1.data.name,
    department: emp1.data.department,
    designation: emp1.data.designation,
    bankName: emp1.data.bankDetails.bankName,
    bankAccountNumber: emp1.data.bankDetails.accountNumber,
    ifscCode: emp1.data.bankDetails.ifscCode,
    panNumber: emp1.data.panNumber,
    workingDays: 30,
    paidDays: 30,
    unpaidLeaves: 0,
    overtimeHours: 8,
    overtimeRate: 850,
    overtimePay: 6800,
    performanceBonus: 15000,
    baseSalary: emp1.data.salaryStructure.baseSalary,
    hra: emp1.data.salaryStructure.hra,
    da: emp1.data.salaryStructure.da,
    specialAllowance: emp1.data.salaryStructure.specialAllowance,
    conveyanceAllowance: emp1.data.salaryStructure.conveyanceAllowance,
    medicalAllowance: emp1.data.salaryStructure.medicalAllowance,
    grossEarnings: 228800,
    pfDeduction: 13200,
    professionalTax: 200,
    tdsTax: 18500,
    leaveDeduction: 0,
    otherDeductions: 0,
    totalDeductions: 31900,
    netPayable: 196900,
    status: 'Disbursed',
    paymentMode: 'NEFT / RTGS',
    transactionReference: 'NEFT-SBI-20260918-99281',
    disbursedAt: new Date().toISOString(),
    remarks: 'Approved by Director. Disbursed via SBI Corporate Banking.'
  });

  // 13. Attendance & Leaves
  console.log('13. Logging Shop Floor Attendance & Leave Requests...');
  await post('/hrms/attendance', {
    employeeId: emp1.data.id,
    employeeName: emp1.data.name,
    department: emp1.data.department,
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:02 AM',
    checkOut: '06:15 PM',
    shift: 'General Day (09:00 - 18:00)',
    totalHours: 9.2,
    overtimeHours: 0.5,
    status: 'Present'
  });

  await post('/hrms/attendance', {
    employeeId: emp2.data.id,
    employeeName: emp2.data.name,
    department: emp2.data.department,
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:58 AM',
    checkOut: '06:05 PM',
    shift: 'General Day (09:00 - 18:00)',
    totalHours: 9.1,
    overtimeHours: 0.2,
    status: 'Present'
  });

  await post('/hrms/leaves', {
    employeeId: emp2.data.id,
    employeeName: emp2.data.name,
    department: emp2.data.department,
    leaveType: 'Earned / Paid Leave',
    startDate: '2026-10-02',
    endDate: '2026-10-05',
    totalDays: 4,
    reason: 'Family wedding ceremony at Ahmedabad.',
    status: 'Approved',
    approvedBy: 'Pooja Dave (HR Manager)',
    appliedAt: new Date(Date.now() - 86400 * 1000).toISOString()
  });

  console.log('🎉 100% Realistic Industrial Manufacturing Data Population Completed Successfully!');
}

main().catch(err => console.error('Error during data population:', err));
