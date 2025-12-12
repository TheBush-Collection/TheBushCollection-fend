import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Users, Calendar, Clock, Camera, Binoculars, Plane, Car, Utensils, Shield, Check, Search, Filter, Building2, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBackendPackages } from '@/hooks/useBackendPackages';
import { Package } from '@/types/package';
import slugify from '@/lib/slugify';

export default function Packages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'duration'>('featured');

  // Convert price filter to min/max values for API
  const getPriceRange = (filter: string) => {
    switch (filter) {
      case 'budget':
        return { minPrice: 0, maxPrice: 2500 };
      case 'mid':
        return { minPrice: 2500, maxPrice: 3500 };
      case 'luxury':
        return { minPrice: 3500, maxPrice: undefined };
      default:
        return { minPrice: undefined, maxPrice: undefined };
    }
  };

  const priceRange = getPriceRange(priceFilter);

  // Memoize options object so identity doesn't change each render
  const packagesOptions = useMemo(() => ({
    search: searchTerm || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice,
    duration: durationFilter !== 'all' ? durationFilter : undefined,
    sortBy,
    page: 1,
    limit: 12
  }), [searchTerm, categoryFilter, priceRange.minPrice, priceRange.maxPrice, durationFilter, sortBy]);

  // Fetch packages from backend with filters
  const { 
    packages: sortedPackages, 
    loading, 
    error 
  } = useBackendPackages(packagesOptions);

  // Get unique categories and durations from loaded packages for filter options
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(sortedPackages.map(p => p.category))];
    return uniqueCategories.sort();
  }, [sortedPackages]);

  const durations = useMemo(() => {
    const uniqueDurations = [...new Set(sortedPackages.map(p => p.duration.split(' ')[0]))];
    return uniqueDurations.sort((a, b) => parseInt(a) - parseInt(b));
  }, [sortedPackages]);

  // Helper function to get display location
  const getDisplayLocation = (pkg: Package) => {
    return pkg.location || pkg.destinations?.slice(0, 2).join(', ') || 'Multiple Destinations';
  };

  // Get featured packages from all packages (client-side filtering for featured section)
  const featuredPackages = useMemo(() => {
    return sortedPackages.filter(p => p.featured);
  }, [sortedPackages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#ffffff] mb-4">Loading packages...</h1>
            <p className="text-[#ffffff]/80">Please wait while we load the available packages.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#ffffff] mb-4">Error Loading Packages</h1>
            <p className="text-[#ffffff]/80 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-[#ebe9d8] hover:bg-[#c9a961] text-[#000000]">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1816]">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#2a2623] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#ffffff]">
            Safari Tour Packages
          </h1>
          <p className="text-xl md:text-2xl text-[#ffffff]/80 max-w-3xl mx-auto mb-8">
            Carefully crafted safari experiences with expert guides, luxury accommodations, and unforgettable adventures
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#c9a961] hover:bg-[#8b6f47] text-[#000000] px-8 py-3">
              Browse All Packages
            </Button>
            <Link to="/contact">
              <Button size="lg" className="bg-[#333033] hover:bg-[#8b6f47] text-[#ffffff] px-8 py-3">
                Custom Package
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-12 bg-[#ebe9d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-[#c9a961] border-[#8b6f47]">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af] h-5 w-5" />
                    <Input
                      placeholder="Search packages by destination, property, activities, or highlights..."
                      className="pl-10 h-12 bg-[#ffffff] text-[#000000] border-[#8b6f47] placeholder:text-[#9ca3af]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-40">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:w-40">
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="budget">Under $2,500</SelectItem>
                        <SelectItem value="mid">$2,500 - $3,500</SelectItem>
                        <SelectItem value="luxury">$3,500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:w-40">
                    <Select value={durationFilter} onValueChange={setDurationFilter}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Durations</SelectItem>
                        {durations.map(duration => (
                          <SelectItem key={duration} value={duration}>
                            {duration} Days
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="sm:w-40">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

{/* Featured Packages */}
{featuredPackages.length > 0 && (
  <section className="py-16 bg-[#1a1816]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4">
          Featured Safari Packages
        </h2>
        <p className="text-xl text-[#ffffff]/80">
          Our most popular and highly-rated safari experiences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-[#ebe9d8] border-[#8b6f47]">
            <div className="relative h-64">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              {/* Featured and Itinerary badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-[#f59e0b] text-white border-0">
                  Featured
                </Badge>
                {pkg.itinerary && pkg.itinerary.length > 0 && (
                  <Badge className="bg-[#003580] text-white text-xs border-0">
                    <Calendar className="h-3 w-3 mr-1" />
                    Itinerary
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#c9a961] text-[#000000] border-0">
                  Save ${pkg.originalPrice - pkg.price}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#2a2623] mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-[#2a2623]/80 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {getDisplayLocation(pkg)}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-[#f59e0b] mr-1" />
                  <span className="text-sm font-medium text-[#2a2623]">{pkg.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#2a2623]/80 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{pkg.groupSize}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-[#2a2623] mb-2">Package Highlights:</p>
                <div className="space-y-1">
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm text-[#2a2623]/80">
                      <Check className="h-3 w-3 text-[#c9a961] mr-2" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#c9a961]">
                      ${pkg.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#2a2623]/60 line-through">
                      ${pkg.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#2a2623]/60">per person</p>
                </div>
                <Badge variant="outline" className="text-xs border-[#8b6f47] text-[#2a2623]">
                  {pkg.category}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Link to={`/book?package=${(pkg as any).slug || slugify(pkg.name) || pkg.id}`} className="flex-1">
                  <Button className="w-full bg-[#c9a961] hover:bg-[#8b6f47] text-[#000000]">
                    Book Now
                  </Button>
                </Link>
                <Link to={`/package/${(pkg as any).slug || slugify(pkg.name) || pkg.id}`} className="flex-1">
                  <Button className="w-full bg-[#333033] hover:bg-[#8b6f47] text-[#ffffff]">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
)}

{/* All Packages */}
<section className="py-16 bg-[#2a2623]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-[#ffffff]">
        All Safari Packages
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-[#ffffff]/80">
          {sortedPackages.length} packages found
        </span>
      </div>
    </div>

    {sortedPackages.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPackages.map((pkg) => (
          <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow bg-[#ebe9d8] border-[#8b6f47]">
            <div className="relative h-64 bg-[#333033]">
              {pkg.image ? (
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#333033] text-[#ffffff]/50">
                  <ImageOff className="h-12 w-12" />
                </div>
              )}
              {/* Itinerary indicator */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#003580] text-white text-xs border-0">
                    <Calendar className="h-3 w-3 mr-1" />
                    Itinerary
                  </Badge>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-[#c9a961] text-[#000000] border-0">
                  Save ${pkg.originalPrice - pkg.price}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge className={`${
                  pkg.difficulty === 'easy' ? 'bg-[#34E0A1]' :
                  pkg.difficulty === 'moderate' ? 'bg-[#f59e0b]' :
                  'bg-[#c9a961]'
                } text-[#000000] border-0`}>
                  {pkg.difficulty.charAt(0).toUpperCase() + pkg.difficulty.slice(1)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-[#2a2623] mb-1">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-[#2a2623]/80 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {getDisplayLocation(pkg)}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-[#f59e0b] mr-1" />
                  <span className="text-sm font-medium text-[#2a2623]">{pkg.rating}</span>
                  <span className="text-xs text-[#2a2623]/60 ml-1">({pkg.reviews})</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#2a2623]/80 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{pkg.groupSize}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-[#2a2623] mb-2">Package Highlights:</p>
                <div className="space-y-1">
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <div key={index} className="flex items-center text-sm text-[#2a2623]/80">
                      <Check className="h-3 w-3 text-[#c9a961] mr-2" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                  {pkg.highlights.length > 3 && (
                    <p className="text-xs text-[#2a2623]/60">+{pkg.highlights.length - 3} more highlights</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#c9a961]">
                      ${pkg.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-[#2a2623]/60 line-through">
                      ${pkg.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#2a2623]/60">per person</p>
                </div>
                <Badge variant="outline" className="text-xs border-[#8b6f47] text-[#2a2623]">
                  {pkg.category}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Link to={`/book?package=${(pkg as any).slug || slugify(pkg.name) || pkg.id}`} className="flex-1">
                  <Button className="w-full bg-[#c9a961] hover:bg-[#8b6f47] text-[#000000]">
                    Book Now
                  </Button>
                </Link>
                <Link to={`/package/${(pkg as any).slug || slugify(pkg.name) || pkg.id}`} className="flex-1">
                  <Button className="w-full bg-[#333033] hover:bg-[#8b6f47] text-[#ffffff]">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <Search className="h-16 w-16 mx-auto mb-4 text-[#ffffff]/30" />
          <h3 className="text-xl font-medium text-[#ffffff] mb-2">
            No packages found
          </h3>
          <p className="text-[#ffffff]/80 mb-6">
            Try adjusting your search criteria or browse all available packages
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setPriceFilter('all');
              setDurationFilter('all');
              setSortBy('featured');
            }}
            className="bg-[#c9a961] hover:bg-[#8b6f47] text-[#000000]"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    )}
  </div>
</section>

      {/* Package Categories 
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Safari Type
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect safari experience for your adventure style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(category => {
              const categoryPackages = tourPackages.filter(p => p.category === category);
              const avgPrice = Math.round(categoryPackages.reduce((sum, p) => sum + p.price, 0) / categoryPackages.length);
              const packagesWithItinerary = categoryPackages.filter(p => p.itinerary && p.itinerary.length > 0).length;
              const icon = category.includes('Wildlife') ? Binoculars :
                          category.includes('Luxury') ? Star :
                          category.includes('Adventure') ? Camera :
                          category.includes('Water') ? Car :
                          category.includes('Desert') ? Plane :
                          Users;
              const IconComponent = icon;

              return (
                <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCategoryFilter(category)}>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {categoryPackages.length} packages available
                      {packagesWithItinerary > 0 && (
                        <span className="text-blue-600"> • {packagesWithItinerary} with detailed itineraries</span>
                      )}
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        From ${avgPrice.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        {(categoryPackages.reduce((sum, p) => sum + p.rating, 0) / categoryPackages.length).toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-[#ebe9d8] text-[#2a2623]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2a2623]">
            Ready for Your Safari Adventure?
          </h2>
          <p className="text-xl mb-8 text-[#2a2623]/80">
            Book your dream safari package today and create memories that will last a lifetime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#c9a961] hover:bg-[#8b6f47] text-[#000000] px-8 py-3">
              Book Any Package
            </Button>
            <Link to="/contact">
              <Button size="lg" className="bg-[#333033] hover:bg-[#8b6f47] text-[#ffffff] px-8 py-3">
                Speak to Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2a2623] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#c9a961]">Safari Packages</h3>
              <p className="text-[#ffffff]/80 mb-4">
                Creating unforgettable safari experiences across Africa's most spectacular destinations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Package Types</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                {categories.map(category => (
                  <li key={category}>
                    <button 
                      onClick={() => setCategoryFilter(category)}
                      className="hover:text-[#c9a961] transition-colors"
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Quick Links</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                <li><Link to="/about" className="hover:text-[#c9a961] transition-colors">About Us</Link></li>
                <li><Link to="/collections" className="hover:text-[#c9a961] transition-colors">Properties</Link></li>
                <li><Link to="/contact" className="hover:text-[#c9a961] transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-[#c9a961]">Contact</h4>
              <ul className="space-y-2 text-[#ffffff]/80">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen.</li>
                <li>P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#8b6f47] mt-8 pt-8 text-center text-[#ffffff]/80">
            <p>&copy; 2024 the bush collection. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}