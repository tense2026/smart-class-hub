// Shared classroom data (students, timetable, seat layout) read by the
// timetable, seat status, and gym pages.
import { STORAGE_KEYS, readJSON, writeJSON } from './storageKeys.js';

export const DAYS = ['월', '화', '수', '목', '금'];
export const SEAT_COUNT = 8;

const SUBJECTS = [
  ['국어', '수학', '영어', '한국사', '물리학', '정보', '자율학습'],
  ['수학', '화학', '영어', '통합과학', '생명과학', '정보', '자율학습'],
  ['영어', '수학', '화학', '한국사', '물리학', '체육', '자율학습'],
  ['국어', '영어', '수학', '화학', '생명과학', '정보', '자율학습'],
  ['수학', '영어', '물리학', '한국사', '화학', '체육', '자율학습'],
];
const ROOMS = ['2-3', '3-4', '2-3', '1-2', '3-5', '1-1', '도서관'];
const NAMES = ['학생1', '학생2', '학생3', '학생4', '학생5', '학생6', '학생7', '학생8'];

export function makeDefaultStudents() {
  return NAMES.map((name, i) => ({
    id: i + 1,
    name,
    subjects: DAYS.map(() => SUBJECTS[i % 5].slice()),
    rooms: DAYS.map(() => ROOMS.slice()),
  }));
}

// Returns a normalized { students, seats } pair. seats[i] is a student id or null.
export function loadClassroom() {
  let students = readJSON(STORAGE_KEYS.STUDENTS, null);
  let seats = readJSON(STORAGE_KEYS.SEATS, null);
  if (!Array.isArray(students) || students.length !== SEAT_COUNT) students = makeDefaultStudents();
  if (!Array.isArray(seats) || seats.length !== SEAT_COUNT) seats = students.map((s) => s.id);
  // Drop seat ids that no longer match a student so the grid never renders a broken state.
  const ids = new Set(students.map((s) => s.id));
  seats = seats.slice(0, SEAT_COUNT).map((id) => (ids.has(id) ? id : null));
  if (seats.every((id) => id === null)) seats = students.map((s) => s.id);
  return { students, seats };
}

export function saveStudents(students) {
  return writeJSON(STORAGE_KEYS.STUDENTS, students);
}

export function saveSeats(seats) {
  return writeJSON(STORAGE_KEYS.SEATS, seats);
}

// Index into DAYS for today, or -1 on weekends.
export function todayIndex(date = new Date()) {
  const d = date.getDay();
  return d >= 1 && d <= 5 ? d - 1 : -1;
}
