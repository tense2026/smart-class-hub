/**
 * Masks name for privacy (e.g., 홍길동 -> 홍*동, 이순신 -> 이*신, 남궁성 -> 남*성)
 * @param {string} name 
 * @returns {string}
 */
export const maskName = (name) => {
  if (!name) return '익명';
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return trimmed[0] + '*';
  
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  const middleMask = '*'.repeat(trimmed.length - 2);
  
  return `${first}${middleMask}${last}`;
};

/**
 * Formats date object or ISO string to YYYY-MM-DD HH:mm
 * @param {string | Date} dateInput 
 * @returns {string}
 */
export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * Returns formatted HTML datetime-local string (YYYY-MM-DDTHH:mm)
 * @param {Date} [dateObj]
 * @returns {string}
 */
export const getCurrentDateTimeLocal = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Calculates relative time label (e.g. "오늘", "어제", "3일 전")
 * @param {string | Date} dateInput 
 * @returns {string}
 */
export const getRelativeTimeString = (dateInput) => {
  if (!dateInput) return '';
  const now = new Date();
  const date = new Date(dateInput);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 5) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return '어제';
  if (diffDays < 30) return `${diffDays}일 전`;
  return `${Math.floor(diffDays / 30)}개월 전`;
};

/**
 * File size validation helper (max 5MB per file)
 * Allowed extensions: .jpg, .jpeg, .png, .heic, image/*
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: '파일이 선택되지 않았습니다.' };
  
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `파일 크기는 5MB 이하여야 합니다. (현재: ${(file.size / (1024 * 1024)).toFixed(2)}MB)` };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/jpg', 'image/webp'];
  const ext = file.name.split('.').pop()?.toLowerCase();
  
  if (!validTypes.includes(file.type) && !['jpg', 'jpeg', 'png', 'heic', 'webp'].includes(ext)) {
    return { valid: false, error: '지원하지 않는 확장자입니다. (.jpg, .png, .heic 지원)' };
  }

  return { valid: true };
};
