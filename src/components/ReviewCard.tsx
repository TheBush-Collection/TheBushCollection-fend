import { Star, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface ReviewCardProps {
  review: Review;
  showUser?: boolean;
}

export default function ReviewCard({ review, showUser = true }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-semibold text-lg text-gray-900">{review.title}</h4>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          )}

          {/* User and Date */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              {showUser && (
                <>
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {review.users?.full_name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Featured badge */}
            {review.is_featured && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
