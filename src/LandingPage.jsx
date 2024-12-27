import React, { useState, useEffect } from "react";
import { FaWind, FaClock, FaWallet, FaMobileAlt } from "react-icons/fa";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaWind className="text-4xl text-blue-600" />,
      title: "Smart Scheduling",
      description:
        "Book your laundry slot in advance with our intelligent scheduling system",
    },
    {
      icon: <FaClock className="text-4xl text-blue-600" />,
      title: "Real-time Updates",
      description:
        "Get instant notifications about your laundry status and machine availability",
    },
    {
      icon: <FaWallet className="text-4xl text-blue-600" />,
      title: "Flexible Payments",
      description:
        "Multiple payment options including digital wallets and contactless payments",
    },
    {
      icon: <FaMobileAlt className="text-4xl text-blue-600" />,
      title: "User-friendly Interface",
      description: "Intuitive mobile app for seamless laundry management",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      content:
        "This smart laundry system has completely transformed how I do my weekly laundry. No more waiting or guessing!",
    },
    {
      name: "Michael Chen",
      role: "Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      content:
        "As a busy student, this system saves me so much time. The app is super easy to use!",
    },
    {
      name: "Emma Davis",
      role: "Business Professional",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      content:
        "The convenience of scheduling and monitoring my laundry remotely is incredible. Highly recommended!",
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1545173168-9f1947eebb7f')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to the Future of Laundry
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              Experience the convenience of smart laundry management with
              real-time monitoring and scheduling
            </p>
            <button
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
              onClick={() => navigate("/")}
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-600">
            Smart Features for Smart Living
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:transform hover:scale-105 transition duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-blue-600">
            What Our Users Say
          </h2>
          <div className="relative">
            <div className="flex items-center justify-center">
              <button
                onClick={prevTestimonial}
                className="absolute left-0 z-10 p-2 text-blue-600 hover:text-blue-800"
              >
                <BsChevronLeft size={30} />
              </button>
              <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-blue-600">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg italic">
                  {testimonials[currentTestimonial].content}
                </p>
              </div>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 z-10 p-2 text-blue-600 hover:text-blue-800"
              >
                <BsChevronRight size={30} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">
            Download Our App
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Scan the QR code below to download the PublicLaundSmart app and
            start managing your laundry services smartly!
          </p>
          <img
            src="images/qrcode.png"
            alt="QR Code"
            className="mx-auto"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Laundry Experience?
          </h2>
          <p className="text-xl text-white mb-8">
            Join thousands of satisfied users and make laundry day stress-free
          </p>
          <button
            className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
            onClick={() => navigate("/")}
          >
            Sign Up Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
