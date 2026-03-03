import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  Utensils,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Play,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBackendProperties } from '@/hooks/useBackendProperties';
import slugify from '@/lib/slugify';

interface AmenityIconMap {
  [key: string]: React.ComponentType<{ className?: string }>;
}

interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
  maxGuests: number;
  price: number;
  available: boolean;
  bookedUntil?: string;
  availableFrom?: string;
  amenities: string[];
  images?: string[];
}

interface GroupedRoom {
  name: string;
  type: string;
  maxGuests: number;
  price: number;
  availableCount: number;
  totalCount: number;
  amenities: string[];
  images?: string[];
  description: string;
  sampleRoomId: string;
  sampleRoomSlug?: string;
}

const amenityIcons: AmenityIconMap = {
  'Free WiFi': Wifi,
  'Parking': Car,
  'Restaurant': Utensils,
  'Coffee': Coffee,
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { properties, loading, error } = useBackendProperties();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [roomImageIndexes, setRoomImageIndexes] = useState<{ [key: string]: number }>({});
  const [roomQuantities, setRoomQuantities] = useState<{ [key: string]: number }>({});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [roomDetailsOpen, setRoomDetailsOpen] = useState(false);
  const [roomDetailImageIndex, setRoomDetailImageIndex] = useState(0);

  // Allow looking up by id, slug, or generated slug from name
  const property = properties.find(p => {
    const pId = p.id || (p as any)._id;
    const pSlug = (p as any).slug || '';
    return pId === id || pSlug === id || slugify(p.name) === id;
  });

  // Redirect to external URL if property has one
  useEffect(() => {
    if (property && property.externalUrl) {
      window.location.href = property.externalUrl;
    }
  }, [property]);

  // Image navigation functions
  const nextImage = () => {
    if (property && property.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  // Room image navigation
  const nextRoomImage = (roomId: string, totalImages: number) => {
    setRoomImageIndexes(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages
    }));
  };

  const prevRoomImage = (roomId: string, totalImages: number) => {
    setRoomImageIndexes(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Room details functions
  const openRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailImageIndex(roomImageIndexes[room.id] || 0);
    setRoomDetailsOpen(true);
  };

  const closeRoomDetails = () => {
    setRoomDetailsOpen(false);
  };

  const nextRoomDetailImage = () => {
    if (selectedRoom && selectedRoom.images) {
      setRoomDetailImageIndex((prev) => (prev + 1) % selectedRoom.images!.length);
    }
  };

  const prevRoomDetailImage = () => {
    if (selectedRoom && selectedRoom.images) {
      setRoomDetailImageIndex((prev) => (prev - 1 + selectedRoom.images!.length) % selectedRoom.images!.length);
    }
  };

  // Handle room quantity changes
  const updateRoomQuantity = (roomName: string, quantity: number) => {
    setRoomQuantities(prev => ({
      ...prev,
      [roomName]: Math.max(0, Math.min(quantity, groupedRooms.find(g => g.name === roomName)?.availableCount || 0))
    }));
  };

  const getRoomQuantity = (roomName: string) => {
    return roomQuantities[roomName] || 0;
  };

  // Enhanced video detection function
  const isVideo = (url: string) => {
    if (!url || typeof url !== 'string') return false;

    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    const videoHosts = [
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'dailymotion.com'
    ];

    // Microsoft services that should be treated as images, not videos
    const microsoftImageServices = [
      'microsoftpersonalcontent.com',
      'southcentralus1-mediap.svc.ms',
      'mediap.svc.ms'
    ];

    // Check for video file extensions
    const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));

    // Check for video hosting platforms (excluding Microsoft services)
    const isVideoHost = videoHosts.some(host => url.toLowerCase().includes(host));

    // Check for Microsoft services (treat as images, not videos)
    const isMicrosoftService = microsoftImageServices.some(host => url.toLowerCase().includes(host));

    // Check for explicit video indicators
    const hasVideoIndicator = url.toLowerCase().includes('video');

    // Return true only for actual video hosts, not Microsoft services
    return hasVideoExtension || (isVideoHost && !isMicrosoftService) || (hasVideoIndicator && !isMicrosoftService);
  };

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
          <p className="text-white/70">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-2 text-lg">Error loading property</p>
          <p className="text-white/60 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // allow looking up by id, slug, or generated slug from name
  const propertybyId = property;

  if (!propertybyId) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Property Not Found</h1>
          <p className="text-white/60 mb-6">The property you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="bg-[#c9a961] hover:bg-[#b8935a] text-white">Back to Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map backend rooms to expected format and group by name
  const rooms = (propertybyId.rooms || []).map(room => ({
    id: room.id,
    name: room.name,
    description: room.description || `${room.name} - ${room.type} room accommodating up to ${room.maxGuests || room.max_guests} guests with modern amenities and stunning views`,
    type: room.type,
    maxGuests: room.maxGuests || room.max_guests,
    price: room.price,
    available: room.available,
    amenities: room.amenities || [],
    images: room.images || []
  }));

  // Group rooms by name
  const groupedRooms = rooms.reduce((acc, room) => {
    const existingGroup = acc.find(group => group.name === room.name);

    if (existingGroup) {
      existingGroup.totalCount++;
      if (room.available) {
        existingGroup.availableCount++;
      }
      // Update other properties if this room has more complete data
      if (room.images && room.images.length > 0) {
        existingGroup.images = room.images;
      }
      if (room.amenities && room.amenities.length > 0) {
        existingGroup.amenities = room.amenities;
      }
    } else {
      acc.push({
        name: room.name,
        type: room.type,
        maxGuests: room.maxGuests,
        price: room.price,
        availableCount: room.available ? 1 : 0,
        totalCount: 1,
        amenities: room.amenities || [],
        images: room.images || [],
        description: room.description,
        sampleRoomId: room.id,
        // include a slug for the room group so links can use a readable room name in the path
        sampleRoomSlug: slugify(room.name || String(room.id))
      });
    }

    return acc;
  }, [] as GroupedRoom[]);

  const availableRoomGroups = groupedRooms.filter(group => group.availableCount > 0);
  const unavailableRoomGroups = groupedRooms.filter(group => group.availableCount === 0);

  // Room Image Carousel Component
  const RoomImageCarousel = ({ room, size = 'large' }: { room: Room, size?: 'small' | 'large' }) => {
    const currentIndex = roomImageIndexes[room.id] || 0;
    const images = room.images || [];
    
    if (images.length === 0) {
      return (
        <div className={`${size === 'small' ? 'w-24 h-20' : 'w-full h-48'} bg-gray-200 rounded-lg flex items-center justify-center`}>
          <div className="text-center text-gray-500">
            <ImageIcon className={`${size === 'small' ? 'h-4 w-4' : 'h-8 w-8'} mx-auto mb-1`} />
            <span className={`${size === 'small' ? 'text-xs' : 'text-sm'}`}>No image</span>
          </div>
        </div>
      );
    }

    const currentMedia = images[currentIndex];
    const isCurrentVideo = isVideo(currentMedia);

    return (
      <div className={`relative ${size === 'small' ? 'w-24 h-20' : 'w-full h-full'} rounded-lg overflow-hidden bg-gray-100`}>
        {isCurrentVideo ? (
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              controls={size === 'large'}
              preload="metadata"
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                console.error('PropertyDetail video failed to load:', {
                  src: target.src,
                  error: target.error,
                  mediaUrl: currentMedia
                });

                // Hide video and show fallback
                target.style.display = 'none';
                const container = target.closest('.relative');
                const fallbackDiv = container?.querySelector('.video-fallback') as HTMLDivElement;
                if (fallbackDiv && fallbackDiv.classList) {
                  fallbackDiv.classList.remove('hidden');
                }
              }}
              onLoadedData={(e) => {
                console.log('PropertyDetail video loaded successfully:', currentMedia);
              }}
              onLoadStart={(e) => {
                console.log('PropertyDetail video load started:', currentMedia);
              }}
              onCanPlay={() => {
                console.log('PropertyDetail video can play:', currentMedia);
              }}
              onPlay={() => {
                console.log('PropertyDetail video started playing:', currentMedia);
              }}
              onPause={() => {
                console.log('PropertyDetail video paused:', currentMedia);
              }}
            >
              <source src={currentMedia} type="video/mp4" />
              <source src={currentMedia} type="video/webm" />
              <source src={currentMedia} type="video/ogg" />
              Your browser does not support the video tag.
            </video>

            {/* Hidden fallback for video errors */}
            <div className="video-fallback absolute inset-0 items-center justify-center bg-gray-200" style={{ display: 'none' }}>
              <div className="text-center text-gray-500">
                <Play className={`${size === 'small' ? 'h-8 w-8' : 'h-12 w-12'} mx-auto mb-2`} />
                <span className={`${size === 'small' ? 'text-xs' : 'text-sm'}`}>Video unavailable</span>
              </div>
            </div>

            {/* Click to Play Overlay for small size or when no controls */}
            {size === 'small' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-1">
                  <Play className="h-3 w-3 text-white" />
                </div>
              </div>
            )}

            {/* Click to Play Overlay for large size without controls */}
            {size === 'large' && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors"
                onClick={(e) => {
                  const container = e.currentTarget.closest('.relative');
                  const video = container?.querySelector('video') as HTMLVideoElement;

                  if (video) {
                    console.log('PropertyDetail play button clicked for video:', currentMedia);

                    if (video.paused) {
                      video.play().then(() => {
                        console.log('PropertyDetail video started playing successfully');
                      }).catch((error) => {
                        console.error('Failed to play PropertyDetail video:', error);

                        // For Microsoft services, try opening in new tab as fallback
                        if (currentMedia && (currentMedia.includes('1drv.ms') || currentMedia.includes('sharepoint.com'))) {
                          console.log('Opening Microsoft video in new tab:', currentMedia);
                          window.open(currentMedia, '_blank');
                          return;
                        }

                        // Show fallback on play error
                        const fallbackDiv = container?.querySelector('.video-fallback');
                        if (fallbackDiv && fallbackDiv.classList) {
                          fallbackDiv.classList.remove('hidden');
                          e.currentTarget.classList.add('hidden');
                        }
                      });
                    } else {
                      video.pause();
                      console.log('PropertyDetail video paused');
                    }
                  } else {
                    console.error('PropertyDetail video element not found for click handler');
                  }
                }}
              >
                <div className="bg-black/60 rounded-full p-4 hover:bg-black/70 transition-colors">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            src={currentMedia}
            alt={room.name}
            className="w-full h-full object-cover cursor-pointer"
            onError={(e) => {
              e.currentTarget.src = size === 'small' 
                ? 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA5NiA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjQ4IiB5PSI0NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0E5QjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
                : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDQwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzlDQTlCNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2UgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
            }}
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className={`absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${
                size === 'small' ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                prevRoomImage(room.id, images.length);
              }}
            >
              <ChevronLeft className={`${size === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 ${
                size === 'small' ? 'h-6 w-6 p-0' : 'h-8 w-8 p-0'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                nextRoomImage(room.id, images.length);
              }}
            >
              <ChevronRight className={`${size === 'small' ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {images.length > 1 && (
          <div className={`absolute ${size === 'small' ? 'bottom-1 right-1' : 'bottom-2 right-2'}`}>
            <Badge variant="secondary" className={`bg-black/70 text-white ${size === 'small' ? 'text-xs px-1 py-0' : 'text-xs'}`}>
              {currentIndex + 1}/{images.length}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1816] overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Background Image with Ken Burns effect */}
        <motion.div
          className="absolute inset-0"
          key={selectedImageIndex}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={propertybyId.images[selectedImageIndex] || propertybyId.images[0] || '/images/default-property.jpg'}
            alt={propertybyId.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1816]/60 via-[#1a1816]/20 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816]/90 via-transparent to-[#1a1816]/30 z-[1]" />

        {/* Back button */}
        <Link
          to="/properties"
          className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/60 hover:text-white text-sm tracking-wide transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Collection</span>
        </Link>

        {/* Navigation Arrows */}
        {propertybyId.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 text-white/60 hover:text-white rounded-none transition-all duration-300"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 text-white/60 hover:text-white rounded-none transition-all duration-300"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Hero content — bottom left editorial */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-20 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">
                {propertybyId.type?.toUpperCase() || 'LODGE'} · {propertybyId.location}
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white leading-[0.95] mb-6">
                {propertybyId.name}
              </h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#c9a961] text-[#c9a961]" />
                  ))}
                </div>
                <span className="text-white/40 text-xs tracking-[0.2em] uppercase">
                  {propertybyId.numReviews || 0} Reviews
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators — bottom right */}
        {propertybyId.images.length > 1 && (
          <div className="absolute bottom-8 right-8 md:right-16 z-30 flex items-center gap-3">
            <span className="text-white/30 text-xs tracking-wider">
              {String(selectedImageIndex + 1).padStart(2, '0')}
            </span>
            <div className="flex gap-1.5">
              {[...Array(Math.min(6, propertybyId.images.length))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    i === selectedImageIndex ? 'bg-[#c9a961] w-8' : 'bg-white/25 w-4 hover:bg-white/40'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-white/30 text-xs tracking-wider">
              {String(Math.min(6, propertybyId.images.length)).padStart(2, '0')}
            </span>
          </div>
        )}
      </motion.section>

      {/* Property Info Section */}
      <section className="bg-[#f5f0ea] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start"
          >
            {/* Left — title & meta */}
            <div>
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-6">About the Property</p>
              <h2 className="text-4xl md:text-5xl font-extralight text-[#1a1816] leading-[1.1] mb-6">
                {propertybyId.name}
              </h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#c9a961]" />
                  <span className="text-[#1a1816]/60 text-sm tracking-wide">{propertybyId.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {propertybyId.amenities?.slice(0, 4).map((amenity, i) => (
                  <span key={i} className="px-4 py-2 border border-[#1a1816]/10 text-[#1a1816]/60 text-xs tracking-[0.1em] uppercase">
                    {amenity}
                  </span>
                ))}
              </div>
              <Link
                to={`/book?property=${propertybyId.id}`}
                className="inline-flex items-center gap-3 mt-10 text-[#c9a961] text-sm tracking-[0.15em] uppercase font-light group"
              >
                Reserve Your Stay
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Right — description */}
            <div>
              <div className="w-12 h-px bg-[#c9a961] mb-8" />
              <p className="text-lg md:text-xl text-[#1a1816]/70 leading-[1.8] font-light">
                {propertybyId.description || 'Experience unparalleled luxury in the heart of the African wilderness. Our exclusive safari lodge combines authentic wildlife encounters with world-class hospitality, offering you an unforgettable journey through pristine landscapes. Each moment is carefully crafted to immerse you in the natural beauty and rich biodiversity of this remarkable ecosystem, while providing the comfort and elegance you deserve.'}
              </p>
              {propertybyId.basePricePerNight ? (
                <div className="mt-8 pt-8 border-t border-[#1a1816]/10">
                  <span className="text-[#1a1816]/40 text-xs tracking-[0.2em] uppercase">From</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extralight text-[#1a1816]">${propertybyId.basePricePerNight}</span>
                    <span className="text-[#1a1816]/40 text-sm">per night</span>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Discover Our Camp Section */}
      <section className="bg-[#f5f0ea] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
            {/* Left — editorial headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">Experience</p>
              <h2 className="text-4xl md:text-6xl font-extralight text-[#1a1816] leading-[1.1]">
                Discover<br />
                <span className="italic font-light">Our Camp</span>
              </h2>
              <p className="text-[#1a1816]/50 text-base font-light mt-6 max-w-sm leading-relaxed">
                We offer more than a stay — we craft experiences through nature, comfort, and thoughtful presence.
              </p>
              <button
                onClick={() => document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 mt-8 text-[#c9a961] text-sm tracking-[0.15em] uppercase font-light group"
              >
                Explore
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </motion.div>

            {/* Right — magazine cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Our Gallery', action: 'gallery', description: 'Explore stunning photography capturing the essence of our luxury safari lodge and breathtaking wildlife encounters.' },
                { title: 'Our Rooms & Suites', action: 'rooms', description: 'Discover beautifully appointed accommodations offering the perfect balance of luxury comfort and safari atmosphere.' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group bg-white overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  onClick={() => {
                    if (item.action === 'rooms') {
                      document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.action === 'gallery') {
                      window.location.href = 'https://thebushcollection.pixieset.com/';
                    }
                  }}
                >
                  {/* Number */}
                  <div className="px-6 pt-5 pb-3">
                    <span className="text-[#1a1816]/30 text-xs tracking-[0.2em] font-light">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Image with hover overlay */}
                  <div className="relative mx-6 aspect-[4/3] overflow-hidden bg-[#f5f0ea]">
                    <img
                      src={propertybyId.images[index % propertybyId.images.length]}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#1a1816]/0 group-hover:bg-[#1a1816]/60 transition-all duration-500 flex items-end p-5 opacity-0 group-hover:opacity-100">
                      <p className="text-white/90 text-sm font-light leading-relaxed translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="px-6 pt-5 pb-6">
                    <h3 className="text-[#1a1816] text-base tracking-[0.08em] uppercase font-medium">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms-section" className="bg-[#1a1816] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header — split layout like the inspo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">Accommodation</p>
              <h2 className="text-4xl md:text-6xl font-extralight text-white leading-[1.1]">
                Our Rooms<br />
                <span className="italic font-light">&amp; Suites</span>
              </h2>
              <p className="text-white/50 text-base font-light mt-6 max-w-md leading-relaxed">
                Discover luxury accommodation in the heart of the wild — each room crafted for comfort, intimacy, and an authentic connection to nature.
              </p>
              <Link
                to={`/book?property=${propertybyId.id}`}
                className="inline-flex items-center gap-3 mt-8 text-[#c9a961] text-sm tracking-[0.15em] uppercase font-light group"
              >
                Book Your Stay
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>

            {/* Right side — first two room cards in top row */}
            <div /> {/* Spacer for layout alignment */}
          </div>

          {/* Room Cards Grid — 2-column layout like the inspo image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupedRooms.slice(0, 6).map((roomGroup, index) => (
              <motion.div
                key={roomGroup.sampleRoomId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
              >
                <Link
                  to={`/property/${(property as any).slug || slugify(propertybyId.name)}/room/${roomGroup.sampleRoomSlug || slugify(roomGroup.name)}`}
                  className="group block bg-white overflow-hidden"
                >
                  {/* Number badge */}
                  <div className="px-6 pt-5 pb-3">
                    <span className="text-[#1a1816]/30 text-xs tracking-[0.2em] font-light">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Image container with hover overlay */}
                  <div className="relative mx-6 aspect-[4/3] overflow-hidden bg-[#f5f0ea]">
                    {roomGroup.images && roomGroup.images.length > 0 ? (
                      <img
                        src={roomGroup.images[0]}
                        alt={roomGroup.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-[#c9a961]/30" />
                      </div>
                    )}

                    {/* Hover overlay — price & description revealed */}
                    <div className="absolute inset-0 bg-[#1a1816]/0 group-hover:bg-[#1a1816]/70 transition-all duration-500 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-2xl font-light text-[#c9a961]">${roomGroup.price}</span>
                          <span className="text-white/50 text-xs tracking-wide">/ night</span>
                        </div>
                        <p className="text-white/80 text-sm font-light leading-relaxed line-clamp-2">
                          {roomGroup.description || 'Luxurious accommodation with stunning views and modern amenities.'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-white/50 text-xs flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            Up to {roomGroup.maxGuests} guests
                          </span>
                          {roomGroup.availableCount > 0 ? (
                            <span className="text-green-400/80 text-xs font-medium">
                              {roomGroup.availableCount} available
                            </span>
                          ) : (
                            <span className="text-red-400/80 text-xs font-medium">Fully Booked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room name below image */}
                  <div className="px-6 pt-5 pb-6">
                    <h3 className="text-[#1a1816] text-base tracking-[0.08em] uppercase font-medium">
                      {roomGroup.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {groupedRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">Room information coming soon</p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link to={`/book?property=${propertybyId.id}`}>
              <Button className="bg-[#c9a961] hover:bg-[#b8935a] text-white px-10 py-6 text-sm tracking-[0.15em] uppercase font-light rounded-none transition-all duration-300">
                Book Your Stay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-[#141210] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
            {/* Brand */}
            <div>
              <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-4">The Bush Collection</p>
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
                Authentic luxury safari experiences across Kenya and Tanzania's most pristine landscapes.
              </p>
            </div>
            {/* Location */}
            <div>
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Location</p>
              <p className="text-white/60 text-sm font-light leading-relaxed">{propertybyId.location}</p>
            </div>
            {/* Contact */}
            <div>
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Contact</p>
              <p className="text-white/60 text-sm font-light mb-1">+254 116 072343</p>
              <p className="text-white/60 text-sm font-light">info@thebushcollection.africa</p>
            </div>
            {/* CTA */}
            <div>
              <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-4">Reserve</p>
              <Link
                to={`/book?property=${propertybyId.id}`}
                className="inline-flex items-center gap-2 text-[#c9a961] text-sm tracking-[0.1em] uppercase font-light hover:text-[#c9a961]/80 transition-colors duration-300 group"
              >
                Book Your Stay
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.04] py-6 px-8 md:px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs tracking-wider">© 2026 The Bush Collection. All rights reserved.</p>
            <p className="text-white/20 text-xs tracking-wider">{propertybyId.name}</p>
          </div>
        </div>
      </section>

      {/* Room Details Modal */}
      {roomDetailsOpen && selectedRoom && (
        <div 
          className="fixed inset-0 z-50 bg-[#1a1816]/95 backdrop-blur-sm overflow-y-auto"
          onClick={closeRoomDetails}
        >
          {/* Close button — top right */}
          <button
            onClick={closeRoomDetails}
            className="fixed top-6 right-6 z-[60] w-12 h-12 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-h-screen py-12 px-4 md:px-8" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-6xl mx-auto">

              {/* Hero Image */}
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#1a1816] overflow-hidden">
                {selectedRoom.images && selectedRoom.images.length > 0 ? (
                  <>
                    <img
                      src={selectedRoom.images[roomDetailImageIndex]}
                      alt={selectedRoom.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation arrows */}
                    {selectedRoom.images.length > 1 && (
                      <>
                        <button
                          onClick={prevRoomDetailImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextRoomDetailImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center border border-white/20 hover:border-white/50 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {selectedRoom.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setRoomDetailImageIndex(idx)}
                              className={`h-0.5 rounded-full transition-all duration-500 ${
                                idx === roomDetailImageIndex ? 'bg-[#c9a961] w-8' : 'bg-white/25 w-4 hover:bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Gradient overlay at bottom for text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1816] to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-white/10" />
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="bg-[#f5f0ea]">
                <div className="px-8 md:px-16 py-12 md:py-16">
                  {/* Header row — title + price */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
                    <div>
                      <p className="text-[#c9a961] text-xs tracking-[0.4em] uppercase font-light mb-3">
                        {selectedRoom.type} · {propertybyId.name}
                      </p>
                      <h2 className="text-4xl md:text-5xl font-extralight text-[#1a1816] leading-[1.1]">
                        {selectedRoom.name}
                      </h2>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extralight text-[#1a1816]">${selectedRoom.price}</span>
                        <span className="text-[#1a1816]/40 text-sm">/ night</span>
                      </div>
                      <div className="flex items-center justify-end gap-3 mt-2 text-[#1a1816]/50 text-xs">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          Up to {selectedRoom.maxGuests} guests
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-12">
                    <div className="w-12 h-px bg-[#c9a961] mb-6" />
                    <p className="text-[#1a1816]/60 text-lg font-light leading-[1.8] max-w-3xl">
                      {selectedRoom.description || 'A thoughtfully designed space blending luxury and comfort, offering an authentic connection to the surrounding wilderness.'}
                    </p>
                  </div>

                  {/* Thumbnail gallery */}
                  {selectedRoom.images && selectedRoom.images.length > 1 && (
                    <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
                      {selectedRoom.images.slice(0, 5).map((img, idx) => (
                        <button
                          key={idx}
                          className={`relative flex-shrink-0 w-24 h-20 overflow-hidden transition-all duration-300 ${
                            idx === roomDetailImageIndex
                              ? 'ring-2 ring-[#c9a961] opacity-100'
                              : 'opacity-50 hover:opacity-80'
                          }`}
                          onClick={() => setRoomDetailImageIndex(idx)}
                        >
                          <img src={img} alt={`${selectedRoom.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Amenities / Inclusions */}
                  <div className="border-t border-[#1a1816]/10 pt-10 mb-12">
                    <p className="text-[#c9a961] text-xs tracking-[0.3em] uppercase font-light mb-8">
                      Inclusions
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-3 max-w-4xl">
                      {(selectedRoom.amenities && selectedRoom.amenities.length > 0
                        ? selectedRoom.amenities
                        : ['Large Private Shower', 'Balcony & Lounge Area', 'En-suite Bathroom', 'Writing Desk', 'Complimentary Slippers', 'Bathrobes', 'Coffee Experience', 'Eco Bed Warmers', 'Laundry Services']
                      ).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-[#1a1816]/60 text-sm font-light py-1">
                          <div className="w-1 h-1 bg-[#c9a961] rounded-full flex-shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Link to={`/book?property=${propertybyId.id}&room=${selectedRoom.id}`}>
                      <Button className="bg-[#c9a961] hover:bg-[#b8935a] text-white px-12 py-6 text-sm tracking-[0.15em] uppercase font-light rounded-none transition-all duration-300">
                        Book This Room
                      </Button>
                    </Link>
                    <button
                      onClick={closeRoomDetails}
                      className="text-[#1a1816]/40 text-sm tracking-[0.1em] uppercase font-light hover:text-[#1a1816]/60 transition-colors duration-300"
                    >
                      Continue Exploring
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}