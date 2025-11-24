import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar, Users, Search, Filter, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import PropertyCard from '@/components/PropertyCard';
import ReviewsSection from '@/components/ReviewsSection';

export default function Index() {
  const { properties, loading, error } = useBackendProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselData = [
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
  ];

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
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
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

      {/* Stats Section */}
<section className="py-16 bg-[#c9a961] text-[#000000]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div className="text-4xl font-bold mb-2">
          {properties.filter(property => 
            !property.location?.toLowerCase().includes('nairobi')
          ).length}
        </div>
        <div className="text-[#2a2623]">Safari Properties</div>
      </div>
      <div>
        <div className="text-4xl font-bold mb-2">
          {properties
            .filter(property => !property.location?.toLowerCase().includes('nairobi'))
            .reduce((sum, p) => sum + (p.rooms?.length || 0), 0)}
        </div>
        <div className="text-[#2a2623]">Total Safari Rooms</div>
      </div>
      <div>
        <div className="text-4xl font-bold mb-2">
          {properties
            .filter(property => !property.location?.toLowerCase().includes('nairobi'))
            .reduce((sum, p) => sum + (p.reviews || 0), 0)}
        </div>
        <div className="text-[#2a2623]">Safari Reviews</div>
      </div>
      <div>
        <div className="text-4xl font-bold mb-2">
          {(() => {
            const safariProperties = properties.filter(property => 
              !property.location?.toLowerCase().includes('nairobi')
            );
            return safariProperties.length > 0 
              ? (safariProperties.reduce((sum, p) => sum + (p.rating || 0), 0) / safariProperties.length).toFixed(1)
              : '0.0';
          })()}
        </div>
        <div className="text-[#2a2623]">Safari Rating</div>
      </div>
    </div>
  </div>
</section>

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