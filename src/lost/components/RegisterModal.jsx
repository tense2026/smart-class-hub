import React, { useState } from 'react';
import { useLostItems } from '../context/LostItemContext';
import { STORAGE_LOCATIONS, FOUND_CATEGORIES } from '../constants/data';
import { getCurrentDateTimeLocal, validateImageFile } from '../utils/helpers';
import {
  X,
  Upload,
  Camera,
  Trash2,
  AlertCircle,
  Building,
  CheckSquare,
  Clock,
  MapPin,
  User,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';

export const RegisterModal = ({ onClose }) => {
  const { addItem, showToast } = useLostItems();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('복도');
  const [customCategory, setCustomCategory] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [foundAt, setFoundAt] = useState(getCurrentDateTimeLocal());
  const [finderName, setFinderName] = useState('');
  const [storageLocation, setStorageLocation] = useState('1학년 교무실');
  const [notes, setNotes] = useState('');
  const [handedOverAgreed, setHandedOverAgreed] = useState(false);

  // File upload state (array of base64 image data strings)
  const [images, setImages] = useState([]);
  const [uploadError, setUploadError] = useState('');

  // Sample preset images option for quick demo testing
  const samplePresets = [
    { label: '이어폰', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80' },
    { label: '지갑', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
    { label: '의류/자켓', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
    { label: '텀블러', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleImageChange = (e) => {
    setUploadError('');
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 3) {
      setUploadError('사진은 최대 3장까지 업로드 가능합니다.');
      return;
    }

    files.forEach((file) => {
      const valResult = validateImageFile(file);
      if (!valResult.valid) {
        setUploadError(valResult.error);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => {
            if (prev.length >= 3) return prev;
            return [...prev, event.target.result];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPresetImage = (url) => {
    if (images.length >= 3) {
      setUploadError('사진은 최대 3장까지 첨부 가능합니다.');
      return;
    }
    setImages((prev) => [...prev, url]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadError('');

    const finalCategory = category === '직접 입력' 
      ? (customCategory.trim() || '기타') 
      : category;

    if (!locationDetail.trim()) {
      setUploadError('상세 습득 장소를 입력해 주세요.');
      return;
    }

    if (!finderName.trim()) {
      setUploadError('습득자 이름을 입력해 주세요.');
      return;
    }

    if (!storageLocation) {
      setUploadError('보관 교무실을 선택해 주세요.');
      return;
    }

    if (!handedOverAgreed) {
      setUploadError('교무실 실물 인계 확인 동의 체크박스에 동의해 주세요.');
      return;
    }

    addItem({
      title: title.trim() || `${finalCategory} 분실물`,
      category: finalCategory,
      locationDetail: locationDetail.trim(),
      foundAt: foundAt.replace('T', ' '),
      finderName: finderName.trim(),
      storageLocation,
      notes: notes.trim(),
      images,
      handedOverAgreed
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">습득 분실물 등록</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Error Banner */}
          {uploadError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* 1. Photo Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center">
                <Camera className="w-4 h-4 mr-1 text-indigo-600" />
                분실물 사진 첨부 <span className="text-slate-400 font-normal ml-1">(최대 3장, 장당 5MB 이내)</span>
              </label>
              <span className="text-xs font-bold text-indigo-600">{images.length}/3장</span>
            </div>

            {/* Image Preview Grid & Upload Trigger */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((imgSrc, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={imgSrc} alt={`미리보기 ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {images.length < 3 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all cursor-pointer">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[11px] font-bold">사진 첨부</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/heic,.jpg,.png,.heic"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Quick Demo Image Selection */}
            <div className="mt-2.5 flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="shrink-0 flex items-center font-medium">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500" /> 데모 샘플 사진:
              </span>
              <div className="flex flex-wrap gap-1">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleAddPresetImage(preset.url)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    +{preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Item Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                카테고리 <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {FOUND_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              
              {category === '직접 입력' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="카테고리 직접 입력 (예: 매점, 동아리실)"
                  className="w-full mt-2 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-xs text-indigo-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium animate-fadeIn"
                />
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                물건명 (제목)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 애플 에어팟 프로 2세대"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. Found Location Detailed */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                상세 습득 장소 <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">습득자가 자유롭게 입력</span>
            </div>
            <input
              type="text"
              required
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
              placeholder="예: 2층 남자화장실 세면대, 식당 퇴식구 앞 3번 테이블, 1층 동아리실"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
            />
            {/* Quick recommendation location chips */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">추천 태그:</span>
              {[
                '학생식당 퇴식구',
                '2층 복도 홈베이스',
                '체육관 관람석',
                '본관 계단 창틀',
                '매점 앞 자판기',
                '운동장 조회대'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setLocationDetail(chip)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                >
                  +{chip}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Found Time & 4. Finder Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                습득 일시 <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={foundAt}
                onChange={(e) => setFoundAt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                습득자 이름 <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                type="text"
                required
                value={finderName}
                onChange={(e) => setFinderName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">* 일반 학생 뷰에서는 마스킹(홍*동) 처리됩니다.</p>
            </div>
          </div>

          {/* 5. Storage Location Radio Component (Mandatory) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              보관 교무실 선택 <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {STORAGE_LOCATIONS.map((loc) => {
                const isSelected = storageLocation === loc.label;
                return (
                  <label
                    key={loc.id}
                    className={`relative p-3 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="storageLocationRadio"
                      value={loc.label}
                      checked={isSelected}
                      onChange={() => setStorageLocation(loc.label)}
                      className="sr-only"
                    />
                    <span className="text-xs">{loc.label}</span>
                    {isSelected && (
                      <span className="mt-1 w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              특징 및 메모 (선택)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예: 파란색 키링 포함, 주머니 내부 지우개 유"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 6. Handover Agreement Checkbox */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={handedOverAgreed}
                onChange={(e) => setHandedOverAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-amber-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-amber-950">
                선택하신 [{storageLocation}]에 실물 분실물을 직접 인계하셨습니까? <span className="text-rose-600">*</span>
              </span>
            </label>
            <p className="text-[11px] text-amber-800 pl-6">
              허위 또는 미인계 분실물 등록을 방지하기 위하여 실물 인계 확인 필수 동의 절차를 거칩니다.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>분실물 업로드</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
