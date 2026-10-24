import React, { useState, useMemo } from 'react';
import { LostItemProvider, useLostItems } from './context/LostItemContext';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { RegisterModal } from './components/RegisterModal';
import { Toast } from './components/Toast';
import { SearchX, PlusCircle, ShieldAlert, Sparkles, Heart } from 'lucide-react';

const MainContent = () => {
  const { items } = useLostItems();

  // State for Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Search text matching (title, locationDetail, category, notes, finderName)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchLoc = item.locationDetail?.toLowerCase().includes(q);
          const matchCat = item.category?.toLowerCase().includes(q);
          const matchFinder = item.finderName?.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          if (!matchTitle && !matchLoc && !matchCat && !matchFinder && !matchNotes) {
            return false;
          }
        }

        // Storage location filter
        if (selectedLocation !== 'ALL' && item.storageLocation !== selectedLocation) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
          return false;
        }

        // Date range filter
        if (selectedDateRange !== 'ALL') {
          const itemDate = new Date(item.foundAt || item.createdAt);
          const now = new Date();
          
          if (selectedDateRange === 'TODAY') {
            const isToday =
              itemDate.getFullYear() === now.getFullYear() &&
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getDate() === now.getDate();
            if (!isToday) return false;
          } else if (selectedDateRange === 'WEEK') {
            const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
            if (diffDays > 7) return false;
          } else if (selectedDateRange === 'MONTH') {
            const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
            if (diffDays > 30) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.foundAt || a.createdAt).getTime();
        const dateB = new Date(b.foundAt || b.createdAt).getTime();
        return sortBy === 'NEWEST' ? dateB - dateA : dateA - dateB;
      });
  }, [items, searchQuery, selectedLocation, selectedStatus, selectedCategory, selectedDateRange, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLocation('ALL');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedDateRange('ALL');
    setSortBy('NEWEST');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Top Sticky Header */}
      <Header onOpenRegisterModal={() => setIsRegisterOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Quick Stats Banner */}
        <StatsOverview
          onFilterLocation={(loc) => setSelectedLocation(loc)}
          currentFilterLocation={selectedLocation}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
        />

        {/* Item List Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-extrabold text-slate-900">
              분실물 목록
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
              {filteredItems.length}개
            </span>
          </div>

          <span className="text-xs text-slate-500">
            * 각 항목을 클릭하면 상세 사진 및 보관 장소를 확인할 수 있습니다.
          </span>
        </div>

        {/* Item Grid / Cards */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItemForDetail(item)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center my-8 max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              조건에 맞는 분실물이 없습니다.
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              검색어나 필터 조건을 변경하거나 새로운 분실물을 등록해 보세요.
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                필터 초기화
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>새 분실물 등록</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {isRegisterOpen && (
        <RegisterModal onClose={() => setIsRegisterOpen(false)} />
      )}

      {selectedItemForDetail && (
        <ItemDetailModal
          item={selectedItemForDetail}
          onClose={() => setSelectedItemForDetail(null)}
        />
      )}

      {/* Notification Toast */}
      <Toast />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© 2026 교내 분실물 스마트 인계 및 조회 서비스. All rights reserved.</p>
          <p className="mt-1 text-slate-400">
            교직원 및 학생 안전 분실물 반환 시스템 | 모바일 및 PC 웹 환경 최적화
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LostItemProvider>
      <MainContent />
    </LostItemProvider>
  );
}
