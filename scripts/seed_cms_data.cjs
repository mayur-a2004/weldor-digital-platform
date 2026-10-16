const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const gallery = [
  {
    id: 'gal-01',
    title: 'MIG / CO2 Torches Range - 24KD & 36KD',
    category: 'Product Closeups',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_4.png',
    thumbnail: '/catalog_pages/page_4.png',
    caption: 'Official Weldor 24KD and 36KD ergonomic air-cooled MIG welding torches with euro connectors.',
    tags: ['MIG Torches', '24KD', '36KD', 'Weldor Catalog'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-02',
    title: 'Heavy-Duty PANA 350A & 500A Torches',
    category: 'Product Closeups',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_5.png',
    thumbnail: '/catalog_pages/page_5.png',
    caption: 'Heavy-duty Panasonic style 350A and 500A CO2 / MAG welding torches.',
    tags: ['PANA 500A', 'Heavy Welding', 'Weldor Catalog'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-03',
    title: 'Plasma & Oxy-Fuel Cutting Torch Lineup',
    category: 'Product Closeups',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_6.png',
    thumbnail: '/catalog_pages/page_6.png',
    caption: 'Industrial plasma manual and CNC automatic cutting torches with PNME/ANME gas cutting torches.',
    tags: ['Plasma Torch', 'Gas Cutting', 'Weldor Catalog'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-04',
    title: 'Forged Brass Industrial Gas Regulators',
    category: 'Testing Bays',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_9.png',
    thumbnail: '/catalog_pages/page_9.png',
    caption: '300 Bar Oxygen, DA Acetylene, Argon/CO2 Flowmeter and Nitrogen regulators.',
    tags: ['Gas Regulators', '300 Bar', 'Oxygen', 'Flowmeter'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-05',
    title: 'CuCrZr Contact Tips & Nozzle Consumables',
    category: 'CNC Machining',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_10.png',
    thumbnail: '/catalog_pages/page_10.png',
    caption: 'Precision CNC turned copper contact tips, gas nozzles, and diffusers.',
    tags: ['Consumables', 'Contact Tips', 'CNC Brass'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-06',
    title: 'Hafnium Plasma Electrodes & CNC Cutting Tips',
    category: 'Factory Floor',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/catalog_pages/page_11.png',
    thumbnail: '/catalog_pages/page_11.png',
    caption: 'Premium hafnium core plasma electrodes and PNME/ANME three-seat cutting nozzles.',
    tags: ['Plasma Electrodes', 'PNME Tips', 'Factory Production'],
    createdAt: '2026-09-25'
  },
  {
    id: 'gal-07',
    title: 'Zeiss Contura CMM 3D Quality Inspection Lab',
    category: 'R&D Quality Lab',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/images/quality_inspection_lab.jpg',
    thumbnail: '/images/quality_inspection_lab.jpg',
    caption: 'In-house Zeiss CMM coordinate measuring probe testing critical component tolerances to ±0.005mm.',
    tags: ['Zeiss CMM', 'Metrology', 'Quality Control', 'ISO 9001'],
    createdAt: '2026-10-01'
  },
  {
    id: 'gal-08',
    title: 'Earth Metal Industries Jamnagar Plant Campus',
    category: 'Factory Floor',
    type: 'Photo',
    mediaTypeGroup: 'photo',
    url: '/images/banners/hero_welding_plant.jpg',
    thumbnail: '/images/banners/hero_welding_plant.jpg',
    caption: 'Modern manufacturing facility in GIDC Jamnagar producing precision brass components and welding systems.',
    tags: ['Factory Floor', 'Jamnagar', 'Make In India'],
    createdAt: '2026-10-01'
  }
];

const exhibitions = [
  {
    id: 'expo-01',
    title: 'INDIA WELDING & FABRICATION EXPO 2026',
    subtitle: 'Live Automated Torch & High-Pressure Gas Flow Demos',
    location: 'Bombay Exhibition Centre (NESCO)',
    fullAddress: 'Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063',
    city: 'Mumbai',
    country: 'India',
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    hallNumber: 'Hall 4',
    boothNumber: 'Stall E-28',
    description: 'Join Weldor by Earth Metal Industries at India premier welding technology expo. Experience live demonstrations of our 36KD/500A robotic torches, CNC plasma torches, and forged brass 300 Bar gas pressure regulators.',
    keyHighlights: [
      'Live Automated MIG Welding',
      '300 Bar Gas Pressure Testing Demos',
      'OEM B2B Technical Consultations'
    ],
    bannerImage: '/images/banners/hero_welding_plant.jpg',
    galleryImages: [
      '/images/banners/hero_welding_plant.jpg',
      '/images/banners/hero_welding_torch.jpg',
      '/catalog_pages/page_4.png'
    ],
    videoUrls: [
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    brochurePdfUrl: '/catalog/Weldor_Welding_Product_Catalog.pdf',
    showcasedCategoryIds: [
      'cat-wel-01',
      'cat-cut-02',
      'cat-reg-03'
    ],
    qrSlug: 'india-welding-expo-2026',
    leadsCapturedCount: 148,
    featured: true,
    status: 'Upcoming'
  },
  {
    id: 'expo-02',
    title: 'IMTEX FORMING & WELDING 2027',
    subtitle: 'South Asia Largest Metal Forming & Automation Exhibition',
    location: 'Bangalore International Exhibition Centre (BIEC)',
    fullAddress: '10th Mile, Tumkur Road, Madavara Post, Bengaluru, Karnataka 562123',
    city: 'Bengaluru',
    country: 'India',
    startDate: '2027-01-21',
    endDate: '2027-01-26',
    hallNumber: 'Hall 5',
    boothNumber: 'Stall B-114',
    description: 'Showcasing next-generation 500A water-cooled torches, CNC plasma cutting gantries, and customized OEM brass manifolds for aerospace and defence manufacturing.',
    keyHighlights: [
      'High-Torque Arc Stability Tests',
      'Heavy-Duty 300 Bar Regulators',
      'Prototype Sample Trial Bookings'
    ],
    bannerImage: '/images/banners/hero_welding_torch.jpg',
    galleryImages: [
      '/images/banners/hero_welding_torch.jpg',
      '/images/quality_inspection_lab.jpg',
      '/catalog_pages/page_6.png'
    ],
    videoUrls: [
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    brochurePdfUrl: '/catalog/Weldor_Welding_Product_Catalog.pdf',
    showcasedCategoryIds: [
      'cat-wel-01',
      'cat-con-04'
    ],
    qrSlug: 'imtex-forming-2027',
    leadsCapturedCount: 215,
    featured: true,
    status: 'Upcoming'
  },
  {
    id: 'expo-03',
    title: 'SCHWEISSEN & SCHNEIDEN (International Welding Fair)',
    subtitle: 'World Leading Trade Fair for Joining, Cutting & Surfacing',
    location: 'Messe Essen',
    fullAddress: 'Messeplatz 1, 45131 Essen, Germany',
    city: 'Essen',
    country: 'Germany',
    startDate: '2025-09-15',
    endDate: '2025-09-19',
    hallNumber: 'Hall 3',
    boothNumber: 'Stand 3C42',
    description: 'Global European showcase of Weldor export-grade heavy-duty 24KD & 36KD torches and 300 Bar gas pressure regulators manufactured to ISO 9001:2015 standards in Jamnagar.',
    keyHighlights: [
      'European Distributor Partnerships Signed',
      'Extreme Safety Leak Tests',
      'Global OEM Quality Recognition'
    ],
    bannerImage: '/images/quality_inspection_lab.jpg',
    galleryImages: [
      '/images/quality_inspection_lab.jpg',
      '/catalog_pages/page_9.png'
    ],
    videoUrls: [],
    brochurePdfUrl: '/catalog/Weldor_Welding_Product_Catalog.pdf',
    showcasedCategoryIds: [
      'cat-wel-01',
      'cat-reg-03'
    ],
    qrSlug: 'schweissen-schneiden-essen',
    leadsCapturedCount: 312,
    featured: true,
    status: 'Past Exhibition'
  }
];

fs.writeFileSync(path.join(__dirname, '../server/data/gallery.json'), JSON.stringify(gallery, null, 2));
fs.writeFileSync(path.join(__dirname, '../server/data/exhibitions.json'), JSON.stringify(exhibitions, null, 2));

const { COLLECTION_MODELS } = require('../server/models/index.js');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  for (const item of gallery) {
    await COLLECTION_MODELS.gallery.findOneAndUpdate({ id: item.id }, { $set: item }, { upsert: true });
  }
  for (const item of exhibitions) {
    await COLLECTION_MODELS.exhibitions.findOneAndUpdate({ id: item.id }, { $set: item }, { upsert: true });
  }

  const galCount = await COLLECTION_MODELS.gallery.countDocuments();
  const expoCount = await COLLECTION_MODELS.exhibitions.countDocuments();
  console.log('✅ Seeded MongoDB Atlas Gallery Count:', galCount);
  console.log('✅ Seeded MongoDB Atlas Exhibitions Count:', expoCount);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
