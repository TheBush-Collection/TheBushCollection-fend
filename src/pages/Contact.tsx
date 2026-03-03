import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send, Calendar, Users, HelpCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import FAQModal from '@/components/FAQModal';
import { subscribeToMailchimp, parseFullName } from '@/lib/mailchimp';
import { motion } from 'framer-motion';

/* ─── animation helpers ─── */
const fade = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    travelDates: '',
    groupSize: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const { firstName, lastName } = parseFullName(formData.name);
      const result = await subscribeToMailchimp({
        email: formData.email,
        firstName,
        lastName,
        phone: formData.phone,
        company: formData.subject,
        tags: formData.interests ? formData.interests.split(',').map(t => t.trim()) : [],
      });
      if (result.success) {
        toast.success("Thank you! We'll get back to you within 24 hours.");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '', travelDates: '', groupSize: '', interests: '' });
      } else {
        toast.error(result.error || 'Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', details: ['+254 116 072 343'], sub: 'Mon – Fri, 9 AM – 6 PM EAT' },
    { icon: Mail, title: 'Email', details: ['info@thebushcollection.africa', 'reservations@thebushcollection.africa'], sub: 'We respond within 24 hours' },
    { icon: MapPin, title: 'Office', details: ['42 Claret Close', 'Silanga Road, Karen'], sub: 'Visit us by appointment' },
    { icon: Clock, title: 'Hours', details: ['Mon – Fri: 9 AM – 6 PM', 'Sat: 10 AM – 4 PM'], sub: 'Closed on Sundays' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0ea]">

      {/* ─── Floating Newsletter Button ─── */}
      <button
        onClick={() => setShowSubscribeModal(true)}
        aria-label="Subscribe to newsletter"
        className="fixed right-6 bottom-6 z-50 flex items-center gap-3 bg-[#c9a961] text-[#1c1917] px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
      >
        <Mail className="w-4 h-4 group-hover:rotate-[-8deg] transition-transform" />
        <span className="font-medium text-sm tracking-wide uppercase">Newsletter</span>
      </button>

      {/* ─── Subscribe Modal ─── */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSubscribeModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-50 w-full max-w-lg px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-4 right-8 text-white/60 hover:text-white text-2xl z-20 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="bg-[#1c1917] border border-[#c9a961]/30 rounded-sm p-8 text-white shadow-2xl">
              <div className="w-10 h-[2px] bg-[#c9a961] mb-6" />
              <h3 className="text-2xl font-light tracking-wide mb-2">Stay Connected</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                Exclusive safari offers, travel insights, and curated experiences — delivered to your inbox.
              </p>
              <NewsletterCard onClose={() => setShowSubscribeModal(false)} />
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mt-4">
                We respect your privacy · Unsubscribe anytime
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-[#1c1917] overflow-hidden">
        {/* layered texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-[10px] uppercase tracking-[0.35em] text-[#c9a961] mb-6"
          >
            Begin the Conversation
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extralight text-white tracking-tight leading-[0.9]"
          >
            Get in
            <span className="block font-light italic text-[#c9a961]">Touch</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-white/50 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            Our team of safari specialists is here to craft your dream African journey — from the first inquiry to the final sunset.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <ChevronDown className="w-5 h-5 text-[#c9a961]/40 mx-auto animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CONTACT CARDS
      ══════════════════════════════════════════════════ */}
      <section className="relative -mt-16 z-20 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map(({ icon: Icon, title, details, sub }, i) => (
              <motion.div
                key={title}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-sm border border-[#e8e0d4] p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-10 h-10 rounded-full bg-[#f5f0ea] flex items-center justify-center mb-4 group-hover:bg-[#c9a961]/10 transition-colors">
                  <Icon className="w-4 h-4 text-[#c9a961]" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#292524]/40 mb-2">{title}</p>
                <div className="space-y-0.5 mb-3">
                  {details.map((d, idx) => (
                    <p key={idx} className="text-[#292524] text-sm font-medium">{d}</p>
                  ))}
                </div>
                <p className="text-xs text-[#292524]/40">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FORM + SIDEBAR
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* section header */}
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="w-12 h-[2px] bg-[#c9a961] mb-6" />
            <h2 className="text-3xl md:text-4xl font-light text-[#292524] tracking-tight">
              Send Us a Message
            </h2>
            <p className="mt-3 text-[#292524]/50 max-w-xl">
              Whether you're planning a honeymoon safari, a family expedition, or a corporate retreat — we'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* ── form (2 cols) ── */}
            <motion.div
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Full Name <span className="text-[#c9a961]">*</span>
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      required
                      className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Email Address <span className="text-[#c9a961]">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      required
                      className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254 ..."
                      className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Subject
                    </label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm text-[#292524]">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="booking">Booking Question</SelectItem>
                        <SelectItem value="custom">Custom Safari Request</SelectItem>
                        <SelectItem value="group">Group Booking</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="travelDates" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Preferred Travel Dates
                    </label>
                    <Input
                      id="travelDates"
                      value={formData.travelDates}
                      onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                      placeholder="e.g., July 2026"
                      className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="groupSize" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                      Group Size
                    </label>
                    <Select value={formData.groupSize} onValueChange={(value) => setFormData({ ...formData, groupSize: value })}>
                      <SelectTrigger className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm text-[#292524]">
                        <SelectValue placeholder="Number of travellers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo traveller</SelectItem>
                        <SelectItem value="2">2 guests</SelectItem>
                        <SelectItem value="3-4">3 – 4 guests</SelectItem>
                        <SelectItem value="5-8">5 – 8 guests</SelectItem>
                        <SelectItem value="9+">9+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="interests" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                    Safari Interests
                  </label>
                  <Input
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="e.g., Big Five, Photography, Cultural experiences"
                    className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-[10px] uppercase tracking-[0.2em] text-[#292524]/50 mb-2">
                    Message <span className="text-[#c9a961]">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your dream safari..."
                    rows={5}
                    required
                    className="bg-[#f5f0ea]/50 border-[#e8e0d4] rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20 text-[#292524] placeholder:text-[#292524]/30 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-[#292524] text-white px-10 py-3.5 rounded-sm text-sm tracking-wide uppercase hover:bg-[#1c1917] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            </motion.div>

            {/* ── sidebar ── */}
            <motion.div
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="space-y-8"
            >
              {/* quick actions */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#292524]/40 mb-4">Quick Links</p>
                <div className="space-y-3">
                  <Link to="/packages" className="group flex items-center gap-3 py-3 border-b border-[#e8e0d4] hover:border-[#c9a961] transition-colors">
                    <Calendar className="w-4 h-4 text-[#c9a961]" />
                    <span className="text-sm text-[#292524] group-hover:text-[#c9a961] transition-colors flex-1">Browse Safari Packages</span>
                    <ArrowRight className="w-3 h-3 text-[#292524]/20 group-hover:text-[#c9a961] transition-colors" />
                  </Link>
                  <Link to="/collections" className="group flex items-center gap-3 py-3 border-b border-[#e8e0d4] hover:border-[#c9a961] transition-colors">
                    <MapPin className="w-4 h-4 text-[#c9a961]" />
                    <span className="text-sm text-[#292524] group-hover:text-[#c9a961] transition-colors flex-1">View Safari Properties</span>
                    <ArrowRight className="w-3 h-3 text-[#292524]/20 group-hover:text-[#c9a961] transition-colors" />
                  </Link>
                  <button className="group w-full flex items-center gap-3 py-3 border-b border-[#e8e0d4] hover:border-[#c9a961] transition-colors text-left">
                    <Users className="w-4 h-4 text-[#c9a961]" />
                    <span className="text-sm text-[#292524] group-hover:text-[#c9a961] transition-colors flex-1">Request Group Quote</span>
                    <ArrowRight className="w-3 h-3 text-[#292524]/20 group-hover:text-[#c9a961] transition-colors" />
                  </button>
                  <FAQModal
                    trigger={
                      <button className="group w-full flex items-center gap-3 py-3 border-b border-[#e8e0d4] hover:border-[#c9a961] transition-colors text-left">
                        <HelpCircle className="w-4 h-4 text-[#c9a961]" />
                        <span className="text-sm text-[#292524] group-hover:text-[#c9a961] transition-colors flex-1">Frequently Asked Questions</span>
                        <ArrowRight className="w-3 h-3 text-[#292524]/20 group-hover:text-[#c9a961] transition-colors" />
                      </button>
                    }
                  />
                </div>
              </div>

              {/* emergency */}
              <div className="bg-[#292524] rounded-sm p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-4 h-4 text-[#c9a961]" />
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#c9a961]">24 / 7 Emergency Line</p>
                </div>
                <p className="text-2xl font-light tracking-wide mb-2">+254 116 072 343</p>
                <p className="text-xs text-white/40 leading-relaxed">
                  For guests on active safari bookings requiring immediate on-ground assistance.
                </p>
              </div>

              {/* trust bar */}
              <div className="bg-[#f5f0ea] rounded-sm p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#292524]/40 mb-3">Why Choose Us</p>
                <ul className="space-y-2.5">
                  {['40+ years of safari heritage', '24-hour response guarantee', 'Bespoke itinerary crafting', 'On-ground support across East Africa'].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#292524]/70">
                      <span className="w-1 h-1 rounded-full bg-[#c9a961] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MAP
      ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f0ea]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="w-12 h-[2px] bg-[#c9a961] mb-6" />
            <h2 className="text-3xl md:text-4xl font-light text-[#292524] tracking-tight">
              Visit Our Office
            </h2>
            <p className="mt-3 text-[#292524]/50">
              42 Claret Close · Silanga Road · Karen, Nairobi
            </p>
          </motion.div>

          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="overflow-hidden rounded-sm border border-[#e8e0d4] shadow-sm"
          >
            <iframe
              src="https://maps.google.com/maps?width=600&height=400&hl=en&q=The%20Bush%20Collection&t=&z=14&ie=UTF8&iwloc=B&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              className="w-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
              allowFullScreen
            />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#292524] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a961] mb-6">
              Ready to Begin?
            </p>
            <h2 className="text-3xl md:text-5xl font-extralight text-white tracking-tight leading-tight mb-6">
              Let's craft your<br />
              <span className="italic font-light text-[#c9a961]">perfect safari</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
              Our expert team is standing by to create an unforgettable African journey tailored exclusively for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+254116072343"
                className="inline-flex items-center justify-center gap-2 bg-[#c9a961] text-[#1c1917] px-8 py-3.5 rounded-sm text-sm uppercase tracking-wide hover:bg-[#d4b56e] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call +254 116 072 343
              </a>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-sm text-sm uppercase tracking-wide hover:border-[#c9a961] hover:text-[#c9a961] transition-colors"
              >
                Explore Packages
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="bg-[#1c1917] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-light tracking-wide mb-4">The Bush Collection</h3>
              <p className="text-white/30 text-sm leading-relaxed">
                Curating extraordinary safari experiences across East Africa's most spectacular landscapes.
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Navigate</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Safari Packages', to: '/packages' },
                  { label: 'Properties', to: '/collections' },
                  { label: 'About Us', to: '/about' },
                  { label: 'Contact', to: '/contact' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-white/40 hover:text-[#c9a961] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Destinations</p>
              <ul className="space-y-2.5 text-sm text-white/40">
                <li>Kenya</li>
                <li>Tanzania</li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Contact</p>
              <ul className="space-y-2.5 text-sm text-white/40">
                <li>+254 116 072 343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road</li>
                <li>Karen, Nairobi</li>
                <li>P.O BOX 58671-00200</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} The Bush Collection. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/20 hover:text-white/40 cursor-pointer transition-colors">Privacy</span>
              <span className="text-xs text-white/20 hover:text-white/40 cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Newsletter Sub-component ─── */
function NewsletterCard({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email || !email.includes('@')) return toast.error('Enter a valid email');
    setLoading(true);
    try {
      const res = await subscribeToMailchimp({ email });
      if (res.success) {
        toast.success('Subscribed — check your inbox');
        setEmail('');
        onClose?.();
      } else {
        toast.error(res.error || 'Subscription failed');
      }
    } catch (err) {
      console.error('Subscribe error:', err);
      toast.error('Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handle} className="flex gap-2">
      <Input
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-sm focus:border-[#c9a961] focus:ring-[#c9a961]/20"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#c9a961] text-[#1c1917] px-5 py-2 rounded-sm text-sm font-medium tracking-wide hover:bg-[#d4b56e] transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? '...' : 'Subscribe'}
      </button>
    </form>
  );
}