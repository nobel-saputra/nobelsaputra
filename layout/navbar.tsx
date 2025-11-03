"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/components/about", label: "About" },
    { href: "/components/portfolio", label: "Portfolio" },
    { href: "/components/contact", label: "Contact" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-full flex justify-center px-4 md:px-8">
      {/* ini card hitam pekat yang dibikin lebih sempit */}
      <nav className="bg-[#212529] rounded-3xl px-10 md:px-16 py-5 shadow-lg w-full max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-white text-xl font-semibold hover:text-gray-300 transition-colors z-50">
            Nobel
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-white hover:text-gray-300 transition-colors relative group">
                {item.label}
                <span className={`absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
            ))}
          </div>

          {/* Hamburger Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white focus:outline-none z-50 relative w-6 h-6" aria-label="Toggle menu">
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 top-3" : "top-0"}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out top-3 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
            <span className={`block absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 top-3" : "top-6"}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-64 mt-6" : "max-h-0"}`}>
          <div className="flex flex-col gap-4 pb-4">
            {navItems.map((item, index) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 transition-colors relative group py-2" style={{ animationDelay: `${index * 0.1}s` }}>
                {item.label}
                <span className={`absolute left-0 bottom-0 h-0.5 bg-white transition-all duration-300 ${isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"}`}></span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
