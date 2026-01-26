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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Play,
  Eye,
  Plus,
  Minus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
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
      {/* Hero Section with Overlay Text */}
      <motion.section 
        className="relative h-screen bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url('${propertybyId.images[selectedImageIndex] || propertybyId.images[0] || '/images/default-property.jpg'}')`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        key={selectedImageIndex}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        
        {/* Navigation Arrows */}
        {propertybyId.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
        
        {/* Logo/Brand */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-center">
            <div className="text-[#c9a961] text-sm tracking-[0.3em] mb-2">THE BUSH</div>
            <div className="text-white text-2xl tracking-[0.2em] font-light border-t border-b border-[#c9a961] py-2">
              COLLECTION
            </div>
          </div>
        </div>

        {/* Property Badge/Name */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            className="bg-black/60 backdrop-blur-sm border-2 border-[#c9a961] px-8 py-6 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-[#c9a961] text-xl tracking-widest">{propertybyId.type?.toUpperCase() || 'LODGE'}</div>
            <div className="text-white text-3xl md:text-4xl font-light mt-2">{propertybyId.name}</div>
            <div className="text-[#c9a961] text-sm tracking-wider mt-2">{propertybyId.location}</div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {[...Array(Math.min(5, propertybyId.images.length))].map((_, i) => (
            <button
              key={i}
              onClick={() => setSelectedImageIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                i === selectedImageIndex ? 'bg-[#c9a961] w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Property Info Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-[#1a1816] mb-4">
              {propertybyId.name} - {propertybyId.location}
            </h2>
            <div className="text-xl text-[#c9a961] mb-2">00° 11' 14" E89° 27' 81"</div>
            <div className="flex justify-center items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#c9a961] text-[#c9a961]" />
              ))}
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-serif">
              {propertybyId.description || 'Experience unparalleled luxury in the heart of the African wilderness. Our exclusive safari lodges combines authentic wildlife encounters with world-class hospitality, offering you an unforgettable journey through pristine landscapes. Each moment is carefully crafted to immerse you in the natural beauty and rich biodiversity of this remarkable ecosystem, while providing the comfort and elegance you deserve.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Discover Our Camp Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-[#1a1816] mb-4">
              Discover Our Camp
            </h2>
            <p className="text-gray-600">Click to view →</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Our Gallery', icon: ImageIcon, action: 'gallery', description: 'Explore stunning photography capturing the essence of our luxury safari lodge and the breathtaking wildlife encounters that await you.' },
              { title: 'Our Rooms and Suites', icon: Users, action: 'rooms', description: 'Discover beautifully appointed accommodations offering the perfect balance of luxury comfort and authentic safari atmosphere.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group relative aspect-[3/4] bg-white border-2 border-[#c9a961] overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  if (item.action === 'rooms') {
                    document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (item.action === 'gallery') {
                    window.location.href = 'https://thebushcollection.pixieset.com/';
                  }
                }}
              >
                <img 
                  src={propertybyId.images[index % propertybyId.images.length]} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                  <div className="p-4 w-full">
                    <item.icon className="w-6 h-6 text-[#c9a961] mb-2" />
                    <h3 className="text-white text-lg font-light mb-1">{item.title}</h3>
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms-section" className="bg-[#1a1816] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
              Our Rooms and Suites
            </h2>
            <p className="text-white/60">Discover luxury accommodation in the heart of the wild</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupedRooms.slice(0, 6).map((roomGroup, index) => (
              <motion.div
                key={roomGroup.sampleRoomId}
                className="bg-[#1a1816] border border-[#c9a961]/20 rounded-lg overflow-hidden hover:border-[#c9a961] transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {roomGroup.images && roomGroup.images.length > 0 ? (
                  <div className="relative w-full h-64 bg-[#000000] group/image">
                    <RoomImageCarousel 
                      room={{
                        id: roomGroup.sampleRoomId,
                        name: roomGroup.name,
                        description: roomGroup.description,
                        type: roomGroup.type,
                        maxGuests: roomGroup.maxGuests,
                        price: roomGroup.price,
                        available: roomGroup.availableCount > 0,
                        amenities: roomGroup.amenities,
                        images: roomGroup.images
                      }} 
                      size="large" 
                    />
                    {/* View Details Button */}
                    <div className="absolute top-4 right-4 z-10">
                      <Link
                        to={`/property/${(property as any).slug || slugify(propertybyId.name)}/room/${roomGroup.sampleRoomSlug || slugify(roomGroup.name)}`}
                        className="flex items-center gap-2 bg-[#c9a961] hover:bg-[#8b6f47] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 shadow-lg"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-[#000000] flex items-center justify-center relative">
                    <ImageIcon className="w-12 h-12 text-[#c9a961]/30" />
                    {/* View Details Button for no image */}
                    <div className="absolute top-4 right-4 z-10">
                      <Link
                        to={`/property/${(property as any).slug || slugify(property.name)}/room/${roomGroup.sampleRoomSlug || slugify(roomGroup.name)}`}
                        className="flex items-center gap-2 bg-[#c9a961] hover:bg-[#8b6f47] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 shadow-lg"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                )}
                <div className="p-6 bg-[#2a2623]">
                  <div className="mb-3">
                    <h3 className="text-2xl font-bold text-white mb-2">{roomGroup.name}</h3>
                    <p className="text-[#c9a961] text-base font-medium">{roomGroup.type}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                    <Users className="w-5 h-5 text-[#c9a961]" />
                    <span>Up to {roomGroup.maxGuests} guests</span>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {roomGroup.description || 'Luxurious accommodation with stunning views and modern amenities.'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-[#c9a961]">${roomGroup.price}</span>
                        <span className="text-white/50 text-sm">per night</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {roomGroup.availableCount > 0 ? (
                        <span className="text-green-400 text-sm font-semibold">
                          {roomGroup.availableCount} available
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm font-semibold">Fully Booked</span>
                      )}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/book?property=${propertybyId.id}&room=${roomGroup.sampleRoomId}`}
                    className="block"
                  >
                    <Button 
                      className="w-full bg-[#c9a961] hover:bg-[#8b6f47] text-white font-semibold py-6 text-base rounded-md transition-all duration-300"
                      disabled={roomGroup.availableCount === 0}
                    >
                      {roomGroup.availableCount > 0 ? 'Book Now' : 'Fully Booked'}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {groupedRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">Room information coming soon</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to={`/book?property=${propertybyId.id}`}>
              <Button className="bg-[#c9a961] hover:bg-[#b8935a] text-white px-8 py-6 text-lg">
                Book Your Stay
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="bg-[#1a1816] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-[#c9a961] font-semibold mb-2">Location</h3>
              <p className="text-white/70">{propertybyId.location}</p>
            </div>
            <div>
              <h3 className="text-[#c9a961] font-semibold mb-2">Contact</h3>
              <p className="text-white/70">+254 116 072343</p>
              <p className="text-white/70">info@thebushcollection.africa</p>
            </div>
            <div>
              <h3 className="text-[#c9a961] font-semibold mb-2">Book Now</h3>
              <Link to={`/book?property=${propertybyId.id}`}>
                <Button className="bg-[#c9a961] hover:bg-[#b8935a] text-white">
                  Reserve Your Stay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Room Details Modal */}
      {roomDetailsOpen && selectedRoom && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
          onClick={closeRoomDetails}
        >
          <div className="min-h-screen p-4 md:p-8">
            <div 
              className="max-w-6xl mx-auto bg-[#ebe9d8] rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeRoomDetails}
                className="absolute top-8 right-8 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Hero Image Section with Carousel */}
              <div className="relative w-full min-h-[60vh] max-h-[80vh] bg-[#1a1816] flex items-center justify-center">
                {selectedRoom.images && selectedRoom.images.length > 0 && (
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
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextRoomDetailImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all duration-300"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {selectedRoom.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setRoomDetailImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === roomDetailImageIndex ? 'bg-[#c9a961] w-6' : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Property branding overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-[#c9a961] text-white px-4 py-2 rounded-lg font-semibold">
                        {propertybyId.name}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Room Details Section */}
              <div className="p-8 md:p-12">
                {/* Room Title and Type */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-[#1a1816] mb-2">{selectedRoom.name}</h2>
                  <p className="text-[#c9a961] text-lg italic">{selectedRoom.type}</p>
                </div>

                {/* Description */}
                <div className="mb-8 text-center max-w-4xl mx-auto">
                  <p className="text-[#1a1816]/80 leading-relaxed">
                    {selectedRoom.description || 'A perfect room for a perfect stay, blending luxury and comfort'}
                  </p>
                </div>

                {/* Image Placeholders (for additional room views) */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {selectedRoom.images && selectedRoom.images.slice(0, 3).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative aspect-[4/3] bg-[#1a1816]/10 border-2 border-[#c9a961]/30 rounded-lg overflow-hidden cursor-pointer hover:border-[#c9a961] transition-all"
                      onClick={() => setRoomDetailImageIndex(idx)}
                    >
                      <img src={img} alt={`${selectedRoom.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Room Features/Amenities */}
                <div className="border-t-2 border-[#c9a961]/30 pt-8">
                  <h3 className="text-2xl font-bold text-[#c9a961] text-center mb-6">
                    Your {selectedRoom.type} Inclusions:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 max-w-4xl mx-auto">
                    {selectedRoom.amenities && selectedRoom.amenities.length > 0 ? (
                      selectedRoom.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>{amenity}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Umbrella</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Large Private Shower</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Challenging Paths & Obstacles</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Balcony & Lounge Area</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Large-on-suite Bathroom</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Additional Heating*</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Writing Desk & Stationery</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Complementary Slippers</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Eco Bed Warmers</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Laundry Services*</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Coffee Experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Bathrobes</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1a1816]/80">
                          <div className="w-2 h-2 bg-[#c9a961] rounded-full"></div>
                          <span>Complementary Slippers</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="mt-12 flex justify-center">
                  <Link to={`/book?property=${propertybyId.id}&room=${selectedRoom.id}`}>
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
                      <span>Up to {selectedRoom.maxGuests} guests</span>
                    </div>
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