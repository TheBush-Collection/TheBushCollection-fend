import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Filter, Search, Sparkles, Award, Globe } from 'lucide-react';
import slugify from '@/lib/slugify';
import PropertyCard from '@/components/PropertyCard';
import { useBackendProperties } from '@/hooks/useBackendProperties';

const Collections = () => {
  const { properties, loading, error } = useBackendProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-center">
          <motion.div 
            className="w-16 h-16 border-4 border-[#c9a961] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/70">Loading safari collections...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2 text-lg">Error loading collections</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Get unique types and locations, filtering out undefined/null values
  const propertyTypes = [...new Set(properties.map(p => p.type).filter((type): type is string => type !== null && type !== undefined && typeof type === 'string'))];
  const locations = [...new Set(properties.map(p => p.location).filter((location): location is string => location !== null && location !== undefined && typeof location === 'string'))];

  // Filter out Nairobi locations for main collections (safari properties only)
  const safariLocations = locations.filter(location => 
    location && !location.toLowerCase().includes('nairobi')
  );

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (property.description && property.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || property.location === selectedLocation;
    return matchesSearch && matchesType && matchesLocation;
  });

  // Separate Nairobi hotels (for overnight stays before safari)
  const nairobiHotels = filteredProperties.filter(p => 
    (p.location || '').toLowerCase().includes('nairobi')
  );

  // Filter out Nairobi hotels from regular properties
  const nonNairobiProperties = filteredProperties.filter(p => 
    !(p.location || '').toLowerCase().includes('nairobi')
  );

  const safeCapitalize = (str: string | undefined) => {
    if (!str || typeof str !== 'string') return 'Unknown';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="min-h-screen bg-[#1a1816]">
      {/* Hero Section */}
      <section 
        className="relative py-40 bg-cover bg-center overflow-hidden"
        style={{ 
          backgroundImage: "url('https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-12.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xMi5qcGciLCJpYXQiOjE3NjM2Mzc5NjQsImV4cCI6MTc5NTE3Mzk2NH0.g9UmiHd-lRuaBK5WB1qrm_SxDSaoho7J_x24HHFJhVM')",
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816]/95 via-[#1a1816]/85 to-[#1a1816]"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#c9a961] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30 px-6 py-2 text-sm mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 inline mr-2" />
              Luxury Safari Properties
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white tracking-tight">
              Our Camps & Lodges
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed mb-10">
              Discover our curated collection of luxury hotel accommodations across Kenya and Tanzania's most breathtaking destinations. 
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#c9a961] text-[#1a1816] hover:bg-[#b8935a] px-8 shadow-xl font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Our Hotels
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-[#c9a961] text-[#c9a961] hover:bg-[#c9a961]/10 px-8 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('nairobi')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Nairobi Hotels
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-[#2a2623] border-[#c9a961]/20 shadow-2xl overflow-hidden backdrop-blur-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c9a961] h-5 w-5" />
                      <Input
                        placeholder="Search properties, locations, or descriptions..."
                        className="pl-12 h-12 text-base bg-[#1a1816] border-[#c9a961]/30 text-white placeholder:text-white/40 focus:border-[#c9a961] rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:w-52">
                    <select
                      className="w-full h-12 px-4 bg-[#1a1816] border border-[#c9a961]/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-transparent text-base"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      {propertyTypes.map((type, index) => (
                        <option key={type || `type-${index}`} value={type}>
                          {safeCapitalize(type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:w-52">
                    <select
                      className="w-full h-12 px-4 bg-[#1a1816] border border-[#c9a961]/30 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c9a961] focus:border-transparent text-base"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {safariLocations.map((location, index) => (
                        <option key={location || `loc-${index}`} value={location}>
                          {location || 'Unknown'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Collections Description Section */}
      <section className="py-20 bg-[#1a1816]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30 px-6 py-2 text-sm mb-6">
              Curated Excellence
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Our Safari Collections
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Every property is handpicked to ensure an unforgettable African safari experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Award, title: 'Luxury Standards', desc: 'Every property meets our rigorous standards for comfort, service, and authentic safari experiences.', color: 'from-[#c9a961] to-[#8b6f47]' },
              { icon: MapPin, title: 'Prime Locations', desc: 'Strategically located in the heart of wildlife-rich areas for optimal game viewing and immersion.', color: 'from-[#b8935a] to-[#6b5638]' },
              { icon: Globe, title: 'Expert Hosts', desc: 'Knowledgeable guides and staff dedicated to creating unforgettable wildlife encounters.', color: 'from-[#a17d4a] to-[#8b6f47]' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group text-center p-8 rounded-2xl bg-[#2a2623] border border-[#c9a961]/20 hover:border-[#c9a961]/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Properties Section - Not grouped by type */}
      {nonNairobiProperties.length > 0 && (
        <section id="properties" className="py-20 bg-gradient-to-b from-[#1a1816] to-[#2a2623]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex items-center justify-between mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h3 className="text-4xl font-bold text-white mb-2">
                  Featured Safari Properties
                </h3>
                <p className="text-lg text-white/60">
                  Explore handpicked luxury accommodations across Kenya and Tanzania's most breathtaking safari destinations.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {nonNairobiProperties.map((property, index) => (
                <motion.div 
                  key={property.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nairobi Hotels Section - After Our Properties */}
      {nairobiHotels.length > 0 && (
        <section id="nairobi" className="py-20 bg-[#1a1816] relative overflow-hidden border-t border-[#c9a961]/20">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden hidden md:block">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c9a961]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8b6f47]/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30 px-6 py-2 text-sm mb-6">
                <MapPin className="w-4 h-4 inline mr-2" />
                Pre-Safari Accommodation
              </Badge>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Nairobi Hotels
              </h3>
              <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                Comfortable overnight stays in Nairobi before your safari adventure begins.
                Rest and prepare for your journey into the wild.
              </p>
            </motion.div>

            {/* The Bush Collection Owned Hotels */}
            {(() => {
              const ownedHotels = nairobiHotels.filter(hotel =>
                hotel.name && (
                  hotel.name.toLowerCase().includes('bush collection') ||
                  hotel.name.toLowerCase().includes('the bush') ||
                  hotel.featured === true // Using featured as a proxy for owned
                )
              );

              if (ownedHotels.length > 0) {
                return (
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-8">
                      <h4 className="text-2xl font-bold text-white">
                        Our Properties
                      </h4>
                      <Badge className="bg-[#c9a961]/20 text-[#c9a961] border border-[#c9a961]/30 px-3 py-1">
                        Bookable
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {ownedHotels.map((property, index) => (
                        <motion.div 
                          key={property.id}
                          className="relative"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-[#2a2623] border-2 border-[#c9a961]/30 rounded-lg">
                            <div className="relative">
                              {property.images && property.images[0] ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.name}
                                  className="w-full h-64 object-cover"
                                />
                              ) : (
                                <div className="w-full h-64 bg-[#151413] flex items-center justify-center text-white/40">No image</div>
                              )}
                              <div className="absolute top-4 left-4">
                                <Badge className="bg-[#c9a961] text-white shadow-lg">
                                  Featured
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-[#c9a961] text-white shadow-lg">
                                  Our Property
                                </Badge>
                              </div>
                            </div>

                            <div className="p-6">
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-2xl font-semibold text-white mb-2">{property.name}</h3>
                                  <div className="flex items-center text-white/60 text-sm">
                                    <MapPin className="h-4 w-4 mr-1 text-[#c9a961]" />
                                    {property.location}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-[#c9a961] fill-[#c9a961] mr-1" />
                                    <span className="font-medium text-white">{property.rating}</span>
                                    <span className="text-white/60 ml-1">({property.reviews || property.numReviews || 0} reviews)</span>
                                  </div>
                                  {property.rooms && property.rooms.length > 0 && (
                                    <div className="flex items-center text-white/60">
                                      <Users className="h-4 w-4 mr-1" />
                                      Up to {Math.max(...property.rooms.map(r => r.maxGuests || r.max_guests || 1))} guests
                                    </div>
                                  )}
                                </div>

                                <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                                  {property.description}
                                </p>

                                <div className="border-t border-[#c9a961]/20 pt-4 mt-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <span className="text-2xl font-bold text-[#c9a961]">${property.price_from || property.basePricePerNight || property.price || 0}</span>
                                      <span className="text-white/60 text-sm ml-1">per night</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      className="flex-1 border-[#c9a961]/30 text-[#c9a961] hover:bg-[#c9a961]/10 hover:border-[#c9a961]"
                                      onClick={() => {
                                        const slug = (property as any).slug || slugify(property.name) || property.id;
                                        window.location.href = `/property/${slug}`;
                                      }}
                                    >
                                      View Details
                                    </Button>
                                    <Button
                                      className="flex-1 bg-[#c9a961] hover:bg-[#b8935a] text-white font-semibold"
                                      onClick={() => {
                                        const slug = (property as any).slug || slugify(property.name) || property.id;
                                        window.location.href = `/book?property=${slug}`;
                                      }}
                                    >
                                      Book Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Partner Hotels */}
            {(() => {
              const partnerHotels = nairobiHotels.filter(hotel =>
                hotel.name && !(
                  hotel.name.toLowerCase().includes('bush collection') ||
                  hotel.name.toLowerCase().includes('the bush') ||
                  hotel.featured === true
                )
              );

              if (partnerHotels.length > 0) {
                return (
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <h4 className="text-2xl font-bold text-white">
                        Partner Hotels
                      </h4>
                      <Badge className="bg-[#8b6f47]/20 text-[#8b6f47] border border-[#8b6f47]/30 px-3 py-1">
                        Information Only
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {partnerHotels.map((property, index) => {
                        const isOurProperty = property.featured === true ||
                          (property.name && (
                            property.name.toLowerCase().includes('bush collection') ||
                            property.name.toLowerCase().includes('the bush')
                          ));

                        return (
                          <motion.div 
                            key={property.id}
                            className="relative"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-[#2a2623] border border-[#c9a961]/20 rounded-lg">
                              <div className="relative">
                                {property.images && property.images[0] ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.name}
                                    className="w-full h-64 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-64 bg-[#151413] flex items-center justify-center text-white/40">No image</div>
                                )}
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-[#c9a961] text-white shadow-lg">
                                    Nairobi
                                  </Badge>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-[#8b6f47] text-white shadow-lg">
                                    Partner Hotel
                                  </Badge>
                                </div>
                              </div>

                              <div className="p-6">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="text-2xl font-semibold text-white mb-2">{property.name}</h3>
                                    <div className="flex items-center text-white/60 text-sm">
                                      <MapPin className="h-4 w-4 mr-1 text-[#c9a961]" />
                                      {property.location}
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 text-[#c9a961] fill-[#c9a961] mr-1" />
                                      <span className="font-medium text-white">{property.rating}</span>
                                      <span className="text-white/60 ml-1">({property.reviews || property.numReviews || 0} reviews)</span>
                                    </div>
                                    {property.rooms && property.rooms.length > 0 && (
                                      <div className="flex items-center text-white/60">
                                        <Users className="h-4 w-4 mr-1" />
                                        Up to {Math.max(...property.rooms.map(r => r.maxGuests || r.max_guests || 1))} guests
                                      </div>
                                    )}
                                  </div>

                                  <p className="text-white/70 text-sm line-clamp-3 leading-relaxed">
                                    {property.description}
                                  </p>

                                  <div className="border-t border-[#c9a961]/20 pt-4 mt-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        {isOurProperty ? (
                                          <>
                                            <span className="text-2xl font-bold text-[#c9a961]">${property.price_from || property.basePricePerNight || property.price || 0}</span>
                                            <span className="text-white/60 text-sm ml-1">per night</span>
                                          </>
                                        ) : (
                                          <span className="text-sm text-white/50 italic">Contact for pricing</span>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="border-[#c9a961]/30 text-[#c9a961] hover:bg-[#c9a961]/10 hover:border-[#c9a961]"
                                        >
                                          View Details
                                        </Button>
                                        <Button
                                          className="bg-[#3a3330] text-white/40 cursor-not-allowed hover:bg-[#3a3330]"
                                          size="sm"
                                          disabled
                                        >
                                          Not Bookable
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <motion.div 
              className="mt-12 p-8 bg-[#2a2623] border border-[#c9a961]/20 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#c9a961] to-[#8b6f47] rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white mb-3">Why Stay in Nairobi?</h4>
                  <p className="text-white/60 leading-relaxed">
                    Most international flights arrive in Nairobi. Spending a night here allows you to rest,
                    adjust to the time zone, and start your safari refreshed. Our partner hotels offer
                    comfortable accommodations, airport transfers, and early morning departures to safari destinations.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* No Results */}
      {nonNairobiProperties.length === 0 && nairobiHotels.length === 0 && (
        <section className="py-20 bg-[#1a1816]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-20 h-20 bg-[#2a2623] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-[#c9a961]" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">
                No properties found
              </h3>
              <p className="text-white/60 mb-8 leading-relaxed">
                Try adjusting your search criteria or browse all properties
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedLocation('all');
                }}
                className="bg-[#c9a961] hover:bg-[#b8935a] text-white px-8"
                size="lg"
              >
                Clear Filters
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-20 bg-[#1a1816] border-t border-[#c9a961]/20 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#c9a961]/5 via-transparent to-[#8b6f47]/5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { value: nonNairobiProperties.length, label: 'Safari Properties', color: 'from-[#c9a961] to-[#b8935a]' },
              { value: nairobiHotels.length, label: 'Nairobi Hotels', color: 'from-[#b8935a] to-[#a17d4a]' },
              { value: safariLocations.length, label: 'Safari Destinations', color: 'from-[#a17d4a] to-[#8b6f47]' },
              { value: nonNairobiProperties.reduce((sum, p) => sum + (p.rooms?.length || 0), 0), label: 'Safari Rooms', color: 'from-[#8b6f47] to-[#6b5638]' },
              { value: nonNairobiProperties.length > 0 ? (nonNairobiProperties.reduce((sum, p) => sum + (p.rating || 0), 0) / nonNairobiProperties.length).toFixed(1) : '0.0', label: 'Average Rating', color: 'from-[#c9a961] to-[#8b6f47]' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className={`text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-white/60 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0e0d] text-white py-16 border-t border-[#c9a961]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#c9a961] to-[#8b6f47] bg-clip-text text-transparent">
                Safari Collections
              </h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                Curated luxury safari experiences across Africa's most spectacular destinations. 
                We partner with the finest lodges, camps, and safari properties to bring you unforgettable wildlife encounters.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Property Types</h4>
              <ul className="space-y-3 text-white/60">
                {propertyTypes.map((type, index) => (
                  <li key={type || `type-${index}`}>
                    <button 
                      onClick={() => setSelectedType(type)}
                      className="hover:text-[#c9a961] transition-colors duration-200"
                    >
                      {safeCapitalize(type)}s ({filteredProperties.filter(p => p.type === type && !(p.location || '').toLowerCase().includes('nairobi')).length})
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Destinations</h4>
              <ul className="space-y-3 text-white/60">
                {safariLocations.slice(0, 6).map((location, index) => (
                  <li key={location || `location-${index}`}>
                    <button 
                      onClick={() => setSelectedLocation(location)}
                      className="hover:text-[#c9a961] transition-colors duration-200"
                    >
                      {location || 'Unknown'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Contact</h4>
              <ul className="space-y-3 text-white/60">
                <li className="hover:text-[#c9a961] transition-colors duration-200">+254116072343</li>
                <li className="hover:text-[#c9a961] transition-colors duration-200">info@thebushcollection.africa</li>
                <li className="text-sm leading-relaxed">42 Claret Close, Silanga Road, Karen.</li>
                <li className="text-sm">P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#c9a961]/20 mt-12 pt-8 text-center text-white/50">
            <p>&copy; 2025 The Bush Collections. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Collections;