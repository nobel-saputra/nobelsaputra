"use client";
import "../../style/animation.css";

export default function IntroCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="card-container bg-[#212529] rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 max-w-6xl w-full shadow-2xl">
        {/* Mobile Layout */}
        <div className="md:hidden text-white text-center">
          <h1 className="text-2xl font-bold mb-2 animate-fade-in-up-1">In Process :(</h1>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block text-white space-y-2 py-20 text-center">
          <h1 className="text-2xl font-bold mb-2 animate-fade-in-up-1">In Process :(</h1>
        </div>
      </div>
    </div>
  );
}
