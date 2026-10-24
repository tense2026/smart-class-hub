import React from 'react';
import { useLostItems } from '../context/LostItemContext';
import { maskName, formatDateTime, getRelativeTimeString } from '../utils/helpers';
import { MapPin, Clock, Building, User, Images, CheckCircle2 } from 'lucide-react';

export const ItemCard = ({ item, onClick }) => {
  const { userRole } = useLostItems();
  const isStaff = userRole === 'STAFF';

  const isReturned = item.status === '반환 완료';
  const mainImage = item.images && item.images.length > 0
    ? item.images[0]
    : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

  // Location Badge Color Map
  const locationColorMap = {
    '1학년 교무실': 'bg-blue-50 text-blue-700 border-blue-200',
    '2학년 교무실': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    '3학년 교무실': 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const locationBadgeClass = locationColorMap[item.storageLocation] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      onClick={onClick}
      className={`group bg-surface rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer flex flex-col ${
        isReturned ? 'opacity-75 bg-slate-50/60' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Status Badge overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-xs border ${
              isReturned
                ? 'bg-slate-800 text-slate-100 border-slate-700'
                : 'bg-emerald-600 text-white border-emerald-500'
            }`}
          >
            {isReturned ? (
              <>
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" /> 반환 완료
              </>
            ) : (
              '보관 중'
            )}
          </span>

          {/* Category Tag */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
            {item.category}
          </span>
        </div>

        {/* Photo count indicator */}
        {item.images && item.images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-medium flex items-center space-x-1">
            <Images className="w-3.5 h-3.5" />
            <span>{item.images.length}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {item.title}
          </h3>

          {/* Location Detail */}
          <div className="mt-2.5 flex items-start space-x-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
            <span className="line-clamp-1 font-medium">{item.locationDetail}</span>
          </div>

          {/* Found Date */}
          <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>습득일: {formatDateTime(item.foundAt)} ({getRelativeTimeString(item.foundAt)})</span>
          </div>
        </div>

        {/* Footer info: Storage Location & Finder */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          
          {/* Storage office badge */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center space-x-1 ${locationBadgeClass}`}>
            <Building className="w-3 h-3" />
            <span>{item.storageLocation}</span>
          </div>

          {/* Finder Name (Masked or Unmasked) */}
          <div className="flex items-center text-xs text-slate-500 space-x-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>습득자: </span>
            <span className="font-semibold text-slate-700">
              {isStaff ? item.finderName : maskName(item.finderName)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
