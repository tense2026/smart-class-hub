import React, { useState } from 'react';
import { useLostItems } from '../context/LostItemContext';
import { maskName, formatDateTime, getRelativeTimeString } from '../utils/helpers';
import {
  X,
  MapPin,
  Clock,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

export const ItemDetailModal = ({ item, onClose }) => {
  const { userRole, markAsReturned, markAsStored, deleteItem, staffNameInput, setStaffNameInput } = useLostItems();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isConfirmingReturn, setIsConfirmingReturn] = useState(false);
  const [handlerName, setHandlerName] = useState(staffNameInput);

  if (!item) return null;

  const isStaff = userRole === 'STAFF';
  const isReturned = item.status === '반환 완료';
  const images = item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleCompleteReturn = () => {
    markAsReturned(item.id, handlerName);
    setIsConfirmingReturn(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 분실물 기록을 삭제하시겠습니까?')) {
      deleteItem(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                isReturned
                  ? 'bg-slate-800 text-slate-100'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {isReturned ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" /> 반환 완료
                </>
              ) : (
                '보관 중'
              )}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-semibold">
              {item.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Main Image Gallery / Carousel */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-16/10 group shadow-inner">
            <img
              src={images[activeImageIndex]}
              alt={item.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Navigation buttons if multiple images */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeImageIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Title & Core Meta */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{item.title}</h2>
            {item.notes && (
              <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">특징/메모:</span> {item.notes}
              </p>
            )}
          </div>

          {/* Location & Time Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Found location detail */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-indigo-900">습득 위치</div>
                <div className="text-sm font-bold text-indigo-950 mt-0.5">{item.locationDetail}</div>
                <div className="text-xs text-indigo-600 mt-0.5">카테고리: {item.category}</div>
              </div>
            </div>

            {/* Storage location */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-emerald-900">보관 교무실 (수령 장소)</div>
                <div className="text-sm font-extrabold text-emerald-950 mt-0.5">{item.storageLocation}</div>
                <div className="text-xs text-emerald-700 mt-0.5 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> 실물 인계 확인 완료
                </div>
              </div>
            </div>

            {/* Found date time */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className="p-2 rounded-xl bg-slate-200 text-slate-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">습득 시각</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">{formatDateTime(item.foundAt)}</div>
                <div className="text-xs text-slate-500 mt-0.5">{getRelativeTimeString(item.foundAt)}</div>
              </div>
            </div>

            {/* Finder Name (Masked vs Real) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3">
              <div className={`p-2 rounded-xl shrink-0 ${isStaff ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'}`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-semibold text-slate-500">습득자 이름</span>
                  {isStaff ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      교직원 검증 뷰
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-600 text-[10px] font-medium">
                      마스킹 처리
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {isStaff ? item.finderName : maskName(item.finderName)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isStaff ? '실명이 표시됩니다.' : '학생 개인정보 보호 적용'}
                </div>
              </div>
            </div>

          </div>

          {/* Returned Log Information if returned */}
          {isReturned && item.returnedLog && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> 분실물 수령 및 반환 완료 로그
                </span>
                <span className="text-slate-400">{item.returnedLog.returnedAt}</span>
              </div>
              <p className="text-sm text-slate-200">
                처리 교직원: <strong className="text-white">{item.returnedLog.staffName}</strong>
              </p>
            </div>
          )}

          {/* Staff Action Box */}
          {isStaff && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>교직원 전용 상태 변경</span>
                </div>
                <button
                  onClick={handleDelete}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center space-x-1 font-medium cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>항목 삭제</span>
                </button>
              </div>

              {!isReturned ? (
                <div>
                  {!isConfirmingReturn ? (
                    <button
                      onClick={() => setIsConfirmingReturn(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>분실자 수령 확인 [반환 완료 처리]</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-white rounded-xl border border-amber-300 space-y-3">
                      <p className="text-xs text-amber-950 font-semibold">
                        분실자가 오프라인 교무실에서 본인 확인 후 물건을 수령했음을 확정합니다.
                      </p>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          처리자 (교직원 성명)
                        </label>
                        <input
                          type="text"
                          value={handlerName}
                          onChange={(e) => {
                            setHandlerName(e.target.value);
                            setStaffNameInput(e.target.value);
                          }}
                          placeholder="예: 김선생님 (1학년 부장)"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCompleteReturn}
                          className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                        >
                          완료 확정
                        </button>
                        <button
                          onClick={() => setIsConfirmingReturn(false)}
                          className="px-3 py-2 rounded-lg bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 cursor-pointer"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <span>이미 반환 처리 완료된 항목입니다.</span>
                  <button
                    onClick={() => markAsStored(item.id)}
                    className="text-amber-700 underline font-semibold cursor-pointer"
                  >
                    상태를 [보관 중]으로 되돌리기
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            수령 절차: 본인 확인 후 해당 <strong>[{item.storageLocation}]</strong>에 방문하세요.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
