import { Star, MapPin, Users, Play, ArrowUpRight } from 'lucide-react';
import slugify from '@/lib/slugify';
import { Link } from 'react-router-dom';

// Backend types (matching useBackendProperties)
type Room = {
  id?: string;
  _id?: string;
  name?: string;
  available?: boolean;
  available_from?: string | null;
  price?: number;
  max_guests?: number;
  maxGuests?: number;
};

type Property = {
  id?: string;
  _id?: string;
  name?: string;
  location?: string;
  description?: string;
  images?: string[];
  price?: number;
  basePricePerNight?: number;
  price_from?: number;
  rating?: number;
  reviews?: number;
  numReviews?: number;
  featured?: boolean;
  externalUrl?: string | null;
  rooms?: Room[];
  safari_rooms?: Room[];
  type?: string;
  category?: string;
};

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // Normalize property data from backend
  const propertyId = property.id || property._id;
  const propertyName = property.name || 'Property';
  const propertyLocation = property.location || 'Location unknown';
  const propertyDescription = property.description || '';
  const propertyPrice = property.price_from || property.basePricePerNight || property.price || 0;
  const propertyRating = property.rating || 4.5;
  const propertyReviews = property.reviews || property.numReviews || 0;
  const propertyFeatured = property.featured || false;
  const propertyImages = property.images || [];
  const propertyType = property.type || property.category || '';

  // Get rooms
  const rooms = (property.rooms || property.safari_rooms || []) as Room[];
  const availableRooms = rooms.filter(room => room.available).length;
  const totalRooms = rooms.length;
  const fullyBooked = totalRooms > 0 && availableRooms === 0;

  // Simplified video detection
  const isVideo = (url: string | null): boolean => {
    if (!url || typeof url !== 'string') return false;
    const lowerUrl = url.toLowerCase();
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
    const videoIndicators = ['/video/', '.video.', 'videoplayback'];
    const isMicrosoftVideo = lowerUrl.includes('1drv.ms') || lowerUrl.includes('onedrive.live.com') ||
      (lowerUrl.includes('sharepoint.com') && (lowerUrl.includes('/video/') || lowerUrl.includes('&web=1')));
    return videoExtensions.some(ext => lowerUrl.includes(ext)) ||
      videoHosts.some(host => lowerUrl.includes(host)) ||
      videoIndicators.some(ind => lowerUrl.includes(ind)) ||
      isMicrosoftVideo;
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const firstMedia = propertyImages[0] || null;
  const videoCheck = firstMedia ? isVideo(firstMedia) : false;
  const propertySlug = (property as any).slug || slugify(propertyName) || propertyId;

  // Availability label
  const getAvailabilityInfo = () => {
    if (fullyBooked) return { label: 'Fully Booked', color: 'text-red-400/80' };
    if (availableRooms < totalRooms && totalRooms > 0) return { label: `${availableRooms} of ${totalRooms} rooms`, color: 'text-[#c9a961]/70' };
    if (totalRooms > 0) return { label: `${totalRooms} rooms available`, color: 'text-white/30' };
    return null;
  };
  const availability = getAvailabilityInfo();

  const renderMedia = () => {
    if (!firstMedia || typeof firstMedia !== 'string') {
      return (
        <div className="w-full h-full bg-[#322e2b] flex items-center justify-center">
          <span className="text-white/15 text-xs tracking-[0.2em] uppercase font-light">No image</span>
        </div>
      );
    }

    if (videoCheck) {
      const lowerUrl = firstMedia.toLowerCase();
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        return (
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${getYouTubeVideoId(firstMedia)}/maxresdefault.jpg`}
              alt={propertyName}
              className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = `https://img.youtube.com/vi/${getYouTubeVideoId(firstMedia)}/hqdefault.jpg`;
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(firstMedia, '_blank'); }}
            >
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
            </div>
          </div>
        );
      }

      if (lowerUrl.includes('1drv.ms') || lowerUrl.includes('onedrive.live.com') || lowerUrl.includes('sharepoint.com')) {
        return (
          <div className="relative w-full h-full overflow-hidden bg-[#322e2b] flex items-center justify-center">
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(firstMedia, '_blank'); }}
            >
              <div className="text-center">
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <Play className="h-5 w-5 text-white/40 ml-0.5" />
                </div>
                <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase font-light">External Video</span>
              </div>
            </div>
          </div>
        );
      }

      // Direct video file
      return (
        <div className="relative w-full h-full overflow-hidden bg-[#322e2b]">
          <video
            className="w-full h-full object-cover"
            muted loop playsInline preload="metadata" controls={false}
            onError={(e) => {
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
              const fallback = target.closest('.relative')?.querySelector('.video-fallback') as HTMLDivElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              if (video.paused) video.play().catch(() => {});
            }}
          >
            <source src={firstMedia} type="video/mp4" />
            <source src={firstMedia} type="video/webm" />
          </video>
          <div className="video-fallback hidden absolute inset-0 items-center justify-center bg-[#322e2b]">
            <span className="text-white/15 text-xs tracking-[0.2em] uppercase font-light">Video unavailable</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault(); e.stopPropagation();
              const container = e.currentTarget.closest('.relative');
              const video = container?.querySelector('video') as HTMLVideoElement;
              if (video) { if (video.paused) { video.play().catch(() => {}); } else { video.pause(); } }
            }}
          >
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <Play className="h-5 w-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      );
    }

    // Image
    return (
      <img
        src={firstMedia}
        alt={propertyName}
        className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.src = '';
          e.currentTarget.alt = '';
          e.currentTarget.classList.add('bg-[#322e2b]');
        }}
      />
    );
  };

  return (
    <Link to={property.externalUrl || `/property/${propertySlug}`} className="block group h-full">
      <div className="h-full bg-[#322e2b] border border-white/[0.04] hover:border-[#c9a961]/15 transition-all duration-700 overflow-hidden flex flex-col">
        {/* ── IMAGE ── */}
        <div className="relative h-56 sm:h-64 overflow-hidden flex-shrink-0">
          {renderMedia()}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#322e2b] via-transparent to-transparent opacity-60" />

          {/* Top-left badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {videoCheck && (
              <span className="text-[8px] tracking-[0.3em] uppercase font-medium text-white bg-white/10 backdrop-blur-md px-3 py-1.5 border border-white/10">
                Video
              </span>
            )}
            {propertyType && (
              <span className="text-[8px] tracking-[0.3em] uppercase font-light text-white/70 bg-[#292524]/60 backdrop-blur-md px-3 py-1.5">
                {propertyType}
              </span>
            )}
          </div>

          {/* Featured badge — top right */}
          {propertyFeatured && (
            <div className="absolute top-4 right-4">
              <span className="text-[8px] tracking-[0.3em] uppercase font-medium text-[#292524] bg-[#c9a961] px-3 py-1.5">
                Featured
              </span>
            </div>
          )}

          {/* Availability — bottom left */}
          {availability && fullyBooked && (
            <div className="absolute bottom-4 left-4">
              <span className="text-[8px] tracking-[0.3em] uppercase font-light text-red-300 bg-red-950/60 backdrop-blur-md px-3 py-1.5 border border-red-500/20">
                Fully Booked
              </span>
            </div>
          )}

          {/* Hover arrow */}
          <div className="absolute bottom-4 right-4 w-10 h-10 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 bg-white/5 backdrop-blur-sm">
            <ArrowUpRight className="w-4 h-4 text-white/80" />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="p-6 md:p-7 flex flex-col flex-1">
          {/* Location */}
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-3 w-3 text-[#c9a961]/60 flex-shrink-0" />
            <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-light truncate">{propertyLocation}</span>
          </div>

          {/* Name */}
          <h3 className="text-xl md:text-2xl font-extralight text-white/90 leading-tight mb-4 group-hover:text-[#c9a961]/90 transition-colors duration-500">
            {propertyName}
          </h3>

          {/* Description */}
          <p className="text-white/30 text-sm font-light leading-relaxed line-clamp-2 mb-6">
            {propertyDescription}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-[#c9a961] fill-[#c9a961]" />
              <span className="text-white/50 font-light">{propertyRating}</span>
              <span className="text-white/20 font-light">({propertyReviews})</span>
            </div>
            {rooms.length > 0 && (
              <>
                <div className="w-[1px] h-3 bg-white/[0.08]" />
                <div className="flex items-center gap-1 text-white/30 font-light">
                  <Users className="h-3 w-3" />
                  <span>Up to {Math.max(...rooms.map(r => (r.maxGuests || r.max_guests || 0)))} guests</span>
                </div>
              </>
            )}
          </div>

          {/* Availability pill */}
          {availability && !fullyBooked && (
            <div className="mb-6">
              <span className={`text-[9px] tracking-[0.2em] uppercase font-light ${availability.color}`}>
                {availability.label}
              </span>
            </div>
          )}

          {/* Price + CTA — pushed to bottom */}
          <div className="mt-auto pt-5 border-t border-white/[0.05] flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/20 font-light block mb-0.5">From</span>
              <span className="text-white/90 text-2xl font-extralight">${propertyPrice}</span>
              <span className="text-white/25 text-xs font-light ml-1">/ night</span>
            </div>
            <span className="text-[#c9a961] text-[9px] tracking-[0.2em] uppercase font-medium group-hover:tracking-[0.3em] transition-all duration-500">
              {fullyBooked ? 'View Details' : 'Explore'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}