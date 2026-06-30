/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { NewsArticle, Venue } from "../types.js";
import { Newspaper, Building, MapPin, Users, Award, ExternalLink } from "lucide-react";

interface NewsTabProps {
  news: NewsArticle[];
  venues: Venue[];
}

export default function NewsTab({ news, venues }: NewsTabProps) {
  return (
    <div className="space-y-12" id="news-view">
      {/* Title Header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="font-headline-lg-mobile md:font-display-lg text-primary uppercase tracking-tight">
          TIN TỨC &amp; ĐỊA ĐIỂM THI ĐẤU
        </h2>
        <p className="text-on-surface-variant text-sm font-body-md">
          Tin tức nóng hổi và danh sách các siêu sân vận động World Cup 2026
        </p>
      </div>

      {/* Stadium Venues (Bento grid / Carousel inspiration) */}
      <section className="space-y-6">
        <h3 className="font-headline-lg-mobile text-primary flex items-center gap-2 border-l-4 border-l-[#c3f400] pl-3 uppercase">
          <Building className="w-5 h-5 text-[#c3f400]" /> Các thánh đường túc cầu 2026
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div key={venue.name} className="glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-[#c3f400]/40 transition-all flex flex-col h-full">
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-white font-label-caps border border-white/10">
                  <MapPin className="w-3 h-3 text-[#c3f400]" /> {venue.city}, {venue.country}
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-on-surface text-base group-hover:text-[#c3f400] transition-colors">{venue.name}</h4>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">{venue.description}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-label-caps text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#00eefc]" /> {venue.capacity}
                  </span>
                  <span className="text-[#c3f400] font-bold">CHI TIẾT</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Grid (2 columns or list style) */}
      <section className="space-y-6 pt-6">
        <h3 className="font-headline-lg-mobile text-primary flex items-center gap-2 border-l-4 border-l-[#00eefc] pl-3 uppercase">
          <Newspaper className="w-5 h-5 text-[#00eefc]" /> Tin tức World Cup 2026 mới nhất
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {news.map((article) => (
            <div
              key={article.id}
              className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-[#00eefc]/30 hover:translate-y-[-2px] transition-all flex flex-col sm:flex-row h-full"
            >
              {/* Image side */}
              <div className="relative w-full sm:w-44 h-44 sm:h-auto flex-shrink-0 overflow-hidden">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Text side */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant">
                    <span>{article.source}</span>
                    <span>{article.date}</span>
                  </div>
                  <h4 className="font-bold text-xs md:text-sm text-on-surface leading-snug group-hover:text-[#00eefc] transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <a
                  href={article.url}
                  className="inline-flex items-center gap-1 text-[10px] font-bold font-label-caps text-[#00eefc] hover:underline"
                >
                  XEM CHI TIẾT <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
