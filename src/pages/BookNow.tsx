import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Users, MapPin, Star, ArrowLeft, Check, CreditCard, Shield, Clock, Plus, Minus, Image, Video, Play, ChevronLeft, ChevronRight, ExternalLink, AlertTriangle, Plane, Banknote, Percent } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBackendProperties, Property, Room } from '@/hooks/useBackendProperties';
import { useBackendPackages } from '@/hooks/useBackendPackages';
import { Package } from '@/types/package';
import { BookingAmenity } from '@/types/amenity';
import { toast } from 'sonner';
import PaymentForm from '@/components/PaymentForm';
import { AmenitySelector } from '@/components/AmenitySelector';

// Country codes data
const countryCodes = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: '+32', country: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: '+358', country: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: '+48', country: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: '+420', country: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', country: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: '+7', country: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+27', country: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: '+254', country: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: '+250', country: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: '+212', country: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+233', country: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: '+971', country: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+965', country: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', country: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: '+973', country: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: '+962', country: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+60', country: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+63', country: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: '+62', country: 'ID', name: 'Indonesia', flag: '🇮🇩' }
];

interface RoomBooking {
  roomId: string;
  quantity: number;
  guests: number;
}

interface RoomBreakdownItem {
  roomName: string;
  quantity: number;
  guests: number;
  maxGuests: number;
  baseRate: number;
  extraGuestFee: number;
  extraGuests: number;
}

interface PropertyCosts {
  baseRate: number;
  extraGuestFees: number;
  amenitiesTotal: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
  nights: number;
  roomBreakdown: RoomBreakdownItem[];
}

interface PackageCosts {
  basePrice: number;
  amenitiesTotal: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

type Costs = PropertyCosts | PackageCosts;

// Payment terms types
type PaymentTerm = 'deposit' | 'full';

interface PaymentSchedule {
  depositAmount: number;
  balanceAmount: number;
  depositDueDate: string;
  balanceDueDate: string;
}

export default function BookNow() {
  const [searchParams] = useSearchParams();
  const { properties, loading: propertiesLoading } = useBackendProperties();
  const { packages, getPackageById, loading: packagesLoading } = useBackendPackages();
  
  const propertyId = searchParams.get('property');
  const roomId = searchParams.get('room');
  const packageId = searchParams.get('package');

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [bookingType, setBookingType] = useState<'property' | 'package'>('property');
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [roomImageIndex, setRoomImageIndex] = useState<{[key: string]: number}>({});
  const [showPayment, setShowPayment] = useState(false);
  
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    specialRequests: '',
    // Airport transfer details
    arrivalDate: '',
    arrivalTime: '',
    arrivalFlightNumber: '',
    departureDate: '',
    departureTime: '',
    departureFlightNumber: '',
    needsAirportTransfer: false
  });

  // Payment terms state
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState<PaymentTerm>('deposit');
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule | null>(null);

  // Date states for calendar
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  // Package-specific date state
  const [packageStartDate, setPackageStartDate] = useState<Date>();
  const [packageEndDate, setPackageEndDate] = useState<Date>();

  // Airport transfer date states
  const [arrivalDate, setArrivalDate] = useState<Date>();
  const [departureDate, setDepartureDate] = useState<Date>();

  // New state for multiple room bookings
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);

  // New state for amenities
  const [selectedAmenities, setSelectedAmenities] = useState<BookingAmenity[]>([]);
  
  // State for showing additional rooms
  const [showAdditionalRooms, setShowAdditionalRooms] = useState(false);

  // Helper function to extract days from duration string
  const extractDaysFromDuration = (duration: string): number => {
    const match = duration.match(/(\d+)\s*Days?/i);
    return match ? parseInt(match[1]) : 1;
  };

  // Auto-calculate package end date when start date changes
  useEffect(() => {
    if (packageStartDate && selectedPackage) {
      const days = extractDaysFromDuration(selectedPackage.duration);
      const endDate = addDays(packageStartDate, days - 1); // -1 because if it's 5 days, it ends on day 5, not day 6
      setPackageEndDate(endDate);
    }
  }, [packageStartDate, selectedPackage]);

  const updateRoomBooking = (roomId: string, field: 'quantity' | 'guests', value: number) => {
    // Check if room is available before allowing booking
    const room = selectedProperty?.rooms?.find(r => r.id === roomId);
    if (!room?.available && field === 'quantity' && value > 0) {
      toast.error(`${room?.name || 'This room'} is currently unavailable and cannot be booked.`);
      return;
    }

    // Check if the requested quantity exceeds available rooms of this type
    if (field === 'quantity' && value > 0) {
      const roomName = room?.name;
      if (roomName) {
        const availableCount = selectedProperty?.rooms?.filter(r =>
          r.name === roomName && r.available
        ).length || 0;

        if (value > availableCount) {
          toast.error(`Only ${availableCount} ${roomName} room${availableCount !== 1 ? 's' : ''} ${availableCount === 1 ? 'is' : 'are'} available.`);
          return;
        }
      }
    }

    setRoomBookings(prev =>
      prev.map(booking =>
        booking.roomId === roomId
          ? { ...booking, [field]: Math.max(0, value) }
          : booking
      )
    );
  };

  const getActiveRoomBookings = () => {
    return roomBookings.filter(booking => booking.quantity > 0);
  };

  const getRoomAvailability = (roomName: string) => {
    if (!selectedProperty?.rooms) return 0;
    return selectedProperty.rooms.filter(r =>
      r.name === roomName && r.available
    ).length;
  };

  const getTotalGuests = () => {
    return roomBookings.reduce((total, booking) => total + booking.guests, 0);
  };

  const calculateNights = () => {
    if (bookingType === 'package') {
      if (packageStartDate && packageEndDate) {
        const timeDiff = packageEndDate.getTime() - packageStartDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 because package includes both start and end days
      }
      return selectedPackage ? extractDaysFromDuration(selectedPackage.duration) : 0;
    } else {
      if (!checkInDate || !checkOutDate) return 0;
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  };

  const calculateRoomCosts = (booking: RoomBooking, room: Room, nights: number) => {
    // Per person per night pricing - each guest pays the same rate regardless of room capacity
    const ratePerPersonPerNight = room.price;
    const totalCost = booking.guests * ratePerPersonPerNight * nights;

    return {
      baseRate: totalCost,
      extraGuestFee: 0, // No extra guest fees with per person pricing
      total: totalCost
    };
  };

  const calculateAmenitiesTotal = () => {
    return selectedAmenities.reduce((total, amenity) => total + amenity.totalPrice, 0);
  };

  const calculatePropertyCosts = () => {
    const nights = calculateNights();
    if (!selectedProperty || nights <= 0) {
      return {
        baseRate: 0,
        extraGuestFees: 0,
        amenitiesTotal: calculateAmenitiesTotal(),
        subtotal: calculateAmenitiesTotal(),
        serviceFee: 0,
        taxes: 0,
        total: calculateAmenitiesTotal(),
        nights: 0,
        roomBreakdown: []
      };
    }

    let totalBaseRate = 0;
    let totalExtraGuestFees = 0; // Still 0 with per person pricing
    const roomBreakdown: RoomBreakdownItem[] = [];

    roomBookings.forEach(booking => {
      if (booking.quantity > 0) {
        const room = selectedProperty.rooms?.find((r: Room) => r.id === booking.roomId);
        if (room) {
          const costs = calculateRoomCosts(booking, room, nights);
          totalBaseRate += costs.baseRate;
          totalExtraGuestFees += costs.extraGuestFee; // Always 0 now
          
          roomBreakdown.push({
            roomName: room.name,
            quantity: booking.quantity,
            guests: booking.guests,
            maxGuests: (room.max_guests || room.maxGuests) * booking.quantity,
            baseRate: costs.baseRate,
            extraGuestFee: costs.extraGuestFee, // Always 0 now
            extraGuests: 0 // No extra guests with per person pricing
          });
        }
      }
    });
    
    const amenitiesTotal = calculateAmenitiesTotal();
    const subtotal = totalBaseRate + totalExtraGuestFees + amenitiesTotal;
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxes = subtotal * 0.15; // 15% taxes
    const total = subtotal + serviceFee + taxes;

    return {
      baseRate: totalBaseRate,
      extraGuestFees: totalExtraGuestFees,
      amenitiesTotal,
      subtotal,
      serviceFee,
      taxes,
      total,
      nights,
      roomBreakdown
    };
  };

  const calculatePackageCosts = () => {
    if (!selectedPackage) {
      return {
        basePrice: 0,
        amenitiesTotal: calculateAmenitiesTotal(),
        subtotal: calculateAmenitiesTotal(),
        serviceFee: 0,
        taxes: 0,
        total: calculateAmenitiesTotal()
      };
    }

    const basePrice = selectedPackage.price * bookingData.guests;
    const amenitiesTotal = calculateAmenitiesTotal();
    const subtotal = basePrice + amenitiesTotal;
    const serviceFee = subtotal * 0.1; // 10% service fee
    const taxes = subtotal * 0.12; // 12% taxes for packages
    const total = subtotal + serviceFee + taxes;

    return {
      basePrice,
      amenitiesTotal,
      subtotal,
      serviceFee,
      taxes,
      total
    };
  };

  const costs = bookingType === 'package' ? calculatePackageCosts() : calculatePropertyCosts();

  // Calculate payment schedule when total amount or payment term changes
  useEffect(() => {
    const totalAmount = costs.total;
    const checkIn = bookingType === 'package' ? packageStartDate : checkInDate;
    
    if (totalAmount > 0 && checkIn) {
      const today = new Date();
      const depositDueDate = new Date(today);
      depositDueDate.setDate(today.getDate() + 7); // 7 days from today
      
      const balanceDueDate = new Date(checkIn);
      balanceDueDate.setDate(balanceDueDate.getDate() - 30); // 30 days before check-in
      
      // If check-in is within 30 days, balance is due immediately
      const isWithin30Days = balanceDueDate <= today;
      
      const depositAmount = totalAmount * 0.3; // 30% deposit
      const balanceAmount = totalAmount * 0.7; // 70% balance
      
      setPaymentSchedule({
        depositAmount,
        balanceAmount: isWithin30Days ? balanceAmount : balanceAmount,
        depositDueDate: depositDueDate.toISOString().split('T')[0],
        balanceDueDate: isWithin30Days ? today.toISOString().split('T')[0] : balanceDueDate.toISOString().split('T')[0]
      });
    }
  }, [costs.total, checkInDate, packageStartDate, bookingType]);

  useEffect(() => {
    // Prevent infinite loops by checking if already initialized
    if (initialized) return;

    // Wait for data to load from Supabase
    if (packagesLoading || propertiesLoading) {
      console.log('Still loading data from Supabase...');
      return; // Still loading, wait
    }

    console.log('Data loaded. Properties:', properties.length, 'Packages:', packages.length);

    let hasFoundItem = false;
    
    const loadInitialData = async () => {
      if (packageId) {
        setBookingType('package');
        console.log('Looking for package:', packageId);
        
        const pkg = await getPackageById(packageId);
        console.log('Found package:', pkg);
        
        if (pkg) {
          setSelectedPackage(pkg);
          setBookingData(prev => ({ ...prev, guests: Math.min(prev.guests, pkg.maxGuests || 10) }));
          hasFoundItem = true;
        } else {
          console.warn('Package not found:', packageId);
        }
      } else if (propertyId) {
        setBookingType('property');
        console.log('Looking for property:', propertyId);
        
        const property = properties.find(p => p.id === propertyId);
        console.log('Found property:', property);
        
        if (property) {
          setSelectedProperty(property);
          
          // Initialize room bookings with availability check
          const rooms = property.rooms || [];
          console.log('Property rooms:', rooms);
          
          const initialRoomBookings = rooms.map((room: Room) => ({
            roomId: room.id,
            quantity: roomId === room.id && room.available ? 1 : 0,
            guests: roomId === room.id && room.available ? 1 : 0
          }));
          setRoomBookings(initialRoomBookings);

          if (roomId) {
            const room = rooms.find((r: Room) => r.id === roomId);
            if (room) {
              setSelectedRoom(room);
            }
          } else if (rooms.length > 0) {
            // Find first available room
            const availableRoom = rooms.find((r: Room) => r.available);
            setSelectedRoom(availableRoom || rooms[0]);
          }
          
          hasFoundItem = true;
        }
      } else {
        console.warn('Neither propertyId nor packageId provided');
      }
    };
    
    loadInitialData();

    // Always set loading to false and mark as initialized after data is loaded
    console.log('Setting initialized to true');
    setIsLoading(false);
    setInitialized(true);
  }, [packageId, propertyId, roomId, packages, properties, getPackageById, initialized, packagesLoading, propertiesLoading]);

  // Update booking data when dates change (for properties)
  useEffect(() => {
    if (checkInDate && bookingType === 'property') {
      setBookingData(prev => ({ ...prev, checkIn: format(checkInDate, 'yyyy-MM-dd') }));
    }
  }, [checkInDate, bookingType]);

  useEffect(() => {
    if (checkOutDate && bookingType === 'property') {
      setBookingData(prev => ({ ...prev, checkOut: format(checkOutDate, 'yyyy-MM-dd') }));
    }
  }, [checkOutDate, bookingType]);

  // Update booking data when package dates change
  useEffect(() => {
    if (packageStartDate && bookingType === 'package') {
      setBookingData(prev => ({ ...prev, checkIn: format(packageStartDate, 'yyyy-MM-dd') }));
    }
  }, [packageStartDate, bookingType]);

  useEffect(() => {
    if (packageEndDate && bookingType === 'package') {
      setBookingData(prev => ({ ...prev, checkOut: format(packageEndDate, 'yyyy-MM-dd') }));
    }
  }, [packageEndDate, bookingType]);

  // Update booking data when airport transfer dates change
  useEffect(() => {
    if (arrivalDate) {
      setBookingData(prev => ({ ...prev, arrivalDate: format(arrivalDate, 'yyyy-MM-dd') }));
    }
  }, [arrivalDate]);

  useEffect(() => {
    if (departureDate) {
      setBookingData(prev => ({ ...prev, departureDate: format(departureDate, 'yyyy-MM-dd') }));
    }
  }, [departureDate]);

  const handleBooking = async () => {
    if (!bookingData.firstName || !bookingData.lastName || !bookingData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (bookingType === 'property') {
      if (!checkInDate || !checkOutDate) {
        toast.error('Please select check-in and check-out dates');
        return;
      }
      
      const activeBookings = getActiveRoomBookings();
      if (activeBookings.length === 0) {
        toast.error('Please select at least one room');
        return;
      }

      // Check if all selected rooms are still available
      const unavailableRooms = activeBookings.filter(booking => {
        const room = selectedProperty?.rooms?.find(r => r.id === booking.roomId);
        return !room?.available;
      });

      if (unavailableRooms.length > 0) {
        toast.error('Some selected rooms are no longer available. Please refresh and try again.');
        return;
      }

      if (checkInDate >= checkOutDate) {
        toast.error('Check-out date must be after check-in date');
        return;
      }
    } else if (bookingType === 'package') {
      if (!packageStartDate) {
        toast.error('Please select a start date for your package');
        return;
      }
    }

    // Validate airport transfer details if requested
    if (bookingData.needsAirportTransfer) {
      if (!arrivalDate || !bookingData.arrivalTime) {
        toast.error('Please provide arrival date and time for airport transfer');
        return;
      }
      if (!departureDate || !bookingData.departureTime) {
        toast.error('Please provide departure date and time for airport transfer');
        return;
      }
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = (bookingId: string) => {
    // Booking is now saved to Supabase via PaymentForm
    // Room availability updates can be handled in the future via Supabase triggers
    toast.success('Booking confirmed successfully!');
  };

  const getCurrentAmountDue = () => {
    if (!paymentSchedule) return costs.total;

    if (selectedPaymentTerm === 'full') {
      return costs.total;
    } else {
      return paymentSchedule.depositAmount;
    }
  };

  const bookingDetails = {
    propertyName: selectedProperty?.name || selectedPackage?.name || '',
    propertyLocation: selectedProperty?.location || selectedPackage?.location || '',
    roomName: selectedRoom?.name || 'Package Booking',
    checkIn: bookingType === 'package' 
      ? (packageStartDate ? format(packageStartDate, 'yyyy-MM-dd') : '')
      : (checkInDate ? format(checkInDate, 'yyyy-MM-dd') : ''),
    checkOut: bookingType === 'package'
      ? (packageEndDate ? format(packageEndDate, 'yyyy-MM-dd') : '')
      : (checkOutDate ? format(checkOutDate, 'yyyy-MM-dd') : ''),
    guests: bookingType === 'property' ? getTotalGuests() : bookingData.guests,
    nights: calculateNights(),
    roomPrice: selectedRoom?.price || selectedPackage?.price || 0,
    selectedAmenities: selectedAmenities.map(ba => ({
      amenity: ba.amenity,
      id: ba.amenity.id,
      name: ba.amenity.name,
      price: ba.amenity.price,
      quantity: ba.quantity
    })),
    totalAmount: costs.total,
    // Payment terms
    paymentTerm: selectedPaymentTerm,
    paymentSchedule: paymentSchedule,
    currentAmountDue: getCurrentAmountDue(),
    // Additional fields for Supabase
    propertyId: bookingType === 'property' ? selectedProperty?.id : null,
    roomId: bookingType === 'property' ? selectedRoom?.id : null,
    packageId: bookingType === 'package' ? selectedPackage?.id : null,
    adults: bookingType === 'property' 
      ? Math.max(1, getTotalGuests() - Math.floor(getTotalGuests() * 0.3))
      : Math.max(1, bookingData.guests - Math.floor(bookingData.guests * 0.3)),
    children: bookingType === 'property'
      ? Math.floor(getTotalGuests() * 0.3)
      : Math.floor(bookingData.guests * 0.3),
    specialRequests: bookingData.specialRequests,
    airportTransfer: bookingData.needsAirportTransfer ? {
      arrivalDate: bookingData.arrivalDate,
      arrivalTime: bookingData.arrivalTime,
      arrivalFlightNumber: bookingData.arrivalFlightNumber,
      departureDate: bookingData.departureDate,
      departureTime: bookingData.departureTime,
      departureFlightNumber: bookingData.departureFlightNumber
    } : null
  };

  const customerDetails = {
    name: `${bookingData.firstName} ${bookingData.lastName}`,
    email: bookingData.email,
    phone: `${bookingData.countryCode} ${bookingData.phone}`
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowPayment(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking Details
            </Button>
          </div>
          <PaymentForm
            bookingDetails={bookingDetails}
            customerDetails={customerDetails}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    );
  }

  // Helper functions for room image carousel
  const isVideo = (url: string) => {
    return url.includes('video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  const nextRoomImage = (roomId: string, totalImages: number) => {
    setRoomImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages
    }));
  };

  const prevRoomImage = (roomId: string, totalImages: number) => {
    setRoomImageIndex(prev => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  // Room Image Carousel Component
  const RoomImageCarousel = ({ room }: { room: Room }) => {
    const currentIndex = roomImageIndex[room.id] || 0;
    const images = room.images || [];
    
    if (images.length === 0) {
      return (
        <div className="w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
          <Image className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500 ml-1">No image</span>
        </div>
      );
    }

    return (
      <div className="relative w-24 h-20 rounded-lg overflow-hidden">
        {isVideo(images[currentIndex]) ? (
          <video
            src={images[currentIndex]}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <img
            src={images[currentIndex]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
              onClick={() => prevRoomImage(room.id, images.length)}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-6 w-6 p-0"
              onClick={() => nextRoomImage(room.id, images.length)}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </>
        )}

        {/* Video Play Indicator */}
        {isVideo(images[currentIndex]) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-1">
              <Play className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-1 left-1">
            <Badge variant="secondary" className="bg-black/70 text-white text-xs px-1 py-0">
              {currentIndex + 1}/{images.length}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading booking details...</h1>
            <p className="text-gray-600">Please wait while we load your selection.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error when package not found
  if (packageId && packages.length > 0 && !selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
            <p className="text-gray-600 mb-6">The requested package could not be found.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/packages">
                <Button>Browse Packages</Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline">Browse Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProperty && !selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No booking item selected</h1>
            <p className="text-gray-600 mb-6">Please select a property or package to book.</p>
            <div className="flex gap-4 justify-center">
              <Link to="/packages">
                <Button>Browse Packages</Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline">Browse Properties</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Determine if user is external guest (not staying at property)
  const isExternalGuest = bookingType === 'property' && getActiveRoomBookings().length === 0;
  const maxGuestsForAmenities = bookingType === 'property' ? getTotalGuests() : bookingData.guests;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to={bookingType === 'package' ? '/packages' : '/collections'}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {bookingType === 'package' ? 'Packages' : 'Properties'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {bookingType === 'package' ? selectedPackage?.name : selectedProperty?.name}
                    </h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {bookingType === 'package' 
                          ? selectedPackage?.location || selectedPackage?.destinations?.slice(0, 2).join(', ')
                          : selectedProperty?.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">
                      {bookingType === 'package' ? selectedPackage?.rating : selectedProperty?.rating}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Package Details */}
            {bookingType === 'package' && selectedPackage && (
              <Card>
                <CardHeader>
                  <CardTitle>Package Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Duration:</span>
                      <p className="text-gray-600">{selectedPackage.duration}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Group Size:</span>
                      <p className="text-gray-600">{selectedPackage.groupSize}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Difficulty:</span>
                      <Badge variant="outline" className="ml-2">
                        {selectedPackage.difficulty.charAt(0).toUpperCase() + selectedPackage.difficulty.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <Badge variant="outline" className="ml-2">
                        {selectedPackage.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Package Highlights:</span>
                    <div className="mt-2 space-y-1">
                      {selectedPackage.highlights.slice(0, 5).map((highlight, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Room Selection for Properties */}
            {bookingType === 'property' && selectedProperty && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Rooms & Guests</CardTitle>
                  <p className="text-sm text-gray-600">Choose rooms and specify number of guests. All guests pay the same per person rate.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(selectedProperty.rooms || [])
                    .filter((room: Room) => {
                      const booking = roomBookings.find(b => b.roomId === room.id);
                      // Show room if it has quantity > 0 OR if it's the initially selected room
                      return booking && (booking.quantity > 0 || room.id === roomId);
                    })
                    .map((room: Room) => {
                    const booking = roomBookings.find(b => b.roomId === room.id);
                    if (!booking) return null;

                    const maxCapacity = room.max_guests * booking.quantity;
                    const extraGuests = Math.max(0, booking.guests - maxCapacity);

                    return (
                      <div key={room.id} className={cn(
                        "border rounded-lg p-4",
                        !room.available && "bg-gray-50 border-gray-300"
                      )}>
                        {/* Unavailable Room Warning */}
                        {!room.available && (
                          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center text-red-800">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <span className="font-medium">Room Unavailable</span>
                            </div>
                            <p className="text-red-600 text-sm mt-1">
                              This room is currently unavailable for booking.
                            </p>
                          </div>
                        )}

                        <div className="flex items-start gap-4 mb-4">
                          {/* Room Image Carousel */}
                          <RoomImageCarousel room={room} />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className={cn(
                                  "font-semibold text-lg",
                                  !room.available && "text-gray-500"
                                )}>{room.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    Max {room.maxGuests} guests per room
                                  </span>
                                  {!room.available && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                      Unavailable
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {room.amenities.slice(0, 3).map((amenity: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={cn(
                                  "text-xl font-bold text-green-600",
                                  !room.available && "text-gray-400"
                                )}>${room.price}</p>
                                <p className="text-sm text-gray-500">per night</p>
                                {extraGuests > 0 && room.available && (
                                  <p className="text-xs text-orange-600 mt-1">
                                    {extraGuests} guest{extraGuests !== 1 ? 's' : ''} @ full rate per person
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Room Quantity */}
                          <div>
                            <Label className="text-sm font-medium">Number of Rooms</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateRoomBooking(room.id, 'quantity', booking.quantity - 1)}
                                disabled={booking.quantity <= 0 || !room.available}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{booking.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateRoomBooking(room.id, 'quantity', booking.quantity + 1)}
                                disabled={!room.available || booking.quantity >= getRoomAvailability(room.name)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <span className="text-xs text-gray-500 ml-2">
                                Max: {getRoomAvailability(room.name)} available
                              </span>
                            </div>
                          </div>

                          {/* Guest Count */}
                          {booking.quantity > 0 && room.available && (
                            <div>
                              <Label className="text-sm font-medium">
                                Total Guests
                                {maxCapacity > 0 && (
                                  <span className="text-xs text-gray-500 ml-1">
                                    (Standard: {maxCapacity}, Extra: {extraGuests})
                                  </span>
                                )}
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateRoomBooking(room.id, 'guests', booking.guests - 1)}
                                  disabled={booking.guests <= 0}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-12 text-center font-medium">{booking.guests}</span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateRoomBooking(room.id, 'guests', booking.guests + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {extraGuests > 0 && (
                                <p className="text-xs text-orange-600 mt-1">
                                  {extraGuests} guest{extraGuests !== 1 ? 's' : ''} @ full rate per person
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Add More Rooms Button */}
                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      type="button"
                      onClick={() => setShowAdditionalRooms(!showAdditionalRooms)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {showAdditionalRooms ? 'Hide Additional Rooms' : 'Add Another Room'}
                    </Button>
                    
                    {showAdditionalRooms && (
                      <div className="mt-4 space-y-3">
                        <p className="text-sm text-gray-600 mb-3">Select additional rooms:</p>
                        {(() => {
                          // Group available rooms by name
                          const availableRoomsByName = (selectedProperty.rooms || [])
                            .filter(room => room.available)
                            .reduce((acc, room) => {
                              const existingGroup = acc.find(group => group.name === room.name);
                              if (existingGroup) {
                                existingGroup.availableCount++;
                              } else {
                                acc.push({
                                  name: room.name,
                                  type: room.type,
                                  maxGuests: room.max_guests,
                                  price: room.price,
                                  availableCount: 1,
                                  sampleRoomId: room.id
                                });
                              }
                              return acc;
                            }, [] as Array<{
                              name: string;
                              type: string;
                              maxGuests: number;
                              price: number;
                              availableCount: number;
                              sampleRoomId: string;
                            }>);

                          return availableRoomsByName
                            .filter(roomGroup => {
                              // Only show room types that aren't already selected
                              const existingBooking = roomBookings.find(b => {
                                const room = selectedProperty.rooms?.find(r => r.id === b.roomId);
                                return room && room.name === roomGroup.name;
                              });
                              return !existingBooking || existingBooking.quantity === 0;
                            })
                            .map((roomGroup) => (
                              <div key={roomGroup.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                <div className="flex-1">
                                  <h5 className="font-medium">{roomGroup.name}</h5>
                                  <p className="text-sm text-gray-600">
                                    <Users className="h-3 w-3 inline mr-1" />
                                    Up to {roomGroup.maxGuests} guests • ${roomGroup.price}/night
                                  </p>
                                  <p className="text-xs text-green-600">
                                    {roomGroup.availableCount} room{roomGroup.availableCount !== 1 ? 's' : ''} available
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => {
                                    updateRoomBooking(roomGroup.sampleRoomId, 'quantity', 1);
                                    setShowAdditionalRooms(false);
                                  }}
                                >
                                  Add Room
                                </Button>
                              </div>
                            ));
                        })()}
                        {(() => {
                          const availableRoomsByName = (selectedProperty.rooms || [])
                            .filter(room => room.available)
                            .reduce((acc, room) => {
                              const existingGroup = acc.find(group => group.name === room.name);
                              if (existingGroup) {
                                existingGroup.availableCount++;
                              } else {
                                acc.push({
                                  name: room.name,
                                  type: room.type,
                                  maxGuests: room.max_guests,
                                  price: room.price,
                                  availableCount: 1,
                                  sampleRoomId: room.id
                                });
                              }
                              return acc;
                            }, [] as Array<{
                              name: string;
                              type: string;
                              maxGuests: number;
                              price: number;
                              availableCount: number;
                              sampleRoomId: string;
                            }>);

                          const availableRoomTypes = availableRoomsByName.filter(roomGroup => {
                            const existingBooking = roomBookings.find(b => {
                              const room = selectedProperty.rooms?.find(r => r.id === b.roomId);
                              return room && room.name === roomGroup.name;
                            });
                            return !existingBooking || existingBooking.quantity === 0;
                          });

                          return availableRoomTypes.length === 0;
                        })() && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No additional rooms available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingType === 'property' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            disabled={(date) => date <= (checkInDate || new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {bookingType === 'package' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Trip Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !packageStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {packageStartDate ? format(packageStartDate, "PPP") : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={packageStartDate}
                            onSelect={setPackageStartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {packageEndDate && (
                      <div>
                        <Label>Trip End Date</Label>
                        <div className="p-3 bg-gray-50 border rounded-lg">
                          <div className="flex items-center text-gray-700">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>{format(packageEndDate, "PPP")}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              Auto-calculated
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Based on {selectedPackage?.duration} package duration
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select 
                        value={bookingData.guests.toString()} 
                        onValueChange={(value) => setBookingData({...bookingData, guests: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(Math.min(8, selectedPackage?.maxGuests || 8))].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} Guest{i > 0 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Airport Transfer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="h-5 w-5 mr-2" />
                  Airport Transfer Details
                </CardTitle>
                <p className="text-sm text-gray-600">Help us manage your airport transfers and daily guest movements</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needsTransfer"
                    checked={bookingData.needsAirportTransfer}
                    onChange={(e) => setBookingData({...bookingData, needsAirportTransfer: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="needsTransfer" className="text-sm font-medium">
                    I need airport transfer service
                  </Label>
                </div>

                {bookingData.needsAirportTransfer && (
                  <div className="space-y-6 pt-4 border-t">
                    {/* Arrival Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Arrival Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Arrival Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !arrivalDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {arrivalDate ? format(arrivalDate, "MMM dd") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={arrivalDate}
                                onSelect={setArrivalDate}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label htmlFor="arrivalTime">Arrival Time</Label>
                          <Input
                            id="arrivalTime"
                            type="time"
                            value={bookingData.arrivalTime}
                            onChange={(e) => setBookingData({...bookingData, arrivalTime: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="arrivalFlight">Flight Number (Optional)</Label>
                          <Input
                            id="arrivalFlight"
                            value={bookingData.arrivalFlightNumber}
                            onChange={(e) => setBookingData({...bookingData, arrivalFlightNumber: e.target.value})}
                            placeholder="e.g., KQ101"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Departure Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Departure Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Departure Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !departureDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {departureDate ? format(departureDate, "MMM dd") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={departureDate}
                                onSelect={setDepartureDate}
                                disabled={(date) => date < (arrivalDate || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label htmlFor="departureTime">Departure Time</Label>
                          <Input
                            id="departureTime"
                            type="time"
                            value={bookingData.departureTime}
                            onChange={(e) => setBookingData({...bookingData, departureTime: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="departureFlight">Flight Number (Optional)</Label>
                          <Input
                            id="departureFlight"
                            value={bookingData.departureFlightNumber}
                            onChange={(e) => setBookingData({...bookingData, departureFlightNumber: e.target.value})}
                            placeholder="e.g., KQ102"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start">
                        <Plane className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium">Transfer Service Information</p>
                          <p className="mt-1">Our team will arrange airport pickup and drop-off based on your flight schedule. Transfer costs are included in most packages or available as an add-on service.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Amenities Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Add Amenities</CardTitle>
                <p className="text-sm text-gray-600">Enhance your experience with additional services</p>
              </CardHeader>
              <CardContent>
                <AmenitySelector
                  selectedAmenities={selectedAmenities}
                  onAmenityChange={setSelectedAmenities}
                  isExternalGuest={isExternalGuest}
                  maxGuests={maxGuestsForAmenities}
                />
              </CardContent>
            </Card>

            {/* Payment Terms Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Terms</CardTitle>
                <p className="text-sm text-gray-600">Choose your preferred payment option</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  value={selectedPaymentTerm} 
                  onValueChange={(value: PaymentTerm) => setSelectedPaymentTerm(value)}
                  className="space-y-3"
                >
                  {/* Deposit Option */}
                  <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="deposit" id="deposit" />
                    <div className="flex-1">
                      <Label htmlFor="deposit" className="text-base font-medium cursor-pointer">
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 mr-2 text-blue-600" />
                          30% Deposit Now, 70% Balance Later
                        </div>
                      </Label>
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Non-refundable deposit:</span>
                          <span className="font-medium text-blue-600">
                            ${paymentSchedule?.depositAmount.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due date for deposit:</span>
                          <span className="font-medium">
                            {paymentSchedule ? format(new Date(paymentSchedule.depositDueDate), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Balance amount:</span>
                          <span className="font-medium">
                            ${paymentSchedule?.balanceAmount.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Due date for balance:</span>
                          <span className="font-medium">
                            {paymentSchedule ? format(new Date(paymentSchedule.balanceDueDate), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Terms:</strong> 30% non-refundable deposit payable within 7 days after booking confirmation. 
                          The balance of 70% is payable latest 30 days prior to arrival.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Payment Option */}
                  <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="full" id="full" />
                    <div className="flex-1">
                      <Label htmlFor="full" className="text-base font-medium cursor-pointer">
                        <div className="flex items-center">
                          <Banknote className="h-4 w-4 mr-2 text-green-600" />
                          Pay Full Amount Now
                        </div>
                      </Label>
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Total amount:</span>
                          <span className="font-medium text-green-600">
                            ${costs.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment due:</span>
                          <span className="font-medium">Immediately</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-800">
                          <strong>Note:</strong> Full payment is required immediately for bookings within 30 days of arrival. 
                          For earlier bookings, you can choose to pay only the deposit now.
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {/* Payment Schedule Summary */}
                {paymentSchedule && selectedPaymentTerm === 'deposit' && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Payment Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-blue-900">First Payment</p>
                          <p className="text-sm text-blue-700">30% Deposit</p>
                          <p className="text-xs text-blue-600">
                            Due: {format(new Date(paymentSchedule.depositDueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-900">
                            ${paymentSchedule.depositAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-blue-600">Non-refundable</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Second Payment</p>
                          <p className="text-sm text-gray-700">70% Balance</p>
                          <p className="text-xs text-gray-600">
                            Due: {format(new Date(paymentSchedule.balanceDueDate), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${paymentSchedule.balanceAmount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(paymentSchedule.balanceDueDate) <= new Date() ? 'Due immediately' : 'Due later'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={bookingData.firstName}
                      onChange={(e) => setBookingData({...bookingData, firstName: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={bookingData.lastName}
                      onChange={(e) => setBookingData({...bookingData, lastName: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={bookingData.countryCode} 
                      onValueChange={(value) => setBookingData({...bookingData, countryCode: value})}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {countryCodes.map((country) => (
                          <SelectItem key={`${country.code}-${country.country}`} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                      placeholder="Enter phone number"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {countryCodes.find(c => c.code === bookingData.countryCode)?.name || 'Country'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    placeholder="Any special requests or dietary requirements?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Item:</span>
                    <span className="font-medium">
                      {bookingType === 'package' ? selectedPackage?.name : selectedProperty?.name}
                    </span>
                  </div>
                  
                  {bookingType === 'property' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Dates:</span>
                        <span>
                          {checkInDate && checkOutDate
                            ? `${('nights' in costs ? costs.nights : 0) || 0} night${('nights' in costs ? costs.nights : 0) !== 1 ? 's' : ''}`
                            : 'Select dates'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Guests:</span>
                        <span>{getTotalGuests()}</span>
                      </div>
                      
                      {getActiveRoomBookings().length > 0 && bookingType === 'property' && (
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium mb-1">Selected Rooms:</p>
                          {'roomBreakdown' in costs && costs.roomBreakdown?.map((room: RoomBreakdownItem, index: number) => (
                            <div key={index} className="text-xs text-gray-600 mb-1">
                              <div className="flex justify-between">
                                <span>{room.roomName} x{room.quantity}</span>
                                <span>{room.guests} guests</span>
                              </div>
                              {/* No extra guest fees with per person pricing */}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  
                  {bookingType === 'package' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Duration:</span>
                        <span>{selectedPackage?.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dates:</span>
                        <span>
                          {packageStartDate && packageEndDate
                            ? `${format(packageStartDate, 'MMM dd')} - ${format(packageEndDate, 'MMM dd, yyyy')}`
                            : 'Select start date'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Guests:</span>
                        <span>{bookingData.guests} guest{bookingData.guests !== 1 ? 's' : ''}</span>
                      </div>
                    </>
                  )}

                  {/* Airport Transfer Summary */}
                  {bookingData.needsAirportTransfer && (
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-medium mb-1 flex items-center">
                        <Plane className="h-3 w-3 mr-1" />
                        Airport Transfer:
                      </p>
                      {arrivalDate && bookingData.arrivalTime && (
                        <div className="text-xs text-gray-600 mb-1">
                          <div className="flex justify-between">
                            <span>Arrival:</span>
                            <span>{format(arrivalDate, 'MMM dd')} at {bookingData.arrivalTime}</span>
                          </div>
                          {bookingData.arrivalFlightNumber && (
                            <div className="flex justify-between">
                              <span>Flight:</span>
                              <span>{bookingData.arrivalFlightNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {departureDate && bookingData.departureTime && (
                        <div className="text-xs text-gray-600 mb-1">
                          <div className="flex justify-between">
                            <span>Departure:</span>
                            <span>{format(departureDate, 'MMM dd')} at {bookingData.departureTime}</span>
                          </div>
                          {bookingData.departureFlightNumber && (
                            <div className="flex justify-between">
                              <span>Flight:</span>
                              <span>{bookingData.departureFlightNumber}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Amenities Summary */}
                  {selectedAmenities.length > 0 && (
                    <div className="border-t pt-2 mt-2">
                      <p className="text-sm font-medium mb-1">Selected Amenities:</p>
                      {selectedAmenities.map((amenity, index) => (
                        <div key={index} className="text-xs text-gray-600 mb-1">
                          <div className="flex justify-between">
                            <span>{amenity.amenity.name} x{amenity.quantity}</span>
                            <span>${amenity.totalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  {bookingType === 'package' ? (
                    <div className="flex justify-between text-sm">
                      <span>Package ({bookingData.guests} guests)</span>
                      <span>${('basePrice' in costs ? costs.basePrice : 0)?.toFixed(2) || '0.00'}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Accommodation ({getTotalGuests()} guests × {'nights' in costs ? costs.nights : 0} nights)</span>
                        <span>${('baseRate' in costs ? costs.baseRate : 0)?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-4">
                        ${selectedRoom?.price || 0}/person/night
                      </div>
                    </>
                  )}
                  {costs.amenitiesTotal > 0 && (
                    <div className="flex justify-between text-sm text-purple-600">
                      <span>Amenities</span>
                      <span>${costs.amenitiesTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Service fee (10%)</span>
                    <span>${costs.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes ({bookingType === 'package' ? '12%' : '15%'})</span>
                    <span>${costs.taxes.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Current Amount Due */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-gray-900">${costs.total.toFixed(2)}</span>
                  </div>
                  
                  {selectedPaymentTerm === 'deposit' && paymentSchedule && (
                    <>
                      <div className="flex justify-between text-sm text-blue-600">
                        <span>Deposit Due Now (30%)</span>
                        <span className="font-semibold">${paymentSchedule.depositAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Balance Due Later (70%)</span>
                        <span>${paymentSchedule.balanceAmount.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg text-green-600">
                        <span>Amount Due Now</span>
                        <span>${paymentSchedule.depositAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  {selectedPaymentTerm === 'full' && (
                    <div className="flex justify-between font-semibold text-lg text-green-600">
                      <span>Amount Due Now</span>
                      <span>${costs.total.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 mt-6"
                  onClick={handleBooking}
                  disabled={
                    !bookingData.firstName || 
                    !bookingData.lastName || 
                    !bookingData.email ||
                    (bookingType === 'property' && (!checkInDate || !checkOutDate)) ||
                    (bookingType === 'property' && getActiveRoomBookings().length === 0) ||
                    (bookingType === 'package' && !packageStartDate) ||
                    (bookingData.needsAirportTransfer && (!arrivalDate || !bookingData.arrivalTime || !departureDate || !bookingData.departureTime))
                  }
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {selectedPaymentTerm === 'deposit' ? 'Pay Deposit Now' : 'Pay Full Amount Now'}
                </Button>

                <div className="flex items-center justify-center text-xs text-gray-500 mt-3">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Secure payment • 30 days prior to arrival: 50% of the balance amount is forfeited
                  • 29–15 days prior to arrival: 75% of the balance amount is forfeited
                  • 14 days prior to arrival and no-shows: 100% of the balance amount is forfeited.
                  • NB: Rates are subject to availability at time of booking.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}