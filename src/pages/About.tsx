import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Globe, Award, Heart, Camera, Compass, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Users, label: 'Happy Travelers', value: '1,000+' },
    { icon: Globe, label: 'Destinations', value: '3+' },
    { icon: Award, label: 'Years Experience', value: '2+' },
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
      image: 'https://westus31-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=194147&inputFormat=jpeg&cs=fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!UHvAJHRZv0uHtY6cWKy5LhPq4UG_8gRHvcdyi-WzL1rWc8fM8bbUQaApuV5hXGy_%2Fitems%2F01GBRSVX6E3BPKML4XKBCKVKAYJSIMVK2V%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiIyNGMwN2I1MC01OTc0LTRiYmYtODdiNS04ZTljNThhY2I5MmUiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4MzA1NjAwIn0.B_dTR2Xl9MsMGk4SjyraLmtng55917bKu43amr2QBN-iPGxox4vUHi1xkfxgy85cPl58bRkj-xuG3P8g2tp97RHD6vhhJbDbQ2dRt9_AwujqMIhaFd3PGvG0mXaZCO8GCsiJ_qyznHaZXpVS95vltH7o7WCnObH0dw3XpxgEeoa49GCQhZ9THVlA8z2ybrG-5iYHZ07yRtJlQ2_ZtRfymNpGXmyO2BCrnHxXU8m2Qs5a99x3uSDnp3ZCxEFBfHW-igBMmREZzQ4frDlSm5y3FRm5iGXaBpnaUmBUqcFUXPK9O8MELq5041qhJfEFbp0HSSLijp84WbDh5hBzM_rAU8ynhahWk0sMvj1lkLmN2ge-3KHCSVHf81T4t8e_xg2q88dL-NEKD60Fcjb7dEqucG3hYxBIB2e1pfSqf-Wjen51qtk0U0A9_r-Q1DXnga44678QP97LIVAH7b1ttmqi__iu3jzUN2-gDxT_dNeYPA5ANU7O-fGopQXc3Gyus-7W.hLrn1URfkgQOLej6T7p-qrgKQCHVOHmX2n-P48patkA%26version%3DPublished&cb=63903813516&encodeFailures=1&width=503&height=755',
      bio: 'Expert in luxury travel and wildlife conservation'
    },
    {
      name: 'Linda Ogutu',
      role: 'Head of Reservations & Sales',
      image: 'https://westus31-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=194147&inputFormat=jpeg&cs=fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!UHvAJHRZv0uHtY6cWKy5LhPq4UG_8gRHvcdyi-WzL1rWc8fM8bbUQaApuV5hXGy_%2Fitems%2F01GBRSVX5VQCDHUL3LOFCJSAFQ5ZIOJ2FZ%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiIyNGMwN2I1MC01OTc0LTRiYmYtODdiNS04ZTljNThhY2I5MmUiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4MzA1NjAwIn0.zXNHsNj2FrsrdG3SkQGgvdTTJ9_Wunya-3x1Of9yU-wG8SL1xVwXIwPDZ9-MHoSFRx-zF1HMtTFpu68dmOY-88MyHuehehdJ28T9_20qS90X5Rb0LGg___KoDIfAGtMlIMOpSkuZcGKTA1edFYfkCHfEl0MzXmNJr8-qWl3Zo7OPW9QwWlG3mIuyBNjZXMgwtYIDXzXb41iEKNV1cntufWqxCx9rPTfBUg2vf-52xXlGLuJPmjYNrdlukEEFXpVbIg4a_sJe6LtrVLwU9qbrMgVsLwuQ3EcnbzR-IyNrugHTeWW3WqoR0Cog8EhT9nL4snm8NAZgQn8NxlpMYQDVJ1lWtX8mjGqgXvyVeWeHYy42GfgK3hdJp_duZvTmJGz9NEm0y0S4xbtzCz6JgLIUrL--OkGKN4mNX1ZLBG2aSMtthccYI46j_P4y9N0zCc3qVhnQ0lNHPQyasKeCch8Fgv_bgwk6Nic8g9MrrVJaFk0CQNFpOxMmua7mCxXfElKu.3J5D6cWsIQ-jdvx-lo5_1_rKeev9tnljuejVVz6Qe4c%26version%3DPublished&cb=63903809112&encodeFailures=1&width=503&height=755',
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
      image: 'https://westus31-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=194147&inputFormat=jpeg&cs=fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!UHvAJHRZv0uHtY6cWKy5LhPq4UG_8gRHvcdyi-WzL1rWc8fM8bbUQaApuV5hXGy_%2Fitems%2F01GBRSVX2NLUTGCVORNVAYVNOYXFEM5ZEY%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiIyNGMwN2I1MC01OTc0LTRiYmYtODdiNS04ZTljNThhY2I5MmUiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4MzA1NjAwIn0.0kdb0J2rJWUe2v0BWJTOFtoG8Jg3mmixxsEGyUpwryubqTiMNTqfBwf3GziWEHa2jJPPdLWe2Ool-ksO_428mvPAzeA6DRBE74AZ8dgLIAw5m5JI22jX6E07DmiAblDKRMHyWO-9869_GA5G5zGiZDyfAbqM9pc0Nq31tv74WRWwjfcdRZFLJqqK5R-8dUJKH9qymHxcuCpfq-OQPQaGYdgzkcg7ZNVbztmySmoFHRa9OTnAzat5ROdpnaDepXDLNqk94xbX2q2-1nfFo7RBDqKxOhArgO_yltVFzhiEwFU99bAv_jHHsWYqScKWhRXSXl6UY84ssGmvz_s0GgqZmB683vYc3aMW65P8Ya80bdUJ1KywPCp_VVXCViT3yVTBjKCVmtgMQj9BI0kOKaRyMWdN-CQ_6EMaIKb1_yH7Loh1jZw7dUtzcR10ryRiPoIDtvbfKSs-5goDUK1ig1Gr3P8bPJsXgLCofUNc_QA6fhyvGoQ6H_awSxf3j-Zj2LJy.b6cCga4D8IPI-XTGFrlj01IIprapiqmeGo6Ixb6g9jE%26version%3DPublished&cb=63903809112&encodeFailures=1&width=503&height=755',
      bio: 'With a genuine love for hospitality, takes pride in connecting guests with the perfect stay experience.'
    },
    {
      name: 'Christine',
      role: 'Procurement Officer',
      image: 'https://westus31-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=194147&inputFormat=jpeg&cs=fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!UHvAJHRZv0uHtY6cWKy5LhPq4UG_8gRHvcdyi-WzL1rWc8fM8bbUQaApuV5hXGy_%2Fitems%2F01GBRSVX7BMEAP7OOQGJB2K6SUJIWIBVHV%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiIyNGMwN2I1MC01OTc0LTRiYmYtODdiNS04ZTljNThhY2I5MmUiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4MzA1NjAwIn0.E2zDvGWCGB_qeOlNwsuR0gvqniJWE7GrCCXxfVqN6l7IB1yXFdJpqTqFF-Y6i_PVFKH9oofCJSPFRuJEWmwF_OfUZkhuYgmpqZN_fOp9tnMcfs_32en0FQwr8ASzzCnXdZ_q3icZGavClLO4f07nqvXHNK6MTwJwZpBV7TZy_fAobmcjWZqDjfcJ8SPhyL0bGGh2PhkNqxrHYqGToRmYy8JLVn9EdyvAE7dFFUfNULu8SIOkWSidUQirwRG_CXgD6OYM2sAK5aQrcbJ2rxpJCXLKnUHD___oOtNxMxtW56n_e2YAyrR0M_ShNip-MxOTjsHtgIRamweWB-g-F1B6S_wKM9SRcDCOuXPdeLZKR8jEhNzRW13ddH5092IK5DgjwGIny3kC-8Fo0ZYIjBHZHSUFNGgx7oVg6KJHvLwMg_0wgu_nRAcdiFGcn6-z_JWsLWLuF86v2e48FLHfUHFi0Y9a7i2JU4K8FCKyH8p9PLLsVSzjSEIE5UO9nO2qNUDu.kCt977tEq3aP4HsVzdFlF-fzokM0AVqfMqm7T-O_qpI%26version%3DPublished&cb=63903809112&encodeFailures=1&width=503&height=755',
      bio: 'Born in Kenya, passionate about sharing African culture'
    },
    {
      name: 'Timsheldon',
      role: 'IT Support Officer',
      image: 'https://westus31-mediap.svc.ms/transform/thumbnail?provider=spo&farmid=194147&inputFormat=jpeg&cs=fFNQTw&docid=https%3A%2F%2Fmy.microsoftpersonalcontent.com%2F_api%2Fv2.0%2Fdrives%2Fb!UHvAJHRZv0uHtY6cWKy5LhPq4UG_8gRHvcdyi-WzL1rWc8fM8bbUQaApuV5hXGy_%2Fitems%2F01GBRSVX3D7YAWS4K76ND25RTQL7X642OJ%3Ftempauth%3Dv1e.eyJzaXRlaWQiOiIyNGMwN2I1MC01OTc0LTRiYmYtODdiNS04ZTljNThhY2I5MmUiLCJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvbXkubWljcm9zb2Z0cGVyc29uYWxjb250ZW50LmNvbUA5MTg4MDQwZC02YzY3LTRjNWItYjExMi0zNmEzMDRiNjZkYWQiLCJleHAiOiIxNzY4MzA1NjAwIn0.lF9j-wzYG6_hhVB0jwS0LQXa5eJEE1SErr8d1-oCdwjkOXLyc9UgtU4V8UoaftR6IbTIG0NAubliY6iHrSiqQlsFN_TzGZHMPNWBoNCourknpKySI-byNsoO67qmG7QX_bGG2YVgZC2T1XpO3DYzLq2FsRpGyxoPOinWEI-LGWN4N86OS6EpNOM2v0i6o91mG1cyOPnVHqqhWODTu9JRgLVYZHucvblSk5IS5wwmLFinKqT0vvbswXtlRehe5aGM20YwzGM_eH1NegtPMeTaXAIHbB9lmRcWPyHRwqK4OEURdhFritV3zF6f8K72gq0XTNnBD4_zrBsgyFtrVchw4hDKR1t3GryZ6fcPd_RaAPYmt34wtwYXuqKCo84wWJkdALaw4-FidoZD1lEnIzDZmu4AXponr952W-AXJmgrxr5G5dc1vWwo3lIH4o835uYO28bZ71CnaeboYCy_I2B3c2yV2zO-cEIhHfjTAJRTj7TYlZ_S2p3hA92oR54av_mP.kUmm9t2j-2pSTOyEAVheHWYhESz0GHvz_WZew44OWHE%26version%3DPublished&cb=63903809112&encodeFailures=1&width=503&height=755',
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

  // Text morphing variants
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
      icon: Heart,
      title: 'Conservation First',
      description: 'We support local conservation efforts and sustainable tourism practices that protect wildlife and ecosystems.'
    },
    {
      icon: Users,
      title: 'Community Impact',
      description: 'Our tours directly benefit local communities through employment, cultural exchange, and economic development.'
    },
    {
      icon: Camera,
      title: 'Authentic Experiences',
      description: 'We create genuine, immersive experiences that connect you with the real Africa beyond typical tourist attractions.'
    },
    {
      icon: Shield,
      title: 'Safety & Quality',
      description: 'Your safety is our priority. We maintain the highest standards in accommodations, transportation, and guides.'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen">
      
      {/* Hero Section */}
<motion.section
  className="relative py-24 text-white overflow-hidden"
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
    {/* Optional overlay for better text readability */}
    <div className="absolute inset-0 bg-black/50"></div>
  </div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
    <motion.h1
      className="text-5xl md:text-6xl font-bold mb-6"
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
      className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-8"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      Spanning the breadth of Kenya and Tanzania, The Bush Collection brings together a group of
affordable lodges & camps - all in optimal locations - that deliver exceptional hospitality with
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
          <Button size="lg" className="bg-[#333033] hover:bg-[#ebe9d8] border-[#333033] hover:border-[#ebe9d8] border-2 px-8 py-3">
            Explore Our Packages
          </Button>
        </Link>
      </motion.div>
      <motion.div variants={staggerItem}>
        <Link to="/contact">
          <Button size="lg" variant="outline" className="bg-[#ebe9d8] border-[#333033] text-[#333033] hover:bg-[#333033] hover:text-[#ebe9d8] px-8 py-3">
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
                <div className="text-3xl font-bold text-[#ebe9d8] mb-2">{value}</div>
                <div className="text-[#ebe9d8]">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story Section */}
      <section className="py-16 bg-[#333033]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#333033]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-[#ebe9d8] mb-6"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'Our Story'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.h2>
              <div className="space-y-4 text-[#ebe9d8] leading-relaxed">
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  Founded in 2023 by safari enthusiast Andre, The Bush Collection began as a small operation with a big dream: to share the incredible wildlife and landscapes of Africa with travelers from around the world.
                </motion.p>
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  What started as guided tours for friends and family has grown into one of Africa's most trusted safari companies. We've maintained our commitment to authentic experiences, conservation, and supporting local communities every step of the way.
                </motion.p>
                <motion.p variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  Today, we work with local guides, conservation organizations, and communities across Tanzania and Kenya to create life-changing experiences that benefit both travelers and the places they visit.
                </motion.p>
              </div>
              <motion.div
                className="mt-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={staggerItem}>
                  <Badge className="bg-green-100 text-green-800 mr-2">Conservation Partner</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-blue-100 text-blue-800 mr-2">Community Focused</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-orange-100 text-orange-800">Award Winning</Badge>
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
              <div className="bg-[#ebe9d8] p-4 rounded-lg">
                <img
                 src="/images/PNG-LOGO (1).png"
                 alt="Safari landscape"
                 className="rounded-lg shadow-lg"
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
                    <div className="font-semibold text-[#333033]">2+ Years</div>
                    <div className="text-sm text-[#333033]">Safari Experience</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <motion.section
        className="py-16 bg-[#ebe9d8]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-[#333033] mb-4"
              variants={textVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {'Our Values'.split('').map((letter, index) => (
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
              className="text-xl text-[#333033] max-w-3xl mx-auto"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Everything we do is guided by our commitment to conservation, community, and creating authentic experiences
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
                <Card className="h-full hover:shadow-lg transition-shadow bg-[#333033]">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-[#ebe9d8] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#ebe9d8] mb-2">{title}</h3>
                        <p className="text-[#ebe9d8]">{description}</p>
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

      {/* Conservation Section */}
      <motion.section
        className="py-16 bg-green-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeInLeft}
            >
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {'Conservation Partnership'.split('').map((letter, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </motion.h2>
              <motion.div
                className="space-y-4 text-green-100"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={staggerItem}>
                  We believe that tourism should benefit wildlife and local communities. That's why we partner with conservation organizations and donate 5% of our profits to wildlife protection initiatives.
                </motion.p>
                <motion.p variants={staggerItem}>
                  Our tours are designed to minimize environmental impact while maximizing positive contributions to conservation efforts and local economies.
                </motion.p>
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white text-green-600">Carbon Neutral Tours</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white text-green-600">Local Community Support</Badge>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <Badge className="bg-white text-green-600">Wildlife Protection</Badge>
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
              <img
                src="https://www.azolifesciences.com/image-handler/ts/20220215094450/ri/1000/src/images/Article_Images/ImageForArticle_714_16449362895935733.jpg"
                alt="Wildlife conservation"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-[#ebe9d8]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-[#333033] mb-4"
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
            className="text-xl text-[#333033] mb-8"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Join thousands of travelers who have experienced the magic of Africa with us
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