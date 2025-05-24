import React, { useState } from "react";
import {
  GraduationCap,
  Shield,
  Search,
  MessageCircle,
  MapPin,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
  BookOpen,
  Bike,
  Laptop,
} from "lucide-react";

const StudentMarketplaceLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Shield,
      title: "Verified Students Only",
      description: "University email verification ensures a trusted community",
    },
    {
      icon: Search,
      title: "Smart Listings",
      description: "Find exactly what you need with AI-powered search",
    },
    {
      icon: MessageCircle,
      title: "Secure Chat",
      description: "Communicate safely within the platform",
    },
    {
      icon: MapPin,
      title: "Campus Meetups",
      description: "Arrange safe exchanges using campus landmarks",
    },
  ];

  const testimonials = [
    {
      name: "Sani Ahmed",
      university: "IUT Dhaka",
      text: "Sold my bike quickly to another verified student",
      rating: 5,
    },
    {
      name: "Faiza Rahman",
      university: "University of Dhaka",
      text: "Found affordable textbooks from seniors in my department",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-xl font-semibold text-gray-800">
                CampusMarket
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Testimonials
              </a>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors">
                Get Started
              </button>
            </div>

            <button className="md:hidden text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Student Marketplace{" "}
              <span className="text-indigo-600">Reimagined</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Buy, sell, and connect with verified students on your campus.
              Everything from textbooks to tech, with built-in safety features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border border-gray-300 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition-colors">
                How It Works
              </button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto border border-gray-100">
            <div className="aspect-video bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center">
              <div className="text-center p-6">
                <GraduationCap className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-gray-500">CampusMarket in action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Student Needs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for safe, convenient campus trading
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-xl border ${
                  activeFeature === index
                    ? "border-indigo-300 shadow-lg"
                    : "border-gray-200 hover:border-indigo-200"
                } transition-all cursor-pointer`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple & Secure
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three easy steps to start trading on campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Verify Your Status",
                description: "Register with your university email address",
                icon: Shield,
              },
              {
                step: "2",
                title: "List or Discover",
                description: "Post items or browse student listings",
                icon: Search,
              },
              {
                step: "3",
                title: "Connect & Trade",
                description: "Chat and meet safely on campus",
                icon: CheckCircle,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center bg-white p-8 rounded-xl border border-gray-200"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Students
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              What our community members are saying
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-indigo-600">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.university}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to join your campus marketplace?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Thousands of students are already buying and selling safely
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors">
                Get Started Free
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors">
                University Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xl font-semibold">CampusMarket</span>
              </div>
              <p className="text-gray-400 mb-4">
                The trusted marketplace for university students
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Universities
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} CampusMarket. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentMarketplaceLanding;
