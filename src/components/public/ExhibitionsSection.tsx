import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Building2,
  CheckCircle2,
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  Image as ImageIcon,
  Video,
  FileText,
  Play,
  Check,
  Download,
  Phone,
  Mail,
  User,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Exhibition } from '../../types';
import { OFFICIAL_WELDOR_EXHIBITIONS } from '../../config/catalogData';

export const ExhibitionsSection: React.FC = () => {
  const { exhibitions, setActiveView, setSelectedExpoSlug, addPublicRFQLead } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedExpoModal, setSelectedExpoModal] = useState<Exhibition | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos'>('photos');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);

  // Horizontal Carousel Slider State
  const expoSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // VIP Booth Meeting Form State inside Modal
  const [companyName, setCompanyName] = useState('Tata Motors');
  const [contactName, setContactName] = useState('Rajesh Sharma');
  const [email, setEmail] = useState('rajesh.sharma@tatamotors.com');
  const [phone, setPhone] = useState('+91 98230 44556');
  const [meetingDate, setMeetingDate] = useState('Day 2 (11:00 AM Slot)');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Escape key handler & scroll lock for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedExpoModal(null);
        setBookingSuccess(null);
      }
    };
    if (selectedExpoModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedExpoModal]);

  // Helper function to calculate dynamic / effective status based on end date
  const getExpoEffectiveStatus = (expo: Exhibition): {
    status: 'Upcoming' | 'Live' | 'Past Exhibition';
    isAutoArchived: boolean;
    label: string;
    badgeClass: string;
  } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(expo.startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(expo.endDate);
    end.setHours(23, 59, 59, 999);

    const isDatePassed = today > end;
    const isLiveToday = today >= start && today <= end;

    if (isLiveToday) {
      return {
        status: 'Live',
        isAutoArchived: false,
        label: 'Live Now (Booth Active)',
        badgeClass: 'bg-emerald-600 text-white animate-pulse',
      };
    }

    if (isDatePassed && expo.autoArchivePassedDate !== false) {
      return {
        status: 'Past Exhibition',
        isAutoArchived: expo.status === 'Upcoming',
        label: 'Past Exhibition',
        badgeClass: 'bg-slate-700 text-slate-200',
      };
    }

    if (expo.status === 'Past Exhibition') {
      return {
        status: 'Past Exhibition',
        isAutoArchived: false,
        label: 'Past Exhibition',
        badgeClass: 'bg-slate-700 text-slate-200',
      };
    }

    return {
      status: 'Upcoming',
      isAutoArchived: false,
      label: 'Upcoming Trade Fair',
      badgeClass: 'bg-orange-600 text-white',
    };
  };

  const processedExhibitions = useMemo(() => {
    const rawList = (exhibitions && exhibitions.length > 0) ? exhibitions : OFFICIAL_WELDOR_EXHIBITIONS;
    return rawList.filter(Boolean).map(expo => ({
      ...expo,
      meta: getExpoEffectiveStatus(expo),
    }));
  }, [exhibitions]);

  const filteredExhibitions = useMemo(() => {
    return processedExhibitions.filter(e => {
      if (!e || !e.meta) return false;
      if (filter === 'All') return true;
      if (filter === 'Upcoming') return e.meta.status === 'Upcoming' || e.meta.status === 'Live';
      if (filter === 'Past') return e.meta.status === 'Past Exhibition';
      return true;
    });
  }, [processedExhibitions, filter]);

  const handleVIPBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpoModal) return;
    const leadNumber = addPublicRFQLead({
      title: `VIP Booth Slot (${selectedExpoModal.title}): ${companyName}`,
      companyName,
      contactPerson: contactName,
      email,
      phone,
      country: selectedExpoModal.country,
      categoryName: 'Exhibition VIP Meeting',
      targetQuantity: 100,
      preferredResponse: 'WhatsApp',
      technicalNotes: `VIP Meeting Slot requested for ${meetingDate} at ${selectedExpoModal.hallNumber}, ${selectedExpoModal.boothNumber}. Physical venue: ${selectedExpoModal.location}, ${selectedExpoModal.city}.`,
    });
    setBookingSuccess(leadNumber);
  };

  const handleOpenModal = (expo: Exhibition) => {
    setSelectedExpoModal(expo);
    setActivePhotoIdx(0);
    setActiveMediaTab('photos');
    setBookingSuccess(null);
  };

  const updateExpoScrollState = () => {
    if (!expoSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = expoSliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = expoSliderRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateExpoScrollState, { passive: true });
    updateExpoScrollState();
    return () => el.removeEventListener('scroll', updateExpoScrollState);
  }, [filteredExhibitions]);

  const scrollExpoSlider = (direction: 'left' | 'right') => {
    if (!expoSliderRef.current) return;
    const amount = 380;
    expoSliderRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="py-10 sm:py-14 bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] border-b border-slate-200 text-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header with Title and Unified Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="tech-label">Global Trade Fairs & Technical Conventions</span>
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/70 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3 text-orange-600" /> Interactive Expo Slider
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 mt-1">
              International Exhibitions & Trade Shows
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl font-medium">
              Slide through upcoming international trade expos, view booth photos, download brochures, or book VIP meeting slots.
            </p>
          </div>

          {/* Controls: Filter Tabs + Slider Navigation */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            {/* Filter Tabs */}
            <div className="flex items-center bg-white border border-slate-300 rounded-xl p-1 font-mono text-xs shadow-xs">
              <button
                onClick={() => setFilter('All')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'All' ? 'bg-slate-900 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                All ({processedExhibitions.length})
              </button>
              <button
                onClick={() => setFilter('Upcoming')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'Upcoming' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                Upcoming ({processedExhibitions.filter(e => e.meta.status !== 'Past Exhibition').length})
              </button>
              <button
                onClick={() => setFilter('Past')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  filter === 'Past' ? 'bg-orange-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900 font-semibold'
                }`}
              >
                Past ({processedExhibitions.filter(e => e.meta.status === 'Past Exhibition').length})
              </button>
            </div>

            {/* Slider Prev / Next Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollExpoSlider('left')}
                disabled={!canScrollLeft}
                aria-label="Previous Exhibition"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollLeft 
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-xs cursor-pointer' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollExpoSlider('right')}
                disabled={!canScrollRight}
                aria-label="Next Exhibition"
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  canScrollRight 
                    ? 'bg-white border-slate-300 text-slate-800 hover:bg-orange-600 hover:text-white hover:border-orange-600 shadow-xs cursor-pointer' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Smooth Slider Track */}
        <div 
          ref={expoSliderRef}
          className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth snap-x snap-mandatory py-2 px-1 -mx-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredExhibitions.map((expo) => (
            <div 
              key={expo.id}
              onClick={() => handleOpenModal(expo)}
              className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 snap-start english-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300 bg-white border border-slate-200 shadow-sm"
            >
              <div>
                {/* Poster Header */}
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  <img 
                    src={expo.bannerImage} 
                    alt={expo.title} 
                    onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />

                  <div className="absolute top-2.5 left-2.5 bg-white/95 text-orange-700 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border border-orange-200 shadow-xs">
                    {expo.hallNumber} • {expo.boothNumber}
                  </div>

                  <div className={`absolute top-2.5 right-2.5 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold shadow-xs ${expo.meta.badgeClass}`}>
                    {expo.meta.label}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur px-2 py-0.5 rounded">
                      <ImageIcon className="w-3 h-3 text-orange-400" />
                      {(expo.galleryImages?.length || 0) + 1} Photos
                    </span>
                    {expo.videoUrls && expo.videoUrls.length > 0 && (
                      <span className="flex items-center gap-1.5 bg-rose-950/80 backdrop-blur px-2 py-0.5 rounded text-rose-200 border border-rose-800">
                        <Video className="w-3 h-3 text-rose-400" />
                        {expo.videoUrls.length} Live Demos
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600 font-semibold">
                    <span className="flex items-center gap-1 text-orange-700 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" /> {expo.startDate} to {expo.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {expo.location}, {expo.city}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {expo.title}
                    </h3>
                    {expo.subtitle && (
                      <p className="text-xs text-slate-500 italic mt-0.5 font-medium truncate">
                        {expo.subtitle}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {expo.description}
                  </p>

                  {/* Highlights preview */}
                  {expo.keyHighlights && expo.keyHighlights.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      {expo.keyHighlights.slice(0, 2).map((hl, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExpoSlug(expo.qrSlug);
                    setActiveView('public-expo-landing');
                  }}
                  className="text-xs font-bold text-orange-700 hover:text-orange-800 flex items-center gap-1 font-mono cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-orange-600" /> Scan QR
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(expo);
                  }}
                  className="btn-primary text-xs px-3 py-1.5 shadow-sm flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>Booth Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Exhibition Full Detail Modal (Multi-Photo, Videos, Address & VIP Slot) */}
      {selectedExpoModal && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center items-start animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedExpoModal(null);
              setBookingSuccess(null);
            }
          }}
        >
          {/* Fixed Floating Screen Close Button (Always visible on screen, never scrolls away) */}
          <button 
            type="button"
            onClick={() => {
              setSelectedExpoModal(null);
              setBookingSuccess(null);
            }}
            aria-label="Close Exhibition Modal"
            title="Close Modal (Esc)"
            className="fixed top-3 right-3 sm:top-6 sm:right-6 z-[120] p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-slate-900/95 hover:bg-rose-600 text-white shadow-2xl border border-slate-700 hover:border-rose-500 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-xs font-mono font-bold hidden sm:inline">CLOSE</span>
          </button>

          {/* Modal Container Box */}
          <div className="bg-white border border-slate-300 rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 my-4 sm:my-8">
            
            {/* Modal In-Card Close Button */}
            <button 
              type="button"
              onClick={() => {
                setSelectedExpoModal(null);
                setBookingSuccess(null);
              }}
              aria-label="Close Modal"
              title="Close (Esc)"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 border border-slate-200 transition-colors z-20 shadow-xs cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3 border-b border-slate-200 pb-4 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tech-label">EXHIBITION BOOTH SPECIFICATIONS</span>
                <span className="tech-badge bg-orange-50 border-orange-200 text-orange-800 font-bold">
                  {selectedExpoModal.hallNumber} • {selectedExpoModal.boothNumber}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {selectedExpoModal.status}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {selectedExpoModal.title}
              </h2>

              {selectedExpoModal.subtitle && (
                <p className="text-sm text-slate-600 font-medium italic">
                  {selectedExpoModal.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700 font-semibold">
                <span className="flex items-center gap-1.5 text-orange-700 font-bold">
                  <Calendar className="w-4 h-4 text-orange-600" /> {selectedExpoModal.startDate} to {selectedExpoModal.endDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" /> {selectedExpoModal.location}, {selectedExpoModal.city}, {selectedExpoModal.country}
                </span>
              </div>

              {selectedExpoModal.fullAddress && (
                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                  <Building className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <span><strong>Full Venue Address:</strong> {selectedExpoModal.fullAddress}</span>
                </p>
              )}
            </div>

            {/* Media Gallery Section */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaTab('photos')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                      activeMediaTab === 'photos'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Photo Gallery ({(selectedExpoModal.galleryImages?.length || 0) + 1})
                  </button>

                  {selectedExpoModal.videoUrls && selectedExpoModal.videoUrls.length > 0 && (
                    <button
                      onClick={() => setActiveMediaTab('videos')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                        activeMediaTab === 'videos'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" /> Live Demonstration Videos ({selectedExpoModal.videoUrls.length})
                    </button>
                  )}
                </div>

                {selectedExpoModal.brochurePdfUrl && (
                  <a
                    href={selectedExpoModal.brochurePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 font-mono"
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Download Brochure (PDF)</span>
                  </a>
                )}
              </div>

              {/* Photos Gallery Viewer */}
              {activeMediaTab === 'photos' && (
                <div className="space-y-3">
                  {(() => {
                    const allPhotos = [selectedExpoModal.bannerImage, ...(selectedExpoModal.galleryImages || [])];
                    const currentImg = allPhotos[activePhotoIdx] || allPhotos[0];
                    return (
                      <>
                        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 bg-slate-900 shadow-md">
                          <img
                            src={currentImg}
                            alt="Selected View"
                            onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded">
                            Photo {activePhotoIdx + 1} of {allPhotos.length}
                          </span>
                        </div>

                        {/* Thumbnail Strip */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {allPhotos.map((photo, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActivePhotoIdx(idx)}
                              className={`relative rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                                activePhotoIdx === idx ? 'border-orange-600 ring-2 ring-orange-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={photo} alt="Thumb" onError={(e) => { e.currentTarget.src = '/catalog_pages/page_4.png'; }} className="w-20 h-14 object-cover" />
                            </button>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Videos Section */}
              {activeMediaTab === 'videos' && selectedExpoModal.videoUrls && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedExpoModal.videoUrls.map((videoUrl, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="relative rounded-lg overflow-hidden h-44 bg-slate-900 flex items-center justify-center">
                        <video
                          src={videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-800">Demo Video #{idx + 1}</span>
                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                        >
                          <Play className="w-3 h-3" /> Open in New Tab
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Event Description & Live Schedule + VIP Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <h4 className="font-heading font-bold text-slate-900 text-base">Trade Show Focus & Machinery Demos</h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedExpoModal.description}
                </p>

                {/* Key Highlights */}
                {selectedExpoModal.keyHighlights && selectedExpoModal.keyHighlights.length > 0 && (
                  <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200 space-y-2 text-xs">
                    <p className="font-mono font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-600" /> Featured Booth Demonstrations:
                    </p>
                    <ul className="space-y-1.5 text-slate-700 font-medium">
                      {selectedExpoModal.keyHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Showcased Product Lines */}
                {selectedExpoModal.showcasedProducts && selectedExpoModal.showcasedProducts.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-600 uppercase">Product Lines on Display:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExpoModal.showcasedProducts.map((prod, i) => (
                        <span key={i} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* VIP Meeting Booking Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-heading font-bold text-slate-900 text-base">Book 1-on-1 Executive Meeting</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Reserve a private discussion slot at Booth {selectedExpoModal.boothNumber} with Weldor engineering leadership.
                  </p>
                </div>
                
                {bookingSuccess ? (
                  <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-2.5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-900">VIP Meeting Slot Confirmed!</p>
                    <p className="text-xs text-slate-700 font-medium">
                      Ref Lead ID: <strong className="font-mono text-orange-700">{bookingSuccess}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Our regional trade coordinator will send calendar invitations and booth access badges via WhatsApp / Email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleVIPBooking} className="space-y-3 text-xs">
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Company Name *</label>
                      <input 
                        type="text" 
                        required 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Contact Person *</label>
                      <input 
                        type="text" 
                        required 
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-mono font-bold text-slate-700 block mb-1">Email *</label>
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="font-mono font-bold text-slate-700 block mb-1">Mobile / WhatsApp *</label>
                        <input 
                          type="text" 
                          required 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono font-bold text-slate-700 block mb-1">Preferred Time Slot</label>
                      <select 
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 font-semibold text-slate-900"
                      >
                        <option value="Day 1 (11:00 AM Slot)">Day 1 (11:00 AM Slot)</option>
                        <option value="Day 2 (11:00 AM Slot)">Day 2 (11:00 AM Slot)</option>
                        <option value="Day 2 (03:00 PM Slot)">Day 2 (03:00 PM Slot)</option>
                        <option value="Day 3 (12:00 PM Slot)">Day 3 (12:00 PM Slot)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary text-xs justify-center py-2.5 shadow-md mt-2"
                    >
                      Reserve Executive Meeting Slot
                    </button>
                  </form>
                )}

              </div>

            </div>

            {/* Modal Bottom Action Strip */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono text-slate-500">
                Weldor Engineering Exhibition Showcase
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedExpoModal(null);
                  setBookingSuccess(null);
                }}
                className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 cursor-pointer"
              >
                <X className="w-4 h-4" /> Close Exhibition Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
