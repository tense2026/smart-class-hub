import React, { useMemo } from 'react';
import { Search, Filter, X, Calendar, MapPin, Tag } from 'lucide-react';
import { STORAGE_LOCATIONS, FOUND_CATEGORIES } from '../constants/data';
import { useLostItems } from '../context/LostItemContext';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  selectedDateRange,
  setSelectedDateRange,
  sortBy,
  setSortBy,
  onResetFilters
}) => {
  const { items } = useLostItems();

  // Dynamic category list combining presets and custom categories in existing items
  const categoryOptions = useMemo(() => {
    const presetFiltered = FOUND_CATEGORIES.filter(c => c !== '직접 입력');
    const customFromItems = items.map(item => item.category).filter(Boolean);
    const combined = Array.from(new Set([...presetFiltered, ...customFromItems]));
    return combined;
  }, [items]);

  const hasActiveFilters =
    searchQuery ||
    selectedLocation !== 'ALL' ||
    selectedStatus !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedDateRange !== 'ALL';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
      
      {/* Top Search & Main Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="물건 이름, 습득 장소(예: 식당, 2층 화장실) 검색..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          {[
            { id: 'ALL', label: '전체' },
            { id: '보관 중', label: '보관 중' },
            { id: '반환 완료', label: '반환 완료' }
          ].map(status => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedStatus === status.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shrink-0"
        >
          <option value="NEWEST">등록일 역순 (최신순)</option>
          <option value="OLDEST">등록일 순 (오래된순)</option>
        </select>
      </div>

      {/* Secondary Detailed Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 flex items-center mr-1">
          <Filter className="w-3.5 h-3.5 mr-1" /> 필터:
        </span>

        {/* Location Dropdown */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            selectedLocation !== 'ALL'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">🏫 보관 위치: 전체 교무실</option>
          {STORAGE_LOCATIONS.map(loc => (
            <option key={loc.id} value={loc.label}>
              {loc.label}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            selectedCategory !== 'ALL'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">📍 습득 장소: 전체 장소</option>
          {categoryOptions.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Date Filter Dropdown */}
        <select
          value={selectedDateRange}
          onChange={(e) => setSelectedDateRange(e.target.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
            selectedDateRange !== 'ALL'
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <option value="ALL">📅 날짜: 전체 기간</option>
          <option value="TODAY">오늘 등록</option>
          <option value="WEEK">최근 7일</option>
          <option value="MONTH">이번 달</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors ml-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>필터 초기화</span>
          </button>
        )}
      </div>

    </div>
  );
};
