import { useState } from 'react';
import { useReviews } from '@/hooks/useReviews';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

// Minimal local Review type (supabase-types removed)
type Review = {
  id?: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  created_at?: string;
  is_featured?: boolean;
  users?: { full_name?: string | null; email?: string } | null;
};

export default function ReviewsSection() {
  const { reviews, loading, error } = useReviews(); // Fetch all approved reviews
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guest Reviews
            </h2>
            <p className="text-xl text-gray-600">
              What our guests say about their safari experiences
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Guest Reviews
            </h2>
            <p className="text-xl text-gray-600">
              What our guests say about their safari experiences
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">Error loading reviews</p>
            <p className="text-gray-600 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Filter for featured reviews or show first few
  const featuredReviews = reviews.filter(review => review.is_featured);
  const displayReviews = (featuredReviews.length > 0 ? featuredReviews : reviews).slice(0, 6);
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Guest Reviews
          </h2>
          <p className="text-xl text-gray-600">
            What our guests say about their safari experiences
          </p>
          {reviews.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {reviews.length} reviews • Average rating: {averageRating} ⭐
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Share Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Share Your Safari Experience</DialogTitle>
                  <DialogDescription>
                    Tell future travelers about your adventure. Your feedback helps us improve our safaris.
                  </DialogDescription>
                </DialogHeader>
                <ReviewForm
                  onSuccess={closeDialog}
                  onCancel={closeDialog}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {displayReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showUser={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No reviews available yet. Be the first to share your safari experience!
          </div>
        )}

        {reviews.length > 6 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Showing {displayReviews.length} of {reviews.length} reviews
            </p>
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              View all reviews →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
