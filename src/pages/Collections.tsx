import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users, Search, ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import slugify from '@/lib/slugify';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import { Link } from 'react-router-dom';

/* helpers */
const safeCapitalize = (str: unknown): string => {
  if (typeof str !== 'string' || !str) return 'Unknown';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const pad = (n: number) => String(n).padStart(2, '0');

const Collections = () => {
  const { properties, loading, error } = useBackendProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null);

  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target as Node)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const propertyTypes = [...new Set(
    properties
      .map(p => (p as any).type || (p as any).category)
      .filter(Boolean)
  )];

  const filteredProperties = properties.filter(p => {
    const matchesSearch =
      !searchTerm ||
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const pType = (p as any).type || (p as any).category || '';
    const matchesType = selectedType === 'all' || pType === selectedType;
    const matchesLocation =
      selectedLocation === 'all' ||
      (p.location || '').toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  const nonNairobiProperties = filteredProperties.filter(
    p => !(p.location || '').toLowerCase().includes('nairobi')
  );
  const nairobiHotels = filteredProperties.filter(
    p => (p.location || '').toLowerCase().includes('nairobi')
  );

  const safariLocations = [...new Set(
    nonNairobiProperties
      .map(p => p.location)
      .filter(Boolean)
  )] as string[];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-10">
            <div className="absolute inset-0 border border-[#c9a961]/20 animate-ping" />
            <div className="absolute inset-3 border border-[#c9a961]/40 animate-pulse" />
            <div className="absolute inset-6 bg-[#c9a961]/10" />
          </div>
          <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-light">Loading Collection</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <div className="w-[1px] h-12 bg-[#c9a961]/30 mx-auto mb-8" />
          <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">Something Went Wrong</p>
          <p className="text-white/40 text-sm font-light leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#292524]">

      {/* ──────────── CINEMATIC HERO ──────────── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        {/* Ken Burns background */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xLmpwZyIsImlhdCI6MTc2MzYyOTcwNCwiZXhwIjoxNzk1MTY1NzA0fQ.Ihw6Bmfj9cx-SsrMzKzH0bt-4Qej5J0sfxw-JgKWllA')`
            }}
          />
        </motion.div>

        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#292524] via-[#292524]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#292524]/70 via-[#292524]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#292524] to-transparent" />

        {/* Film-grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

        {/* Top editorial line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[#c9a961]/40 to-transparent z-10" />

        {/* Content — bottom left editorial */}
        <div className="absolute inset-0 flex items-end z-10">
          <div className="max-w-7xl w-full mx-auto px-8 md:px-16 pb-20 md:pb-28">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-[1px] bg-[#c9a961]" />
                <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-light">The Bush Collection</p>
              </div>

              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight text-white leading-[0.95] mb-8">
                Our<br />
                <span className="italic text-[#c9a961]/90">Collections</span>
              </h1>

              <p className="text-white/45 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10">
                Handpicked lodges, camps &amp; retreats spanning the breadth of Kenya and Tanzania — each chosen for its soul.
              </p>

              <div className="flex items-center gap-6">
                <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-light">
                  {properties.length} Destinations
                </span>
                <div className="w-[1px] h-4 bg-white/10" />
                <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-light">
                  East Africa
                </span>
                <div className="w-[1px] h-4 bg-white/10" />
                <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-light">
                  Est. 1983
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Vertical text — right */}
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 z-20">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/10 font-light [writing-mode:vertical-lr] rotate-180">
            Curated Safari Portfolio — Since 1983
          </span>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#c9a961]/40 to-transparent" />
        </motion.div>
      </section>

      {/* ──────────── REFINED SEARCH ──────────── */}
      <section className="relative py-10 bg-[#272220] border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-8 md:px-16">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* Search input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-[#c9a961]/60 transition-colors" />
              <Input
                placeholder="Search by name, destination, or keyword..."
                className="pl-12 h-14 bg-transparent text-white/80 border-white/[0.06] hover:border-white/[0.12] focus:border-[#c9a961]/30 placeholder:text-white/20 rounded-none text-sm tracking-wide transition-all duration-300 font-light"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Type dropdown */}
            <div className="relative md:w-48" ref={typeDropdownRef}>
              <button
                type="button"
                onClick={() => { setTypeDropdownOpen(!typeDropdownOpen); setLocationDropdownOpen(false); }}
                className="w-full h-14 px-5 bg-transparent text-white/60 border border-white/[0.06] hover:border-white/[0.12] rounded-none text-sm tracking-wide focus:outline-none focus:border-[#c9a961]/30 transition-all duration-300 flex items-center justify-between font-light"
              >
                <span className="text-xs tracking-[0.15em] uppercase">{selectedType === 'all' ? 'All Types' : safeCapitalize(selectedType)}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${typeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#2a2523] border border-white/[0.08] shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-5 py-3.5 text-xs tracking-[0.1em] uppercase transition-colors duration-150 font-light ${
                      selectedType === 'all' ? 'bg-[#c9a961]/15 text-[#c9a961]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                    onClick={() => { setSelectedType('all'); setTypeDropdownOpen(false); }}
                  >
                    All Types
                  </button>
                  {propertyTypes.map((type, index) => (
                    <button
                      type="button"
                      key={type || `type-${index}`}
                      className={`w-full text-left px-5 py-3.5 text-xs tracking-[0.1em] uppercase transition-colors duration-150 font-light ${
                        selectedType === type ? 'bg-[#c9a961]/15 text-[#c9a961]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                      }`}
                      onClick={() => { setSelectedType(type); setTypeDropdownOpen(false); }}
                    >
                      {safeCapitalize(type)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location dropdown */}
            <div className="relative md:w-52" ref={locationDropdownRef}>
              <button
                type="button"
                onClick={() => { setLocationDropdownOpen(!locationDropdownOpen); setTypeDropdownOpen(false); }}
                className="w-full h-14 px-5 bg-transparent text-white/60 border border-white/[0.06] hover:border-white/[0.12] rounded-none text-sm tracking-wide focus:outline-none focus:border-[#c9a961]/30 transition-all duration-300 flex items-center justify-between font-light"
              >
                <span className="text-xs tracking-[0.15em] uppercase">{selectedLocation === 'all' ? 'All Locations' : selectedLocation}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${locationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {locationDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#2a2523] border border-white/[0.08] shadow-2xl shadow-black/50 max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    className={`w-full text-left px-5 py-3.5 text-xs tracking-[0.1em] uppercase transition-colors duration-150 font-light ${
                      selectedLocation === 'all' ? 'bg-[#c9a961]/15 text-[#c9a961]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                    onClick={() => { setSelectedLocation('all'); setLocationDropdownOpen(false); }}
                  >
                    All Locations
                  </button>
                  {safariLocations.map((loc, index) => (
                    <button
                      type="button"
                      key={loc || `loc-${index}`}
                      className={`w-full text-left px-5 py-3.5 text-xs tracking-[0.1em] uppercase transition-colors duration-150 font-light ${
                        selectedLocation === loc ? 'bg-[#c9a961]/15 text-[#c9a961]' : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                      }`}
                      onClick={() => { setSelectedLocation(loc); setLocationDropdownOpen(false); }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter pills */}
          {(searchTerm || selectedType !== 'all' || selectedLocation !== 'all') && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mt-6 flex-wrap"
            >
              <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-light">Active:</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-[#c9a961] text-[10px] tracking-[0.15em] uppercase font-light border border-[#c9a961]/15 px-3 py-1.5 hover:bg-[#c9a961]/10 transition-all duration-200"
                >
                  &quot;{searchTerm}&quot; ×
                </button>
              )}
              {selectedType !== 'all' && (
                <button
                  onClick={() => setSelectedType('all')}
                  className="text-[#c9a961] text-[10px] tracking-[0.15em] uppercase font-light border border-[#c9a961]/15 px-3 py-1.5 hover:bg-[#c9a961]/10 transition-all duration-200"
                >
                  {safeCapitalize(selectedType)} ×
                </button>
              )}
              {selectedLocation !== 'all' && (
                <button
                  onClick={() => setSelectedLocation('all')}
                  className="text-[#c9a961] text-[10px] tracking-[0.15em] uppercase font-light border border-[#c9a961]/15 px-3 py-1.5 hover:bg-[#c9a961]/10 transition-all duration-200"
                >
                  {selectedLocation} ×
                </button>
              )}
              <button
                onClick={() => { setSearchTerm(''); setSelectedType('all'); setSelectedLocation('all'); }}
                className="text-white/25 text-[10px] tracking-[0.1em] uppercase font-light hover:text-white/50 transition-colors ml-1 underline underline-offset-4"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ──────────── EDITORIAL QUOTE ──────────── */}
      <section className="relative py-28 md:py-36 bg-[#292524] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[#c9a961]/20" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-transparent to-[#c9a961]/20" />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div className="max-w-5xl mx-auto px-8 md:px-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-light mb-10">What Defines Us</p>
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extralight text-white/85 leading-[1.3] mb-10 max-w-4xl mx-auto">
              Every property in our collection is chosen for its <span className="italic text-[#c9a961]">location</span>,
              its <span className="italic text-[#c9a961]">character</span>, and its ability to deliver
              hospitality with <span className="italic text-[#c9a961]">heartfelt warmth</span>.
            </h2>
            <div className="flex items-center justify-center gap-5">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#c9a961]/30" />
              <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-light">40+ Years of Safari Heritage</span>
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#c9a961]/30" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────── SAFARI PROPERTIES — EDITORIAL GRID ──────────── */}
      {nonNairobiProperties.length > 0 && (
        <section className="py-24 md:py-32 bg-[#f5f0ea]">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-20"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-[1px] bg-[#c9a961]" />
                    <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">Safari Collection</p>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-[#292524] leading-[1.05]">
                    Lodges &amp;<br />
                    <span className="italic text-[#292524]/70">Camps</span>
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-[#292524]/50 text-sm font-light leading-relaxed">
                    {nonNairobiProperties.length} exceptional destinations handpicked across the most iconic safari landscapes of East Africa.
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-6 h-[1px] bg-[#c9a961]/40" />
                    <span className="text-[#292524]/30 text-[9px] tracking-[0.3em] uppercase font-light">Bush · Beach · Luxury</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Magazine-style property cards */}
            <div className="space-y-16">
              <AnimatePresence mode="popLayout">
                {nonNairobiProperties.map((property, index) => {
                  const slug = (property as any).slug || slugify(property.name || '') || property.id;
                  const propertyPrice = (property as any).price_from || (property as any).basePricePerNight || property.price || 0;
                  const rooms = property.rooms || (property as any).safari_rooms || [];
                  const isEven = index % 2 === 0;

                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                      layout
                    >
                      <Link to={`/property/${slug}`} className="block group">
                        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white overflow-hidden ${isEven ? '' : 'lg:[direction:rtl]'}`}>
                          {/* Image side */}
                          <div className="relative h-72 sm:h-80 lg:h-[480px] overflow-hidden lg:[direction:ltr]"
                            onMouseEnter={() => setHoveredProperty(property.id || '')}
                            onMouseLeave={() => setHoveredProperty(null)}
                          >
                            {property.images && property.images[0] ? (
                              <motion.img
                                src={property.images[0]}
                                alt={property.name}
                                className="w-full h-full object-cover"
                                animate={{ scale: hoveredProperty === property.id ? 1.05 : 1 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                              />
                            ) : (
                              <div className="w-full h-full bg-[#e8e0d4] flex items-center justify-center text-[#292524]/20 text-sm font-light">No image</div>
                            )}
                            {/* Number badge */}
                            <div className="absolute top-6 left-6">
                              <span className="text-[#c9a961] text-5xl md:text-6xl font-extralight leading-none opacity-90">{pad(index + 1)}</span>
                            </div>
                            {/* Category badge */}
                            <div className="absolute bottom-6 left-6">
                              <span className="text-[10px] tracking-[0.3em] uppercase font-light text-white bg-[#292524]/60 backdrop-blur-sm px-4 py-2">
                                {safeCapitalize((property as any).type || (property as any).category || 'safari')}
                              </span>
                            </div>
                            {/* Hover overlay */}
                            <motion.div
                              className="absolute inset-0 bg-[#292524]/20 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredProperty === property.id ? 1 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-14 h-14 border border-white/40 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-white" />
                              </div>
                            </motion.div>
                          </div>

                          {/* Content side */}
                          <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center lg:[direction:ltr]">
                            <div className="flex items-center gap-3 mb-6">
                              <MapPin className="h-3.5 w-3.5 text-[#c9a961]" />
                              <span className="text-[#292524]/40 text-xs tracking-[0.2em] uppercase font-light">{property.location}</span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-extralight text-[#292524] leading-tight mb-5 group-hover:text-[#292524]/80 transition-colors duration-500">
                              {property.name}
                            </h3>

                            <div className="w-10 h-[1px] bg-[#c9a961]/50 mb-6" />

                            <p className="text-[#292524]/45 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                              {property.description}
                            </p>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-5 mb-8 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 text-[#c9a961] fill-[#c9a961]" />
                                <span className="text-[#292524]/60 font-light">{property.rating}</span>
                                <span className="text-[#292524]/30 font-light">({property.reviews || (property as any).numReviews || 0})</span>
                              </div>
                              {rooms.length > 0 && (
                                <>
                                  <div className="w-[1px] h-3 bg-[#292524]/10" />
                                  <div className="flex items-center gap-1.5 text-[#292524]/40 font-light">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{rooms.length} {rooms.length === 1 ? 'Room' : 'Rooms'}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Price + CTA */}
                            <div className="mt-auto flex items-end justify-between pt-6 border-t border-[#292524]/[0.06]">
                              <div>
                                <span className="text-[10px] tracking-[0.2em] uppercase text-[#292524]/30 font-light block mb-1">From</span>
                                <span className="text-[#292524] text-3xl font-extralight">${propertyPrice}</span>
                                <span className="text-[#292524]/30 text-sm font-light ml-1">/ night</span>
                              </div>
                              <span className="text-[#c9a961] text-[10px] tracking-[0.2em] uppercase font-medium group-hover:tracking-[0.3em] transition-all duration-500 flex items-center gap-2">
                                Explore
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* ──────────── NAIROBI HOTELS ──────────── */}
      {nairobiHotels.length > 0 && (
        <section className="py-24 md:py-32 bg-[#292524]">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-20"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-[1px] bg-[#c9a961]" />
                    <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">City Stays</p>
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-white/90 leading-[1.05]">
                    Nairobi<br />
                    <span className="italic text-[#c9a961]/80">Hotels</span>
                  </h2>
                </div>
                <p className="text-white/35 text-sm font-light max-w-sm leading-relaxed">
                  Most international flights arrive in Nairobi. Spend a night to rest, adjust, and start your safari refreshed.
                </p>
              </div>
            </motion.div>

            {/* Our Hotels */}
            {(() => {
              const ownedHotels = nairobiHotels.filter(hotel =>
                hotel.name && (
                  hotel.name.toLowerCase().includes('bush collection') ||
                  hotel.name.toLowerCase().includes('the bush') ||
                  hotel.featured === true
                )
              );
              if (ownedHotels.length > 0) {
                return (
                  <div className="mb-20">
                    <div className="flex items-center gap-4 mb-12">
                      <h3 className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-light">Our Hotels</h3>
                      <div className="flex-1 h-[1px] bg-white/[0.05]" />
                      <Badge className="bg-[#c9a961]/10 text-[#c9a961] border border-[#c9a961]/15 rounded-none text-[9px] tracking-[0.2em] uppercase font-light px-4 py-1.5 hover:bg-[#c9a961]/10">
                        Book Direct
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ownedHotels.map((property, index) => {
                        const slug = (property as any).slug || slugify(property.name || '') || property.id;
                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.12 }}
                          >
                            <div className="group relative overflow-hidden bg-[#322e2b] border border-white/[0.04] hover:border-[#c9a961]/15 transition-all duration-700">
                              <div className="relative h-72 overflow-hidden">
                                {property.images && property.images[0] ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.name}
                                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#1a1816] flex items-center justify-center text-white/15 text-sm font-light">No image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#322e2b] via-black/20 to-transparent" />
                                <div className="absolute top-5 left-5">
                                  <span className="text-[9px] tracking-[0.4em] uppercase font-light text-[#c9a961] bg-[#292524]/70 backdrop-blur-md px-4 py-2">Nairobi</span>
                                </div>
                                {property.featured && (
                                  <div className="absolute top-5 right-5">
                                    <span className="text-[9px] tracking-[0.4em] uppercase font-light text-[#292524] bg-[#c9a961] px-4 py-2">Featured</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-8 md:p-10">
                                <h3 className="text-2xl md:text-3xl font-extralight text-white mb-3 group-hover:text-[#c9a961]/90 transition-colors duration-500">{property.name}</h3>
                                <div className="flex items-center text-white/35 text-sm font-light mb-5">
                                  <MapPin className="h-3.5 w-3.5 mr-2 text-[#c9a961]/50" />
                                  {property.location}
                                </div>
                                <div className="flex items-center gap-4 mb-6 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-[#c9a961] fill-[#c9a961]" />
                                    <span className="text-white/60 font-light">{property.rating}</span>
                                    <span className="text-white/25 font-light ml-0.5">({property.reviews || (property as any).numReviews || 0})</span>
                                  </div>
                                  {property.rooms && property.rooms.length > 0 && (
                                    <>
                                      <div className="w-[1px] h-3 bg-white/10" />
                                      <div className="flex items-center text-white/35 font-light">
                                        <Users className="h-3.5 w-3.5 mr-1" />
                                        Up to {Math.max(...property.rooms.map((r: any) => r.maxGuests || r.max_guests || 1))} guests
                                      </div>
                                    </>
                                  )}
                                </div>
                                <p className="text-white/35 text-sm font-light line-clamp-2 leading-relaxed mb-8">
                                  {property.description}
                                </p>
                                <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    <span className="text-[#c9a961] text-2xl md:text-3xl font-extralight">${(property as any).price_from || (property as any).basePricePerNight || property.price || 0}</span>
                                    <span className="text-white/25 text-sm font-light ml-1.5">/ night</span>
                                  </div>
                                  <div className="flex gap-3">
                                    <Link to={`/property/${slug}`}>
                                      <button className="text-white/40 hover:text-[#c9a961] text-[10px] tracking-[0.2em] uppercase font-light border border-white/[0.06] hover:border-[#c9a961]/25 px-6 py-3 transition-all duration-300">
                                        Details
                                      </button>
                                    </Link>
                                    <button
                                      className="text-[#292524] bg-[#c9a961] hover:bg-[#b8943d] text-[10px] tracking-[0.2em] uppercase font-medium px-6 py-3 transition-all duration-300"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if ((property as any).externalUrl) {
                                          window.location.href = (property as any).externalUrl;
                                        } else {
                                          window.location.href = `/book?property=${slug}`;
                                        }
                                      }}
                                    >
                                      Book Now
                                    </button>
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
                    <div className="flex items-center gap-4 mb-12">
                      <h3 className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-light">Partner Hotels</h3>
                      <div className="flex-1 h-[1px] bg-white/[0.05]" />
                      <Badge className="bg-white/[0.03] text-white/30 border border-white/[0.06] rounded-none text-[9px] tracking-[0.2em] uppercase font-light px-4 py-1.5 hover:bg-white/[0.03]">
                        Information Only
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {partnerHotels.map((property, index) => {
                        const isOurProperty = property.featured === true ||
                          (property.name && (
                            property.name.toLowerCase().includes('bush collection') ||
                            property.name.toLowerCase().includes('the bush')
                          ));
                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <div className="group relative overflow-hidden bg-[#322e2b] border border-white/[0.04] hover:border-white/[0.06] transition-all duration-700">
                              <div className="relative h-64 overflow-hidden">
                                {property.images && property.images[0] ? (
                                  <img
                                    src={property.images[0]}
                                    alt={property.name}
                                    className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-[#1a1816] flex items-center justify-center text-white/15 text-sm font-light">No image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#322e2b] via-black/20 to-transparent" />
                                <div className="absolute top-5 left-5">
                                  <span className="text-[9px] tracking-[0.4em] uppercase font-light text-white/50 bg-[#292524]/70 backdrop-blur-md px-4 py-2">Nairobi</span>
                                </div>
                                <div className="absolute top-5 right-5">
                                  <span className="text-[9px] tracking-[0.4em] uppercase font-light text-white/40 bg-[#292524]/70 backdrop-blur-md px-4 py-2">Partner</span>
                                </div>
                              </div>
                              <div className="p-8 md:p-10">
                                <h3 className="text-2xl md:text-3xl font-extralight text-white mb-3">{property.name}</h3>
                                <div className="flex items-center text-white/35 text-sm font-light mb-5">
                                  <MapPin className="h-3.5 w-3.5 mr-2 text-[#c9a961]/50" />
                                  {property.location}
                                </div>
                                <div className="flex items-center gap-4 mb-6 text-xs">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 text-[#c9a961] fill-[#c9a961]" />
                                    <span className="text-white/60 font-light">{property.rating}</span>
                                    <span className="text-white/25 font-light ml-0.5">({property.reviews || (property as any).numReviews || 0})</span>
                                  </div>
                                  {property.rooms && property.rooms.length > 0 && (
                                    <>
                                      <div className="w-[1px] h-3 bg-white/10" />
                                      <div className="flex items-center text-white/35 font-light">
                                        <Users className="h-3.5 w-3.5 mr-1" />
                                        Up to {Math.max(...property.rooms.map((r: any) => r.maxGuests || r.max_guests || 1))} guests
                                      </div>
                                    </>
                                  )}
                                </div>
                                <p className="text-white/35 text-sm font-light line-clamp-2 leading-relaxed mb-8">
                                  {property.description}
                                </p>
                                <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                  <div>
                                    {isOurProperty ? (
                                      <>
                                        <span className="text-[#c9a961] text-2xl font-extralight">${(property as any).price_from || (property as any).basePricePerNight || property.price || 0}</span>
                                        <span className="text-white/25 text-sm font-light ml-1.5">/ night</span>
                                      </>
                                    ) : (
                                      <span className="text-white/25 text-sm font-light italic">Contact for pricing</span>
                                    )}
                                  </div>
                                  <div className="flex gap-3">
                                    <button className="text-white/40 hover:text-[#c9a961] text-[10px] tracking-[0.2em] uppercase font-light border border-white/[0.06] hover:border-[#c9a961]/25 px-6 py-3 transition-all duration-300">
                                      Details
                                    </button>
                                    <button
                                      className="text-white/15 text-[10px] tracking-[0.2em] uppercase font-light border border-white/[0.04] px-6 py-3 cursor-not-allowed"
                                      disabled
                                    >
                                      Not Bookable
                                    </button>
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

            {/* Why Stay in Nairobi — editorial card */}
            <motion.div
              className="mt-20 border border-white/[0.04] bg-[#322e2b] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-20 bg-[#c9a961]/5 flex items-center justify-center py-6 md:py-0">
                  <MapPin className="h-5 w-5 text-[#c9a961]/60 md:rotate-0" />
                </div>
                <div className="flex-1 p-10 md:p-12">
                  <p className="text-[#c9a961] text-[10px] tracking-[0.4em] uppercase font-light mb-4">Travel Tip</p>
                  <h4 className="text-2xl md:text-3xl font-extralight text-white mb-5">Why Stay in Nairobi?</h4>
                  <p className="text-white/35 text-sm font-light leading-[1.8] max-w-2xl">
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

      {/* ──────────── NO RESULTS ──────────── */}
      {nonNairobiProperties.length === 0 && nairobiHotels.length === 0 && (
        <section className="py-36 bg-[#292524]">
          <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
            <motion.div
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 border border-white/[0.06] flex items-center justify-center mx-auto mb-10">
                <Search className="h-5 w-5 text-[#c9a961]/50" />
              </div>
              <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-light mb-5">No Results</p>
              <h3 className="text-3xl md:text-4xl font-extralight text-white mb-4">No properties found</h3>
              <p className="text-white/35 text-sm font-light leading-relaxed mb-12">
                Try adjusting your search criteria or browse all properties
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedType('all'); setSelectedLocation('all'); }}
                className="text-[#292524] bg-[#c9a961] hover:bg-[#b8943d] text-[10px] tracking-[0.2em] uppercase font-medium px-10 py-3.5 transition-all duration-300"
              >
                Clear Filters
              </button>
            </motion.div>
          </div>
        </section>
      )}

      {/* ──────────── STATS STRIP ──────────── */}
      <section className="py-24 bg-[#292524] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8">
            {[
              { value: nonNairobiProperties.length, label: 'Safari Properties' },
              { value: nairobiHotels.length, label: 'Nairobi Hotels' },
              { value: safariLocations.length, label: 'Destinations' },
              { value: nonNairobiProperties.reduce((sum, p) => sum + (p.rooms?.length || 0), 0), label: 'Safari Rooms' },
              { value: nonNairobiProperties.length > 0
                  ? (nonNairobiProperties.reduce((sum, p) => sum + (p.rating || 0), 0) / nonNairobiProperties.length).toFixed(1)
                  : '0.0',
                label: 'Avg Rating'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-extralight text-[#c9a961] mb-3">{stat.value}</div>
                <div className="text-white/25 text-[9px] tracking-[0.3em] uppercase font-light">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── EDITORIAL CTA ──────────── */}
      <section className="relative py-32 md:py-40 bg-[#322e2b] overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 0.5px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-[#c9a961]/15" />

        <div className="max-w-4xl mx-auto text-center px-8 md:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-light mb-10">Begin Your Journey</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white/90 leading-[1.1] mb-8">
              Ready for Your<br />
              <span className="italic text-[#c9a961]">Safari Adventure?</span>
            </h2>
            <p className="text-white/40 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto mb-14">
              Let us craft the perfect East African journey for you — from sun-drenched savannahs to the rhythm of the Indian Ocean.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book">
                <Button className="bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] rounded-none px-12 py-6 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300">
                  Start Booking
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-transparent hover:bg-white/[0.04] text-white/50 hover:text-white/80 border border-white/[0.08] hover:border-white/[0.15] rounded-none px-12 py-6 text-xs tracking-[0.2em] uppercase font-light transition-all duration-300">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────── EDITORIAL FOOTER ──────────── */}
      <footer className="bg-[#1c1917] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
            <div className="md:col-span-1">
              <h3 className="text-[#c9a961] text-xs tracking-[0.3em] uppercase font-light mb-6">The Bush Collection</h3>
              <p className="text-white/30 text-sm font-light leading-[1.8]">
                Curated luxury safari experiences across Africa's most spectacular destinations for over 40 years.
              </p>
            </div>

            <div>
              <h4 className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-light mb-7">Property Types</h4>
              <ul className="space-y-3.5">
                {propertyTypes.map((type, index) => (
                  <li key={type || `type-${index}`}>
                    <button
                      onClick={() => { setSelectedType(type); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-white/30 hover:text-[#c9a961] text-sm font-light transition-colors duration-300"
                    >
                      {safeCapitalize(type)}s
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-light mb-7">Destinations</h4>
              <ul className="space-y-3.5">
                {safariLocations.slice(0, 6).map((location, index) => (
                  <li key={location || `location-${index}`}>
                    <button
                      onClick={() => { setSelectedLocation(location); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-white/30 hover:text-[#c9a961] text-sm font-light transition-colors duration-300"
                    >
                      {location || 'Unknown'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-light mb-7">Contact</h4>
              <ul className="space-y-3.5 text-white/30 text-sm font-light">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen</li>
                <li>P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.04] mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-[10px] tracking-[0.15em] font-light">&copy; {new Date().getFullYear()} The Bush Collection. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[1px] bg-[#c9a961]/20" />
              <span className="text-white/15 text-[9px] tracking-[0.4em] uppercase font-light">Experience is Everything</span>
              <div className="w-8 h-[1px] bg-[#c9a961]/20" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Collections;
