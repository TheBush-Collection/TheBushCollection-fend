import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Users, Search, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import PropertyCard from '@/components/PropertyCard';
import OptimizedImage from '@/components/OptimizedImage';
import ReviewsSection from '@/components/ReviewsSection';
import { subscribeToMailchimp } from '@/lib/mailchimp';
import { toast } from 'sonner';

export default function Index() {
  const { properties, loading, error } = useBackendProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const carouselData = useMemo(() => [
    {
      place: 'Mwazaro',
      title: 'Witness The',
      title2: 'Great Migration',
      description: 'Experience one of nature\'s most spectacular wonders on Kenya\'s coast. At Mwazaro Beach Lodge, you\'ll wake to the sound of the Indian Ocean, stroll along 300 metres of untouched beach and mangroves, and feel the true rhythm of coastal Kenya.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xLmpwZyIsImlhdCI6MTc2MzYyOTcwNCwiZXhwIjoxNzk1MTY1NzA0fQ.Ihw6Bmfj9cx-SsrMzKzH0bt-4Qej5J0sfxw-JgKWllA'
    },
    {
      place: 'Mwazaro',
      title: 'Explore The',
      title2: 'Water Wilderness',
      description: 'Dive into a unique aquatic landscape where the lagoon meets ocean, and mangrove channels beckon. Kayak, kite‑surf, snorkel or simply drift into calm as the tides spin their magic in this hidden gem south of Mombasa.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-21.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0yMS5qcGciLCJpYXQiOjE3NjM2Mjk3NTksImV4cCI6MTc5NTE2NTc1OX0.Pvrn4sSkN6u8EJQqmuvj-epoOj--T1DlEUKWJlJRhrc'
    },
    {
      place: 'Mwazaro',
      title: 'Experience The',
      title2: 'Magic of The Beach',
      description: 'Mwazaro Beach Lodge offers a rare blend of tranquility and adventure. As the Indian Ocean meets lush mangroves, this lodge is your gateway to Kenya\'s wildlife and coastal charm.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-14.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xNC5qcGciLCJpYXQiOjE3NjM2Mjk4NzksImV4cCI6MTc5NTE2NTg3OX0.CeuwjPVvymlgWfQ5QjVAw8KH9n36zolqfx1Ahmdrbq8'
    },
    {
      place: 'Mwazaro',
      title: 'Discover The',
      title2: 'Secret Coastline',
      description: 'Escape to Mwazaro Beach Lodge, where the turquoise waters of the Indian Ocean meet the serene beauty of untouched nature.',
      image: 'https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-13.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xMy5qcGciLCJpYXQiOjE3NjM2Mjk4MzIsImV4cCI6MTc5NTE2NTgzMn0.4L16wdz4HQcyZubogPX0d0u4VwXtXedbJ1Br7odFfiw'
    }
  ], []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  // Preload all carousel images on mount to make initial paint immediate
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    carouselData.forEach((s) => {
      const img = new Image();
      img.src = s.image;
      imgs.push(img);
    });

    return () => {
      // clear src to allow GC
      imgs.forEach(i => { try { i.src = ''; } catch (e) { void e; } });
    };
  }, [carouselData]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1816]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a961] mx-auto mb-4"></div>
          <p className="text-[#ffffff]/80">Loading safari properties...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1816]">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading properties</p>
          <p className="text-[#ffffff]/80 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Filter properties based on search, type, and exclude Nairobi hotels
  const filteredProperties = properties.filter(property => {
    const matchesSearch =
      (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || property.type === selectedType;

    // Exclude Nairobi hotels
    const isNairobiHotel =
      property.location?.toLowerCase().includes('nairobi') ||
      property.name?.toLowerCase().includes('nairobi');

    return matchesSearch && matchesType && !isNairobiHotel;
  });

  // Featured properties excluding Nairobi hotels
  const featuredProperties = properties.filter(
    property =>
      property.featured &&
      !property.location?.toLowerCase().includes('nairobi') &&
      !property.name?.toLowerCase().includes('nairobi')
  );

  // Filter out undefined/null types and get unique property types
  const propertyTypes = [
    ...new Set(
      properties
        .map(p => p.type)
        .filter(
          (type): type is string =>
            type !== null && type !== undefined && typeof type === 'string'
        )
    ),
  ];

  return (
    <div className="min-h-screen bg-[#1a1816]">
      {/* Floating subscribe button */}
      <button
        onClick={() => setShowSubscribeModal(true)}
        aria-label="Subscribe to newsletter"
        className="fixed right-8 bottom-8 z-50 flex items-center gap-4 bg-[#c9a961] text-black px-5 py-3 rounded-full shadow-lg hover:opacity-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18" />
        </svg>
        <span className="font-medium">Subscribe to Newsletter</span>
      </button>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSubscribeModal(false)} />
          <div className="relative z-50 w-full max-w-md px-4">
            <div className="bg-transparent">
              <div onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setShowSubscribeModal(false)}
                    className="text-white text-xl leading-none p-2"
                    aria-label="Close subscribe modal"
                  >
                    ×
                  </button>
                </div>
                <div className="mx-auto">
                  <div className="p-0">
                    <NewsletterForm onClose={() => setShowSubscribeModal(false)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden bg-[#1a1816]">
        {/* Background Slides */}
        {carouselData.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <OptimizedImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === currentSlide ? 'eager' : 'lazy'}
              decoding="async"
              placeholder="/placeholder-image.png"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#1a1816]/40"></div>
          </div>
        ))}

        {/* Property Tag - Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <span className="text-[#c9a961] text-lg md:text-xl font-semibold">
            {carouselData[currentSlide].place}
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-left max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-3xl">
            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white block">{carouselData[currentSlide].title}</span>
              <span className="text-[#c9a961] block">{carouselData[currentSlide].title2}</span>
            </h1>
            
            {/* Description */}
            <p className="text-base md:text-lg mb-8 text-white max-w-2xl leading-relaxed">
              {carouselData[currentSlide].description}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/properties">
                <Button size="lg" className="bg-[#ebe9d8] hover:bg-[#c9a961] text-[#000000] px-8 py-3 text-base font-normal rounded-md">
                  Explore Properties
                </Button>
              </Link>
              <Link to="/book">
                <Button size="lg" className="bg-[#1a1816]/60 hover:bg-[#1a1816]/80 text-white border-0 px-8 py-3 text-base font-normal rounded-md backdrop-blur-sm">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Navigation - Right Side */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-4">
          <button
            onClick={prevSlide}
            className="w-14 h-14 rounded-full border-2 border-white/60 hover:border-white hover:bg-white/20 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full border-2 border-white/60 hover:border-white hover:bg-white/20 flex items-center justify-center transition-all duration-300 group backdrop-blur-sm"
            aria-label="Next slide"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide Indicators - Right Side with Number */}
        <div className="absolute right-8 bottom-8 z-20 flex flex-col items-center space-y-3">
          {/* Slide Dots - Horizontal */}
          <div className="flex space-x-2">
            {carouselData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-[#c9a961] w-10 h-3' 
                    : 'bg-white/50 w-3 h-3 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Current Slide Number */}
          <div className="text-white text-4xl font-bold">
            {String(currentSlide + 1).padStart(2, '0')}
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-[#2a2623]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
              Find Your Perfect Safari
            </h2>
            <p className="text-xl text-[#ffffff]/80 max-w-2xl mx-auto">
              Search through our collection of luxury safari accommodations
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-[#c9a961] border-[#8b6f47]">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-5 w-5" />
                    <Input
                      placeholder="Search destinations or properties..."
                      className="pl-10 h-12 bg-[#ffffff] text-[#000000] border-[#8b6f47] placeholder:text-[#9ca3af]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:w-48">
                  <select
                    className="w-full h-12 px-3 bg-[#ffffff] text-[#000000] border border-[#8b6f47] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map((type, index) => (
                      <option key={type || `type-${index}`} value={type}>
                        {type && typeof type === 'string' ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                <Button size="lg" className="h-12 px-8 bg-[#ebe9d8] hover:bg-[#8b6f47] text-[#000000] hover:text-[#ffffff]">
                  <Filter className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-[#1a1816]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
                Featured Destinations
              </h2>
              <p className="text-xl text-[#ffffff]/80">
                Handpicked luxury safari experiences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Properties */}
      <section className="py-16 bg-[#2a2623]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
              All Safari Destinations
            </h2>
            <p className="text-xl text-[#ffffff]/80">
              {filteredProperties.length} properties available
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#ffffff] mb-2">No properties found</h3>
              <p className="text-[#ffffff]/80">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Partners Section */}
      <section className="py-16 bg-[#2a2623] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
              Our Partners
            </h2>
            <p className="text-xl text-white/80">
              Trusted by leading travel platforms worldwide
            </p>
          </div>
        </div>
        
        {/* Scrolling Partners Container */}
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set of partners */}
            <div className="flex items-center gap-16 px-8 min-w-max">
              {/* Booking.com */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect width="24" height="24" rx="4" fill="#003580"/>
                    <text x="12" y="16" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">B</text>
                  </svg>
                  <span className="text-lg font-semibold text-[#003580]">Booking.com</span>
                </div>
              </div>
              
              {/* Expedia */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="#FFCB05"/>
                    <path d="M12 6L15 12L12 18L9 12Z" fill="#003087"/>
                  </svg>
                  <span className="text-lg font-semibold text-[#003087]">Expedia</span>
                </div>
              </div>
              
              {/* TripAdvisor */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="8" cy="12" r="4" fill="#34E0A1"/>
                    <circle cx="16" cy="12" r="4" fill="#34E0A1"/>
                    <circle cx="8" cy="12" r="2" fill="#000"/>
                    <circle cx="16" cy="12" r="2" fill="#000"/>
                    <path d="M4 8C4 8 6 6 12 6C18 6 20 8 20 8" stroke="#34E0A1" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="text-lg font-semibold text-[#34E0A1]">TripAdvisor</span>
                </div>
              </div>
              
              {/* Airbnb */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8ZM12 18C8.7 18 6 20.7 6 24H18C18 20.7 15.3 18 12 18Z" fill="#FF5A5F"/>
                  </svg>
                  <span className="text-lg font-semibold text-[#FF5A5F]">Airbnb</span>
                </div>
              </div>
              
              {/* Hotels.com */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#D32F2F"/>
                    <path d="M8 8H16V10H8V8ZM8 11H16V13H8V11ZM8 14H13V16H8V14Z" fill="white"/>
                  </svg>
                  <span className="text-lg font-semibold text-[#D32F2F]">Hotels.com</span>
                </div>
              </div>
              
              {/* Agoda */}
              <div className="w-64 md:w-56 h-24 flex items-center justify-center bg-white rounded-lg shadow-lg px-6">
                <div className="flex items-center gap-4">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="#FF6B00"/>
                    <path d="M8 10L12 6L16 10L12 14Z" fill="white"/>
                    <path d="M8 14L12 18L16 14L12 10Z" fill="white" opacity="0.7"/>
                  </svg>
                  <span className="text-lg font-semibold text-[#FF6B00]">Agoda</span>
                </div>
              </div>
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-16 px-8 min-w-max">
              {/* Booking.com */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <rect width="24" height="24" rx="4" fill="#003580"/>
                    <text x="12" y="16" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">B</text>
                  </svg>
                  <span className="text-2xl font-bold text-[#003580]">Booking.com</span>
                </div>
              </div>
              
              {/* Expedia */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#FFCB05"/>
                    <path d="M12 6L15 12L12 18L9 12Z" fill="#003087"/>
                  </svg>
                  <span className="text-2xl font-bold text-[#003087]">Expedia</span>
                </div>
              </div>
              
              {/* TripAdvisor */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <circle cx="8" cy="12" r="4" fill="#34E0A1"/>
                    <circle cx="16" cy="12" r="4" fill="#34E0A1"/>
                    <circle cx="8" cy="12" r="2" fill="#000"/>
                    <circle cx="16" cy="12" r="2" fill="#000"/>
                    <path d="M4 8C4 8 6 6 12 6C18 6 20 8 20 8" stroke="#34E0A1" strokeWidth="2" fill="none"/>
                  </svg>
                  <span className="text-2xl font-bold text-[#34E0A1]">TripAdvisor</span>
                </div>
              </div>
              
              {/* Airbnb */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2ZM12 8C9.8 8 8 9.8 8 12C8 14.2 9.8 16 12 16C14.2 16 16 14.2 16 12C16 9.8 14.2 8 12 8ZM12 18C8.7 18 6 20.7 6 24H18C18 20.7 15.3 18 12 18Z" fill="#FF5A5F"/>
                  </svg>
                  <span className="text-2xl font-bold text-[#FF5A5F]">Airbnb</span>
                </div>
              </div>
              
              {/* Hotels.com */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#D32F2F"/>
                    <path d="M8 8H16V10H8V8ZM8 11H16V13H8V11ZM8 14H13V16H8V14Z" fill="white"/>
                  </svg>
                  <span className="text-2xl font-bold text-[#D32F2F]">Hotels.com</span>
                </div>
              </div>
              
              {/* Agoda */}
              <div className="flex items-center justify-center h-24 px-12 bg-white rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#FF6B00"/>
                    <path d="M8 10L12 6L16 10L12 14Z" fill="white"/>
                    <path d="M8 14L12 18L16 14L12 10Z" fill="white" opacity="0.7"/>
                  </svg>
                  <span className="text-2xl font-bold text-[#FF6B00]">Agoda</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* CTA Section */}
      <section className="py-16 bg-[#1a1816]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
            Ready for Your Safari Adventure?
          </h2>
          <p className="text-xl text-[#ffffff]/80 mb-8">
            Book your dream safari experience today and create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-[#ebe9d8] hover:bg-[#8b6f47] text-[#000000] hover:text-[#ffffff] px-8 py-3">
                Start Booking
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-[#8b6f47] text-[#ffffff] hover:bg-[#333033] hover:text-[#ffffff] px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2a2623] text-[#ffffff] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#c9a961]">Safari Tours</h3>
              <p className="text-[#ffffff]/80 mb-4">
                Creating unforgettable safari experiences across Africa's most spectacular destinations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Quick Links</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                <li><Link to="/about" className="hover:text-[#c9a961]">About Us</Link></li>
                <li><Link to="/packages" className="hover:text-[#c9a961]">Safari Packages</Link></li>
                <li><Link to="/collections" className="hover:text-[#c9a961]">Collections</Link></li>
                <li><Link to="/contact" className="hover:text-[#c9a961]">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-[#c9a961]">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Destinations</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                <li>Kenya</li>
                <li>Tanzania</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Contact</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen.</li>
                <li>P.O BOX 58671-00200,Nairobi</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#8b6f47] mt-8 pt-8 text-center text-[#ffffff]/80">
            <p>&copy; 2024 The Bush Collection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NewsletterForm({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // const toast = useToast();

  const handleSubscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) return toast.error('Enter a valid email');
    setLoading(true);
    try {
      const res = await subscribeToMailchimp({ email });
      if (res.success) {
        // Backend may return mailchimp_status (pending/subscribed) to indicate whether
        // Mailchimp will send a confirmation email (pending) or the member is active (subscribed)
        const status = (res as any).mailchimp_status || (res as any).data?.status;
        if (status === 'pending') {
          toast('Please check your email to confirm your subscription', { type: 'info' });
        } else {
          toast.success('Subscribed — check your inbox for updates');
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
      <div className="relative bg-[#0f0e0d] border border-[#c9a961] rounded-lg p-8 text-center shadow-lg">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#c9a961] rounded-full w-12 h-12 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
          </svg>
        </div>

        <h3 className="text-2xl font-semibold text-white mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-sm text-white/70 mb-6">Get exclusive safari deals, travel tips, and updates delivered to your inbox.</p>

        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3">
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="bg-[#1b1918] border-[#2a2a2a] text-white"
          />
          <Button type="submit" className="bg-[#c9a961] text-black px-6" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe Now'}
          </Button>
        </form>

        <p className="text-xs text-white/50 mt-4">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </div>
  );
}