import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Download, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  date: string;
  category: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

const categories = ['all', 'Wildlife', 'Landscapes', 'Culture', 'Accommodations', 'Activities'];

export default function MediaCenter() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  // Safely format a date string — returns a fallback when invalid
  const formatDateSafe = (dateStr?: string | null) => {
    if (!dateStr) return 'Unknown date';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Unknown date';
    try {
      return format(d, 'MMM d, yyyy');
    } catch (err) {
      return 'Unknown date';
    }
  };

  const fetchMediaItems = useCallback(async () => {
    try {
      setLoading(true);
      const params: { category?: string } = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const res = await api.get('/media/media-center', { params });
      setMediaItems(res.data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast({
        title: 'Error',
        description: 'Failed to load media content. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, toast]);

  useEffect(() => {
    fetchMediaItems();
  }, [fetchMediaItems]);

  const handleMediaClick = (item: MediaItem) => {
    setSelectedMedia(item);
    setShowDialog(true);
  };

  const handleDownload = async (url: string, title: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = title.replace(/\s+/g, '-').toLowerCase() + (url.endsWith('.mp4') ? '.mp4' : '.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading media:', error);
      toast({
        title: 'Error',
        description: 'Failed to download media. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Media Center</h1>
      
      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : mediaItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <div className="relative">
              {/* Thumbnail */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="mr-2"
                  onClick={() => handleMediaClick(item)}
                >
                  {item.type === 'video' ? <Play className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => handleDownload(item.url, item.title)}
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>

              {/* Featured badge */}
              {item.featured && (
                <Badge className="absolute top-2 right-2">
                  Featured
                </Badge>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{item.category}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateSafe(item.date || item.created_at || item.updated_at)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {selectedMedia && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedMedia.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedMedia.type === 'video' ? (
                <div className="relative pt-[56.25%]">
                  <iframe
                    src={selectedMedia.url}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              )}
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {selectedMedia.description}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}