"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes successPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-title {
          animation: fadeInUp 0.6s ease-out;
        }
        .animate-subtitle {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .animate-form {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }
        .animate-success {
          animation: scaleIn 0.4s ease-out, successPulse 2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-medium text-[#212529] mb-4 animate-title">Get In Touch</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto animate-subtitle">Have a question or want to work together? Feel free to reach out!</p>
        </div>

        <div className="bg-[#212529] rounded-2xl p-8 sm:p-10 animate-form shadow-2xl">
          {!isSubmitted ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#ffffff] text-[#212529] border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#ffffff] text-[#212529] border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 outline-none" placeholder="your@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#ffffff] text-[#212529] border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 outline-none" placeholder="How can I help you?" />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={6} className="w-full px-4 py-3 rounded-lg bg-[#ffffff] text-[#212529] border border-gray-700 focus:border-white focus:ring-2 focus:ring-white transition-all duration-300 outline-none resize-none" placeholder="Tell me about your project..." />
              </div>

              <button onClick={handleSubmit} className="relative w-full bg-white border-[#848484] border-2 text-[#212529] font-semibold py-4 rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 group">
                <span className="absolute left-0 top-0 h-full w-0 bg-[#212529] transition-all duration-1000 ease-out group-hover:w-full"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-1000">Send Message</span>
                <Send className="w-5 h-5 relative z-10 transition-all duration-1000 group-hover:text-white group-hover:translate-x-1" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 animate-success">
              <div className="bg-[#212529] rounded-full p-4 mb-6">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-400 text-center">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
