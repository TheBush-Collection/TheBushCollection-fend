
import { Star, User, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

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
  const [expanded, setExpanded] = useState(false);
  const COMMENT_LIMIT = 120;
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-[#d9732b] fill-current' : 'text-[#e6dcc7]'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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
    <Card className="h-full bg-[#2a2623]">
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
            <h4 className="font-semibold text-lg text-[#fff]">{review.title}</h4>
          )}

          {/* Comment with Read More */}
          {review.comment && (
            <>
              <p className="text-[#e6dcc7] text-sm leading-relaxed">
                {expanded || review.comment.length <= COMMENT_LIMIT
                  ? review.comment
                  : review.comment.slice(0, COMMENT_LIMIT) + '...'}
              </p>
              {review.comment.length > COMMENT_LIMIT && (
                <button
                  className="text-xs font-semibold text-[#d9732b] hover:underline focus:outline-none mt-1"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </>
          )}

          {/* User and Date */}
          <div className="flex items-center justify-between pt-2 border-t border-[#e6dcc7]">
            <div className="flex items-center gap-2">
              {showUser && (
                <>
                  <div className="w-8 h-8 bg-[#efe7d1] rounded-full flex items-center justify-center">
                    {/* show initials if we have a name/email, otherwise generic user icon */}
                    {review.users?.full_name || review.users?.email ? (
                      <span className="text-xs font-semibold text-[#d9732b]">
                        {getInitials(review.users?.full_name || (review.users?.email?.split('@')[0] ?? null))}
                      </span>
                    ) : (
                      <User className="h-4 w-4 text-[#d9732b]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#fff]">
                      {review.users?.full_name || (review.users?.email ? review.users.email.split('@')[0] : 'Null')}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#d7cdb8]">
                      <Calendar className="h-3 w-3" />
                      {formatDate(review.created_at)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Featured badge */}
            {review.is_featured && (
              <Badge variant="secondary" className="bg-[#efe7d1] text-[#5C3B22] border border-[#d7cdb8]">
                Featured
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
