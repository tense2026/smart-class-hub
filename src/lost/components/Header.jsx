import React from 'react';
import { useLostItems } from '../context/LostItemContext';
import { Shield, UserCheck, PlusCircle, RefreshCw, Sparkles, Building2, ArrowLeft } from 'lucide-react';

export const Header = ({ onOpenRegisterModal }) => {
  const { userRole, setUserRole, resetToInitialData, items } = useLostItems();

  const isStaff = userRole === 'STAFF';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Service Title */}
          <div className="flex items-center space-x-3">
            <a
              href="/"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Smart Class 메인으로"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                  교내 분실물 센터
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> Smart Campus
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                교내에서 습득된 물건을 빠르게 등록하고 해당 학년 교무실에서 수령하세요.
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setUserRole('STUDENT')}
                className={`flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  !isStaff
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="일반 학생 뷰 (습득자 이름 마스킹 처리)"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-blue-500" />
                <span>학생 모드</span>
              </button>

              <button
                onClick={() => setUserRole('STAFF')}
                className={`flex items-center px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isStaff
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="교직원 관리자 뷰 (실명 확인 및 반환 처리)"
              >
                <Shield className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-amber-300" />
                <span>교직원 모드</span>
              </button>
            </div>

            {/* Register Item Button */}
            <button
              onClick={onOpenRegisterModal}
              className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/25 space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>분실물 등록</span>
            </button>

            {/* Data Reset Button */}
            <button
              onClick={resetToInitialData}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="초기 샘플 데이터로 복원"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Staff Mode Active Alert Banner */}
        {isStaff && (
          <div className="mb-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>교직원 관리자 권한 적용됨:</strong> 습득자 실명 확인 및 분실물 [반환 완료] 처리 기능이 활성화되었습니다.
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
