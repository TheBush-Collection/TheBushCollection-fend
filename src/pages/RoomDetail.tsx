import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import type { Property } from '@/hooks/useBackendProperties';

interface Room {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  type: string;
  maxGuests?: number;
  max_guests?: number;
  price: number;
  available: boolean;
  amenities: string[];
  images?: string[];
}

export default function RoomDetail() {
  const params = useParams<Record<string, string | undefined>>();
  const [searchParams] = useSearchParams();
  // Support multiple routing patterns:
  // - /property/:id -> property detail route
  // - /room/:roomId?property=<propertyId> (or ?roomId=...)
  // - /room/:someId?roomId=... (some apps put property id in path)
  const paramId = params.id || params.roomId || params.propertyId;
  const queryRoomId = searchParams.get('roomId');
  const queryPropertyId = searchParams.get('property') || searchParams.get('propertyId');
  
  const { properties, loading, error } = useBackendProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    // If a query roomId is provided, find the property that contains that room.
    if (queryRoomId) {
      let foundProp: Property | undefined;
      let foundRoom: Room | undefined;
      for (const p of properties) {
        const rooms = p.rooms || [];
        const match = rooms.find(r => (r.id || (r as { _id?: string })._id) === queryRoomId);
        if (match) {
          foundProp = p;
          foundRoom = match as Room;
          break;
        }
      }
      if (foundProp) setProperty(foundProp);
      else setProperty(null);
      setSelectedRoom(foundRoom || null);
      return;
    }

    // If a property id is available (from query or path), resolve property and optional room
    const effectivePropertyId = queryPropertyId || paramId;
    if (effectivePropertyId) {
      const foundProperty = properties.find(p => {
        const pId = p.id || (p as { _id?: string })._id;
        return pId === effectivePropertyId;
      });
      setProperty(foundProperty || null);

      // Try to resolve a room id from either query param or path param (if path used roomId)
      const candidateRoomId = queryRoomId || (params.roomId && params.roomId !== effectivePropertyId ? params.roomId : null);
      if (foundProperty && candidateRoomId) {
        const room = foundProperty.rooms?.find((r) => {
          const rId = r.id || (r as { _id?: string })._id;
          return rId === candidateRoomId;
        }) as Room | undefined;
        setSelectedRoom(room || null);
      } else {
        // no explicit room id, leave selectedRoom as null
        setSelectedRoom(null);
      }
      return;
    }

    // Fallback: if the path param looks like a room id (and not a property), search across properties
    if (params.roomId) {
      let foundProp: Property | undefined;
      let foundRoom: Room | undefined;
      for (const p of properties) {
        const rooms = p.rooms || [];
        const match = rooms.find(r => (r.id || (r as { _id?: string })._id) === params.roomId);
        if (match) {
          foundProp = p;
          foundRoom = match as Room;
          break;
        }
      }
      if (foundProp) setProperty(foundProp);
      else setProperty(null);
      setSelectedRoom(foundRoom || null);
    }
  }, [properties, paramId, queryRoomId, queryPropertyId]);

  const nextImage = () => {
    if (selectedRoom?.images && selectedRoom.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedRoom.images!.length);
    }
  };

  const prevImage = () => {
    if (selectedRoom?.images && selectedRoom.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedRoom.images!.length) % selectedRoom.images!.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-white text-xl">Loading room details...</div>
      </div>
    );
  }

  if (error || !property || !selectedRoom) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-white text-xl">Room not found</div>
      </div>
    );
  }

  const roomImages = selectedRoom.images && selectedRoom.images.length > 0 
    ? selectedRoom.images 
    : property.images || [];

  return (
    <div className="min-h-screen bg-[#ebe9d8]">
      {/* Hero Carousel Section */}
      <section className="relative h-[70vh] bg-[#1a1816]">
        <div className="absolute inset-0">
          {roomImages.length > 0 && (
            <>
              <img
                src={roomImages[currentImageIndex]}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          )}
        </div>

        {/* Property Logo/Branding - Top Center */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-[#c9a961] px-6 py-3 rounded-lg">
            <div className="text-white font-bold text-xl text-center">
              {property.name}
            </div>
          </div>
        </div>

        {/* Centered Text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <h1 className="text-white text-4xl md:text-6xl font-bold text-center px-4">
            The Best Address in the Mara
          </h1>
        </div>

        {/* Navigation Arrows */}
        {roomImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-4 rounded-full transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {roomImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {roomImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-[#c9a961] w-8' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Room Details Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Room Title and Coordinates */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#c9a961] mb-4">
            {selectedRoom.name}
          </h2>
          
          {/* GPS Coordinates */}
          {property.location && (
            <div className="flex items-center justify-center gap-2 text-[#2a2623]/80 text-lg">
              <MapPin className="w-5 h-5" />
              <span>{property.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {selectedRoom.description && (
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <p className="text-[#2a2623]/90 leading-relaxed text-lg">
              {selectedRoom.description}
            </p>
          </div>
        )}

        {/* Image Gallery Placeholders */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {roomImages.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] border-4 border-[#c9a961] rounded-sm overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setCurrentImageIndex(idx)}
            >
              <img
                src={img}
                alt={`${selectedRoom.name} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Room Inclusions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-[#2a2623]">
            Your {selectedRoom.type} Inclusions:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-3 max-w-5xl mx-auto">
            {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
              selectedRoom.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#c9a961] rounded-full flex-shrink-0"></div>
                  <span className="text-[#2a2623]">{amenity}</span>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#2a2623]/60">
                <p>Amenities information will be available soon.</p>
              </div>
            )}
          </div>

          {/* Additional Notes - Only show if there are amenities with asterisks */}
          {selectedRoom.amenities && selectedRoom.amenities.some(a => a.includes('*')) && (
            <div className="mt-6 text-center text-sm text-[#2a2623]/70 max-w-4xl mx-auto">
              {selectedRoom.amenities.some(a => a.includes('*') && !a.includes('**')) && (
                <p>* Additional services may be available at extra cost or subject to availability.</p>
              )}
              {selectedRoom.amenities.some(a => a.includes('**')) && (
                <p className="mt-2">** Services run at no extra charge.</p>
              )}
            </div>
          )}
        </div>

                        {/* Booking Button */}
                <div className="mt-12 flex justify-center">
                  <Link to={`/book?property=${property.id}&room=${selectedRoom.id}`}>
                    <Button 
                      className="bg-[#c9a961] hover:bg-[#b8935a] text-white px-12 py-6 text-xl rounded-full font-semibold shadow-lg"
                    >
                      Book Now
                    </Button>
                  </Link>
                </div>

                {/* Price Info */}
                <div className="mt-8 text-center">
                  <div className="text-3xl font-bold text-[#c9a961] mb-2">
                    ${selectedRoom.price}
                    <span className="text-lg text-[#1a1816]/60 ml-2">per night</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-[#1a1816]/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Up to {selectedRoom.max_guests} guests</span>
                    </div>
                  </div>
                </div>
      </div>
{/* Footer */}
      <footer className="bg-[#2a2623] text-[#ffffff] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
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