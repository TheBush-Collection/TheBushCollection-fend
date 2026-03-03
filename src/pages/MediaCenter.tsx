import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Play, Download, Eye, Calendar, Search, Sparkles, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

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
  const [searchTerm, setSearchTerm] = useState('');
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
      const raw = res.data || [];
      const items = (raw as Array<Record<string, unknown>>).map((it) => {
        const obj = it as Record<string, unknown>;
        const id = String(obj['_id'] ?? obj['id'] ?? '');
        const type = String(obj['type'] ?? 'image') as 'image' | 'video';
        const title = String(obj['title'] ?? '');
        const description = String(obj['description'] ?? '');
        const fileUrl = String(obj['fileUrl'] ?? obj['url'] ?? '');
        const thumbnail = String(obj['thumbnailUrl'] ?? obj['thumbnail'] ?? fileUrl ?? '');
        const date = String(obj['createdAt'] ?? obj['date'] ?? new Date().toISOString());
        const category = String(obj['category'] ?? '');
        const featured = Boolean(obj['featured'] ?? false);

        return {
          id,
          type,
          title,
          description,
          url: fileUrl,
          thumbnail,
          date,
          category,
          featured,
        } as MediaItem;
      });
      setMediaItems(items);
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

  // Determine how to render a video URL: iframe for embeds, <video> for direct files
  const getVideoEmbed = (url?: string) => {
    if (!url) return { kind: 'unknown' as const };
    const u = url.trim();

    // YouTube
    const ytMatch = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
    if (ytMatch) return { kind: 'iframe' as const, src: `https://www.youtube.com/embed/${ytMatch[1]}` };

    // Vimeo
    const vMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (vMatch) return { kind: 'iframe' as const, src: `https://player.vimeo.com/video/${vMatch[1]}` };

    // Facebook watch or videos
    if (/facebook\.com|fb\.watch/i.test(u)) {
      // Use Facebook video plugin which accepts the full URL as href
      const encoded = encodeURIComponent(u);
      return { kind: 'iframe' as const, src: `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0` };
    }

    // Instagram post (p/ or reel/)
    const igMatch = u.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/i);
    if (igMatch) return { kind: 'iframe' as const, src: `https://www.instagram.com/p/${igMatch[1]}/embed` };

    // TikTok
    const ttMatch = u.match(/tiktok\.com\/(?:@[^/]+\/video\/)?(\d+)/i);
    if (ttMatch) return { kind: 'iframe' as const, src: `https://www.tiktok.com/embed/v2/${ttMatch[1]}` };

    // Direct video file
    if (/\.(mp4|webm|ogg|mov|mkv)(\?|$)/i.test(u)) {
      return { kind: 'video' as const, src: u };
    }

    // If already an embed URL or player URL, keep as iframe
    if (/embed|player\.vimeo|youtube\.com\/embed/i.test(u)) return { kind: 'iframe' as const, src: u };

    // Fallback: treat as iframe attempt
    return { kind: 'iframe' as const, src: u };
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

  /* ── filtered items ── */
  const filteredItems = mediaItems.filter(item => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (
        !item.title.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q) &&
        !item.category.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const featuredItems = filteredItems.filter(i => i.featured);

  return (
    <div className="min-h-screen bg-[#292524]">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Ken Burns background */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: [1, 1.08] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://obbrmdtdcevckizykfzu.supabase.co/storage/v1/object/sign/images/Mwazaro-1.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMmQyZDM5YS1mOGUyLTQwNGItOTJlMy1mZjc1ZGJjYmQ5ZDUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvTXdhemFyby0xLmpwZyIsImlhdCI6MTc2MzYyOTcwNCwiZXhwIjoxNzk1MTY1NzA0fQ.Ihw6Bmfj9cx-SsrMzKzH0bt-4Qej5J0sfxw-JgKWllA')`
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#292524]/60 via-[#292524]/40 to-[#292524]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-[1px] bg-[#c9a961]" />
              <span className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">Visual Stories</span>
              <div className="w-10 h-[1px] bg-[#c9a961]" />
            </div>

            <h1 className="text-5xl md:text-7xl font-extralight text-white/90 leading-[1.05] mb-6">
              Media <span className="italic text-[#c9a961]/80">Center</span>
            </h1>

            <p className="text-white/35 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Browse photos and videos captured across our safaris, lodges, and retreats throughout East Africa
            </p>
          </motion.div>
        </div>

        {/* Vertical accent */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <span className="text-[9px] tracking-[0.5em] uppercase text-white/10 font-light [writing-mode:vertical-lr] rotate-180">
            Est. 1983 — The Bush Collection
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SEARCH + CATEGORY FILTERS
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 -mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#322e2b] border border-white/[0.06] p-6 md:p-8"
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                aria-label="Search media"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search media, locations or tags…"
                className="w-full h-13 pl-12 pr-5 bg-transparent text-white/80 border border-white/[0.08] hover:border-white/[0.15] focus:border-[#c9a961]/40 placeholder:text-white/15 text-sm font-light tracking-wide outline-none transition-all duration-300"
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-10 px-5 text-xs tracking-[0.15em] uppercase font-light transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#c9a961] text-[#292524]'
                      : 'border border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED MEDIA (if any)
      ═══════════════════════════════════════════ */}
      {featuredItems.length > 0 && (
        <section className="py-24 bg-[#292524]">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-14"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-[1px] bg-[#c9a961]" />
                <span className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">Editor's Picks</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extralight text-white/90 leading-tight">
                Featured <span className="italic text-[#c9a961]/80">Gallery</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredItems.slice(0, 4).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative cursor-pointer overflow-hidden bg-[#322e2b] border border-white/[0.04] hover:border-[#c9a961]/20 transition-all duration-500"
                  onClick={() => handleMediaClick(item)}
                >
                  <div className="relative h-72 md:h-80 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/90 via-[#292524]/20 to-transparent" />

                    {/* Type indicator */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a961] text-[#292524] text-[9px] tracking-[0.2em] uppercase font-medium">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    </div>

                    {item.type === 'video' && (
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-[9px] tracking-[0.15em] uppercase font-light">
                          <Play className="w-3 h-3" /> Video
                        </span>
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#292524]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                      <button className="w-12 h-12 border border-white/20 hover:border-[#c9a961]/60 flex items-center justify-center text-white/70 hover:text-[#c9a961] transition-all duration-300">
                        {item.type === 'video' ? <Play className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      <button
                        className="w-12 h-12 border border-white/20 hover:border-[#c9a961]/60 flex items-center justify-center text-white/70 hover:text-[#c9a961] transition-all duration-300"
                        onClick={(e) => { e.stopPropagation(); handleDownload(item.url, item.title); }}
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-light text-white/90 mb-1 line-clamp-1">{item.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-white/30 text-xs font-light">{item.category}</span>
                        <span className="flex items-center gap-1 text-white/25 text-xs font-light">
                          <Calendar className="w-3 h-3" />
                          {formatDateSafe(item.date || item.created_at || item.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          ALL MEDIA GRID
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#322e2b]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-[1px] bg-[#c9a961]" />
                <span className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">Full Archive</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extralight text-white/90 leading-tight">
                All <span className="italic text-[#c9a961]/80">Media</span>
              </h2>
            </div>
            <p className="text-white/25 text-sm font-light">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in collection
            </p>
          </motion.div>

          {loading ? (
            /* ── Loading skeleton ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#292524] border border-white/[0.04] animate-pulse">
                  <div className="h-52 bg-white/[0.03]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/[0.04] w-3/4" />
                    <div className="h-3 bg-white/[0.03] w-full" />
                    <div className="h-3 bg-white/[0.03] w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="group cursor-pointer bg-[#292524] border border-white/[0.04] hover:border-[#c9a961]/20 transition-all duration-500"
                  onClick={() => handleMediaClick(item)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#292524]/70 via-transparent to-transparent" />

                    {/* Type badge */}
                    {item.type === 'video' && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-[8px] tracking-[0.15em] uppercase font-light">
                          <Play className="w-2.5 h-2.5" /> Video
                        </span>
                      </div>
                    )}

                    {/* Featured */}
                    {item.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#c9a961] text-[#292524] text-[8px] tracking-[0.15em] uppercase font-medium">
                          <Sparkles className="w-2.5 h-2.5" /> Featured
                        </span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-[#292524]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center gap-3">
                      <button className="w-10 h-10 border border-white/20 hover:border-[#c9a961]/60 flex items-center justify-center text-white/70 hover:text-[#c9a961] transition-all duration-300">
                        {item.type === 'video' ? <Play className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        className="w-10 h-10 border border-white/20 hover:border-[#c9a961]/60 flex items-center justify-center text-white/70 hover:text-[#c9a961] transition-all duration-300"
                        onClick={(e) => { e.stopPropagation(); handleDownload(item.url, item.title); }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-sm font-light text-white/80 mb-2 line-clamp-1 group-hover:text-[#c9a961] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-white/20 text-xs font-light line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="h-[1px] bg-white/[0.06] mb-4" />
                    <div className="flex items-center justify-between">
                      <span className="text-white/25 text-[10px] tracking-[0.15em] uppercase font-light">{item.category}</span>
                      <span className="flex items-center gap-1 text-white/20 text-[10px] font-light">
                        <Calendar className="w-3 h-3" />
                        {formatDateSafe(item.date || item.created_at || item.updated_at)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ── Empty state ── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-lg mx-auto">
                <div className="mx-auto mb-6 w-12 h-12 border border-white/[0.06] flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white/15" />
                </div>
                <h3 className="text-2xl font-extralight text-white/70 mb-3">No media found</h3>
                <p className="text-white/25 text-sm font-light leading-relaxed mb-8">
                  Try adjusting your search or selecting a different category
                </p>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                  className="h-12 px-8 bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PREVIEW DIALOG / LIGHTBOX
      ═══════════════════════════════════════════ */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {selectedMedia && (
          <DialogContent className="max-w-5xl bg-[#1c1917] border border-white/[0.06] p-0 overflow-hidden">
            {/* Close is handled by DialogContent's built-in X */}
            <div>
              {/* Media */}
              <div className="relative bg-black">
                {selectedMedia.type === 'video' ? (
                  (() => {
                    const embed = getVideoEmbed(selectedMedia.url);
                    if (embed.kind === 'iframe') {
                      return (
                        <div className="relative pt-[56.25%]">
                          <iframe
                            src={embed.src}
                            className="absolute top-0 left-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                    if (embed.kind === 'video') {
                      return (
                        <video
                          controls
                          src={embed.src}
                          className="w-full h-auto max-h-[70vh] object-contain"
                        />
                      );
                    }
                    return (
                      <div className="flex items-center justify-center h-64 text-white/30 text-sm font-light">
                        Unable to preview this video
                      </div>
                    );
                  })()
                ) : (
                  <img
                    src={selectedMedia.url || selectedMedia.thumbnail}
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                )}
              </div>

              {/* Info bar */}
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-light text-white/90 mb-1">{selectedMedia.title}</h3>
                    <div className="flex items-center gap-3 text-white/25 text-xs font-light">
                      <span className="tracking-[0.15em] uppercase">{selectedMedia.category}</span>
                      <span className="w-1 h-1 rounded-full bg-white/15" />
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateSafe(selectedMedia.date || selectedMedia.created_at || selectedMedia.updated_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedMedia.url, selectedMedia.title)}
                    className="h-10 px-5 border border-white/[0.08] hover:border-[#c9a961]/40 text-white/40 hover:text-[#c9a961] text-xs tracking-[0.15em] uppercase font-light transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
                {selectedMedia.description && (
                  <p className="text-white/30 text-sm font-light leading-relaxed">{selectedMedia.description}</p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ═══════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#292524] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-[1px] bg-[#c9a961]" />
              <span className="text-[#c9a961] text-[10px] tracking-[0.5em] uppercase font-medium">Experience Africa</span>
              <div className="w-10 h-[1px] bg-[#c9a961]" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extralight text-white/90 leading-tight mb-5">
              Inspired by What <span className="italic text-[#c9a961]/80">You See</span>?
            </h2>
            <p className="text-white/30 text-base font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Turn these moments into your own story. Browse our curated safari packages and luxury properties.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/packages"
                className="h-13 px-10 bg-[#c9a961] hover:bg-[#b8943d] text-[#292524] text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Safari Packages</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                to="/collections"
                className="h-13 px-10 border border-white/[0.12] hover:border-white/[0.25] text-white/60 hover:text-white/80 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>View Properties</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="bg-[#1c1917] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-[1px] bg-[#c9a961]" />
                <span className="text-[#c9a961] text-[10px] tracking-[0.4em] uppercase font-medium">Media Center</span>
              </div>
              <p className="text-white/25 text-sm font-light leading-relaxed">
                A visual journey through Africa's most spectacular safari destinations and luxury retreats.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-white/25 hover:text-[#c9a961] text-sm font-light transition-colors duration-300">About Us</Link></li>
                <li><Link to="/collections" className="text-white/25 hover:text-[#c9a961] text-sm font-light transition-colors duration-300">Properties</Link></li>
                <li><Link to="/packages" className="text-white/25 hover:text-[#c9a961] text-sm font-light transition-colors duration-300">Safari Packages</Link></li>
                <li><Link to="/contact" className="text-white/25 hover:text-[#c9a961] text-sm font-light transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium mb-5">Contact</h4>
              <ul className="space-y-3 text-white/25 text-sm font-light">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen.</li>
                <li>P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/15 text-xs font-light tracking-wide">
              &copy; {new Date().getFullYear()} the bush collection. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-[1px] bg-[#c9a961]/30" />
              <span className="text-[#c9a961]/30 text-[8px] tracking-[0.4em] uppercase font-light">Est. 1983</span>
              <div className="w-6 h-[1px] bg-[#c9a961]/30" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}