import React from 'react';
import { useLostItems } from '../context/LostItemContext';
import { Box, CheckCircle2, Clock, MapPin } from 'lucide-react';

export const StatsOverview = ({ onFilterLocation, currentFilterLocation }) => {
  const { items } = useLostItems();

  const totalCount = items.length;
  const storedCount = items.filter(item => item.status === '보관 중').length;
  const returnedCount = items.filter(item => item.status === '반환 완료').length;

  const countByOffice = (officeName) => {
    return items.filter(item => item.storageLocation === officeName && item.status === '보관 중').length;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Total & Stored Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            현재 교무실 보관 중
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-indigo-600">{storedCount}</span>
            <span className="text-sm text-slate-500">건 / 전체 {totalCount}건</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">학생 수령을 기다리고 있습니다.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Returned Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            누적 반환 완료
          </p>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600">{returnedCount}</span>
            <span className="text-sm text-slate-500">건</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">주인에게 안사히 전달되었습니다.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>

      {/* Storage Location Quick Filter Cards */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> 교무실별 보관 현황
          </p>
          <span className="text-xs text-indigo-600 font-medium">클릭 시 필터</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: '1학년 교무실', color: 'border-blue-200 text-blue-700 bg-blue-50/50' },
            { name: '2학년 교무실', color: 'border-emerald-200 text-emerald-700 bg-emerald-50/50' },
            { name: '3학년 교무실', color: 'border-purple-200 text-purple-700 bg-purple-50/50' },
          ].map(office => {
            const count = countByOffice(office.name);
            const isSelected = currentFilterLocation === office.name;
            return (
              <button
                key={office.name}
                onClick={() => onFilterLocation(isSelected ? 'ALL' : office.name)}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${office.color} ${
                  isSelected ? 'ring-2 ring-indigo-500 font-bold shadow-xs' : 'hover:opacity-90'
                }`}
              >
                <div className="text-xs font-medium text-slate-600 truncate">{office.name}</div>
                <div className="text-base font-extrabold mt-0.5">{count}건</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
