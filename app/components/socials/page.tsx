"use client";

import "../../style/animation.css";
import { Instagram, Github, Dribbble, Linkedin, ArrowRight } from "lucide-react";

export default function SocialMediaCard() {
  const socialMedia = [
    { name: "Instagram", icon: Instagram, link: "https://instagram.com/nobel_852" },
    { name: "Github", icon: Github, link: "https://github.com/nobel-saputra" },
    { name: "Dribbble", icon: Dribbble, link: "https://dribbble.com/nobelsaputra" },
    { name: "LinkedIn", icon: Linkedin, link: "https://www.linkedin.com/in/i-made-nobel-saputra-5a0809368/" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="bg-[#212529] rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 max-w-6xl w-full shadow-2xl">
        <h2 className="text-white text-5xl lg:text-6xl font-medium mb-8 sm:mb-12 animate-title">Social Media</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {socialMedia.map((social, index) => {
            const Icon = social.icon;
            return (
              <a key={social.name} href={social.link} className={`relative animate-card-${index + 1} rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center justify-between transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group`}>
                {/* Background Layer */}
                <div className="absolute inset-0 bg-white group-hover:bg-[#212529] transition-colors duration-300"></div>

                {/* Content */}
                <div className="relative z-10 w-full flex flex-col items-center justify-between h-full">
                  <div className="w-full flex justify-center mb-6">
                    <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-800 group-hover:text-white transition-colors duration-300" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 group-hover:text-white transition-colors duration-300">{social.name}</h3>

                  <div className="w-full flex justify-end">
                    <div className="bg-gray-900 group-hover:bg-[#212529] rounded-full p-2 transition-colors duration-300">
                      <ArrowRight className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
