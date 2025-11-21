"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import "../../style/animation.css";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  image_url: string;
  live_url: string;
  github_url: string;
  jenis: string;
  created_at: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchPortfolios = async () => {
      const { data, error } = await supabase.from("portfolios").select("*").order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPortfolios(data || []);
      }
      setLoading(false);
    };

    fetchPortfolios();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isLongDescription = (description: string) => {
    return description.length > 150;
  };

  if (loading)
    return (
      <div className="min-h-screen rounded-2xl bg-[#212529] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loader"></div>
          <p className="text-white text-lg">Loading portfolios...</p>
        </div>
      </div>
    );

  if (portfolios.length === 0)
    return (
      <div className="min-h-screen rounded-2xl bg-[#212529] flex items-center justify-center">
        <p className="text-white text-lg">No portfolios found :(</p>
      </div>
    );

  return (
    <div className="min-h-screen rounded-2xl bg-[#212529] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-5xl lg:text-6xl font-medium text-white mb-4 tracking-tight">My Portfolio</h1>
        </div>

        {/* Portfolio Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((item, index) => (
            <div key={item.id} className="border-gray-500 border-2 portfolio-card group" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative w-full h-72 overflow-hidden rounded-t-xl">
                <Image src={item.image_url} alt={item.title} fill className="object-contain bg-[#1a1d21] transition-transform duration-500 group-hover:scale-105" />
              </div>

              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-white group-hover:text-gray-200 transition-colors">{item.title}</h2>
                <h2 className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">{item.jenis}</h2>
                
                <div>
                  <p className={`text-gray-400 text-sm leading-relaxed break-words ${!expandedCards[item.id] && isLongDescription(item.description) ? 'line-clamp-3' : ''}`}>
                    {item.description}
                  </p>
                  {isLongDescription(item.description) && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="text-white text-sm font-semibold mt-2 hover:text-gray-300 transition-colors block"
                    >
                      {expandedCards[item.id] ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  {item.live_url && (
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="flex-1  bg-white text-[#212529] px-4 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-gray-200 transition-all duration-300 hover:shadow-lg">
                      Live Demo
                    </a>
                  )}
                  {item.github_url && (
                    <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-transparent border-2 border-white text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-white hover:text-[#212529] transition-all duration-300">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .portfolio-card {
          background: #2d3238;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .portfolio-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}