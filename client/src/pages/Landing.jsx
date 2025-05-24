import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import {
  ShoppingBag,
  Shield,
  Users,
  MessageCircle,
  MapPin,
  Star,
  Brain,
  Smartphone,
  BookOpen,
  Bike,
  Laptop,
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Eye,
  Lock,
  Zap,
  Search,
  Camera,
  TrendingUp,
  Globe,
} from "lucide-react";

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Student Identity & Verification",
      description:
        "University email enforcement and academic profiles for trusted transactions",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Search,
      title: "Smart Listings & Discovery",
      description:
        "AI-powered search with flexible pricing and visibility controls",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Communication",
      description:
        "Instant messaging with image sharing for seamless negotiations",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      title: "Safe Campus Meetups",
      description: "Interactive campus maps for secure in-person exchanges",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Student-Driven Moderation",
      description: "Community-powered platform integrity with peer reviews",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: Brain,
      title: "AI-Powered Features",
      description: "Smart pricing, chatbots, and image recognition technology",
      color: "from-teal-500 to-blue-500",
    },
  ];

  const aiFeatures = [
    {
      icon: TrendingUp,
      title: "Price Advisor",
      description: "AI suggests fair market prices based on historical data",
    },
    {
      icon: MessageCircle,
      title: "Smart Chatbot",
      description:
        "Natural language search assistance for finding perfect items",
    },
    {
      icon: Camera,
      title: "Condition Estimator",
      description:
        "Image AI automatically estimates item condition from photos",
    },
    {
      icon: Eye,
      title: "Visual Search",
      description: "Upload photos to find similar items across the marketplace",
    },
  ];

  const testimonials = [
    {
      name: "Sani Ahmed",
      university: "IUT Dhaka",
      text: "Finally sold my bike safely with fair pricing suggestions!",
      rating: 5,
    },
    {
      name: "Faiza Rahman",
      university: "University of Dhaka",
      text: "Found the perfect budget laptop from a trusted seller nearby.",
      rating: 5,
    },
    {
      name: "Ravi Patel",
      university: "BUET",
      text: "The campus map feature made meetups so much safer and easier.",
      rating: 5,
    },
  ];

  const FloatingCard = ({ children, delay = 0, className = "" }) => (
    <div
      className={`transform transition-all duration-1000 ${className}`}
      style={{
        transform: `translateY(${Math.sin(scrollY * 0.01 + delay) * 10}px)`,
      }}
    >
      {children}
    </div>
  );

  const ParallaxSection = ({ children, speed = 0.5, className = "" }) => (
    <div
      className={className}
      style={{
        transform: `translateY(${scrollY * speed}px)`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">CampusMarket</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="hover:text-purple-400 transition-colors"
              >
                Features
              </a>
              <a href="#ai" className="hover:text-purple-400 transition-colors">
                AI Tools
              </a>
              <a
                href="#testimonials"
                className="hover:text-purple-400 transition-colors"
              >
                Reviews
              </a>
              <button className="bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="container mx-auto px-6 py-4 space-y-4">
              <a
                href="#features"
                className="block hover:text-purple-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#ai"
                className="block hover:text-purple-400 transition-colors"
              >
                AI Tools
              </a>
              <a
                href="#testimonials"
                className="block hover:text-purple-400 transition-colors"
              >
                Reviews
              </a>
              <button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-2 rounded-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="container mx-auto text-center">
          <ParallaxSection speed={-0.2}>
            <FloatingCard delay={0}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                The Future of
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Student Commerce
                </span>
              </h1>
            </FloatingCard>
          </ParallaxSection>

          <FloatingCard delay={1} className="mb-8">
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A secure, AI-powered marketplace exclusively for university
              students. Buy, sell, and connect with verified peers in your
              campus community.
            </p>
          </FloatingCard>

          <FloatingCard delay={2} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/login")}
                className="group bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Start Trading Now
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </FloatingCard>

          {/* Hero Stats */}
          <FloatingCard delay={3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">10K+</div>
                <div className="text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">50+</div>
                <div className="text-gray-400">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">25K+</div>
                <div className="text-gray-400">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">4.9★</div>
                <div className="text-gray-400">User Rating</div>
              </div>
            </div>
          </FloatingCard>
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <FloatingCard delay={0}>
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl transform rotate-12 animate-spin-slow"></div>
          </FloatingCard>
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <FloatingCard delay={2}>
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transform -rotate-12 animate-bounce"></div>
          </FloatingCard>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need for safe, smart, and seamless student trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FloatingCard key={index} delay={index * 0.5}>
                <div
                  className="group bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 cursor-pointer"
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section
        id="ai"
        className="relative z-10 py-20 px-6 bg-gradient-to-r from-purple-900/20 to-cyan-900/20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Innovation
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Cutting-edge artificial intelligence makes trading smarter and
              safer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {aiFeatures.map((feature, index) => (
              <FloatingCard key={index} delay={index * 0.3}>
                <div className="group bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-500 transform hover:scale-105">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Simple steps to start your campus trading journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Verify Your Identity",
                description:
                  "Register with your university email and create your trusted student profile",
                icon: Shield,
              },
              {
                step: "02",
                title: "List or Search",
                description:
                  "Post items for sale or browse AI-curated listings from verified students",
                icon: Search,
              },
              {
                step: "03",
                title: "Connect & Trade",
                description:
                  "Chat securely and meet safely on campus using our interactive maps",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <FloatingCard key={index} delay={index * 0.4}>
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-12 h-12" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </p>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative z-10 py-20 px-6 bg-gradient-to-r from-slate-900/50 to-purple-900/50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Student Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real experiences from students across universities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <FloatingCard key={index} delay={index * 0.3}>
                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-bold text-purple-400">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto text-center">
          <FloatingCard>
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-md border border-purple-500/30 rounded-3xl p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of students already trading safely and smartly on
                CampusMarket
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="group bg-gradient-to-r from-purple-500 to-cyan-500 px-12 py-4 rounded-full text-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  Get Started Free
                  <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-white/30 px-12 py-4 rounded-full text-xl font-semibold hover:bg-white/10 transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold">CampusMarket</span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of student commerce, powered by AI and built for
                safety.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-purple-500/20 transition-colors cursor-pointer">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    University Partners
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Report Issue
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 CampusMarket. Built for students, by students. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
