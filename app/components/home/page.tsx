"use client";
import "../../style/animation.css";

export default function IntroCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="card-container bg-[#212529] rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 max-w-6xl w-full shadow-2xl">
        {/* Mobile Layout */}
        <div className="md:hidden text-white text-center">
          <h1 className="text-2xl font-bold mb-2 animate-fade-in-up-1">I Made Nobel Saputra</h1>
          <p className="text-md font-medium text-gray-300 mb-6 animate-fade-in-up-2">Full-Stack Web Developer</p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block text-white space-y-2">
          <h1 className="text-5xl lg:text-6xl font-medium animate-fade-in-up-1">Hello</h1>
          <h2 className="text-5xl lg:text-6xl font-medium animate-fade-in-up-2">My Name is</h2>
          <h3 className="text-5xl lg:text-6xl font-medium animate-fade-in-up-3">I Made Nobel Saputra</h3>

          <div className="pt-8 flex items-center gap-4 animate-slide-in">
            <div className="w-2 h-16 bg-white rounded-full"></div>
            <p className="text-2xl lg:text-3xl font-medium text-gray-300">I&apos;m Full-Stack Web Developer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
