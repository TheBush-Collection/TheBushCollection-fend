import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import PropertyCard from '@/components/PropertyCard';
import OptimizedImage from '@/components/OptimizedImage';
import ReviewsSection from '@/components/ReviewsSection';
import { subscribeToMailchimp } from '@/lib/mailchimp';
import slugify from '@/lib/slugify';
import { toast } from 'sonner';

export default function Index() {
  const { properties, loading, error } = useBackendProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [propertyCategoryView, setPropertyCategoryView] = useState<'bush' | 'beach' | 'all'>('beach');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const carouselData = useMemo(() => [
    {
      place: 'Mwazaro Beach Lodge',
      subtitle: 'South Coast, Kenya',
      title: 'Witness The',
      title2: 'Dolphins',
      description: 'Wake to the sound of the Indian Ocean, stroll along 300 metres of untouched beach and mangroves, and feel the true rhythm of coastal Kenya.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xLmpwZyIsImlhdCI6MTc2MzYyOTcwNCwiZXhwIjoxNzk1MTY1NzA0fQ.Ihw6Bmfj9cx-SsrMzKzH0bt-4Qej5J0sfxw-JgKWllA'
    },
    {
      place: 'Mwazaro Beach Lodge',
      subtitle: 'South Coast, Kenya',
      title: 'Explore The',
      title2: 'Water Wilderness',
      description: 'Dive into a unique aquatic landscape where the lagoon meets ocean. Kayak, kiteâ€‘surf, snorkel or simply drift into calm as the tides spin their magic.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-21.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0yMS5qcGciLCJpYXQiOjE3NjM2Mjk3NTksImV4cCI6MTc5NTE2NTc1OX0.Pvrn4sSkN6u8EJQqmuvj-epoOj--T1DlEUKWJlJRhrc'
    },
    {
      place: 'Mwazaro Beach Lodge',
      subtitle: 'South Coast, Kenya',
      title: 'Experience The',
      title2: 'Magic of The Beach',
      description: 'A rare blend of tranquility and adventure. As the Indian Ocean meets lush mangroves, this lodge is your gateway to Kenya\'s wildlife and coastal charm.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-14.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xNC5qcGciLCJpYXQiOjE3NjM2Mjk4NzksImV4cCI6MTc5NTE2NTg3OX0.CeuwjPVvymlgWfQ5QjVAw8KH9n36zolqfx1Ahmdrbq8'
    },
    {
      place: 'Mwazaro Beach Lodge',
      subtitle: 'South Coast, Kenya',
      title: 'Discover The',
      title2: 'Secret Coastline',
      description: 'Where the turquoise waters of the Indian Ocean meet the serene beauty of untouched nature â€” a sanctuary for the soul.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-13.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xMy5qcGciLCJpYXQiOjE3NjM2Mjk4MzIsImV4cCI6MTc5NTE2NTgzMn0.4L16wdz4HQcyZubogPX0d0u4VwXtXedbJ1Br7odFfiw'
    }
  ], []);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % carouselData.length);
  }, [currentSlide, carouselData.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + carouselData.length) % carouselData.length);
  }, [currentSlide, carouselData.length, goToSlide]);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  // Preload all carousel images on mount
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    carouselData.forEach((s) => {
      const img = new Image();
      img.src = s.image;
      imgs.push(img);
    });
    return () => {
      imgs.forEach(i => { try { i.src = ''; } catch (e) { void e; } });
    };
  }, [carouselData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#292524]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border border-[#c9a961]/30"></div>
            <div className="absolute inset-0 rounded-full border-t border-[#c9a961] animate-spin"></div>
          </div>
          <p className="text-[#c9a961]/60 text-sm tracking-[0.25em] uppercase font-light">Loading Collection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#292524]">
        <div className="text-center max-w-md">
          <p className="text-[#c9a961] text-sm tracking-[0.2em] uppercase mb-3">Something went wrong</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || (property.type || '').toLowerCase() === selectedType.toLowerCase();
    const isNairobiHotel =
      property.location?.toLowerCase().includes('nairobi') ||
      property.name?.toLowerCase().includes('nairobi');
    return matchesSearch && matchesType && !isNairobiHotel;
  });

  const normalizedCategory = (value?: string) => (value || 'bush').toLowerCase();
  const bushProperties = filteredProperties.filter(p => normalizedCategory(p.category) === 'bush');
  const beachProperties = filteredProperties.filter(p => normalizedCategory(p.category) === 'beach');

  const propertyTypes = [
    ...new Set(
      properties
        .map(p => p.type)
        .filter((type): type is string => type !== null && type !== undefined && typeof type === 'string')
    ),
  ];

  const displayProperties = propertyCategoryView === 'all'
    ? filteredProperties
    : propertyCategoryView === 'bush'
      ? bushProperties
      : beachProperties;

  return (
    <div className="min-h-screen bg-[#292524]">

      {/* â”€â”€â”€ Floating Newsletter Button â”€â”€â”€ */}
      <button
        onClick={() => setShowSubscribeModal(true)}
        aria-label="Subscribe to newsletter"
        className="fixed right-6 bottom-6 z-50 group flex items-center gap-3 bg-[#c9a961] text-[#292524] pl-5 pr-6 py-3 rounded-full shadow-2xl shadow-[#c9a961]/20 hover:shadow-[#c9a961]/40 transition-all duration-500 hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18" />
        </svg>
        <span className="text-sm font-medium tracking-wide">Newsletter</span>
      </button>

      {/*  Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSubscribeModal(false)} />
          <div className="relative z-50 w-full max-w-md px-4">
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowSubscribeModal(false)}
                  className="text-white/60 hover:text-white text-2xl leading-none p-2 transition-colors"
                  aria-label="Close"
                >
                  Ã—
                </button>
              </div>
              <NewsletterForm onClose={() => setShowSubscribeModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* 
          HERO â€” Cinematic Full-Viewport
       */}
      <section className="relative h-screen overflow-hidden bg-[#292524]">
        {/* Background Slides */}
        {carouselData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1.4s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <OptimizedImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              placeholder="/placeholder-image.png"
            />
          </div>
        ))}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#292524]/60 via-[#292524]/20 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/90 via-transparent to-transparent z-[1]" />

        {/* Thin Decorative Border Frame */}
        <div className="absolute inset-6 md:inset-10 border border-white/[0.08] rounded-sm z-[2] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-28 px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto w-full">
          {/* Location Tag */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-[#c9a961]" />
            <span className="text-[#c9a961] text-xs tracking-[0.3em] uppercase font-light">{carouselData[currentSlide].place}</span>
            <span className="text-white/30 text-xs">â€”</span>
            <span className="text-white/40 text-xs tracking-[0.2em] uppercase font-light">{carouselData[currentSlide].subtitle}</span>
          </div>

          {/* Main Title Editorial Serif Style */}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-[0.9] mb-6 tracking-tight transition-all duration-700"
            key={`title-${currentSlide}`}
          >
            <span className="block text-white/90 font-light">{carouselData[currentSlide].title}</span>
            <span className="block text-[#c9a961] italic font-extralight">{carouselData[currentSlide].title2}</span>
          </h1>

          {/* Description + Actions Row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-full">
            <p className="text-white/70 text-base md:text-lg font-light leading-relaxed max-w-xl">
              {carouselData[currentSlide].description}
            </p>

            <div className="flex items-center gap-4 flex-shrink-0">
              <Link to="/collections">
                <Button className="bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 hover:tracking-[0.2em]">
                  Explore
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/book">
                <Button className="bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white/40 rounded-none px-8 py-6 text-sm tracking-[0.15em] uppercase font-light transition-all duration-300">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Navigation â€” Minimal Bottom Bar */}
        <div className="absolute bottom-8 left-8 md:left-16 lg:left-24 z-20 flex items-center gap-6">
          <button onClick={prevSlide} className="text-white/40 hover:text-white transition-colors duration-300" aria-label="Previous">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative h-[2px] transition-all duration-700 overflow-hidden"
                style={{ width: index === currentSlide ? '48px' : '16px' }}
                aria-label={`Slide ${index + 1}`}
              >
                <div className="absolute inset-0 bg-white/20" />
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-[#c9a961] origin-left animate-[slideProgress_8s_linear]" />
                )}
              </button>
            ))}
          </div>

          <button onClick={nextSlide} className="text-white/40 hover:text-white transition-colors duration-300" aria-label="Next">
            <ChevronRight className="w-5 h-5" />
          </button>

          <span className="text-white/20 text-xs tracking-widest ml-2 font-light">
            {String(currentSlide + 1).padStart(2, '0')} / {String(carouselData.length).padStart(2, '0')}
          </span>
        </div>

        {/* Vertical Text â€” Right Edge */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 z-20">
          <span className="text-[10px] tracking-[0.4em] uppercase text-white/15 font-light [writing-mode:vertical-lr] rotate-180">
            The Bush Collection Est. Heritage Since 1983
          </span>
        </div>
      </section>

      {/* 
          BRAND STATEMENT â€” Editorial Interlude
      */}
      <section className="relative py-24 md:py-32 bg-[#292524] overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-[#c9a961]/30" />

        <div className="max-w-5xl mx-auto px-8 md:px-16 text-center">
          <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-8">Our Promise</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white/90 leading-[1.2] mb-8">
            Spanning the breadth of <span className="italic text-[#c9a961]">Kenya</span> and <span className="italic text-[#c9a961]">Tanzania</span>,
            we bring together exceptional lodges &amp; camps all in optimal locations that deliver
            hospitality with <span className="italic text-[#c9a961]">heartfelt warmth</span>.
          </h2>
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="w-12 h-[1px] bg-[#c9a961]/30" />
            <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">40+ Years of Safari Heritage</span>
            <div className="w-12 h-[1px] bg-[#c9a961]/30" />
          </div>
        </div>
      </section>

      {/* 
          SEARCH â€” Minimal Inline Bar
      */}
      <section className="py-12 bg-[#322e2b] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
              <Input
                placeholder="Search destinations or properties..."
                className="pl-11 h-14 bg-white/[0.03] text-white border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/25 rounded-none text-sm tracking-wide transition-colors duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Custom styled dropdown to match dark theme */}
            <div className="relative md:w-52" ref={typeDropdownRef}>
              <button
                type="button"
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="w-full h-14 px-5 bg-white/[0.03] text-white/70 border border-white/[0.08] hover:border-white/[0.15] rounded-none text-sm tracking-wide focus:outline-none focus:border-[#c9a961]/40 transition-colors duration-300 flex items-center justify-between"
              >
                <span>
                  {selectedType === 'all'
                    ? 'All Types'
                    : selectedType && typeof selectedType === 'string'
                      ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
                      : 'Unknown'}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${typeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#322e2b] border border-white/[0.1] shadow-xl shadow-black/40 max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-5 py-3 text-sm tracking-wide transition-colors duration-150 ${
                      selectedType === 'all'
                        ? 'bg-[#c9a961]/20 text-[#c9a961]'
                        : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
                    }`}
                    onClick={() => { setSelectedType('all'); setTypeDropdownOpen(false); }}
                  >
                    All Types
                  </button>
                  {propertyTypes.map((type, index) => (
                    <button
                      type="button"
                      key={type || `type-${index}`}
                      className={`w-full text-left px-5 py-3 text-sm tracking-wide transition-colors duration-150 ${
                        selectedType === type
                          ? 'bg-[#c9a961]/20 text-[#c9a961]'
                          : 'text-white/60 hover:bg-white/[0.06] hover:text-white/90'
                      }`}
                      onClick={() => { setSelectedType(type); setTypeDropdownOpen(false); }}
                    >
                      {type && typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTIES — Editorial Grid */}
      <section className="py-20 md:py-28 bg-[#292524]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">The Collection</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-white/90 leading-tight">
                {propertyCategoryView === 'all'
                  ? 'All Properties'
                  : propertyCategoryView === 'bush'
                    ? 'Bush Properties'
                    : 'Beach Properties'}
              </h2>
              <p className="text-white/45 text-base font-light mt-3">
                {propertyCategoryView === 'all'
                  ? `${filteredProperties.length} exceptional destinations`
                  : propertyCategoryView === 'bush'
                    ? 'Safari lodges across the savannah'
                    : `${beachProperties.length} coastal retreats`}
              </p>
            </div>

            {/* Category Toggle â€” Refined Pill Tabs */}
            <div className="flex items-center gap-1 p-1 border border-white/[0.08] rounded-none">
              {(['beach', 'bush', 'all'] as const).map((cat) => (
                <button
                  key={cat}
                  className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300 ${
                    propertyCategoryView === cat
                      ? 'bg-[#c9a961] text-[#292524]'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                  onClick={() => setPropertyCategoryView(cat)}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Property Grid */}
          {displayProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-sm tracking-[0.2em] uppercase font-light mb-2">No properties found</p>
              <p className="text-white/30 text-sm font-light">Try adjusting your search criteria</p>
            </div>
          )}

          {/* View All Link */}
          <div className="flex justify-center mt-16">
            <Link to="/collections" className="group flex items-center gap-3 text-[#c9a961]/70 hover:text-[#c9a961] text-sm tracking-[0.2em] uppercase font-light transition-all duration-300">
              View Full Collection
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* PARTNERS — Clean Minimal Strip */}
      <section className="py-20 bg-[#322e2b] border-y border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 md:px-16 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-3">Trusted Worldwide</p>
              <h2 className="text-3xl md:text-4xl font-extralight text-white/90">Our Partners</h2>
            </div>
            <p className="text-white/40 text-sm font-light max-w-sm">
              Listed on the world's leading travel platforms
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#322e2b] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#322e2b] to-transparent z-10" />

          <div className="flex animate-scroll">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex items-center gap-12 px-6 min-w-max">
                {/* Booking.com */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect width="24" height="24" rx="4" fill="#003580"/>
                      <text x="12" y="16" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">B</text>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">Booking.com</span>
                  </div>
                </div>

                {/* Expedia */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" fill="#FFCB05"/>
                      <path d="M12 6L15 12L12 18L9 12Z" fill="#003087"/>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">Expedia</span>
                  </div>
                </div>

                {/* TripAdvisor */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="8" cy="12" r="4" fill="#34E0A1"/>
                      <circle cx="16" cy="12" r="4" fill="#34E0A1"/>
                      <circle cx="8" cy="12" r="2" fill="#000"/>
                      <circle cx="16" cy="12" r="2" fill="#000"/>
                      <path d="M4 8C4 8 6 6 12 6C18 6 20 8 20 8" stroke="#34E0A1" strokeWidth="2" fill="none"/>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">TripAdvisor</span>
                  </div>
                </div>

                {/* Airbnb */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8ZM12 18C8.7 18 6 20.7 6 24H18C18 20.7 15.3 18 12 18Z" fill="#FF5A5F"/>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">Airbnb</span>
                  </div>
                </div>

                {/* Hotels.com */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="4" y="4" width="16" height="16" rx="2" fill="#D32F2F"/>
                      <path d="M8 8H16V10H8V8ZM8 11H16V13H8V11ZM8 14H13V16H8V14Z" fill="white"/>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">Hotels.com</span>
                  </div>
                </div>

                {/* Agoda */}
                <div className="flex items-center justify-center h-16 px-10 bg-white/[0.04] border border-white/[0.06] rounded-sm hover:bg-white/[0.08] transition-all duration-500 group">
                  <div className="flex items-center gap-3">
                    <svg className="w-7 h-7 opacity-60 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" fill="#FF6B00"/>
                      <path d="M8 10L12 6L16 10L12 14Z" fill="white"/>
                      <path d="M8 14L12 18L16 14L12 10Z" fill="white" opacity="0.7"/>
                    </svg>
                    <span className="text-sm font-light tracking-wide text-white/50 group-hover:text-white/80 transition-colors">Agoda</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}</style>

      {/* CTA — Editorial Statement */}
      <section className="py-28 md:py-36 bg-[#292524] relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="max-w-4xl mx-auto text-center px-8 md:px-16 relative z-10">
          <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-8">Begin Your Journey</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white/90 leading-[1.15] mb-8">
            Ready for Your <br className="hidden sm:block" />
            <span className="italic text-[#c9a961]">Safari Adventure?</span>
          </h2>
          <p className="text-white/50 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
            Book your dream safari experience today and create memories that will last a lifetime. Let us craft the perfect East African journey for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button className="bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300">
                Start Booking
                <ArrowRight className="ml-3 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-white/15 hover:border-white/30 rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase font-light transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER — Clean, Editorial */}
      <footer className="bg-[#1c1917] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <h3 className="text-[#c9a961] text-sm tracking-[0.25em] uppercase font-light mb-6">The Bush Collection</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                Creating unforgettable safari experiences across Africa's most spectacular destinations for over 40 years.
              </p>
            </div>

            <div>
              <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase font-light mb-6">Navigate</h4>
              <ul className="space-y-3">
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/packages', label: 'Safari Packages' },
                  { to: '/collections', label: 'Collections' },
                  { to: '/contact', label: 'Contact' },
                  { to: '/faq', label: 'FAQ' },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-white/40 hover:text-[#c9a961] text-sm font-light transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase font-light mb-6">Destinations</h4>
              <ul className="space-y-3">
                <li className="text-white/40 text-sm font-light">Kenya</li>
                <li className="text-white/40 text-sm font-light">Tanzania</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white/60 text-xs tracking-[0.2em] uppercase font-light mb-6">Contact</h4>
              <ul className="space-y-3 text-white/40 text-sm font-light">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen</li>
                <li>P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs tracking-wide font-light">&copy; {new Date().getFullYear()} The Bush Collection. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-[1px] bg-[#c9a961]/30" />
              <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-light">Experience is Everything</span>
              <div className="w-8 h-[1px] bg-[#c9a961]/30" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NewsletterForm({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) return toast.error('Enter a valid email');
    setLoading(true);
    try {
      const res = await subscribeToMailchimp({ email });
      if (res.success) {
        const status = res.mailchimp_status || (res.data as { status?: string } | undefined)?.status;
        if (status === 'pending') {
          toast.info('Please check your email to confirm your subscription');
        } else {
          toast.success('Subscribed â€” check your inbox for updates');
        }
        setEmail('');
        if (onClose) onClose();
      } else {
        toast.error(res.error || 'Subscription failed');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative bg-[#292524] border border-[#c9a961]/30 rounded-none p-10 text-center shadow-2xl shadow-black/50">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
          <div className="w-10 h-10 bg-[#c9a961] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#292524]" />
          </div>
        </div>

        <p className="text-[#c9a961] text-xs tracking-[0.3em] uppercase font-light mb-2 mt-2">Stay Connected</p>
        <h3 className="text-2xl font-extralight text-white mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-sm text-white/30 font-light mb-8">Exclusive safari deals, travel tips, and updates delivered to your inbox.</p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-3">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="bg-white/[0.03] border-white/[0.08] text-white rounded-none h-12 placeholder:text-white/25 text-sm tracking-wide"
          />
          <Button type="submit" className="bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] rounded-none px-6 h-12 text-sm tracking-[0.1em] uppercase font-medium" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>

        <p className="text-[10px] text-white/15 mt-6 tracking-wide font-light">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </div>
  );
}
