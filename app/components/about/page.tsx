// app/about/about.tsx

"use client";
import "../../style/animation.css";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="card-container bg-[#212529] rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 max-w-6xl w-full shadow-2xl">
        {/* Mobile Layout */}
        <div className="md:hidden text-white text-center">
          <h1 className="text-2xl font-bold mb-2 animate-fade-in-up-1">About Me</h1>
          <p className="text-md font-medium text-gray-300 mb-6 text-justify mt-5 animate-fade-in-up-2">I&apos;m a full-stack web developer who loves building all kinds of websites e-commerce, portfolios, apps, and anything that brings new ideas to life.</p>
          <div className="pt-4 flex items-center gap-4 mb-8 animate-slide-in">
            <div className="w-2 h-10 bg-white rounded-full"></div>
            <p className="text-md lg:text-xl font-medium text-gray-300">My Skill</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Next.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-2">Node.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Express.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Tailwindcss</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block text-white space-y-2">
          <h1 className="text-5xl lg:text-6xl font-medium animate-fade-in-up-1">About Me</h1>
          <p className="text-xl font-medium text-gray-300 mb-6 mt-5 animate-fade-in-up-2 max-w-[700px] leading-relaxed text-left">I&apos;m a full-stack web developer who loves building all kinds of websites e-commerce, portfolios, apps, and anything that brings new ideas to life.</p>
          <div className="pt-3 flex items-center gap-4 animate-slide-in">
            <div className="w-2 h-16 bg-white rounded-full"></div>
            <p className="text-2xl lg:text-3xl font-medium text-gray-300">My Skill</p>
          </div>

          <div className="pt-6 flex gap-3">
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Next.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-2">Node.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Express.js</span>
            <span className="px-4 py-2 bg-gray-700 rounded-full text-sm animate-scale-in-1">Tailwindcss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
