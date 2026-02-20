import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Users,
  Globe,
  Award,
  Heart,
  Camera,
  Compass,
  Shield,
  TreePine,
  GraduationCap,
  Handshake,
  Eye,
  Target,
  Quote,
  Leaf,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Globe, label: 'Countries', value: 'Kenya & Tanzania' },
    { icon: Award, label: 'Years of Heritage', value: '40+' },
    { icon: Users, label: 'Record Visitors in 2023', value: 'Historic High' },
    { icon: Star, label: 'Average Rating', value: '4.8' }
  ];

  const team = [
    {
      name: 'Andre Du Plessis',
      role: 'Founder & CEO',
      image: '',
      bio: 'Safari enthusiast with 20+ years of African travel experience'
    },
    {
      name: 'James Mwangi',
      role: 'Head of IT',
      image: 'https://res.cloudinary.com/dfaakg2ds/image/upload/v1769681709/James_wfhj6t.jpg',
      bio: 'Expert in luxury travel and wildlife conservation'
    },
    {
      name: 'Linda Otieno',
      role: 'Head of Reservations & Sales',
      image: 'https://res.cloudinary.com/dfaakg2ds/image/upload/v1771577013/linda2_k2ipao.jpg',
      bio: 'A passionate hotelier dedicated to creating memorable guest experiences while driving sales growth and operational excellence.'
    },
    {
      name: 'Paul',
      role: 'General Manager',
      image: '',
      bio: 'Born in Kenya, passionate about sharing African culture'
    },
    {
      name: 'Molly Obondi',
      role: 'Sales and reservations',
      image: 'https://res.cloudinary.com/dfaakg2ds/image/upload/v1769681709/Molly_uutxyb.jpg',
      bio: 'With a genuine love for hospitality, takes pride in connecting guests with the perfect stay experience.'
    },
    {
      name: 'Christine Mutie',
      role: 'Procurement Officer',
      image: 'https://res.cloudinary.com/dfaakg2ds/image/upload/v1769681710/Christine_z6qwzi.jpg',
      bio: 'Born in Kenya, passionate about sharing African culture'
    },
    {
      name: 'Timsheldon Oure',
      role: 'IT Support Officer',
      image: 'https://res.cloudinary.com/dfaakg2ds/image/upload/v1769681709/Tim_ueubsn.jpg',
      bio: 'Born in Kenya, passionate about sharing African culture'
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const values = [
    {
      icon: Handshake,
      title: 'Community Partnerships',
      description: 'All of our properties – now and in the future – are founded in partnership with local communities. This is critical for the long-term preservation of our primary asset – our wildlife.'
    },
    {
      icon: GraduationCap,
      title: 'Educating the Next Generation',
      description: 'In 2025 each of our properties will be required to enter into educating the next generation of conservationists.'
    },
    {
      icon: Heart,
      title: 'Direct Community Impact',
      description: 'All donor funding goes directly to schools and communities – because we believe education is at the forefront of conservation.'
    },
    {
      icon: CheckCircle,
      title: 'Recognized Programmes',
      description: 'We maintain externally recognized conservation and community programmes that hold us to the highest standards of environmental and social responsibility.'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen">

      {/* Hero Section */}
      <motion.section
        className="relative py-32 md:py-44 text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/images/16.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="text-sm font-medium tracking-wider uppercase">Over 40 Years of Safari Heritage</span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={letterVariants}
            initial="hidden"
            animate="visible"
          >
            {'Experience is Everything'.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Spanning the breadth of Kenya and Tanzania, The Bush Collection brings together a group of
            affordable lodges &amp; camps — all in optimal locations — that deliver exceptional hospitality with
            heartfelt warmth and authenticity.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <Link to="/packages">
                <Button size="lg" className="bg-[#333033] hover:bg-[#ebe9d8] hover:text-[#333033] border-[#333033] hover:border-[#ebe9d8] border-2 px-8 py-3 text-base">
                  Explore Our Packages
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-[#ebe9d8] border-[#333033] text-[#333033] hover:bg-[#333033] hover:text-[#ebe9d8] px-8 py-3 text-base">
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-[#ebe9d8]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ icon: Icon, label, value }, index) => (
              <motion.div
                key={index}
                className="bg-[#333033] p-6 rounded-lg shadow-sm"
                variants={staggerItem}
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-[#ebe9d8] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-[#333033]" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#ebe9d8] mb-2">{value}</div>
                <div className="text-[#ebe9d8] text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Who We Are Section */}
      <section className="py-20 bg-[#333033]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-4 text-[#ebe9d8]/70 text-sm font-medium tracking-widest uppercase"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <TreePine className="h-4 w-4" />
                Our Heritage
              </motion.div>
              <motion.h2
                className="text-3xl md:text-5xl font-bold text-[#ebe9d8] mb-8 leading-tight"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'Who We Are'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.h2>
              <div className="space-y-5 text-[#ebe9d8]/90 leading-relaxed text-lg">
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  A family-developed safari brand with <span className="text-[#ebe9d8] font-semibold">deep heritage in tourism and conservation</span> in East Africa. Our business is derived from over 40 years of safari camp and lodge hospitality, with additional experience in the luxury destination sector.
                </motion.p>
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  Our new and exciting venture comes at a time when the safari sector has never been so popular, with a <span className="text-[#ebe9d8] font-semibold">record number of travellers</span> visiting East Africa in 2023.
                </motion.p>
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  We are growing our Collection from not only our owned product, but welcoming in independent brands that hold the same service and quality ethic as we do — and who can capitalise on our exceptional market reach. We aim to develop <span className="text-[#ebe9d8] font-semibold italic">'tourism-conservation partnerships'</span>.
                </motion.p>
              </div>
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={staggerItem}>
                  <Badge className="bg-[#ebe9d8] text-[#333033] px-3 py-1">40+ Years Heritage</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-[#ebe9d8] text-[#333033] px-3 py-1">Family Brand</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-[#ebe9d8] text-[#333033] px-3 py-1">Tourism-Conservation Partnerships</Badge>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInRight}
            >
              <div className="bg-[#ebe9d8] p-4 rounded-2xl">
                <img
                  src="/images/PNG-LOGO (1).png"
                  alt="The Bush Collection"
                  className="rounded-xl shadow-lg"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 bg-[#ebe9d8] border-[#333033] border-2 p-4 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center">
                  <Compass className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <div className="font-semibold text-[#333033]">40+ Years</div>
                    <div className="text-sm text-[#333033]">Safari Heritage</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-[#ebe9d8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Vision */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <Card className="h-full bg-[#333033] border-none overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-green-400 to-green-600 rounded-l-lg"></div>
                <CardContent className="p-8 md:p-10">
                  <motion.div
                    className="w-16 h-16 bg-[#ebe9d8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 5 }}
                  >
                    <Eye className="h-8 w-8 text-[#333033]" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#ebe9d8] mb-4">Our Vision</h3>
                  <p className="text-[#ebe9d8]/90 text-lg leading-relaxed">
                    To be the preferred choice for travelers seeking <span className="font-semibold text-[#ebe9d8]">comfort, authenticity and unforgettable experiences</span> in every destination we serve.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInRight}
            >
              <Card className="h-full bg-[#333033] border-none overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-lg"></div>
                <CardContent className="p-8 md:p-10">
                  <motion.div
                    className="w-16 h-16 bg-[#ebe9d8] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: -5 }}
                  >
                    <Target className="h-8 w-8 text-[#333033]" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#ebe9d8] mb-4">Our Mission</h3>
                  <p className="text-[#ebe9d8]/90 text-lg leading-relaxed">
                    To provide exceptional, personalized experiences in comfortable, welcoming environments, where every guest feels <span className="font-semibold text-[#ebe9d8]">at home and connected to the beauty of nature</span>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote Section */}
      <motion.section
        className="py-20 bg-[#333033] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-[#ebe9d8] rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-2 border-[#ebe9d8] rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Quote className="h-16 w-16 text-[#ebe9d8]/20 mx-auto" />
          </motion.div>
          <motion.blockquote
            className="text-xl md:text-2xl lg:text-3xl text-[#ebe9d8] font-light italic leading-relaxed mb-10"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            "It is essential to me that the communities we collaborate with are actively engaged in safeguarding our wildlife, viewing it as a <span className="font-semibold not-italic text-[#ebe9d8]">valuable opportunity</span> rather than a mere commodity."
          </motion.blockquote>
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#ebe9d8]/50 to-transparent mb-4"></div>
            <p className="text-[#ebe9d8] font-bold text-xl tracking-wide">Andre du Plessis</p>
            <p className="text-[#ebe9d8]/60 text-sm font-medium tracking-widest uppercase">Proud Owner</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Expressing Our Values Section */}
      <motion.section
        className="py-20 bg-[#ebe9d8]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <motion.div
              className="inline-flex items-center gap-2 mb-4 text-[#333033]/60 text-sm font-medium tracking-widest uppercase"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Leaf className="h-4 w-4" />
              What Drives Us
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-[#333033] mb-6"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {'Expressing Our Values'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              className="text-xl text-[#333033]/80 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Conservation, community, and education are not just values — they are the foundation of everything we build.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {values.map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-[#333033] border-none">
                  <CardContent className="p-8">
                    <div className="flex items-start">
                      <div className="w-14 h-14 bg-[#ebe9d8] rounded-2xl flex items-center justify-center mr-5 flex-shrink-0">
                        <Icon className="h-7 w-7 text-[#333033]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#ebe9d8] mb-3">{title}</h3>
                        <p className="text-[#ebe9d8]/85 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 bg-[#333033]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-[#ebe9d8] mb-4"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {'Meet Our Team'.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              className="text-xl text-[#ebe9d8]"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Passionate professionals dedicated to creating your perfect safari experience
            </motion.p>
          </motion.div>

          {/* Founder & CEO - Centered at top */}
          <motion.div
            className="flex justify-center mb-12 bg-[#333033]"
            variants={staggerItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{
                y: -5,
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
              }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-transparent text-center hover:shadow-lg transition-shadow w-[280px] h-[300px] flex flex-col group overflow-hidden relative">
                {/* Full-cover image as background */}
                <img
                  src={team[0].image}
                  alt={team[0].name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-30"
                />
                <CardContent className="p-6 flex flex-col h-full relative z-10">
                  {/* Overlay content (hidden by default, appears on hover) - glass gradient, left aligned */}
                  <div className="absolute inset-0 p-6 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 bg-gradient-to-br from-black/50 via-black/30 to-black/10 backdrop-blur-md text-white flex items-start">
                    <div className="max-w-[260px]">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{team[0].name}</h3>
                      <p className="text-sm md:text-base font-medium mb-4 text-white/90">{team[0].role}</p>
                      <p className="text-sm leading-relaxed text-white/90">{team[0].bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Auto-scrolling team members */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex animate-scroll"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {/* Original team members */}
              {team.slice(1).map((member, index) => (
                <motion.div
                  key={`original-${index}`}
                  variants={staggerItem}
                  className="flex-shrink-0 mx-4"
                  whileHover={{
                    y: -3,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-transparent text-center hover:shadow-lg transition-shadow w-[280px] h-[300px] flex flex-col group overflow-hidden relative">
                    {/* Full-cover image as background */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-30"
                    />
                    <CardContent className="p-6 flex flex-col h-full relative z-10">
                      <div className="absolute inset-0 p-6 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 bg-gradient-to-br from-black/50 via-black/30 to-black/10 backdrop-blur-md text-white flex items-start">
                          <div className="max-w-[260px]">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{member.name}</h3>
                            <p className="text-sm md:text-base font-medium mb-4 text-white/90">{member.role}</p>
                            <p className="text-sm leading-relaxed text-white/90">{member.bio}</p>
                          </div>
                        </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {/* Duplicated team members for seamless loop */}
              {team.slice(1).map((member, index) => (
                <motion.div
                  key={`duplicate-${index}`}
                  variants={staggerItem}
                  className="flex-shrink-0 mx-4"
                  whileHover={{
                    y: -3,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-transparent text-center hover:shadow-lg transition-shadow w-[280px] h-[300px] flex flex-col group overflow-hidden relative">
                    {/* Full-cover image as background */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-out group-hover:opacity-30"
                    />
                    <CardContent className="p-6 flex flex-col h-full relative z-10">
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:bg-white/20 group-hover:backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">{member.name}</h3>
                        <p className="text-orange-600 font-medium mb-2 text-sm break-words">{member.role}</p>
                        <p className="text-gray-600 text-xs break-words max-w-[220px]">{member.bio}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Conservation Partnership Section */}
      <motion.section
        className="py-20 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img
            src="https://www.azolifesciences.com/image-handler/ts/20220215094450/ri/1000/src/images/Article_Images/ImageForArticle_714_16449362895935733.jpg"
            alt="Wildlife conservation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/85 to-green-900/90"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-4 text-green-200/80 text-sm font-medium tracking-widest uppercase"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <TreePine className="h-4 w-4" />
                Conservation & Community
              </motion.div>
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-8 text-white"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'Tourism-Conservation'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
                <br />
                {'Partnerships'.split('').map((letter, index) => (
                  <motion.span
                    key={`line2-${index}`}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.h2>
              <motion.div
                className="space-y-5 text-green-50/90 text-lg leading-relaxed"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={staggerItem}>
                  All of our properties – now and in the future – are <span className="font-semibold text-white">founded in partnership with local communities</span>. This is critical for the long-term preservation of our primary asset – our wildlife.
                </motion.p>
                <motion.p variants={staggerItem}>
                  In 2025, each of our properties will be required to enter into <span className="font-semibold text-white">educating the next generation of conservationists</span>. All donor funding goes directly to schools and communities – because we believe education is at the forefront of conservation.
                </motion.p>
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-1">Community Partnerships</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-1">Education First</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-1">Wildlife Protection</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white/20 text-white backdrop-blur-sm border border-white/30 px-3 py-1">Recognized Programmes</Badge>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right side - impact highlights */}
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
            >
              {[
                { icon: BookOpen, title: 'Education', text: 'Funding goes directly to schools and communities to nurture future conservationists.' },
                { icon: Handshake, title: 'Local Partnerships', text: 'Every property is built on a foundation of collaboration with the communities around it.' },
                { icon: Shield, title: 'Recognized Standards', text: 'Externally recognized conservation and community programmes ensure accountability.' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-green-50/80 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-[#ebe9d8]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-[#333033] mb-6"
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {'Ready for Your African Adventure?'.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </motion.h2>
          <motion.p
            className="text-xl text-[#333033]/80 mb-10 leading-relaxed"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Join travelers from around the world who have experienced the magic of East Africa with a brand built on 40 years of heritage, authenticity, and heart.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem}>
              <Link to="/packages">
                <Button size="lg" className="bg-[#333033] hover:bg-[#ebe9d8] border-[#333033] hover:border-[#333033] hover:border py-3 text-white hover:text-[#333033]">
                  View Safari Packages
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-[#ebe9d8] hover:bg-[#333033] border-[#333033] hover:border-[#ebe9d8]  px-8 py-3">
                  Plan Custom Safari
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-gray-900 text-white py-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem}>
              <h3 className="text-xl font-bold mb-4">Safari Tours</h3>
              <p className="text-gray-400 mb-4">
                Creating unforgettable safari experiences across Africa's most spectacular destinations.
              </p>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/packages" className="hover:text-white">Safari Packages</Link></li>
                <li><Link to="/collections" className="hover:text-white">Properties</Link></li>
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h4 className="font-semibold mb-4">Destinations</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Tanzania</li>
                <li>Kenya</li>
              </ul>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>+254 116072343</li>
                <li>info@thebushcollection.africa</li>
                <li>42 Claret Close, Silanga Road, Karen.</li>
                <li>P.O BOX 58671-00200, Nairobi</li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p>&copy; 2024 The Bush Collection. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}