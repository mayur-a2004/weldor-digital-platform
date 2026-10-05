import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ptiq7p8r',
  api_key: process.env.CLOUDINARY_API_KEY || '312621411738839',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Zu-q2czVP-0ANJrK_150CY6MKng'
});

const MANIFEST_PATH = path.join(__dirname, 'cloudinary_manifest.json');
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {
    manifest = {};
  }
}

const saveManifest = () => {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
};

// Upload single file with retry & cache
async function uploadFile(filePath, folder, customName) {
  const baseName = customName || path.basename(filePath);
  const cacheKey = `${folder}/${baseName}`;
  if (manifest[cacheKey]) {
    console.log(`⚡ Cached: ${cacheKey} -> ${manifest[cacheKey]}`);
    return manifest[cacheKey];
  }

  try {
    console.log(`📤 Uploading: ${baseName} to ${folder}...`);
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: 'auto'
    });
    manifest[cacheKey] = res.secure_url;
    saveManifest();
    console.log(`✅ Uploaded: ${baseName} -> ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.error(`❌ Upload failed for ${baseName}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('========================================================');
  console.log('🚀 Starting Master Cloudinary & MongoDB Synchronization');
  console.log('========================================================');

  // 1. Upload Catalog Pages (12 pages)
  const catalogPagesDir = path.join(ROOT_DIR, 'public', 'catalog_pages');
  const catalogPageUrls = {};
  if (fs.existsSync(catalogPagesDir)) {
    const pageFiles = fs.readdirSync(catalogPagesDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    console.log(`\n📑 Uploading ${pageFiles.length} Catalog Pages to Cloudinary...`);
    for (const file of pageFiles) {
      const url = await uploadFile(path.join(catalogPagesDir, file), 'weldor/catalog_pages', file);
      if (url) catalogPageUrls[file] = url;
    }
  }

  // 2. Upload DSLR Product Photos from drive-download folder
  const dslrDir = 'C:/Users/Admin/Downloads/drive-download-20260925T163338Z-1-001';
  const dslrUrls = [];
  if (fs.existsSync(dslrDir)) {
    const dslrFiles = fs.readdirSync(dslrDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png'));
    console.log(`\n📸 Uploading ${dslrFiles.length} DSLR Product Photography Files to Cloudinary...`);
    for (const file of dslrFiles) {
      const url = await uploadFile(path.join(dslrDir, file), 'weldor/products', file);
      if (url) dslrUrls.push(url);
    }
  }

  // Catalog PDF CDN URL (already uploaded)
  const CATALOG_PDF_CDN_URL = 'https://res.cloudinary.com/ptiq7p8r/raw/upload/v1790679137/weldor/catalogs/Weldor_Welding_Catalog_CDN.pdf';

  console.log(`\n📊 Upload Summary:`);
  console.log(` - Catalog Pages on Cloudinary: ${Object.keys(catalogPageUrls).length}`);
  console.log(` - DSLR Product Photos on Cloudinary: ${dslrUrls.length}`);
  console.log(` - Catalog PDF on Cloudinary: ${CATALOG_PDF_CDN_URL}`);

  // Helper to get catalog page Cloudinary URL
  const getPageUrl = (pageName, fallbackIdx = 0) => {
    return catalogPageUrls[pageName] || dslrUrls[fallbackIdx % dslrUrls.length] || '';
  };

  // 3. Define Official Categories with Cloudinary CDN Images
  const categories = [
    {
      id: "cat-wel-01",
      name: "MIG / CO2 & TIG Welding Torches",
      slug: "mig-tig-welding-torches",
      description: "Heavy-duty 24KD, 36KD, PANA 350A/500A, and precision high-frequency TIG welding torches with air-cooled and water-cooled configurations.",
      iconName: "Flame",
      productCount: 4,
      featured: true,
      image: getPageUrl('page_4.png', 0),
      bannerImage: getPageUrl('page_4.png', 0),
      subCategories: ["24KD MIG Torches", "36KD MIG Torches", "PANA 350A/500A Torches", "TIG Welding Torches (WP-18/26)"],
      seoKeywords: ["MIG welding torch", "24KD torch", "36KD torch", "PANA 500A torch", "TIG torch", "CO2 welding torch"],
      seoMetaTitle: "MIG & TIG Industrial Welding Torches | Weldor Industries",
      seoMetaDescription: "High-performance air-cooled and water-cooled MIG & TIG welding torches manufactured by Weldor Industries."
    },
    {
      id: "cat-cut-02",
      name: "Plasma & Gas Cutting Torches",
      slug: "plasma-gas-cutting-torches",
      description: "Manual handheld and Automatic CNC Plasma cutting torches up to 200A and injector / equal-pressure PNME & ANME gas cutting torches up to 300mm capacity.",
      iconName: "Zap",
      productCount: 4,
      featured: true,
      image: getPageUrl('page_6.png', 5),
      bannerImage: getPageUrl('page_7.png', 6),
      subCategories: ["Plasma Manual Torches", "Plasma Automatic CNC Torches", "PNME Injector Gas Torches", "ANME Equal Pressure Torches"],
      seoKeywords: ["plasma torch", "CNC plasma torch", "gas cutting torch", "PNME torch", "ANME cutting torch"],
      seoMetaTitle: "Plasma & Oxy-Fuel Gas Cutting Torches | Weldor Industries",
      seoMetaDescription: "Industrial plasma and gas cutting torches for structural steel cutting up to 300mm thickness."
    },
    {
      id: "cat-reg-03",
      name: "Industrial Gas Pressure Regulators",
      slug: "gas-pressure-regulators",
      description: "Heavy-duty forged brass gas pressure regulators and flowmeters for Oxygen, Acetylene, Argon/CO2, Nitrogen, Hydrogen, and LPG.",
      iconName: "Droplets",
      productCount: 4,
      featured: true,
      image: getPageUrl('page_9.png', 10),
      bannerImage: getPageUrl('page_9.png', 10),
      subCategories: ["Oxygen Regulators", "Acetylene Regulators", "Argon / CO2 Flowmeters", "Nitrogen High-Pressure Regulators"],
      seoKeywords: ["gas regulator", "oxygen regulator", "argon flowmeter", "acetylene regulator", "300 bar regulator"],
      seoMetaTitle: "Heavy-Duty Forged Brass Gas Pressure Regulators | Weldor",
      seoMetaDescription: "High-pressure forged brass gas regulators for oxy-fuel cutting, MIG/TIG shielding gas, and industrial heating."
    },
    {
      id: "cat-con-04",
      name: "Welding & Cutting Consumables",
      slug: "welding-cutting-consumables",
      description: "CuCrZr contact tips, conical MIG nozzles, gas diffusers, plasma electrodes, swirl rings, and precision CNC machined PNME/ANME cutting nozzles.",
      iconName: "Cpu",
      productCount: 3,
      featured: true,
      image: getPageUrl('page_10.png', 15),
      bannerImage: getPageUrl('page_8.png', 16),
      subCategories: ["MIG Contact Tips & Nozzles", "Plasma Electrodes & Nozzles", "PNME/ANME Cutting Tips", "Gas Diffusers & Insulators"],
      seoKeywords: ["MIG contact tip", "welding nozzle", "plasma electrode", "cutting nozzle", "gas diffuser"],
      seoMetaTitle: "Welding & Cutting Consumables & Spare Parts | Weldor",
      seoMetaDescription: "Precision machined copper and brass consumables for MIG, TIG, Plasma, and Oxy-Fuel torches."
    }
  ];

  // Helper to pick DSLR photos for products
  const getProductMedia = (primaryIdx, secondaryIdxs = []) => {
    const primary = dslrUrls[primaryIdx % dslrUrls.length] || getPageUrl('page_4.png');
    const gallery = [primary];
    for (const idx of secondaryIdxs) {
      if (dslrUrls[idx % dslrUrls.length]) {
        gallery.push(dslrUrls[idx % dslrUrls.length]);
      }
    }
    return { image: primary, gallery };
  };

  // 4. Define Official Products with Cloudinary CDN Images
  const products = [
    // Category 1: MIG & TIG Torches
    {
      id: "prod-weldor-01",
      sku: "WLD-MIG-24KD",
      name: "24KD MIG Welding Torch (250A Air-Cooled)",
      category: "MIG / CO2 & TIG Welding Torches",
      categoryId: "cat-wel-01",
      subCategory: "24KD MIG Torches",
      brand: "WELDOR",
      modelNumber: "WEL-24KD-PRO",
      tagline: "Heavy-duty ergonomic 250A MIG torch built for high-performance fabrication with smooth wire feeding.",
      description: "The 24KD MIG Welding Torch is a heavy-duty torch built for high-performance welding in industrial applications. Designed for durability and efficiency, it provides smooth wire feeding and consistent arc stability. Features an ergonomic rubber handle with ball-joint knuckle for reduced operator fatigue.",
      bulletPoints: [
        "Rated Current: 250A (CO2) / 220A (Mixed Gas) at 60% Duty Cycle.",
        "Cooling: High-efficiency Air-Cooled system with heavy copper conductor.",
        "Wire Diameter compatibility: 0.8 mm to 1.2 mm (Solid & Flux-cored).",
        "Available Cable Lengths: 3 meters, 4 meters, and 5 meters with EURO connector.",
        "Robust & ergonomic design with spring cable support for prolonged industrial usage."
      ],
      industries: ["Automotive & Sheet Metal", "General Fabrication", "Shipbuilding", "Heavy Machinery"],
      applications: ["MIG/MAG CO2 Structural Welding", "Automotive Body Fabrication", "Pipe & Tank Welding"],
      materials: ["High Conductivity Deoxidized Copper", "Heat-Resistant Silicone Rubber", "Reinforced Brass Body"],
      specifications: [
        { label: "Rated Current (CO2)", value: "250 A" },
        { label: "Rated Current (Mixed Gas)", value: "220 A" },
        { label: "Duty Cycle", value: "60%" },
        { label: "Wire Diameter", value: "0.8 - 1.2 mm" },
        { label: "Cooling Method", value: "Air-Cooled" },
        { label: "Cable Lengths", value: "3m / 4m / 5m" },
        { label: "Connection Type", value: "Universal EURO Connection" }
      ],
      featured: true,
      ...getProductMedia(0, [1, 2]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 48,
      priceINR: 3850,
      certifications: ["ISO 9001:2015", "Make in India", "MSME Certified", "CE Standard"],
      minOrderQty: 2,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["24KD MIG torch", "250A welding torch", "MIG gun", "air cooled MIG torch", "Weldor 24KD"],
      status: "Active"
    },
    {
      id: "prod-weldor-02",
      sku: "WLD-MIG-36KD",
      name: "36KD Heavy-Duty MIG Welding Torch (320A High-Performance)",
      category: "MIG / CO2 & TIG Welding Torches",
      categoryId: "cat-wel-01",
      subCategory: "36KD MIG Torches",
      brand: "WELDOR",
      modelNumber: "WEL-36KD-HD",
      tagline: "Industrial heavy-duty 320A MIG welding torch with heavy copper swan neck and superior heat dissipation.",
      description: "The 36KD MIG Welding Torch is a heavy-duty torch built for high-performance welding in heavy engineering and structural fabrication. Designed for maximum durability and thermal efficiency, it ensures smooth wire feeding and continuous high-current arc stability under extreme production cycles.",
      bulletPoints: [
        "Rated Current: 320A (CO2) / 290A (Mixed Gas) at 60% Duty Cycle.",
        "Heavy-duty swan neck with integrated gas diffuser and insulated nozzle.",
        "Wire Diameter compatibility: 0.8 mm to 1.6 mm.",
        "Ergonomic handle with knuckle joint and heavy-duty spring strain relief.",
        "Precision machined brass central adapter connector (EURO standard)."
      ],
      industries: ["Heavy Structural Engineering", "Boiler & Pressure Vessel Fabrication", "Railways & Metro Coaches"],
      applications: ["Multi-pass Heavy Plate Welding", "GMAW/FCAW Automatic & Semi-automatic Welding"],
      materials: ["Oxygen-Free Copper Swan Neck", "High-Grade Brass", "Heat-Resistant Phenolic Compound"],
      specifications: [
        { label: "Rated Current (CO2)", value: "320 A" },
        { label: "Rated Current (Mixed Gas)", value: "290 A" },
        { label: "Duty Cycle", value: "60%" },
        { label: "Wire Diameter Range", value: "0.8 - 1.6 mm" },
        { label: "Cooling Method", value: "Air-Cooled" },
        { label: "Connection", value: "EURO Central Adapter" }
      ],
      featured: true,
      ...getProductMedia(3, [4, 5]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 65,
      priceINR: 5200,
      certifications: ["ISO 9001:2015", "Make in India", "CE Compliant"],
      minOrderQty: 2,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["36KD MIG torch", "320A welding gun", "heavy duty MIG torch", "Euro connector MIG torch"],
      status: "Active"
    },
    {
      id: "prod-weldor-03",
      sku: "WLD-PANA-500A",
      name: "PANA 500A Industrial MIG Welding Torch (Water-Cooled)",
      category: "MIG / CO2 & TIG Welding Torches",
      categoryId: "cat-wel-01",
      subCategory: "PANA 350A/500A Torches",
      brand: "WELDOR",
      modelNumber: "WEL-PANA-500W",
      tagline: "Ultra high-power 500A water-cooled MIG torch designed for continuous robotic & automated heavy fabrication.",
      description: "The PANA 500A Water-Cooled MIG Torch delivers exceptional thermal management for the most demanding heavy duty production lines. Engineered for 100% duty cycle operation at 500 Amperes, it prevents nozzle burn and contact tip expansion even during multi-shift non-stop welding.",
      bulletPoints: [
        "100% Duty Cycle at 500A under pure CO2 shielding gas.",
        "Dual-circuit liquid cooling ensures direct chiller water circulation up to the torch tip.",
        "Compatible with heavy flux-cored and solid wires up to 2.0 mm diameter.",
        "Heavy brass head and double-insulated outer protection jacket.",
        "Available with Panasonic-style backend or EURO central connection."
      ],
      industries: ["Earth Moving Equipment", "Shipbuilding & Marine", "Structural Steel Fabricators"],
      applications: ["High-deposition Multi-pass GMAW", "Robotic Automation & Column-Boom Welding"],
      materials: ["Tellurium Copper Conductors", "EPDM Reinforced Water Hoses", "Impact-Resistant Polymer"],
      specifications: [
        { label: "Current Rating (CO2)", value: "500 A" },
        { label: "Current Rating (Mixed Gas)", value: "450 A" },
        { label: "Duty Cycle", value: "100%" },
        { label: "Cooling Type", value: "Liquid / Water Cooled" },
        { label: "Wire Size", value: "1.0 - 2.0 mm" }
      ],
      featured: true,
      ...getProductMedia(6, [7, 8]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 115,
      priceINR: 9200,
      certifications: ["ISO 9001:2015", "CE Standard"],
      minOrderQty: 1,
      standardLeadTimeDays: 3,
      inStock: true,
      seoKeywords: ["PANA 500A", "water cooled MIG torch", "500A welding torch", "robotic MIG gun"],
      status: "Active"
    },
    {
      id: "prod-weldor-04",
      sku: "WLD-TIG-WP18",
      name: "WP-18 Water-Cooled Heavy Duty TIG Welding Torch (350A)",
      category: "MIG / CO2 & TIG Welding Torches",
      categoryId: "cat-wel-01",
      subCategory: "TIG Welding Torches (WP-18/26)",
      brand: "WELDOR",
      modelNumber: "WEL-WP18-350W",
      tagline: "Precision high-amperage 350A TIG torch with direct silicon cooling jacket for flawless root runs.",
      description: "The WP-18 TIG Torch is engineered for precision welding of high-alloy steels, titanium, aluminium, and pressure vessel piping. High-capacity liquid cooling provides maximum operator comfort and extended consumable life under high continuous current.",
      bulletPoints: [
        "Rated Current: 350A DC / 260A AC at 100% Duty Cycle.",
        "Flexible torch body option available for tight angle pipe work.",
        "Tungsten electrode capacity: 0.5 mm to 4.0 mm.",
        "Silicone rubber outer hose cable assembly with leather front guard.",
        "Available in 4-meter and 8-meter lengths with standard two-pin trigger switch."
      ],
      industries: ["Nuclear & Defense", "Aerospace & Chemical Reactors", "Dairy & Food Processing Equipment"],
      applications: ["GTAW High-Purity Root Pass", "Sanitary Stainless Steel Piping", "Aluminium AC TIG Welding"],
      materials: ["Silicon Nitride Insulators", "Deoxidized Copper Heat Sink", "Super-flex Braided Hoses"],
      specifications: [
        { label: "Current (DC)", value: "350 A" },
        { label: "Current (AC)", value: "260 A" },
        { label: "Duty Cycle", value: "100%" },
        { label: "Electrode Size", value: "0.5 - 4.0 mm" },
        { label: "Cooling Method", value: "Water Cooled" }
      ],
      featured: false,
      ...getProductMedia(9, [10, 11]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 78,
      priceINR: 6250,
      certifications: ["ISO 9001:2015", "CE Standard"],
      minOrderQty: 1,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["WP-18 TIG torch", "350A TIG torch", "water cooled TIG torch", "Argon welding torch"],
      status: "Active"
    },

    // Category 2: Plasma & Gas Cutting Torches
    {
      id: "prod-weldor-05",
      sku: "WLD-PLS-P80",
      name: "P-80 High-Frequency Pilot Arc Plasma Cutting Torch (100A)",
      category: "Plasma & Gas Cutting Torches",
      categoryId: "cat-cut-02",
      subCategory: "Plasma Manual Torches",
      brand: "WELDOR",
      modelNumber: "WEL-P80-PRO",
      tagline: "Pilot Arc non-contact plasma torch cutting up to 40mm steel plate with dross-free bevel quality.",
      description: "The P-80 Plasma Torch is an industry benchmark for manual air plasma cutting. Featuring an efficient pilot arc ignition system, it cuts through painted, rusted, and galvanized metals with zero surface prep. High thermal efficiency ensures long electrode and nozzle lifespan.",
      bulletPoints: [
        "Cutting Capacity: Severance up to 40mm, Quality cut up to 32mm.",
        "Rated Current: 100 Amps at 60% Duty Cycle.",
        "Pilot Arc start allows instant cutting on perforated sheets and expanded metal.",
        "Reinforced fiberglass safety shield prevents spatter feedback.",
        "Standard M16x1.5 or Central connector with safety trigger lock."
      ],
      industries: ["Scrap Dismantling", "Metal Fabrication Shops", "Automotive Customization", "HVAC Ducting"],
      applications: ["Manual Air Plasma Cutting", "Gouging & Piercing of Structural Steels"],
      materials: ["Hafnium Core Electrodes", "Tellurium Copper Nozzles", "Fiberglass Insulated Body"],
      specifications: [
        { label: "Rated Current", value: "100 A" },
        { label: "Duty Cycle", value: "60%" },
        { label: "Max Cutting Thickness", value: "40 mm" },
        { label: "Air Pressure Required", value: "4.5 - 5.5 Bar" },
        { label: "Gas Flow Rate", value: "200 L/min" }
      ],
      featured: true,
      ...getProductMedia(12, [13, 14]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 58,
      priceINR: 4600,
      certifications: ["ISO 9001:2015", "CE Standard"],
      minOrderQty: 2,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["P80 plasma torch", "100A plasma cutter", "pilot arc plasma gun", "P-80 torch"],
      status: "Active"
    },
    {
      id: "prod-weldor-06",
      sku: "WLD-PLS-CNC200",
      name: "CNC Heavy Duty 200A Machine Plasma Torch (Automatic)",
      category: "Plasma & Gas Cutting Torches",
      categoryId: "cat-cut-02",
      subCategory: "Plasma Automatic CNC Torches",
      brand: "WELDOR",
      modelNumber: "WEL-CNC-200W",
      tagline: "Water-cooled straight machine barrel torch for 24/7 automated CNC gantry plasma tables.",
      description: "Designed specifically for industrial CNC profile cutting tables and robotic bevel gantries, the CNC-200W Machine Torch delivers razor-sharp edge squareness and minimal kerf width. Direct water cooling protects internal components during high-amperage continuous duty.",
      bulletPoints: [
        "Rated Current: 200 Amperes at 100% Continuous Duty Cycle.",
        "Piercing capacity up to 35mm, severance cutting up to 60mm carbon steel.",
        "35mm stainless steel barrel diameter compatible with standard CNC torch lifters.",
        "Integrated ohmic sensing cap and height controller compatibility.",
        "Available in 8m and 12m cable assemblies with heavy metallic conduit."
      ],
      industries: ["CNC Profile Cutting Centers", "Steel Service Yards", "Heavy Equipment Manufacturers"],
      applications: ["Automated CNC Plate Cutting", "High-speed Bevel Cutting", "Plasma Gouging"],
      materials: ["Chromium Zirconium Copper", "Precision Turned Brass", "Stainless Steel Barrel"],
      specifications: [
        { label: "Current Rating", value: "200 A" },
        { label: "Duty Cycle", value: "100%" },
        { label: "Quality Cut Capacity", value: "45 mm" },
        { label: "Severance Cut", value: "60 mm" },
        { label: "Cooling Method", value: "Liquid Cooled" }
      ],
      featured: true,
      ...getProductMedia(15, [16, 17]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 185,
      priceINR: 14800,
      certifications: ["ISO 9001:2015", "CE Standard"],
      minOrderQty: 1,
      standardLeadTimeDays: 3,
      inStock: true,
      seoKeywords: ["CNC plasma torch", "machine plasma torch", "200A plasma gun", "automatic plasma torch"],
      status: "Active"
    },
    {
      id: "prod-weldor-07",
      sku: "WLD-GAS-PNME",
      name: "PNME Heavy Duty Injector Type Gas Cutting Blowpipe",
      category: "Plasma & Gas Cutting Torches",
      categoryId: "cat-cut-02",
      subCategory: "PNME Injector Gas Torches",
      brand: "WELDOR",
      modelNumber: "WEL-PNME-CUT",
      tagline: "Forged brass heavy-duty oxy-LPG/Propane cutting torch with 300mm cutting capacity.",
      description: "The PNME Injector Gas Cutting Torch is designed for optimal performance with Oxy-LPG and Oxy-Natural Gas. The precision engineered injector ensures intimate gas mixing for clean preheat flames and rapid piercing with zero backfire risk.",
      bulletPoints: [
        "Cutting Capacity: 3mm up to 300mm carbon steel plates.",
        "Drop forged brass body and stainless steel tubes for high mechanical strength.",
        "Precision brass control valves for needle-fine flame regulation.",
        "Forward-positioned cutting lever with lock latch for comfortable operation.",
        "Compatible with all international standard PNME two-piece cutting nozzles."
      ],
      industries: ["Steel Mills & Rolling Plants", "Demolition & Scrap Processing", "General Structural Fabrication"],
      applications: ["Manual Oxy-LPG Plate Cutting", "Ladle Skimming", "Riser & Runner Cutting in Foundries"],
      materials: ["Drop Forged Extruded Brass", "Seamless Stainless Steel Tubing", "Teflon Valve Seals"],
      specifications: [
        { label: "Cutting Thickness", value: "3 - 300 mm" },
        { label: "Fuel Gas", value: "LPG / Propane / Natural Gas" },
        { label: "Torch Length", value: "480 mm / 19 inches" },
        { label: "Torch Head Angle", value: "90° (Optional 75° / 180°)" },
        { label: "Mixing Principle", value: "Injector Mixing" }
      ],
      featured: false,
      ...getProductMedia(18, [19, 20]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 36,
      priceINR: 2850,
      certifications: ["ISO 9001:2015", "ISI Approved Standard"],
      minOrderQty: 3,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["PNME gas torch", "LPG cutting torch", "gas cutting blowpipe", "oxy propane torch"],
      status: "Active"
    },
    {
      id: "prod-weldor-08",
      sku: "WLD-GAS-ANME",
      name: "ANME Equal-Pressure Oxy-Acetylene Gas Cutting Torch",
      category: "Plasma & Gas Cutting Torches",
      categoryId: "cat-cut-02",
      subCategory: "ANME Equal Pressure Torches",
      brand: "WELDOR",
      modelNumber: "WEL-ANME-OXY",
      tagline: "Equal pressure 90° head torch for ultra-hot Oxy-Acetylene flame cutting up to 300mm.",
      description: "The ANME Nozzle-Mix Cutting Torch provides maximum operator safety by mixing Oxygen and Acetylene directly inside the solid copper nozzle head rather than in the torch body. This eliminates flash-back hazards in demanding shipyard and railway work.",
      bulletPoints: [
        "Nozzle-mix technology eliminates internal flash-back hazards.",
        "Cuts structural steels from 3mm up to 300mm with ANME solid copper tips.",
        "Triple stainless steel gas tubes arranged in triangular formation for maximum stiffness.",
        "Heavy forged head prevents deformation when working close to molten slag.",
        "Ergonomic fluted brass handle provides non-slip grip even with leather welding gloves."
      ],
      industries: ["Shipyards & Offshore Platforms", "Railway Workshops", "Foundries & Forge Plants"],
      applications: ["Heavy Plate Beveling", "Oxy-Acetylene Cutting", "Flame Gouging"],
      materials: ["Extruded Forged Brass", "Austenitic Stainless Steel 304", "Monel Valve Spindles"],
      specifications: [
        { label: "Cutting Capacity", value: "3 - 300 mm" },
        { label: "Fuel Gas", value: "Dissolved Acetylene (DA)" },
        { label: "Mixing Location", value: "Inside Cutting Nozzle (Nozzle Mix)" },
        { label: "Head Angle", value: "90° Standard" },
        { label: "Inlet Connection", value: "3/8\" BSP Right / Left" }
      ],
      featured: false,
      ...getProductMedia(21, [22, 23]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 42,
      priceINR: 3350,
      certifications: ["ISO 9001:2015", "CE Standard"],
      minOrderQty: 3,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["ANME torch", "oxy acetylene cutting torch", "nozzle mix blowpipe", "acetyl torch"],
      status: "Active"
    },

    // Category 3: Gas Pressure Regulators
    {
      id: "prod-weldor-09",
      sku: "WLD-REG-OXY300",
      name: "Heavy-Duty Forged Brass Oxygen Pressure Regulator (300 Bar)",
      category: "Industrial Gas Pressure Regulators",
      categoryId: "cat-reg-03",
      subCategory: "Oxygen Regulators",
      brand: "WELDOR",
      modelNumber: "WEL-REG-OXY",
      tagline: "Solid forged brass 300 bar inlet oxygen regulator with dual safety blow-off valves.",
      description: "Manufactured from high-density forged brass bar-stock, this industrial Oxygen Regulator withstands up to 300 Bar inlet cylinder pressure. Engineered with neoprene diaphragm and stainless steel valve pin, it ensures non-fluctuating delivery pressure for continuous cutting.",
      bulletPoints: [
        "Inlet Pressure: Up to 300 Bar (4350 PSI), Outlet Pressure: 0 - 10 Bar (145 PSI).",
        "Body & bonnet machined from solid hot forged brass for extreme burst safety.",
        "Neoprene diaphragm with fabric reinforcement ensures instant response to flow demand.",
        "Dual 63mm pressure gauges with shatter-resistant safety acrylic lenses.",
        "Integrated sintered bronze inlet filter traps rust and pipeline particulates."
      ],
      industries: ["Steel Works & Fabrication", "Medical Gas Facilities", "Pipeline Construction"],
      applications: ["Oxy-Fuel Cutting & Gouging", "Industrial Gas Manifold Delivery", "Cylinder Filling Stations"],
      materials: ["Forged Brass CW617N", "Sintered Bronze Filter", "Neoprene Diaphragm"],
      specifications: [
        { label: "Max Inlet Pressure", value: "300 Bar" },
        { label: "Max Outlet Pressure", value: "10 Bar" },
        { label: "Rated Flow Rate", value: "120 m³/h" },
        { label: "Inlet Connection", value: "5/8\" BSP Right Hand Male" },
        { label: "Outlet Connection", value: "3/8\" BSP Right Hand Male" }
      ],
      featured: true,
      ...getProductMedia(24, [25, 26]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 38,
      priceINR: 2950,
      certifications: ["ISO 9001:2015", "EN ISO 2503", "BSI Certified"],
      minOrderQty: 2,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["oxygen regulator", "300 bar gas regulator", "brass oxygen regulator", "welding gas regulator"],
      status: "Active"
    },
    {
      id: "prod-weldor-10",
      sku: "WLD-REG-ARCO2",
      name: "Argon / CO2 Shielding Gas Regulator with Precision Flowmeter",
      category: "Industrial Gas Pressure Regulators",
      categoryId: "cat-reg-03",
      subCategory: "Argon / CO2 Flowmeters",
      brand: "WELDOR",
      modelNumber: "WEL-FLOW-ARG",
      tagline: "Precision 0 - 35 L/min graduated flowmeter regulator for zero-porosity MIG & TIG shielding.",
      description: "Designed for high-precision TIG and MIG welding, this regulator features a calibrated polycarbonate flow tube with a stainless steel ball indicator. It provides exact laminar shielding gas flow from 0 to 35 Litres per minute without turbulent surging.",
      bulletPoints: [
        "Inlet Cylinder Pressure: 200 Bar (3000 PSI).",
        "Calibrated Flow Range: 0 - 35 Litres/Minute for Argon and Argon/CO2 mixes.",
        "Impact-resistant polycarbonate outer cover protects calibrated inner flow tube.",
        "Internal preset pressure relief valve prevents over-pressurization.",
        "High-sensitivity needle valve allows fine-tuning for robotic and manual welding."
      ],
      industries: ["Precision Aerospace TIG", "Automotive Sheet Metal", "Stainless Tank & Pipe Welding"],
      applications: ["MIG/MAG Shielding Gas Delivery", "TIG Purge Gas Regulation", "Automated Robot Torch Supply"],
      materials: ["Extruded Brass Body", "Polycarbonate Tube", "Stainless Steel Float Ball"],
      specifications: [
        { label: "Max Inlet Pressure", value: "200 Bar" },
        { label: "Flow Capacity", value: "0 - 35 L/min" },
        { label: "Inlet Fitting", value: "G 5/8\" Male (BS 341 No. 3)" },
        { label: "Outlet Fitting", value: "3/8\" BSP RH with Hose Nipple" },
        { label: "Gas Service", value: "Argon, CO2, Ar/CO2 Mix, Helium" }
      ],
      featured: true,
      ...getProductMedia(27, [28, 29]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 44,
      priceINR: 3450,
      certifications: ["ISO 9001:2015", "EN ISO 2503"],
      minOrderQty: 2,
      standardLeadTimeDays: 2,
      inStock: true,
      seoKeywords: ["argon regulator", "CO2 flowmeter", "TIG gas regulator", "shielding gas flowmeter"],
      status: "Active"
    },

    // Category 4: Consumables
    {
      id: "prod-weldor-11",
      sku: "WLD-CON-TIP",
      name: "CuCrZr Heavy-Duty MIG Contact Tips (M6 / M8 / M10 Threads)",
      category: "Welding & Cutting Consumables",
      categoryId: "cat-con-04",
      subCategory: "MIG Contact Tips & Nozzles",
      brand: "WELDOR",
      modelNumber: "WEL-TIP-CUCRZR",
      tagline: "High thermal conductivity Copper-Chromium-Zirconium tips with 3x longer operational life.",
      description: "Manufactured from cold-drawn Copper-Chromium-Zirconium (CuCrZr) alloy, these contact tips maintain their bore diameter and electrical conductivity even at temperatures exceeding 450°C. Delivers 3 times the lifespan of standard E-Cu tips on robotic lines.",
      bulletPoints: [
        "CuCrZr Alloy Composition: Cr 0.6-1.2%, Zr 0.03-0.3%, Balance Cu (Hardness > 140 HB).",
        "High softening temperature (>450°C) prevents bore elongation and wire burn-back.",
        "Ultra-smooth wire bore with mirror finish minimizes friction and prevents wire stalling.",
        "Available in M6 (28mm), M8 (30mm), and M10 (35mm) threads for 0.8mm to 2.0mm wires.",
        "Packaged in corrosion-proof hermetic blister packs of 25 pcs."
      ],
      industries: ["Robotic Automotive Manufacturing", "Heavy Structural Steel", "Boiler Tube Fabrication"],
      applications: ["High-Duty MIG/MAG Production", "Automated Robotic Cells", "Hardfacing & Cladding"],
      materials: ["CuCrZr Precipitation-Hardened Copper", "Electroplated Silver Coating (Optional)"],
      specifications: [
        { label: "Material Grade", value: "CuCrZr (Copper Chromium Zirconium)" },
        { label: "Hardness", value: "> 140 HB" },
        { label: "Electrical Conductivity", value: "> 85% IACS" },
        { label: "Thread Options", value: "M6 x 28mm / M8 x 30mm / M10 x 35mm" },
        { label: "Wire Diameters", value: "0.8, 1.0, 1.2, 1.6, 2.0 mm" }
      ],
      featured: true,
      ...getProductMedia(0, [1, 2]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 1.8,
      priceINR: 140,
      certifications: ["ISO 9001:2015", "RoHS Compliant"],
      minOrderQty: 50,
      standardLeadTimeDays: 1,
      inStock: true,
      seoKeywords: ["CuCrZr contact tip", "MIG tip M8", "welding contact tip", "robotic contact tip"],
      status: "Active"
    },
    {
      id: "prod-weldor-12",
      sku: "WLD-CON-PNME-TIP",
      name: "PNME Two-Piece Cutting Nozzles (Sizes 1/32\" to 1/8\")",
      category: "Welding & Cutting Consumables",
      categoryId: "cat-con-04",
      subCategory: "PNME/ANME Cutting Tips",
      brand: "WELDOR",
      modelNumber: "WEL-NOZ-PNME",
      tagline: "Precision CNC milled copper outer shell with brass spline inner for Oxy-LPG cutting.",
      description: "Weldor PNME cutting nozzles feature a precision CNC-machined solid copper outer sheath and an extruded brass inner core with micro-splined preheat orifices. This design produces uniform, high-temperature preheat flames and an ultra-narrow high-pressure cutting oxygen stream.",
      bulletPoints: [
        "Two-piece design optimized for Oxy-LPG and Propane fuel gases.",
        "Outer nozzle made from pure deoxidized copper for maximum spatter repellence.",
        "Inner brass core with CNC milled flutes ensures laminar flame distribution.",
        "Available in 6 sizes: 1/32\" (3-6mm), 3/64\" (5-12mm), 1/16\" (10-75mm), 5/64\" (70-100mm), 3/32\" (90-150mm), 1/8\" (150-300mm).",
        "100% flame tested for zero leakage and uniform flame cone."
      ],
      industries: ["Shipbuilding Yards", "Steel Service Centers", "Bridge & Heavy Fabrication"],
      applications: ["Manual & Semi-Automatic Oxy-LPG Cutting", "Profile Machine Cutting"],
      materials: ["Electrolytic Tough Pitch Copper", "Free-Cutting Brass IS 319"],
      specifications: [
        { label: "Available Sizes", value: "1/32\", 3/64\", 1/16\", 5/64\", 3/32\", 1/8\"" },
        { label: "Plate Thickness Range", value: "3 mm to 300 mm" },
        { label: "Fuel Gas", value: "LPG / Propane / Natural Gas" },
        { label: "Cutting Oxygen Pressure", value: "1.5 - 7.0 Bar" },
        { label: "Preheat Oxygen Pressure", value: "1.5 - 2.5 Bar" }
      ],
      featured: false,
      ...getProductMedia(3, [4, 5]),
      catalogPdfUrl: CATALOG_PDF_CDN_URL,
      priceUSD: 4.5,
      priceINR: 360,
      certifications: ["ISO 9001:2015", "ISI 7653"],
      minOrderQty: 10,
      standardLeadTimeDays: 1,
      inStock: true,
      seoKeywords: ["PNME nozzle", "LPG cutting tip", "two piece cutting nozzle", "gas cutting tip"],
      status: "Active"
    }
  ];

  // 5. Connect to MongoDB Atlas & Store Data
  console.log('\n🍃 Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  console.log('✅ MongoDB Atlas connected successfully.');

  // Upsert Categories in MongoDB
  console.log(`\n📦 Storing ${categories.length} Categories in MongoDB Atlas...`);
  await db.collection('categories').deleteMany({});
  const catRes = await db.collection('categories').insertMany(categories);
  console.log(`✅ Inserted ${catRes.insertedCount} Categories into MongoDB!`);

  // Upsert Products in MongoDB
  console.log(`\n📦 Storing ${products.length} Products in MongoDB Atlas...`);
  await db.collection('products').deleteMany({});
  const prodRes = await db.collection('products').insertMany(products);
  console.log(`✅ Inserted ${prodRes.insertedCount} Products into MongoDB!`);

  // 6. Sync into Local JSON Files for 100% Offline / Fast API Uptime
  const localDirs = [
    path.join(ROOT_DIR, 'server', 'data'),
    path.join(ROOT_DIR, 'weldor-digital', 'server', 'data')
  ];

  for (const dir of localDirs) {
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf8');
      fs.writeFileSync(path.join(dir, 'products.json'), JSON.stringify(products, null, 2), 'utf8');
      console.log(`💾 Synced categories.json & products.json into ${dir}`);
    }
  }

  await mongoose.disconnect();
  console.log('\n========================================================');
  console.log('🎉 ALL PRODUCTS & CATEGORIES SYNCED TO CLOUDINARY & MONGODB!');
  console.log('========================================================');
}

main().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
