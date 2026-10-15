import { Product, ProductCategory, HeroBanner, GalleryMedia, Exhibition } from '../types';

export const OFFICIAL_WELDOR_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-wel-01",
    name: "MIG / CO2 & TIG Welding Torches",
    slug: "mig-tig-welding-torches",
    description: "Heavy-duty 24KD, 36KD, PANA 350A/500A, and precision high-frequency TIG welding torches with air-cooled and water-cooled configurations.",
    iconName: "Flame",
    productCount: 4,
    featured: true,
    image: "/catalog_pages/page_4.png",
    bannerImage: "/catalog_pages/page_4.png",
    subCategories: ["24KD MIG Torches", "36KD MIG Torches", "PANA 350A/500A Torches", "TIG Welding Torches (WP-18/26)"],
    seoKeywords: ["MIG welding torch", "24KD torch", "36KD torch", "PANA 500A torch", "TIG torch", "CO2 welding torch"],
    seoMetaTitle: "MIG & TIG Industrial Welding Torches | Weldor Industries",
    seoMetaDescription: "High-performance air-cooled and water-cooled MIG & TIG welding torches manufactured by Earth Metal Industries."
  },
  {
    id: "cat-cut-02",
    name: "Plasma & Gas Cutting Torches",
    slug: "plasma-gas-cutting-torches",
    description: "Manual handheld and Automatic CNC Plasma cutting torches up to 200A and injector / equal-pressure PNME & ANME gas cutting torches up to 300mm capacity.",
    iconName: "Zap",
    productCount: 4,
    featured: true,
    image: "/catalog_pages/page_6.png",
    bannerImage: "/catalog_pages/page_7.png",
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
    productCount: 5,
    featured: true,
    image: "/catalog_pages/page_9.png",
    bannerImage: "/catalog_pages/page_9.png",
    subCategories: ["Oxygen Regulators", "Acetylene Regulators", "Argon / CO2 Flowmeters", "Nitrogen High-Pressure Regulators", "Industrial LPG Regulators"],
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
    image: "/catalog_pages/page_10.png",
    bannerImage: "/catalog_pages/page_8.png",
    subCategories: ["MIG Contact Tips & Nozzles", "Plasma Electrodes & Nozzles", "PNME/ANME Cutting Tips", "Gas Diffusers & Insulators"],
    seoKeywords: ["MIG contact tip", "welding nozzle", "plasma electrode", "cutting nozzle", "gas diffuser"],
    seoMetaTitle: "Welding & Cutting Consumables & Spare Parts | Weldor",
    seoMetaDescription: "Precision machined copper and brass consumables for MIG, TIG, Plasma, and Oxy-Fuel torches."
  }
];

export const OFFICIAL_WELDOR_PRODUCTS: Product[] = [
  {
    "id": "prod-mig-24kd",
    "sku": "WLD-MIG-24KD",
    "name": "24KD MIG Welding Torch",
    "category": "MIG / CO2 & TIG Welding Torches",
    "categoryId": "cat-wel-01",
    "subCategory": "24KD MIG Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-24KD-PRO",
    "tagline": "Air-Cooled 250A Heavy-Duty Ergonomic MIG Torch",
    "description": "The 24KD MIG Welding Torch is a heavy-duty torch built for high-performance welding in industrial applications. Designed for durability and efficiency, it provides smooth wire feeding and consistent arc stability.",
    "bulletPoints": [
      "Rated Current: 250A (CO2) / 220A (Mixed Gas) at 60% Duty Cycle",
      "Reliable Air-Cooled heavy copper construction with optimum cooling channels",
      "Accommodates Wire Diameters from 1.0 mm to 1.6 mm with smooth feed liner",
      "Available in flexible cable lengths: 3m, 4m, & 5m industrial rubber sheathing",
      "Robust & ergonomic handle design for prolonged fatigue-free operator usage"
    ],
    "industries": [
      "Heavy Fabrication",
      "Automotive Assembly",
      "Shipbuilding",
      "Pipeline Construction",
      "Structural Steel"
    ],
    "applications": [
      "CO2 Welding",
      "MIG/MAG Solid Wire Welding",
      "Flux-Cored Wire Welding",
      "General Workshop Fabrication"
    ],
    "materials": [
      "Deoxidized High-Conductivity Copper",
      "Forged Brass",
      "Flame-Retardant Polymer",
      "Reinforced Cable"
    ],
    "specifications": [
      {
        "label": "Rated Current (CO2)",
        "value": "250A"
      },
      {
        "label": "Rated Current (Mixed Gas)",
        "value": "220A"
      },
      {
        "label": "Duty Cycle",
        "value": "60%"
      },
      {
        "label": "Cooling System",
        "value": "Air-Cooled"
      },
      {
        "label": "Wire Diameter Range",
        "value": "1.0 mm - 1.6 mm"
      },
      {
        "label": "Available Cable Lengths",
        "value": "3 m, 4 m, 5 m"
      },
      {
        "label": "Connection Interface",
        "value": "Euro Central Connector (KZ-2)"
      },
      {
        "label": "Standard",
        "value": "EN 60974-7 / ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_24kd_mig_torch.png",
    "gallery": [
      "/products/catalog/weldor_24kd_mig_torch.png",
      "/catalog_pages/page_4.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 45.0,
    "priceINR": 3450.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "24KD MIG torch",
      "24KD welding torch",
      "MIG torch 250A",
      "air cooled MIG gun",
      "Weldor MIG torch"
    ],
    "seoMetaTitle": "24KD MIG Welding Torch (250A) | Weldor Industries",
    "seoMetaDescription": "Official 24KD air-cooled 250A industrial MIG welding torch with ergonomic handle and smooth wire feeding.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-36kd",
    "sku": "WLD-MIG-36KD",
    "name": "36KD MIG Welding Torch",
    "category": "MIG / CO2 & TIG Welding Torches",
    "categoryId": "cat-wel-01",
    "subCategory": "36KD MIG Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-36KD-PRO",
    "tagline": "Heavy-Duty 320A High-Performance Industrial MIG Torch",
    "description": "The 36KD MIG Welding Torch is a heavy-duty torch built for high-performance welding in industrial applications. Designed for durability and efficiency, it provides smooth wire feeding and consistent arc stability.",
    "bulletPoints": [
      "Rated Current: 320A (CO2) / 290A (Mixed Gas) at 60% Duty Cycle",
      "High thermal dissipation air-cooled copper swan neck assembly",
      "Accommodates Wire Diameters from 1.0 mm to 1.6 mm for heavy deposition",
      "Available in heavy-duty cable lengths: 3m, 4m, & 5m with reinforced spring support",
      "Robust & ergonomic handle with trigger microswitch for continuous heavy fabrication"
    ],
    "industries": [
      "Heavy Machine Building",
      "Boiler Fabrication",
      "Railway Coach Manufacturing",
      "Heavy Structural Works"
    ],
    "applications": [
      "Heavy Plate Welding",
      "Multi-pass MIG/MAG",
      "High Current CO2 Welding",
      "Deposition Surfacing"
    ],
    "materials": [
      "Tellurium Copper",
      "Forged Brass",
      "Heavy-Duty Rubber Sheath",
      "Silver Contact Components"
    ],
    "specifications": [
      {
        "label": "Rated Current (CO2)",
        "value": "320A"
      },
      {
        "label": "Rated Current (Mixed Gas)",
        "value": "290A"
      },
      {
        "label": "Duty Cycle",
        "value": "60%"
      },
      {
        "label": "Cooling System",
        "value": "Air-Cooled"
      },
      {
        "label": "Wire Diameter Range",
        "value": "1.0 mm - 1.6 mm"
      },
      {
        "label": "Available Cable Lengths",
        "value": "3 m, 4 m, 5 m"
      },
      {
        "label": "Connection Interface",
        "value": "Euro Central Connector (KZ-2)"
      },
      {
        "label": "Standard",
        "value": "EN 60974-7 / ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_36kd_mig_torch.png",
    "gallery": [
      "/products/catalog/weldor_36kd_mig_torch.png",
      "/catalog_pages/page_4.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 58.0,
    "priceINR": 4450.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "36KD MIG torch",
      "36KD welding gun",
      "320A MIG torch",
      "heavy duty MIG torch",
      "Weldor 36KD"
    ],
    "seoMetaTitle": "36KD Heavy-Duty MIG Welding Torch (320A) | Weldor Industries",
    "seoMetaDescription": "High-durability 36KD air-cooled 320A MIG welding torch engineered for high-deposition industrial welding.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-pana",
    "sku": "WLD-MIG-PANA-500",
    "name": "PANA 350A/500A MIG Welding Torch",
    "category": "MIG / CO2 & TIG Welding Torches",
    "categoryId": "cat-wel-01",
    "subCategory": "PANA 350A/500A Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-PANA-500A",
    "tagline": "Heavy-Duty Panasonic Type Industrial CO2 Torch",
    "description": "The PANA 350A/500A MIG Torch is designed for heavy-duty industrial welding applications, ensuring superior performance and longevity.",
    "bulletPoints": [
      "Rated Current: 350A / 500A (CO2) high capacity for prolonged industrial usage",
      "Duty Cycle: 60% rated for severe factory environment operations",
      "High-quality copper components for excellent electrical & thermal conductivity",
      "Wire Diameter: 1.0 mm to 1.6 mm with smooth Panasonic wire feed liner",
      "Dual Connection Type availability: EURO or PANASONIC direct rear connector"
    ],
    "industries": [
      "Automotive Chassis",
      "Heavy Equipment",
      "Shipyards",
      "Mining Machinery",
      "Steel Mills"
    ],
    "applications": [
      "Automated & Semi-Automated Welding",
      "High Current CO2 Welding",
      "Heavy Deposition Fabrications"
    ],
    "materials": [
      "Oxygen-Free Copper",
      "Forged Brass",
      "Heavy Insulated Rubber Sheath"
    ],
    "specifications": [
      {
        "label": "Rated Current",
        "value": "350A / 500A (CO2)"
      },
      {
        "label": "Duty Cycle",
        "value": "60%"
      },
      {
        "label": "Cooling",
        "value": "Air-Cooled"
      },
      {
        "label": "Wire Diameter Range",
        "value": "1.0 mm - 1.6 mm"
      },
      {
        "label": "Available Cable Lengths",
        "value": "3 m, 4 m, 5 m"
      },
      {
        "label": "Connection Interface",
        "value": "EURO / PANASONIC"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_pana_350a_500a_torch.png",
    "gallery": [
      "/products/catalog/weldor_pana_350a_500a_torch.png",
      "/catalog_pages/page_5.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 62.0,
    "priceINR": 4850.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "PANA 350A",
      "PANA 500A",
      "Panasonic MIG torch",
      "CO2 welding torch 500A",
      "Weldor PANA"
    ],
    "seoMetaTitle": "PANA 350A / 500A MIG Welding Torch | Weldor Industries",
    "seoMetaDescription": "High-current PANA 350A & 500A CO2 welding torch with Panasonic and Euro connection options.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-tig-torch",
    "sku": "WLD-TIG-WP26",
    "name": "TIG Welding Torch",
    "category": "MIG / CO2 & TIG Welding Torches",
    "categoryId": "cat-wel-01",
    "subCategory": "TIG Welding Torches (WP-18/26)",
    "brand": "WELDOR",
    "modelNumber": "WEL-TIG-PRO",
    "tagline": "Precision Air & Water Cooled High-Frequency TIG Torch",
    "description": "The TIG Welding Torch is engineered for precision welding, ensuring clean and high-quality welds in stainless steel, aluminum, and other metals.",
    "bulletPoints": [
      "Rated Current: 150A - 400A (Depending on air-cooled or water-cooled model)",
      "Duty Cycle: 60% with superior arc control and clean weld puddling",
      "Flexible Torch Head: Allows easy articulation for better control and maneuverability",
      "High-Temperature Resistant Silicone Rubber Handle for operator comfort",
      "Tungsten Electrode capacity: 1.0 mm to 3.0 mm; Cable Length: 1.0 m to 4.0 m"
    ],
    "industries": [
      "Aerospace Fabrication",
      "Stainless Steel Kitchenware",
      "Pharmaceutical Equipment",
      "Nuclear Piping"
    ],
    "applications": [
      "Precision TIG/GTAW",
      "Stainless Steel Welding",
      "Aluminum & Titanium Alloys",
      "Sanitary Piping"
    ],
    "materials": [
      "Tellurium Copper Collet Body",
      "Silicone Rubber Grip",
      "High-Dielectric Ceramic Alumina"
    ],
    "specifications": [
      {
        "label": "Rated Current",
        "value": "150A - 400A (Model dependent)"
      },
      {
        "label": "Duty Cycle",
        "value": "60%"
      },
      {
        "label": "Cooling Method",
        "value": "Air-Cooled & Water-Cooled Options"
      },
      {
        "label": "Tungsten Electrode Diameter",
        "value": "1.0 mm - 3.0 mm"
      },
      {
        "label": "Torch Head Type",
        "value": "Flexible Neck / Rigid Neck"
      },
      {
        "label": "Handle Construction",
        "value": "High-Temp Silicone Rubber"
      },
      {
        "label": "Standard",
        "value": "EN 60974-7 / ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_tig_welding_torch.png",
    "gallery": [
      "/products/catalog/weldor_tig_welding_torch.png",
      "/catalog_pages/page_5.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 55.0,
    "priceINR": 4200.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "TIG torch",
      "GTAW torch",
      "WP-26 TIG",
      "WP-18 water cooled TIG",
      "stainless steel TIG torch"
    ],
    "seoMetaTitle": "Precision TIG Welding Torch (150A - 400A) | Weldor Industries",
    "seoMetaDescription": "Flexible head TIG welding torch for stainless steel and aluminum with high-temperature silicone handle.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-pls-manual",
    "sku": "WLD-PLS-MAN-125",
    "name": "Plasma Manual Torch",
    "category": "Plasma & Gas Cutting Torches",
    "categoryId": "cat-cut-02",
    "subCategory": "Plasma Manual Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-PLS-MAN-125",
    "tagline": "Handheld Industrial Plasma Cutting Torch Up to 50mm",
    "description": "The Plasma Manual Torch delivers high-speed, precise cutting with minimal distortion, making it ideal for industrial metal cutting applications.",
    "bulletPoints": [
      "Rated Current: 40A - 200A (Depending on power source model)",
      "Heavy Cutting Capacity: Clean piercing and severing up to 50 mm plate thickness",
      "Cooling Options: High-velocity Air-Cooled & Heavy-Duty Water-Cooled models",
      "Durable Electrode & Nozzle Design engineered for extended consumable life",
      "Universal Compatibility: Works seamlessly with all major plasma cutting power supplies"
    ],
    "industries": [
      "Steel Service Centers",
      "Scrap & Demolition",
      "Heavy Equipment Repair",
      "Fabrication Workshops"
    ],
    "applications": [
      "Manual Plate Cutting",
      "Gouging & Chamfering",
      "Beveling Carbon Steel",
      "Stainless & Aluminum Severing"
    ],
    "materials": [
      "High-Strength Composite Body",
      "Silver-Hafnium Electrode Core",
      "Copper Nozzle"
    ],
    "specifications": [
      {
        "label": "Rated Current",
        "value": "40A - 200A (Model dependent)"
      },
      {
        "label": "Cutting Capacity",
        "value": "Up to 50 mm thickness"
      },
      {
        "label": "Cooling System",
        "value": "Air-Cooled & Water-Cooled"
      },
      {
        "label": "Gas Pressure Requirement",
        "value": "4.5 - 6.5 Bar Compressed Air"
      },
      {
        "label": "Pilot Arc",
        "value": "Non-HF / HF Contact Start"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_plasma_manual_torch.png",
    "gallery": [
      "/products/catalog/weldor_plasma_manual_torch.png",
      "/catalog_pages/page_6.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 85.0,
    "priceINR": 6800.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 3,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "plasma manual torch",
      "handheld plasma cutter torch",
      "plasma torch 50mm",
      "air plasma torch"
    ],
    "seoMetaTitle": "Manual Handheld Plasma Cutting Torch | Weldor Industries",
    "seoMetaDescription": "High-speed industrial manual plasma cutting torch with up to 50mm plate cutting capacity.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-pls-cnc",
    "sku": "WLD-PLS-CNC-200",
    "name": "Plasma Automatic CNC Torch",
    "category": "Plasma & Gas Cutting Torches",
    "categoryId": "cat-cut-02",
    "subCategory": "Plasma Automatic CNC Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-PLS-CNC-200",
    "tagline": "Precision Straight-Barrel CNC Gantry Plasma Cutting Torch",
    "description": "The Plasma Automatic CNC Torch delivers high-speed, precise cutting with minimal distortion, making it ideal for industrial metal cutting applications.",
    "bulletPoints": [
      "Straight-barrel machine design optimized for CNC gantry & robotic table mounting",
      "Rated Current: 40A - 200A for rapid production profile cutting",
      "Cutting Capacity: Up to 50 mm thickness with zero dross and high bevel accuracy",
      "Cooling: Air-Cooled & Water-Cooled high duty cycle configurations",
      "Durable Electrode & Nozzle Design for continuous shift automated cutting"
    ],
    "industries": [
      "CNC Profile Cutting Centers",
      "Automotive Stamping",
      "Structural Gantry Works",
      "Pressure Vessel Fabricators"
    ],
    "applications": [
      "Automated CNC Table Cutting",
      "Robotic Profiling",
      "Bevel Edge Prep",
      "Precision Piercing"
    ],
    "materials": [
      "Precision Turned Aluminum/Delrin Barrel",
      "Tellurium Copper Heat Shield",
      "Hafnium Insert"
    ],
    "specifications": [
      {
        "label": "Rated Current",
        "value": "40A - 200A"
      },
      {
        "label": "Cutting Capacity",
        "value": "Up to 50 mm thickness"
      },
      {
        "label": "Cooling System",
        "value": "Air-Cooled & Water-Cooled"
      },
      {
        "label": "Mounting Type",
        "value": "35mm / 50mm Machine Torch Clamp"
      },
      {
        "label": "Compatibility",
        "value": "All Major CNC Controller & Height Control Systems"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_plasma_cnc_torch.png",
    "gallery": [
      "/products/catalog/weldor_plasma_cnc_torch.png",
      "/catalog_pages/page_6.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 110.0,
    "priceINR": 8900.0,
    "certifications": [
      "ISO 9001:2015",
      "CE Certified",
      "Make in India"
    ],
    "minOrderQty": 2,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "CNC plasma torch",
      "automatic plasma torch",
      "straight plasma torch",
      "gantry cutting plasma torch"
    ],
    "seoMetaTitle": "Automatic CNC Machine Plasma Cutting Torch | Weldor Industries",
    "seoMetaDescription": "High-precision straight barrel CNC plasma torch for automated cutting gantries and robotic tables.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-cut-pnme",
    "sku": "WLD-CUT-PNME-300",
    "name": "PNME Gas Cutting Torch",
    "category": "Plasma & Gas Cutting Torches",
    "categoryId": "cat-cut-02",
    "subCategory": "PNME Injector Gas Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-PNME-300",
    "tagline": "Injector Type Heavy Oxy-Acetylene Cutting Torch (300mm)",
    "description": "High-performance injector type gas cutting torch built with forged brass and stainless steel control lever for smooth, precise cutting up to 300mm thickness.",
    "bulletPoints": [
      "Type: Injector Type with Pressure Mixing System for safety & flame stability",
      "Extreme Cutting Capacity: Effortlessly cuts steel plate up to 300 mm thickness",
      "Gas Compatibility: Engineered specifically for Oxygen-Acetylene industrial service",
      "Nozzle Compatibility: Standard PNME copper/brass cutting nozzles",
      "Body Material: Heavy Forged Brass head with stainless steel cutting oxygen lever"
    ],
    "industries": [
      "Ship Breaking",
      "Steel Rolling Mills",
      "Heavy Machinery Dismantling",
      "Bridge Construction"
    ],
    "applications": [
      "Oxy-Acetylene Cutting",
      "Scrap Processing",
      "Riser Removal",
      "Heavy Ingot Severing"
    ],
    "materials": [
      "Heavy Forged Brass",
      "Stainless Steel Tubes & Lever",
      "Precision Knurled Control Knobs"
    ],
    "specifications": [
      {
        "label": "Torch Type",
        "value": "Injector Type"
      },
      {
        "label": "Mixing System",
        "value": "Pressure Type Mixing"
      },
      {
        "label": "Cutting Capacity",
        "value": "Up to 300 mm"
      },
      {
        "label": "Gas Compatibility",
        "value": "Oxygen-Acetylene"
      },
      {
        "label": "Nozzle Type",
        "value": "PNME Standard Nozzles"
      },
      {
        "label": "Body Material",
        "value": "Forged Brass with Stainless Steel Lever"
      },
      {
        "label": "Handle",
        "value": "Ergonomic Fluted Grip for Operator Comfort"
      },
      {
        "label": "Standard",
        "value": "IS 7653 / ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_pnme_gas_cutting_torch.png",
    "gallery": [
      "/products/catalog/weldor_pnme_gas_cutting_torch.png",
      "/catalog_pages/page_7.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 38.0,
    "priceINR": 2950.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "PNME torch",
      "injector gas cutting torch",
      "oxy acetylene cutting torch",
      "gas blowpipe 300mm"
    ],
    "seoMetaTitle": "PNME Injector Gas Cutting Torch (300mm) | Weldor Industries",
    "seoMetaDescription": "Heavy-duty injector type PNME gas cutting torch with 300mm cutting capacity for Oxygen-Acetylene.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-cut-anme",
    "sku": "WLD-CUT-ANME-300",
    "name": "ANME Gas Cutting Torch",
    "category": "Plasma & Gas Cutting Torches",
    "categoryId": "cat-cut-02",
    "subCategory": "ANME Equal Pressure Torches",
    "brand": "WELDOR",
    "modelNumber": "WEL-ANME-300",
    "tagline": "Equal Pressure Heavy Oxy-LPG & Acetylene Cutting Torch",
    "description": "Equal pressure heavy-duty gas cutting torch with nozzle-mixing head design, providing outstanding flashback resistance and smooth operation up to 300mm thickness.",
    "bulletPoints": [
      "Type: Equal Pressure Type with in-nozzle mixing for extreme safety",
      "Cutting Capacity: Up to 300 mm plate thickness with clean kerf edges",
      "Multi-Fuel Gas Compatibility: Compatible with Oxygen-LPG & Oxygen-Acetylene",
      "Nozzle Compatibility: Standard ANME two-piece and single-piece nozzles",
      "Durable & efficient design for smooth, reliable continuous factory cutting"
    ],
    "industries": [
      "Shipyards",
      "Fabrication Yards",
      "Railway Maintenance",
      "Structural Steel Fabricators"
    ],
    "applications": [
      "Oxy-Propane / LPG Cutting",
      "Oxy-Acetylene Cutting",
      "Beveling Heavy Plate",
      "Scrap Severing"
    ],
    "materials": [
      "Forged Brass Head",
      "Seamless Stainless Steel Gas Tubes",
      "Stainless Steel High-Pressure Lever"
    ],
    "specifications": [
      {
        "label": "Torch Type",
        "value": "Equal Pressure Type"
      },
      {
        "label": "Mixing System",
        "value": "Equal Pressure / Nozzle Mix"
      },
      {
        "label": "Cutting Capacity",
        "value": "Up to 300 mm"
      },
      {
        "label": "Gas Compatibility",
        "value": "Oxygen-LPG / Oxygen-Acetylene"
      },
      {
        "label": "Nozzle Type",
        "value": "ANME Standard Nozzles"
      },
      {
        "label": "Body Material",
        "value": "Brass with Stainless Steel Lever"
      },
      {
        "label": "Design",
        "value": "Durable & Efficient for Smooth Operation"
      },
      {
        "label": "Standard",
        "value": "IS 7653 / ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_anme_cutting_torch.png",
    "gallery": [
      "/products/catalog/weldor_anme_cutting_torch.png",
      "/products/catalog/weldor_pnme_gas_cutting_torch.png",
      "/catalog_pages/page_7.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 40.0,
    "priceINR": 3100.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "ANME torch",
      "equal pressure cutting torch",
      "oxy LPG cutting torch",
      "gas cutter 300mm"
    ],
    "seoMetaTitle": "ANME Equal Pressure Gas Cutting Torch (300mm) | Weldor Industries",
    "seoMetaDescription": "Equal pressure ANME gas cutting torch compatible with Oxy-LPG and Oxy-Acetylene up to 300mm plate.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-csm-plasma-kit",
    "sku": "WLD-CSM-PLS-KIT",
    "name": "Plasma Cutting Torch Consumables",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Plasma Electrodes & Nozzles",
    "brand": "WELDOR",
    "modelNumber": "WEL-PLS-CSM-KIT",
    "tagline": "Precision Hafnium Electrodes, Swirl Nozzles & Wheel Guide Kit",
    "description": "Complete precision plasma cutting consumable pack featuring high-grade hafnium inserted electrodes, tellurium copper nozzles, dual-wheel standoff guides, and nozzle servicing wrenches.",
    "bulletPoints": [
      "Pure Hafnium insert electrodes for extended arc life and instant arc ignition",
      "Precision CNC drilled copper nozzles ensuring concentrated plasma column",
      "Includes heavy brass adjustable dual-roller wheeled standoff cutting guide",
      "Packed in protective transparent organizer cases for workshop efficiency",
      "Compatible with 40A to 120A industrial air plasma cutting torches"
    ],
    "industries": [
      "Sheet Metal Fabrication",
      "CNC Plasma Cutting",
      "HVAC Ducting",
      "Automotive Customization"
    ],
    "applications": [
      "Precision Plasma Cutting",
      "Circular Hole Piercing",
      "Gouging",
      "Standoff Guidance"
    ],
    "materials": [
      "Tellurium Copper",
      "Pure Hafnium Core",
      "Forged Brass Guide Wheels"
    ],
    "specifications": [
      {
        "label": "Contents",
        "value": "Electrodes, Nozzles, Shield Cups, Swirl Rings, Roller Guide"
      },
      {
        "label": "Current Rating",
        "value": "40A - 120A"
      },
      {
        "label": "Material",
        "value": "CuCrZr Copper with Hafnium Insert"
      },
      {
        "label": "Packaging",
        "value": "High-Impact Multi-Compartment Storage Cases"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_plasma_consumables.png",
    "gallery": [
      "/products/catalog/weldor_plasma_consumables.png",
      "/catalog_pages/page_8.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 28.0,
    "priceINR": 2200.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 10,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "plasma consumables",
      "plasma electrodes",
      "plasma nozzles",
      "plasma roller guide",
      "hafnium tips"
    ],
    "seoMetaTitle": "Plasma Cutting Torch Consumables & Spares | Weldor Industries",
    "seoMetaDescription": "High-durability hafnium electrodes, copper nozzles, and standoff wheel guides for plasma cutting.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-csm-gas-kit",
    "sku": "WLD-CSM-GAS-KIT",
    "name": "Gas Welding & Cutting Consumables",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "PNME/ANME Cutting Tips",
    "brand": "WELDOR",
    "modelNumber": "WEL-GAS-CSM-KIT",
    "tagline": "PNME/ANME Cutting Nozzles, Flashback Arrestors & Connectors",
    "description": "Industrial grade gas cutting and welding consumable collection including precision CNC PNME/ANME nozzles, dual-color certified flashback arrestors, heating tips, and brass couplings.",
    "bulletPoints": [
      "CNC machined copper PNME & ANME cutting nozzles for sharp, slag-free cuts",
      "Stainless steel & brass flashback arrestors (Red for Fuel, Blue for Oxygen)",
      "Forged brass high-pressure nuts, hose tail nipples, and regulator adaptor nipples",
      "Specialized injector needles for precise pre-heat and cutting gas mixture",
      "100% leak and flame tested at factory before dispatch"
    ],
    "industries": [
      "Heavy Steel Fabrication",
      "Foundry & Casting",
      "Demolition",
      "Boiler Erection"
    ],
    "applications": [
      "Oxy-Fuel Cutting",
      "Flame Gouging",
      "Pre-Heating",
      "Gas Line Safety Protection"
    ],
    "materials": [
      "Electrolytic Tough Pitch Copper",
      "High-Tensile Brass IS 319",
      "Stainless Steel"
    ],
    "specifications": [
      {
        "label": "Nozzle Compatibility",
        "value": "PNME & ANME Series (Sizes 1/32\" to 1/8\")"
      },
      {
        "label": "Flashback Arrestor Rating",
        "value": "EN 730-1 / ISO 5175 Certified (Up to 20 Bar Oxygen, 1.5 Bar Fuel)"
      },
      {
        "label": "Connection Threads",
        "value": "3/8\" BSP R/H and L/H Standard"
      },
      {
        "label": "Body Material",
        "value": "Solid Forged Brass & Copper"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_gas_cutting_consumables.png",
    "gallery": [
      "/products/catalog/weldor_gas_cutting_consumables.png",
      "/catalog_pages/page_8.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 24.0,
    "priceINR": 1850.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 10,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "gas cutting consumables",
      "PNME nozzles",
      "ANME nozzles",
      "flashback arrestor",
      "oxy fuel accessories"
    ],
    "seoMetaTitle": "Gas Welding & Cutting Consumables & Flashback Arrestors | Weldor",
    "seoMetaDescription": "Solid copper cutting nozzles, safety flashback arrestors, and precision brass gas fittings.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-co2",
    "sku": "WLD-REG-CO2-200B",
    "name": "Carbon Dioxide (CO2) Gas Pressure Regulator",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Argon / CO2 Flowmeters",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-CO2",
    "tagline": "Heavy-Duty Forged Brass 200 Bar CO2 Pressure Regulator",
    "description": "Heavy-duty dual gauge forged brass Carbon Dioxide (CO2) gas pressure regulator engineered for MIG/TIG welding and industrial gas dispensing.",
    "bulletPoints": [
      "Max Inlet Pressure: 200 Bar (Up to 4500 PSI testing range)",
      "Max Outlet Pressure: 4 Bar with smooth pressure adjustment knob",
      "Inlet Connection: 0.860\" * 14 TPI R/H (Female) standard CO2 cylinder fitment",
      "Outlet Connection: 3/8\" BSP R/H (Male) with brass hose barb nipple",
      "Forged brass body with stainless steel diaphragm for zero pressure creep"
    ],
    "industries": [
      "Automotive MIG Welding",
      "Beverage & Food Processing",
      "Industrial Shielding Gas",
      "Greenhouse CO2 Enrichment"
    ],
    "applications": [
      "MIG/MAG CO2 Shielding Gas",
      "TIG Purging",
      "Laser Cutting Assist",
      "Pressure Vessel Testing"
    ],
    "materials": [
      "Forged Extruded Brass",
      "High-Impact Neoprene Diaphragm",
      "Dual Brass Pressure Gauges"
    ],
    "specifications": [
      {
        "label": "Type of Gas",
        "value": "Carbon Dioxide (CO2)"
      },
      {
        "label": "Max Inlet Pressure",
        "value": "200 Bar"
      },
      {
        "label": "Max Outlet Pressure",
        "value": "4 Bar"
      },
      {
        "label": "Inlet Connection",
        "value": "0.860 * 14 TPI R/H (Female)"
      },
      {
        "label": "Outlet Connection",
        "value": "3/8\" BSP R/H (Male)"
      },
      {
        "label": "Body Material",
        "value": "Forged Brass (Made in India)"
      },
      {
        "label": "Application",
        "value": "MIG / TIG Welding"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015 / IS 6901"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_co2_regulator.png",
    "gallery": [
      "/products/catalog/weldor_co2_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 32.0,
    "priceINR": 2450.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "CO2 regulator",
      "carbon dioxide pressure regulator",
      "MIG welding gas regulator",
      "200 bar regulator"
    ],
    "seoMetaTitle": "Carbon Dioxide (CO2) Gas Pressure Regulator (200 Bar) | Weldor",
    "seoMetaDescription": "Forged brass 200 Bar dual-gauge CO2 gas regulator for MIG welding and industrial shielding gas.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-oxygen",
    "sku": "WLD-REG-O2-300B",
    "name": "Oxygen (O2) Gas Pressure Regulator",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Oxygen Regulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-O2",
    "tagline": "Heavy-Duty 300 Bar Forged Brass Oxygen Regulator",
    "description": "High-pressure forged brass Oxygen gas pressure regulator with 300 Bar inlet rating and 12 Bar outlet capacity for heavy industrial cutting and welding.",
    "bulletPoints": [
      "Max Inlet Pressure: 300 Bar with heavy-duty forged brass safety capsule",
      "Max Outlet Pressure: 12 Bar for deep penetration oxy-fuel cutting up to 300mm",
      "Inlet Connection: 5/8\" BSP R/H (Male) standard industrial cylinder thread",
      "Outlet Connection: 3/8\" BSP R/H (Male) with precision needle shut-off",
      "Dual calibrated gauges with safety blow-out relief valve"
    ],
    "industries": [
      "Shipyards",
      "Steel Plants",
      "Heavy Fabrication",
      "Scrap Yards",
      "Medical Oxygen Stations"
    ],
    "applications": [
      "Oxy-Fuel Cutting & Welding",
      "Heavy Steel Gouging",
      "Industrial Heating",
      "High-Flow Oxygen Delivery"
    ],
    "materials": [
      "Forged Brass IS 319",
      "Stainless Steel Valve Stem",
      "Sintered Bronze Filter"
    ],
    "specifications": [
      {
        "label": "Type of Gas",
        "value": "Oxygen (O2)"
      },
      {
        "label": "Max Inlet Pressure",
        "value": "300 Bar"
      },
      {
        "label": "Max Outlet Pressure",
        "value": "12 Bar"
      },
      {
        "label": "Inlet Connection",
        "value": "5/8\" BSP R/H (Male)"
      },
      {
        "label": "Outlet Connection",
        "value": "3/8\" BSP R/H (Male)"
      },
      {
        "label": "Body Material",
        "value": "Forged Brass Body"
      },
      {
        "label": "Application",
        "value": "Gas Cutting, Welding & Industrial Use"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015 / IS 6901"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_oxygen_regulator.png",
    "gallery": [
      "/products/catalog/weldor_oxygen_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 30.0,
    "priceINR": 2350.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "oxygen regulator",
      "O2 gas regulator",
      "300 bar oxygen regulator",
      "gas cutting regulator"
    ],
    "seoMetaTitle": "Oxygen (O2) Gas Pressure Regulator (300 Bar) | Weldor Industries",
    "seoMetaDescription": "300 Bar inlet heavy-duty forged brass Oxygen regulator for industrial cutting and fabrication.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-acetylene",
    "sku": "WLD-REG-DA-40B",
    "name": "Acetylene (DA) Gas Pressure Regulator",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Acetylene Regulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-DA",
    "tagline": "Safety Red-Bonnet Dissolved Acetylene Pressure Regulator",
    "description": "Forged brass safety red-bonnet Dissolved Acetylene (DA) regulator rated for 40 Bar inlet and 1.5 Bar outlet with left-hand fuel gas safety threads.",
    "bulletPoints": [
      "Max Inlet Pressure: 40 Bar with safety burst disc and internal sintered filter",
      "Max Outlet Pressure: 1.5 Bar calibrated for explosive-safe acetylene delivery",
      "Inlet Connection: 5/8\" BSP L/H (Male) left-hand reverse safety fuel thread",
      "Outlet Connection: 3/8\" BSP L/H (Male) with knurled fuel gas barb",
      "Distinctive red powder-coated forged brass bonnet for instant hazard identification"
    ],
    "industries": [
      "Metal Fabrication",
      "Artisan Blacksmithing",
      "Piping & Pipelines",
      "Demolition"
    ],
    "applications": [
      "Oxy-Acetylene Welding",
      "Flame Cutting",
      "Brazing & Silver Soldering",
      "Localized Flame Heating"
    ],
    "materials": [
      "Forged Brass",
      "Fuel-Resistant Synthetic Diaphragm",
      "Stainless Steel Internal Springs"
    ],
    "specifications": [
      {
        "label": "Type of Gas",
        "value": "Dissolved Acetylene (DA)"
      },
      {
        "label": "Max Inlet Pressure",
        "value": "40 Bar"
      },
      {
        "label": "Max Outlet Pressure",
        "value": "1.5 Bar"
      },
      {
        "label": "Inlet Connection",
        "value": "5/8\" BSP L/H (Male)"
      },
      {
        "label": "Outlet Connection",
        "value": "3/8\" BSP L/H (Male)"
      },
      {
        "label": "Bonnet Color",
        "value": "Industrial Safety Red"
      },
      {
        "label": "Application",
        "value": "Welding & Cutting"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015 / IS 6901"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_acetylene_regulator.png",
    "gallery": [
      "/products/catalog/weldor_acetylene_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 30.0,
    "priceINR": 2350.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "acetylene regulator",
      "DA regulator",
      "dissolved acetylene gas regulator",
      "fuel gas regulator"
    ],
    "seoMetaTitle": "Acetylene (DA) Gas Pressure Regulator (40 Bar) | Weldor Industries",
    "seoMetaDescription": "Safety red-bonnet forged brass Dissolved Acetylene regulator for oxy-acetylene welding and cutting.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-nitrogen",
    "sku": "WLD-REG-N2-300B",
    "name": "Nitrogen (N2) Gas Pressure Regulator",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Nitrogen High-Pressure Regulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-N2",
    "tagline": "300 Bar High-Pressure Nitrogen & HVAC Testing Regulator",
    "description": "High-pressure forged brass Nitrogen gas regulator engineered with 300 Bar inlet capacity and 10 Bar controlled outlet for HVAC pressure testing and inert purging.",
    "bulletPoints": [
      "Max Inlet Pressure: 300 Bar rating for ultra-high cylinder pressures",
      "Max Outlet Pressure: 10 Bar stable delivery for refrigeration line testing",
      "Inlet Connection: 5/8\" BSP R/H (Male); Outlet: 3/8\" BSP R/H (Male)",
      "Forged brass high-density body resisting pressure cycles and temperature swings",
      "Ideal for pipe pressure holding tests, air conditioning leak detection, and inert blanketing"
    ],
    "industries": [
      "HVAC & Refrigeration",
      "Aviation Tire Inflation",
      "Chemical Blanketing",
      "Oil & Gas Pipeline Testing"
    ],
    "applications": [
      "Pressure Testing",
      "System Purging",
      "Laser Cutting Shielding",
      "Inert Tank Blanketing"
    ],
    "materials": [
      "Forged Brass IS 319",
      "Neoprene High-Pressure Diaphragm"
    ],
    "specifications": [
      {
        "label": "Type of Gas",
        "value": "Nitrogen (N2)"
      },
      {
        "label": "Max Inlet Pressure",
        "value": "300 Bar"
      },
      {
        "label": "Max Outlet Pressure",
        "value": "10 Bar"
      },
      {
        "label": "Inlet Connection",
        "value": "5/8\" BSP R/H (Male)"
      },
      {
        "label": "Outlet Connection",
        "value": "3/8\" BSP R/H (Male)"
      },
      {
        "label": "Application",
        "value": "HVAC, Purging & Pressure Testing"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_nitrogen_regulator.png",
    "gallery": [
      "/products/catalog/weldor_nitrogen_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 34.0,
    "priceINR": 2650.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "nitrogen regulator",
      "N2 regulator 300 bar",
      "HVAC testing regulator",
      "purging gas regulator"
    ],
    "seoMetaTitle": "Nitrogen (N2) Gas Pressure Regulator (300 Bar) | Weldor Industries",
    "seoMetaDescription": "Forged brass 300 Bar Nitrogen regulator for HVAC leak testing, pipeline purging, and industrial blanketing.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-argon",
    "sku": "WLD-REG-AR-300B",
    "name": "Argon (AR) Gas Pressure Regulator",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Argon / CO2 Flowmeters",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-AR",
    "tagline": "Precision Argon Shielding Gas Regulator for TIG & MIG",
    "description": "Precision dual-gauge forged brass Argon gas pressure regulator with 300 Bar inlet and sensitive 2 Bar outlet delivery for high-integrity TIG and pulsed MIG welding.",
    "bulletPoints": [
      "Max Inlet Pressure: 300 Bar; Max Outlet Pressure: 2 Bar for laminar shielding",
      "High sensitivity control valve prevents gas turbulence at the weld puddle",
      "Inlet Connection: 5/8\" BSP R/H (Male); Outlet: 3/8\" BSP R/H (Male)",
      "Heavy forged brass body with calibrated flow/pressure dial gauges",
      "Engineered for zero gas leakage and maximum gas economy on high-purity argon cylinders"
    ],
    "industries": [
      "Aerospace & Defense",
      "Stainless Steel Fabrication",
      "Alloy Pipe Welding",
      "Semiconductor Tooling"
    ],
    "applications": [
      "TIG Shielding Gas Control",
      "MIG Aluminum Welding",
      "Plasma Arc Welding Gas",
      "Purging Root Welds"
    ],
    "materials": [
      "Forged Brass",
      "Sintered Bronze Filter",
      "Precision Metering Needle"
    ],
    "specifications": [
      {
        "label": "Type of Gas",
        "value": "Argon (AR)"
      },
      {
        "label": "Max Inlet Pressure",
        "value": "300 Bar"
      },
      {
        "label": "Max Outlet Pressure",
        "value": "2 Bar"
      },
      {
        "label": "Inlet Connection",
        "value": "5/8\" BSP R/H (Male)"
      },
      {
        "label": "Outlet Connection",
        "value": "3/8\" BSP R/H (Male)"
      },
      {
        "label": "Application",
        "value": "TIG Welding & Shielding Gas Control"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_argon_regulator.png",
    "gallery": [
      "/products/catalog/weldor_argon_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 32.0,
    "priceINR": 2500.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "argon regulator",
      "TIG argon regulator",
      "shielding gas regulator",
      "argon flow gauge"
    ],
    "seoMetaTitle": "Argon (AR) Gas Pressure Regulator (300 Bar) | Weldor Industries",
    "seoMetaDescription": "High-accuracy forged brass Argon gas regulator for clean, porosity-free TIG and MIG welding.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-reg-lpg",
    "sku": "WLD-REG-LPG-17B",
    "name": "LPG Regulator (Industrial)",
    "category": "Industrial Gas Pressure Regulators",
    "categoryId": "cat-reg-03",
    "subCategory": "Industrial LPG Regulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-REG-LPG",
    "tagline": "Heavy-Duty Forged Brass Adjustable LPG Pressure Regulator",
    "description": "Heavy-duty forged brass industrial LPG pressure regulator with adjustable outlet pressure (0-4 Bar / 0-10 Bar) for welding, cutting, brazing, and high-heat commercial burners.",
    "bulletPoints": [
      "Gas Type: Liquefied Petroleum Gas (LPG) industrial commercial cylinders",
      "Adjustable Outlet Pressure: 0-4 Bar / 0-10 Bar controlled by top handwheel knob",
      "Inlet Pressure: Rated up to 17 Bar with heavy forged brass construction",
      "Dual safety T-pin locking screws for vibration-proof pressure holding",
      "Wide Applications: Oxy-LPG Cutting, Brazing & Soldering, Industrial Heating, Commercial LPG Systems"
    ],
    "industries": [
      "Commercial Kitchens",
      "Foundry Preheating",
      "Oxy-Propane Cutting",
      "Asphalt & Roofing Heating"
    ],
    "applications": [
      "Industrial Heating",
      "Welding & Cutting",
      "Brazing & Soldering",
      "Commercial LPG Burner Systems"
    ],
    "materials": [
      "Heavy-Duty Forged Brass Body",
      "High-Impact Polymer Bonnet Knob",
      "Brass Hose Nipple"
    ],
    "specifications": [
      {
        "label": "Gas Type",
        "value": "Liquefied Petroleum Gas (LPG)"
      },
      {
        "label": "Inlet Pressure",
        "value": "Up to 17 Bar"
      },
      {
        "label": "Outlet Pressure",
        "value": "0-4 Bar / 0-10 Bar (Adjustable)"
      },
      {
        "label": "Body Material",
        "value": "Heavy-Duty Forged Brass Body"
      },
      {
        "label": "Applications",
        "value": "Welding & Cutting, Brazing & Soldering, Heating"
      },
      {
        "label": "Standard",
        "value": "ISO 9001:2015"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_lpg_regulator.png",
    "gallery": [
      "/products/catalog/weldor_lpg_regulator.png",
      "/catalog_pages/page_9.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 26.0,
    "priceINR": 1950.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 5,
    "standardLeadTimeDays": 7,
    "inStock": true,
    "seoKeywords": [
      "LPG regulator",
      "industrial LPG regulator",
      "adjustable gas regulator",
      "brass LPG regulator"
    ],
    "seoMetaTitle": "Heavy-Duty Forged Brass Industrial LPG Regulator | Weldor Industries",
    "seoMetaDescription": "Adjustable 0-4 Bar / 0-10 Bar forged brass commercial LPG regulator for oxy-propane cutting and heating.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-cyl-nozzle",
    "sku": "WLD-MIG-NOZ-CYL",
    "name": "MIG Cylindrical Welding Nozzle",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "MIG Contact Tips & Nozzles",
    "brand": "WELDOR",
    "modelNumber": "WEL-NOZ-CYL-36",
    "tagline": "Heavy-Duty Chrome Plated Cylindrical MIG Gas Nozzle",
    "description": "Precision turned cylindrical gas nozzle for 24KD and 36KD MIG torches, offering a wide laminar shielding gas envelope and spatter-resistant knurled body.",
    "bulletPoints": [
      "Cylindrical straight-bore geometry for maximum gas coverage on heavy plate welds",
      "Thick-walled copper alloy body with bright chrome spatter-resistant electroplating",
      "Integrated high-temperature insulated inner sleeve for electrical isolation",
      "Precision knurled grip ring for easy slip-on and removal during cleaning",
      "Compatible with standard 24KD, 36KD, and PANA series MIG welding torches"
    ],
    "industries": [
      "Heavy Structural Fabrication",
      "Automotive Body Shops",
      "Shipyards"
    ],
    "applications": [
      "MIG/MAG CO2 Shielding",
      "Spatter-Intensive Fabrication",
      "Continuous Production Welding"
    ],
    "materials": [
      "Deoxidized Copper Alloy",
      "Bright Chrome Plating",
      "High-Dielectric Ceramic Insulator"
    ],
    "specifications": [
      {
        "label": "Nozzle Shape",
        "value": "Cylindrical Straight-Bore"
      },
      {
        "label": "Bore Diameter",
        "value": "19 mm ID"
      },
      {
        "label": "Length",
        "value": "84 mm"
      },
      {
        "label": "Mounting Type",
        "value": "Push-on with Internal Retention Spring"
      },
      {
        "label": "Compatibility",
        "value": "24KD / 36KD MIG Torches"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_cylindrical_nozzle.png",
    "gallery": [
      "/products/catalog/weldor_mig_cylindrical_nozzle.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 4.5,
    "priceINR": 350.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 25,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "MIG cylindrical nozzle",
      "36KD gas nozzle",
      "welding nozzle",
      "chrome MIG nozzle"
    ],
    "seoMetaTitle": "MIG Cylindrical Welding Nozzle (24KD/36KD) | Weldor Industries",
    "seoMetaDescription": "Heavy-duty chrome plated cylindrical MIG nozzle for wide laminar gas shielding and spatter deflection.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-con-nozzle",
    "sku": "WLD-MIG-NOZ-CON",
    "name": "MIG Conical Welding Nozzle",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "MIG Contact Tips & Nozzles",
    "brand": "WELDOR",
    "modelNumber": "WEL-NOZ-CON-36",
    "tagline": "Tapered Conical MIG Gas Nozzle with Internal Insulation",
    "description": "Tapered conical gas nozzle designed for tight corner access and pipe welding, featuring internal thermal insulation and threaded retention ring.",
    "bulletPoints": [
      "Conical tapered design gives superior visibility and access in V-grooves and corners",
      "Internal insulated thread prevents electrical shorting to the contact tip holder",
      "Manufactured from heavy copper alloy for high thermal conductivity and long duty life",
      "Knurled center band ensures firm grip when changing hot nozzles with welding gloves",
      "Engineered to reduce shielding gas turbulence and eliminate weld porosity"
    ],
    "industries": [
      "Pipe Fabrication",
      "Pressure Vessels",
      "Automotive Exhausts",
      "Precision Sheetmetal"
    ],
    "applications": [
      "Root Pass Welding",
      "Fillet Welds in Deep Angles",
      "Automated Robot Welding"
    ],
    "materials": [
      "Drawn Copper Alloy",
      "Chrome Plating",
      "Heat-Resistant Silicone Resin Core"
    ],
    "specifications": [
      {
        "label": "Nozzle Shape",
        "value": "Conical Tapered"
      },
      {
        "label": "Bore Diameter",
        "value": "16 mm ID (Tapered Tip)"
      },
      {
        "label": "Length",
        "value": "84 mm"
      },
      {
        "label": "Mounting Type",
        "value": "Internal Insulated Retention Ring"
      },
      {
        "label": "Compatibility",
        "value": "24KD / 36KD MIG Torches"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_conical_nozzle.png",
    "gallery": [
      "/products/catalog/weldor_mig_conical_nozzle.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 4.8,
    "priceINR": 380.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 25,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "conical MIG nozzle",
      "tapered welding nozzle",
      "36KD conical nozzle",
      "pipe welding MIG nozzle"
    ],
    "seoMetaTitle": "MIG Conical Tapered Welding Nozzle | Weldor Industries",
    "seoMetaDescription": "Precision tapered conical MIG nozzle for tight-access fillet and root pass welding.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-tip-adaptor",
    "sku": "WLD-MIG-ADP-BRS",
    "name": "MIG Contact Tip Adaptor (Brass M6/M8)",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-ADP-M8-36",
    "tagline": "Forged Brass CNC Machined Contact Tip Holder Adaptor",
    "description": "CNC precision machined forged brass contact tip adaptor connecting the swan neck to M6 or M8 contact tips, ensuring minimal electrical resistance.",
    "bulletPoints": [
      "Forged free-cutting brass alloy with high electrical and thermal conductivity",
      "Precision M6 / M8 internal female threads for tight contact tip lockup",
      "Rear male thread with gas port holes for uniform laminar gas delivery",
      "Hexagonal machined wrench flats for effortless installation and torqueing",
      "Resists thread stripping and arc flash degradation over extensive continuous shifts"
    ],
    "industries": [
      "Fabrication Plants",
      "Trailer Manufacturers",
      "Heavy Structural Shops"
    ],
    "applications": [
      "MIG Torch Rebuilding",
      "High-Amp Deposition",
      "Robot Tooling"
    ],
    "materials": [
      "High-Tensile Brass IS 319 (Grade I)"
    ],
    "specifications": [
      {
        "label": "Thread Size Front",
        "value": "M8 / M6 Internal Female"
      },
      {
        "label": "Thread Size Rear",
        "value": "M10 x 1.0 Male Right-Hand"
      },
      {
        "label": "Overall Length",
        "value": "32 mm"
      },
      {
        "label": "Wrench Flat",
        "value": "12 mm Hexagon"
      },
      {
        "label": "Compatibility",
        "value": "24KD, 36KD, and PANA Torches"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_contact_tip_adaptor.png",
    "gallery": [
      "/products/catalog/weldor_mig_contact_tip_adaptor.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.2,
    "priceINR": 175.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "contact tip adaptor",
      "MIG tip holder",
      "brass tip adaptor M8",
      "36KD tip adaptor"
    ],
    "seoMetaTitle": "MIG Contact Tip Adaptor (Brass M6/M8) | Weldor Industries",
    "seoMetaDescription": "Forged brass contact tip holder adaptor for 24KD and 36KD MIG welding torches.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-hex-bushing",
    "sku": "WLD-MIG-BSH-HEX",
    "name": "MIG Torch Retaining Bushing & Hex Adaptor",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-BSH-HEX-01",
    "tagline": "Precision Threaded Brass Retaining Bushing",
    "description": "Precision threaded brass hex bushing and retaining adaptor for MIG torch swan neck assembly and gas insulator seating.",
    "bulletPoints": [
      "Machined from solid brass rod on Swiss-type CNC lathes for microscopic tolerances",
      "Heavy hex head shoulder for secure seating against torch body insulation",
      "Fine-pitch external threading prevents loosening under thermal cycling",
      "Inner bore chamfered for smooth wire feeding without copper shavings or snagging",
      "100% inspected for thread pitch accuracy and concentricity"
    ],
    "industries": [
      "Torch Manufacturing",
      "OEM Equipment Servicing",
      "Welding Consumable Distribution"
    ],
    "applications": [
      "Swan Neck Assembly",
      "Torch Insulation Locking",
      "MIG Gun Servicing"
    ],
    "materials": [
      "Lead-Free CW614N Brass Alloy"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Turned High-Grade Brass"
      },
      {
        "label": "Hex Size",
        "value": "17 mm A/F"
      },
      {
        "label": "Threading",
        "value": "M14 x 1.5 Precision External"
      },
      {
        "label": "Bore Size",
        "value": "8.5 mm Clear Passage"
      },
      {
        "label": "Compatibility",
        "value": "Universal MIG Torch Neck Assemblies"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_hex_bushing.png",
    "gallery": [
      "/products/catalog/weldor_mig_hex_bushing.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.0,
    "priceINR": 160.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "retaining bushing",
      "hex adaptor brass",
      "MIG torch bushing",
      "welding brass parts"
    ],
    "seoMetaTitle": "MIG Torch Retaining Bushing & Hex Adaptor | Weldor Industries",
    "seoMetaDescription": "Solid brass hex bushing and retaining adaptor for industrial MIG torch assemblies.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-copper-diffuser",
    "sku": "WLD-MIG-DIF-COP",
    "name": "MIG Copper Gas Diffuser & Tip Holder",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-DIF-COP-500",
    "tagline": "Pure Tellurium Copper Gas Diffuser for 500A Torches",
    "description": "High-conductivity pure copper gas diffuser and contact tip holder engineered for Panasonic 500A and extreme-duty water-cooled MIG torches.",
    "bulletPoints": [
      "Manufactured from high-purity tellurium copper for ultimate heat conduction",
      "Multi-hole radial port layout produces completely laminar, turbulence-free gas flow",
      "Integral hex shoulder enables fast replacement with standard torch tools",
      "Withstands 500A continuous welding arcs without thermal softening or arc erosion",
      "Direct replacement for OEM Panasonic style heavy-deposition torches"
    ],
    "industries": [
      "Shipbuilding",
      "Heavy Earthmoving Machinery",
      "Pipeline Fabrication"
    ],
    "applications": [
      "Heavy Deposition MIG/MAG",
      "High Current CO2 Welding",
      "Submerged & Flux-Cored Arc"
    ],
    "materials": [
      "Tellurium Copper C14500 (99.5% Cu Min)"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Pure Tellurium Copper (C14500)"
      },
      {
        "label": "Port Configuration",
        "value": "6 Radial Laminar Gas Holes"
      },
      {
        "label": "Front Thread",
        "value": "M8 / M6 Contact Tip"
      },
      {
        "label": "Rear Thread",
        "value": "M12 x 1.25 High-Pressure Male"
      },
      {
        "label": "Current Rating",
        "value": "Up to 500A Continuous"
      }
    ],
    "featured": true,
    "image": "/products/catalog/weldor_mig_copper_diffuser.png",
    "gallery": [
      "/products/catalog/weldor_mig_copper_diffuser.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 3.8,
    "priceINR": 310.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "copper gas diffuser",
      "MIG diffuser copper",
      "500A tip holder",
      "PANA copper diffuser"
    ],
    "seoMetaTitle": "MIG Copper Gas Diffuser & Tip Holder (500A) | Weldor Industries",
    "seoMetaDescription": "High-purity tellurium copper gas diffuser for 350A and 500A heavy-duty MIG welding torches.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-swan-insert",
    "sku": "WLD-MIG-INS-SWN",
    "name": "MIG Swan Neck Connector Insert (Brass)",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-INS-SWN-01",
    "tagline": "Tapered Forged Brass Torch Swan Neck Insert",
    "description": "Heavy forged brass swan neck connector insert providing leak-free gas transmission and secure nozzle seating on ergonomic MIG torches.",
    "bulletPoints": [
      "Forged brass stepped geometry engineered for airtight internal o-ring sealing",
      "Fluted front nozzle taper for reliable push-on tension and spatter isolation",
      "Deep internal gas passage eliminates pressure drop along long cable runs",
      "Precision concentricity prevents wire friction and liner wear at neck bends",
      "Standard fitment across European style 24KD and 25AK welding torches"
    ],
    "industries": [
      "Welding Torch OEM Assembly",
      "Torch Refurbishment",
      "Industrial Workshops"
    ],
    "applications": [
      "Swan Neck Repair",
      "Gas Sealing",
      "Torch Head Replacement"
    ],
    "materials": [
      "Forged Brass Alloy IS 319"
    ],
    "specifications": [
      {
        "label": "Material",
        "value": "Heavy Forged Brass"
      },
      {
        "label": "Front Taper",
        "value": "12.5 mm OD Tapered Seat"
      },
      {
        "label": "Rear Stepped OD",
        "value": "14 mm with O-Ring Groove"
      },
      {
        "label": "Overall Length",
        "value": "45 mm"
      },
      {
        "label": "Compatibility",
        "value": "24KD & 25AK MIG Torches"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_swan_neck_insert.png",
    "gallery": [
      "/products/catalog/weldor_mig_swan_neck_insert.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.5,
    "priceINR": 195.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "swan neck insert",
      "brass torch insert",
      "24KD neck connector",
      "welding torch parts"
    ],
    "seoMetaTitle": "MIG Swan Neck Connector Insert (Brass) | Weldor Industries",
    "seoMetaDescription": "Solid brass swan neck torch insert providing leak-free gas transmission and secure nozzle seating.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-dual-diffuser",
    "sku": "WLD-MIG-DIF-PAIR",
    "name": "MIG Gas Diffuser Nozzle Inserts (Pair)",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-DIF-PR-02",
    "tagline": "Matched Pair of Hex Head Brass Gas Diffusers",
    "description": "Matched set of precision brass gas diffuser nozzle inserts with precision-bored orifices for smooth laminar shield gas coverage and arc stability.",
    "bulletPoints": [
      "Supplied as a matched pair of standard and conical-seat brass diffusers",
      "Multi-orifice radial venting prevents gas vortexing and ambient air intake",
      "Turned from corrosion-resistant solid brass bar with fine-threaded shank",
      "Protects the swan neck from radiant arc heat and slag spatter buildup",
      "Compatible with both CO2 and Argon/CO2 mixed shielding gases"
    ],
    "industries": [
      "Pressure Vessel Fabricators",
      "Automotive Ancillary",
      "Agricultural Machinery"
    ],
    "applications": [
      "Gas Dispersion",
      "Porosity-Free Shielding",
      "Dual Gas Torch Setup"
    ],
    "materials": [
      "Brass CW614N"
    ],
    "specifications": [
      {
        "label": "Package Quantity",
        "value": "Pair (2 Pieces Matched)"
      },
      {
        "label": "Material",
        "value": "Precision Turned Brass"
      },
      {
        "label": "Diffuser Venting",
        "value": "4 x 1.2 mm Radial Holes"
      },
      {
        "label": "Hex Dimension",
        "value": "10 mm Hex Body"
      },
      {
        "label": "Compatibility",
        "value": "24KD & 36KD MIG Guns"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_gas_diffuser_inserts.png",
    "gallery": [
      "/products/catalog/weldor_mig_gas_diffuser_inserts.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 3.2,
    "priceINR": 250.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 25,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "gas diffuser pair",
      "brass diffuser inserts",
      "MIG gas nozzle insert",
      "welding diffuser set"
    ],
    "seoMetaTitle": "MIG Gas Diffuser Nozzle Inserts (Pair) | Weldor Industries",
    "seoMetaDescription": "Matched pair of precision brass gas diffuser inserts for smooth laminar shield gas coverage.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-insulated-diffuser",
    "sku": "WLD-MIG-DIF-INS",
    "name": "Extended Gas Diffuser with Ceramic Insulator Ring",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-DIF-INS-03",
    "tagline": "Extended Brass Diffuser with Ceramic Insulation Ring",
    "description": "Extended length brass gas diffuser equipped with a high-dielectric heat-resistant ceramic insulator ring, preventing nozzle short-circuits during high-current MIG operations.",
    "bulletPoints": [
      "Extended brass body with integrated white high-alumina ceramic insulator collar",
      "Eliminates nozzle-to-tip arcing even when nozzle touches grounded workpiece",
      "Precision micro-drilled gas exit ports for smooth uniform gas delivery",
      "Superior thread engagement withstands high torques without seizing",
      "Ideal for robotic and high-deposition semi-automatic welding stations"
    ],
    "industries": [
      "Robotic Welding Cells",
      "Automated Gantry Welding",
      "Heavy Vehicle Chassis"
    ],
    "applications": [
      "Anti-Arcing Insulation",
      "High-Amp Pulse MIG",
      "Continuous Production Lines"
    ],
    "materials": [
      "Free-Machining Brass",
      "High-Alumina Ceramic Insulator"
    ],
    "specifications": [
      {
        "label": "Body Length",
        "value": "52 mm Extended Shank"
      },
      {
        "label": "Insulator Material",
        "value": "Industrial High-Dielectric Alumina Ceramic"
      },
      {
        "label": "Thread Size",
        "value": "M8 Internal / M10 External"
      },
      {
        "label": "Dielectric Strength",
        "value": "> 2500 V DC"
      },
      {
        "label": "Compatibility",
        "value": "36KD & 500A Industrial Guns"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_insulated_diffuser_pin.png",
    "gallery": [
      "/products/catalog/weldor_mig_insulated_diffuser_pin.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 3.5,
    "priceINR": 280.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 25,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "insulated gas diffuser",
      "diffuser with ceramic ring",
      "anti shorting diffuser",
      "ceramic MIG ring"
    ],
    "seoMetaTitle": "Extended Gas Diffuser with Ceramic Insulator Ring | Weldor Industries",
    "seoMetaDescription": "Extended brass gas diffuser with high-dielectric ceramic ring for electrical isolation and zero arcing.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-cable-nuts",
    "sku": "WLD-MIG-NUT-PR",
    "name": "MIG Power Cable Locking Hex Nuts (Pair)",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-NUT-PR-04",
    "tagline": "Solid Brass Cable Clamp & Euro Locking Nuts (Pair)",
    "description": "Precision hex locking nuts for secure cable clamping and gas seal on European and Panasonic style torch ends and central adapter blocks.",
    "bulletPoints": [
      "Machined from heavy forged brass to resist split failure under high clamping torques",
      "Precision internal imperial / metric threads with clean entry chamfers",
      "Flanged shoulder provides uniform compression on cable sleeves and gas seals",
      "Supplied as a pair for complete front-to-rear cable harness refurbishment",
      "Zero corrosion under industrial workshop environments and humid conditions"
    ],
    "industries": [
      "Cable Harness Assembly",
      "Torch Repair Depots",
      "Welding Consumables Supply"
    ],
    "applications": [
      "Cable Assembly Clamping",
      "Euro Socket Mounting",
      "Gas Seal Tightening"
    ],
    "materials": [
      "Forged Brass Alloy IS 319 (Grade I)"
    ],
    "specifications": [
      {
        "label": "Pack Contents",
        "value": "2 Hex Clamping Nuts"
      },
      {
        "label": "Hex Size",
        "value": "19 mm Hexagon A/F"
      },
      {
        "label": "Thread Size",
        "value": "M12 x 1.0 / 3/8\" BSP Option"
      },
      {
        "label": "Material",
        "value": "Solid Forged Brass"
      },
      {
        "label": "Compatibility",
        "value": "Universal Euro & Asian Style Torches"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_cable_locking_nuts.png",
    "gallery": [
      "/products/catalog/weldor_mig_cable_locking_nuts.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.4,
    "priceINR": 180.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "cable locking nuts",
      "brass hex nuts",
      "MIG cable nuts",
      "welding cable clamp"
    ],
    "seoMetaTitle": "MIG Power Cable Locking Hex Nuts (Pair) | Weldor Industries",
    "seoMetaDescription": "Solid brass cable clamping and Euro locking hex nuts for MIG torch maintenance.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-central-nipple",
    "sku": "WLD-MIG-NIP-EUR",
    "name": "Euro Central Socket Brass Adaptor Nipple",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-NIP-EUR-05",
    "tagline": "Dual-Threaded Brass Euro Socket Adaptor Nipple",
    "description": "Male-threaded central socket adapter nipple for euro-style wire feeder and torch cable coupling, ensuring zero gas leak and high electrical contact.",
    "bulletPoints": [
      "Turned on multi-axis CNC machines for absolute thread pitch concentricity",
      "Dual-threaded body connects euro connector block to torch power cable",
      "Internal gas passage with mirror-finished bore for zero restriction",
      "Accommodates high electrical current transfer up to 500A without overheating",
      "Heavy hex center enables quick tightening with standard open wrenches"
    ],
    "industries": [
      "Wire Feeder Manufacturing",
      "MIG Machine Retrofitting",
      "Welding Machine Service"
    ],
    "applications": [
      "Euro Connector Conversion",
      "Central Block Servicing",
      "Power Cable Coupling"
    ],
    "materials": [
      "High-Conductivity Brass Alloy"
    ],
    "specifications": [
      {
        "label": "Male Thread 1",
        "value": "M12 x 1.0 (Euro Block Side)"
      },
      {
        "label": "Male Thread 2",
        "value": "M10 x 1.0 (Cable Nut Side)"
      },
      {
        "label": "Bore Size",
        "value": "5.5 mm Through Hole"
      },
      {
        "label": "Hex Center",
        "value": "14 mm Hexagon"
      },
      {
        "label": "Current Rating",
        "value": "Up to 500A"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_central_adaptor_nipple.png",
    "gallery": [
      "/products/catalog/weldor_mig_central_adaptor_nipple.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.8,
    "priceINR": 220.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "euro adaptor nipple",
      "central socket nipple",
      "brass euro connector",
      "MIG cable nipple"
    ],
    "seoMetaTitle": "Euro Central Socket Brass Adaptor Nipple | Weldor Industries",
    "seoMetaDescription": "Dual-threaded solid brass Euro central socket adaptor nipple for MIG wire feeders and torch cables.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  },
  {
    "id": "prod-mig-csm-diffuser-pin",
    "sku": "WLD-MIG-PIN-DIF",
    "name": "MIG Long Shank Gas Diffuser Pin",
    "category": "Welding & Cutting Consumables",
    "categoryId": "cat-con-04",
    "subCategory": "Gas Diffusers & Insulators",
    "brand": "WELDOR",
    "modelNumber": "WEL-PIN-DIF-06",
    "tagline": "Precision Drilled Long Shank Brass Diffuser Pin",
    "description": "Long shank precision drilled gas diffuser pin for specialized heavy industrial MIG fabrication guns and narrow-gap welding setups.",
    "bulletPoints": [
      "Extended long shank length facilitates deep access into narrow groove joints",
      "Micro-drilled cross ports balance gas velocity to prevent shield turbulence",
      "Turned from premium forged brass for maximum rigidity under intense arc heat",
      "Smooth thread lead-in prevents cross-threading into swan neck bases",
      "Specially calibrated for mixed Argon-CO2 and pure CO2 gas mixtures"
    ],
    "industries": [
      "Narrow Gap Heavy Fabrication",
      "Boiler Tube Welds",
      "Structural Steel Fabricators"
    ],
    "applications": [
      "Narrow Joint MIG",
      "Extended Tip Offset",
      "Specialized Torch Fabrication"
    ],
    "materials": [
      "Free-Cutting Brass IS 319"
    ],
    "specifications": [
      {
        "label": "Shank Length",
        "value": "48 mm Long Reach"
      },
      {
        "label": "Shank Diameter",
        "value": "6.0 mm Ground OD"
      },
      {
        "label": "Gas Hole Count",
        "value": "2 Radial Cross Holes (1.0 mm Dia)"
      },
      {
        "label": "Thread Connection",
        "value": "M8 Right Hand Male"
      },
      {
        "label": "Compatibility",
        "value": "Specialized Industrial MIG Torch Setups"
      }
    ],
    "featured": false,
    "image": "/products/catalog/weldor_mig_precision_diffuser_pin.png",
    "gallery": [
      "/products/catalog/weldor_mig_precision_diffuser_pin.png",
      "/catalog_pages/page_10.png"
    ],
    "catalogPdfUrl": "/catalog/Weldor_Welding_Catalog_CDN.pdf",
    "priceUSD": 2.5,
    "priceINR": 195.0,
    "certifications": [
      "ISO 9001:2015",
      "Make in India"
    ],
    "minOrderQty": 50,
    "standardLeadTimeDays": 5,
    "inStock": true,
    "seoKeywords": [
      "diffuser pin",
      "long shank diffuser",
      "narrow gap MIG pin",
      "welding pin diffuser"
    ],
    "seoMetaTitle": "MIG Long Shank Gas Diffuser Pin | Weldor Industries",
    "seoMetaDescription": "Long shank precision drilled brass gas diffuser pin for deep-groove MIG fabrication guns.",
    "status": "Active",
    "createdAt": "2026-10-15T12:00:00.000Z",
    "updatedAt": "2026-10-15T12:00:00.000Z"
  }
];


export const OFFICIAL_WELDOR_BANNERS: HeroBanner[] = [
  {
    id: "ban-weldor-01",
    badge: "EARTH METAL INDUSTRIES • WELDOR® BRAND",
    title: "Creating The Best Welding Experience",
    highlightText: "",
    subtitle: "Heavy-Duty MIG, TIG & Plasma Cutting Torches",
    description: "Precision-engineered welding and cutting torches manufactured at our Jamnagar plant for peak arc stability, operator comfort, and extreme industrial durability.",
    bgImageUrl: "/images/banners/hero_welding_plant.jpg",
    productImageUrl: "/catalog_pages/page_4.png",
    productSku: "WLD-MIG-36KD",
    productName: "36KD Heavy-Duty MIG Welding Torch (320A)",
    transitionEffect: "zoom",
    overlayTheme: "dark-glass",
    primaryBtnText: "Explore Welding Catalog",
    primaryBtnAction: "public-products",
    secondaryBtnText: "Request Technical RFQ",
    secondaryBtnAction: "public-rfq",
    stats: [
      { label: "Arc Stability", value: "100% Tested" },
      { label: "Torch Duty Cycle", value: "60% @ 350A" },
      { label: "Global Standards", value: "ISO 9001:2015" }
    ],
    features: ["100% Leak & Arc Tested", "Heavy Forged Brass Construction", "Direct Factory Pricing"],
    active: true,
    displayOrder: 1,
    autoplayDurationSec: 6
  },
  {
    id: "ban-weldor-02",
    badge: "FORGED BRASS INDUSTRIAL REGULATORS",
    title: "Precision Engineered For Heavy Fabrication",
    highlightText: "",
    subtitle: "High-Pressure Gas Regulators & Oxy-Fuel Cutting Systems",
    description: "Forged brass 300 Bar gas pressure regulators, flashback arrestors, and precision CNC cutting nozzles built to ISO 9001:2015 safety standards.",
    bgImageUrl: "/images/banners/hero_welding_torch.jpg",
    productImageUrl: "/catalog_pages/page_9.png",
    productSku: "WLD-REG-O2-300B",
    productName: "Forged Brass Oxygen Regulator (300 Bar)",
    transitionEffect: "kenburns",
    overlayTheme: "dark-glass",
    primaryBtnText: "View Gas Regulators",
    primaryBtnAction: "public-products",
    secondaryBtnText: "Download Specifications",
    secondaryBtnAction: "public-rfq",
    stats: [
      { label: "Inlet Rating", value: "300 Bar" },
      { label: "Body Material", value: "Forged Brass" },
      { label: "Standard", value: "BSPP / IS" }
    ],
    features: ["Dual Heavy Gauges", "Safety Relief Valve Built-in", "Zero Pressure Fluctuation"],
    active: true,
    displayOrder: 2,
    autoplayDurationSec: 6
  }
];

export const OFFICIAL_WELDOR_GALLERY: GalleryMedia[] = [
  {
    id: "gal-01",
    title: "MIG / CO2 Torches Range - 24KD & 36KD",
    category: "Product Closeups",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_4.png",
    thumbnail: "/catalog_pages/page_4.png",
    caption: "Official Weldor 24KD and 36KD ergonomic air-cooled MIG welding torches with euro connectors.",
    tags: ["MIG Torches", "24KD", "36KD", "Weldor Catalog"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-02",
    title: "Heavy-Duty PANA 350A & 500A Torches",
    category: "Product Closeups",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_5.png",
    thumbnail: "/catalog_pages/page_5.png",
    caption: "Heavy-duty Panasonic style 350A and 500A CO2 / MAG welding torches.",
    tags: ["PANA 500A", "Heavy Welding", "Weldor Catalog"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-03",
    title: "Plasma & Oxy-Fuel Cutting Torch Lineup",
    category: "Product Closeups",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_6.png",
    thumbnail: "/catalog_pages/page_6.png",
    caption: "Industrial plasma manual and CNC automatic cutting torches with PNME/ANME gas cutting torches.",
    tags: ["Plasma Torch", "Gas Cutting", "Weldor Catalog"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-04",
    title: "Forged Brass Industrial Gas Regulators",
    category: "Testing Bays",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_9.png",
    thumbnail: "/catalog_pages/page_9.png",
    caption: "300 Bar Oxygen, DA Acetylene, Argon/CO2 Flowmeter and Nitrogen regulators.",
    tags: ["Gas Regulators", "300 Bar", "Oxygen", "Flowmeter"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-05",
    title: "CuCrZr Contact Tips & Nozzle Consumables",
    category: "CNC Machining",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_10.png",
    thumbnail: "/catalog_pages/page_10.png",
    caption: "Precision CNC turned copper contact tips, gas nozzles, and diffusers.",
    tags: ["Consumables", "Contact Tips", "CNC Brass"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-06",
    title: "Hafnium Plasma Electrodes & CNC Cutting Tips",
    category: "Factory Floor",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/catalog_pages/page_11.png",
    thumbnail: "/catalog_pages/page_11.png",
    caption: "Premium hafnium core plasma electrodes and PNME/ANME three-seat cutting nozzles.",
    tags: ["Plasma Electrodes", "PNME Tips", "Factory Production"],
    createdAt: "2026-09-25"
  },
  {
    id: "gal-07",
    title: "Zeiss Contura CMM 3D Quality Inspection Lab",
    category: "R&D Quality Lab",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/images/quality_inspection_lab.jpg",
    thumbnail: "/images/quality_inspection_lab.jpg",
    caption: "In-house Zeiss CMM coordinate measuring probe testing critical component tolerances to ±0.005mm.",
    tags: ["Zeiss CMM", "Metrology", "Quality Control", "ISO 9001"],
    createdAt: "2026-10-01"
  },
  {
    id: "gal-08",
    title: "Earth Metal Industries Jamnagar Plant Campus",
    category: "Factory Floor",
    type: "Photo",
    mediaTypeGroup: "photo",
    url: "/images/banners/hero_welding_plant.jpg",
    thumbnail: "/images/banners/hero_welding_plant.jpg",
    caption: "Modern manufacturing facility in GIDC Jamnagar producing precision brass components and welding systems.",
    tags: ["Factory Floor", "Jamnagar", "Make In India"],
    createdAt: "2026-10-01"
  }
];

export const OFFICIAL_WELDOR_EXHIBITIONS: Exhibition[] = [
  {
    id: "expo-01",
    title: "INDIA WELDING & FABRICATION EXPO 2026",
    subtitle: "Live Automated Torch & High-Pressure Gas Flow Demos",
    location: "Bombay Exhibition Centre (NESCO)",
    fullAddress: "Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063",
    city: "Mumbai",
    country: "India",
    startDate: "2026-11-20",
    endDate: "2026-11-23",
    hallNumber: "Hall 4",
    boothNumber: "Stall E-28",
    description: "Join Weldor by Earth Metal Industries at India's premier welding technology expo. Experience live demonstrations of our 36KD/500A robotic torches, CNC plasma torches, and forged brass 300 Bar gas pressure regulators.",
    keyHighlights: [
      "Live Automated MIG Welding",
      "300 Bar Gas Pressure Testing Demos",
      "OEM B2B Technical Consultations"
    ],
    bannerImage: "/images/banners/hero_welding_plant.jpg",
    galleryImages: [
      "/images/banners/hero_welding_plant.jpg",
      "/images/banners/hero_welding_torch.jpg",
      "/catalog_pages/page_4.png"
    ],
    videoUrls: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    brochurePdfUrl: "/catalog/Weldor_Welding_Product_Catalog.pdf",
    showcasedCategoryIds: [
      "cat-wel-01",
      "cat-cut-02",
      "cat-reg-03"
    ],
    qrSlug: "india-welding-expo-2026",
    leadsCapturedCount: 148,
    featured: true,
    status: "Upcoming"
  },
  {
    id: "expo-02",
    title: "IMTEX FORMING & WELDING 2027",
    subtitle: "South Asia Largest Metal Forming & Automation Exhibition",
    location: "Bangalore International Exhibition Centre (BIEC)",
    fullAddress: "10th Mile, Tumkur Road, Madavara Post, Bengaluru, Karnataka 562123",
    city: "Bengaluru",
    country: "India",
    startDate: "2027-01-21",
    endDate: "2027-01-26",
    hallNumber: "Hall 5",
    boothNumber: "Stall B-114",
    description: "Showcasing next-generation 500A water-cooled torches, CNC plasma cutting gantries, and customized OEM brass manifolds for aerospace and defence manufacturing.",
    keyHighlights: [
      "High-Torque Arc Stability Tests",
      "Heavy-Duty 300 Bar Regulators",
      "Prototype Sample Trial Bookings"
    ],
    bannerImage: "/images/banners/hero_welding_torch.jpg",
    galleryImages: [
      "/images/banners/hero_welding_torch.jpg",
      "/images/quality_inspection_lab.jpg",
      "/catalog_pages/page_6.png"
    ],
    videoUrls: [
      "https://www.w3schools.com/html/mov_bbb.mp4"
    ],
    brochurePdfUrl: "/catalog/Weldor_Welding_Product_Catalog.pdf",
    showcasedCategoryIds: [
      "cat-wel-01",
      "cat-con-04"
    ],
    qrSlug: "imtex-forming-2027",
    leadsCapturedCount: 215,
    featured: true,
    status: "Upcoming"
  },
  {
    id: "expo-03",
    title: "SCHWEISSEN & SCHNEIDEN (International Welding Fair)",
    subtitle: "World Leading Trade Fair for Joining, Cutting & Surfacing",
    location: "Messe Essen",
    fullAddress: "Messeplatz 1, 45131 Essen, Germany",
    city: "Essen",
    country: "Germany",
    startDate: "2025-09-15",
    endDate: "2025-09-19",
    hallNumber: "Hall 3",
    boothNumber: "Stand 3C42",
    description: "Global European showcase of Weldor export-grade heavy-duty 24KD & 36KD torches and 300 Bar gas pressure regulators manufactured to ISO 9001:2015 standards in Jamnagar.",
    keyHighlights: [
      "European Distributor Partnerships Signed",
      "Extreme Safety Leak Tests",
      "Global OEM Quality Recognition"
    ],
    bannerImage: "/images/quality_inspection_lab.jpg",
    galleryImages: [
      "/images/quality_inspection_lab.jpg",
      "/catalog_pages/page_9.png"
    ],
    videoUrls: [],
    brochurePdfUrl: "/catalog/Weldor_Welding_Product_Catalog.pdf",
    showcasedCategoryIds: [
      "cat-wel-01",
      "cat-reg-03"
    ],
    qrSlug: "schweissen-schneiden-essen",
    leadsCapturedCount: 312,
    featured: true,
    status: "Past Exhibition"
  }
];


