"use client";

import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Github",
      icon: Github,
      url: "#",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "#",
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:your@email.com",
    },
  ];

  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Home", url: "/" },
        { name: "About", url: "/components/about" },
        { name: "Portfolio", url: "/components/portfolio" },
        { name: "Contact", url: "/components/contact" },
        { name: "Social Media", url: "/components/socials" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Web Development", url: "#" },
        { name: "Maintenance", url: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-[#212529] text-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-fade-in-up">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">I Made Nobel Saputra</h3>
            <p className="text-gray-400 mb-6 max-w-md">Full-Stack Web Developer passionate about creating beautiful and functional web experiences.</p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a key={social.name} href={social.url} aria-label={social.name} className="bg-white text-[#212529] p-3 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.url} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center sm:text-left">© {currentYear} I Made Nobel Saputra. All rights reserved.</p>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>using Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
