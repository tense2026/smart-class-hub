# Smart Class Hub

교실 관리 웹 페이지 모음입니다. 시간표·자리 배치, 실시간 자리 현황, 체육시간 장소 안내, 교실 문 제어, 교내 분실물 센터를 하나의 사이트로 묶었습니다.

## 페이지

| 경로 | 기능 | 구현 |
|---|---|---|
| `/` | 학생별 시간표, 자리 배치, 교직원 모드 | 바닐라 JS (`src/pages/timetable.js`) |
| `/seats/` | 자리별 착석 감지 상태 (현재는 시뮬레이션) | 바닐라 JS (`src/pages/seats.js`) |
| `/gym/` | 온습도 기준 체육관/운동장 안내, 오늘 체육 수업 목록 | 바닐라 JS (`src/pages/gym.js`) |
| `/door/` | 교실 문 열기/닫기, 자동 닫힘 | 바닐라 JS (`src/pages/door.js`) |
| `/lost/` | 교내 분실물 등록·조회 ([PRD](docs/PRD_Lost_and_Found.md)) | React (`src/lost/`) |

## 공용 모듈

- `src/shared/storageKeys.js`: 모든 localStorage 키. 페이지끼리 데이터를 공유하므로 키는 여기서만 정의합니다.
- `src/shared/classroom.js`: 학생·시간표·자리 데이터 로드/저장 (`/`, `/seats/`, `/gym/`에서 사용)
- `src/shared/page.css`: `/seats/`, `/gym/`, `/door/` 공통 레이아웃

## 디자인 토큰

모든 페이지가 같은 색·폰트·모서리 값을 씁니다. 시스템이 다크 모드면 자동으로 어두운 테마가 적용됩니다.

- `src/shared/palette.css`: OKLCH 색 팔레트. 색상군(neutral, accent, success, danger, warning, info, plum)마다 색조와 채도만 정하고, 명도 단계는 공통으로 씁니다. 다크 모드는 명도 단계만 뒤집습니다.
- `src/shared/tokens.css`: 의미 기반 토큰(`--bg`, `--surface`, `--text`, `--accent`, `--success-soft` 등). 페이지 CSS는 이 이름만 사용합니다.
- `src/shared/base.css`: 바닐라 페이지용 기본 요소 스타일과 `.btn`, `.sim-box`
- 분실물 앱은 `src/lost/index.css`의 `@theme`에서 Tailwind 색상(slate, indigo, emerald 등)을 같은 팔레트로 다시 매핑합니다. 새 Tailwind 색상군을 쓸 때는 여기에 매핑을 추가해야 합니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/
```

## 하드웨어 연동 계획

```
센서(온습도·압력) / 문 모터 → Arduino Mega → Raspberry Pi → 서버 → 웹
```

현재 웹 페이지는 서버 연동 전 단계로, 시뮬레이션 입력과 Web Serial(USB 직결 테스트용)만 지원합니다. 데이터는 브라우저 localStorage에만 저장됩니다.
