export const STORAGE_LOCATIONS = [
  { id: 'office-1', label: '1학년 교무실', color: 'blue' },
  { id: 'office-2', label: '2학년 교무실', color: 'emerald' },
  { id: 'office-3', label: '3학년 교무실', color: 'purple' },
];

export const FOUND_CATEGORIES = [
  '식당',
  '운동장',
  '체육관',
  '화장실',
  '복도',
  '교실',
  '도서관',
  '기타',
  '직접 입력'
];

export const STATUS_TYPES = {
  STORED: '보관 중',
  RETURNED: '반환 완료',
};

export const INITIAL_LOST_ITEMS = [
  {
    id: 'item-101',
    title: '애플 에어팟 프로 2세대 본체 (체인 케이스)',
    category: '식당',
    locationDetail: '학생식당 퇴식구 옆 3번 테이블 아래',
    foundAt: '2026-07-22 12:45',
    storageLocation: '1학년 교무실',
    finderName: '김민준',
    status: '보관 중',
    createdAt: '2026-07-22T12:50:00Z',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=800&q=80'
    ],
    notes: '검은색 곰인형 키링이 걸려있습니다.',
    handedOverAgreed: true,
    returnedLog: null
  },
  {
    id: 'item-102',
    title: '학생증 및 나이스 체크카드 (신한)',
    category: '복도',
    locationDetail: '본관 2층 중앙 계단 앞 창틀',
    foundAt: '2026-07-22 10:15',
    storageLocation: '2학년 교무실',
    finderName: '이서연',
    status: '보관 중',
    createdAt: '2026-07-22T10:20:00Z',
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80'
    ],
    notes: '2학년 3반 이름이 적혀있습니다.',
    handedOverAgreed: true,
    returnedLog: null
  },
  {
    id: 'item-103',
    title: '나이키 검은색 후드 집업 (L 사이즈)',
    category: '체육관',
    locationDetail: '체육관 1층 관람석 2열 좌측 관람석',
    foundAt: '2026-07-21 16:30',
    storageLocation: '3학년 교무실',
    finderName: '박현우',
    status: '보관 중',
    createdAt: '2026-07-21T16:40:00Z',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'
    ],
    notes: '주머니 안에 주황색 지우개가 들어있음',
    handedOverAgreed: true,
    returnedLog: null
  },
  {
    id: 'item-104',
    title: '써모스 파스텔블루 보온 텀블러 (500ml)',
    category: '도서관',
    locationDetail: '도서관 2층 열람실 14번 스터디 데스크',
    foundAt: '2026-07-20 15:00',
    storageLocation: '1학년 교무실',
    finderName: '최예은',
    status: '반환 완료',
    createdAt: '2026-07-20T15:10:00Z',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    notes: '스티커가 2장 붙어 있습니다.',
    handedOverAgreed: true,
    returnedLog: {
      returnedAt: '2026-07-21 11:20',
      staffName: '정성훈 교사 (1학년 부장)'
    }
  },
  {
    id: 'item-105',
    title: '모나미 3색 볼펜 세트 및 카카오 필통',
    category: '교실',
    locationDetail: '3학년 5반 교실 뒤편 분리수거함 옆',
    foundAt: '2026-07-19 17:10',
    storageLocation: '3학년 교무실',
    finderName: '강지훈',
    status: '보관 중',
    createdAt: '2026-07-19T17:15:00Z',
    images: [
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80'
    ],
    notes: '라이언 캐릭터 파우치 형태 필통',
    handedOverAgreed: true,
    returnedLog: null
  }
];
