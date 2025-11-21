import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Calendar, AlertTriangle, AlertCircle, CheckCircle, User, DollarSign, Trash2, MapPin, Users, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBackendBookings } from '@/hooks/useBackendBookings';
import { useReviews } from '@/hooks/useReviews';
import ReviewSubmission from '@/components/ReviewSubmission';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user } = useAuth();
  const { bookings } = useBackendBookings();
  const { reviews } = useReviews();
  const [activeTab, setActiveTab] = useState('bookings');

  // Backend returns bookings for authenticated user only
  const userBookings = bookings;

  const getUpcomingBookings = () => {
    const today = new Date();
    return userBookings.filter(booking =>
      new Date(booking.check_in) > today && booking.status !== 'cancelled'
    );
  };

  const getPastBookings = () => {
    const today = new Date();
    return userBookings.filter(booking =>
      new Date(booking.check_out) < today
    );
  };

  const getTotalSpent = () => {
    return userBookings
      .filter(booking => booking.status !== 'cancelled')
      .reduce((total, booking) => total + (booking.total_amount || 0), 0);
  };

  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();
  const totalSpent = getTotalSpent();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access your dashboard.</p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your safari bookings and adventures
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              <div className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{pastBookings.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{userBookings.length}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-full">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews & Feedback</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <BookingsTab />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <ReviewSubmission />
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-sm text-gray-900">{user.user_metadata?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-2">Booking Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Bookings</div>
                      <div className="font-medium">{userBookings.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Upcoming</div>
                      <div className="font-medium text-blue-600">{upcomingBookings.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Completed</div>
                      <div className="font-medium text-green-600">{pastBookings.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Total Spent</div>
                      <div className="font-medium text-green-600">${totalSpent.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function BookingsTab() {
  const { bookings, cancelBooking } = useBackendBookings();
  const [cancellationLoading, setCancellationLoading] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState<string | null>(null);
  const [downloadingReceipt, setDownloadingReceipt] = useState<string | null>(null);

  const today = new Date();

  const upcomingBookings = bookings.filter(booking =>
    new Date(booking.check_in) > today && booking.status !== 'cancelled'
  );

  const pastBookings = bookings.filter(booking =>
    new Date(booking.check_out) < today
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      deposit_paid: { color: 'bg-orange-100 text-orange-800', label: 'Deposit Paid' },
      fully_paid: { color: 'bg-green-100 text-green-800', label: 'Fully Paid' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    };

    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellationLoading(bookingId);
      await cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      setShowCancelConfirm(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error('Cancel booking error:', error);
    } finally {
      setCancellationLoading(null);
    }
  };

  const handleDownloadReceipt = async (booking: any) => {
    try {
      setDownloadingReceipt(booking._id);
      const response = await fetch(`/api/bookings/receipt/${booking.bookingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }

      const data = await response.json();
      
      // Create receipt object for download
      const receiptContent = `
BOOKING RECEIPT
=====================================
Date Generated: ${new Date().toLocaleDateString()}

BOOKING INFORMATION
Booking ID: ${booking.bookingId}
Confirmation #: ${booking.confirmationNumber}
Status: ${booking.status}

CUSTOMER DETAILS
Name: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone || 'N/A'}

STAY INFORMATION
Type: ${booking.bookingType === 'property' ? 'Property' : 'Package'}
Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}
Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}
Nights: ${booking.nights}
Guests: ${booking.totalGuests} (${booking.adults} adults, ${booking.children} children)

COST BREAKDOWN
Base Price: $${(booking.costs?.basePrice || 0).toFixed(2)}
Amenities: $${(booking.costs?.amenitiesTotal || 0).toFixed(2)}
Subtotal: $${(booking.costs?.subtotal || 0).toFixed(2)}
Service Fee: $${(booking.costs?.serviceFee || 0).toFixed(2)}
Taxes: $${(booking.costs?.taxes || 0).toFixed(2)}
TOTAL: $${(booking.costs?.total || 0).toFixed(2)}

PAYMENT STATUS
Amount Paid: $${booking.amountPaid?.toFixed(2) || '0.00'}
Payment Term: ${booking.paymentTerm}
Status: ${booking.status}

=====================================
Thank you for your booking!
      `;

      // Download as text file
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
      element.setAttribute('download', `receipt_${booking.bookingId}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast.success('Receipt downloaded successfully');
    } catch (error) {
      toast.error('Failed to download receipt');
      console.error('Receipt download error:', error);
    } finally {
      setDownloadingReceipt(null);
    }
  };

  const BookingCard = ({ booking, isPast }: { booking: any; isPast: boolean }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{booking.property_name || booking.package_name || 'Booking'}</h3>
            <p className="text-sm text-gray-600">Booking ID: {booking.bookingId}</p>
          </div>
          <div>{getStatusBadge(booking.status)}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Check-in: {new Date(booking.check_in).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Check-out: {new Date(booking.check_out).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            {booking.guests && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
            )}
            <div className="flex items-center text-sm font-semibold text-green-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>${(booking.total_amount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {!isPast && booking.status !== 'cancelled' && (
          <div className="flex gap-2">
            {showCancelConfirm === booking._id ? (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCancelBooking(booking._id)}
                  disabled={cancellationLoading === booking._id}
                  className="flex-1"
                >
                  {cancellationLoading === booking._id ? 'Cancelling...' : 'Confirm Cancel'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCancelConfirm(null)}
                  disabled={cancellationLoading === booking._id}
                  className="flex-1"
                >
                  Keep Booking
                </Button>
              </div>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadReceipt(booking)}
                  disabled={downloadingReceipt === booking._id}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {downloadingReceipt === booking._id ? 'Downloading...' : 'Receipt'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCancelConfirm(booking._id)}
                  className="text-red-600 hover:text-red-700 flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}

        {isPast && booking.status !== 'cancelled' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadReceipt(booking)}
              disabled={downloadingReceipt === booking._id}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadingReceipt === booking._id ? 'Downloading...' : 'Receipt'}
            </Button>
            <Link to={`/property/${booking.property_id}`} className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                View Property & Review
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start your journey by booking a property or package today</p>
          <Link to="/">
            <Button>Browse Properties</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Trips</h2>
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600">
              No upcoming bookings. <Link to="/" className="text-blue-600 hover:underline">Browse properties</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} isPast={false} />
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Past Trips</h2>
        {pastBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-600">
              No past bookings yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pastBookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} isPast={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
