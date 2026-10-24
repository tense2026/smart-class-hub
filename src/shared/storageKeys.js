// Single source of truth for every localStorage key used across pages.
// All pages share one origin, so a mismatched key silently splits the data.
export const STORAGE_KEYS = {
  STUDENTS: 'SMART_CLASS_STUDENTS_V7',
  SEATS: 'SMART_CLASS_SEATS_V7',
  DOOR_STATE: 'SMART_CLASS_DOOR_STATE',
  DOOR_AUTO_CLOSE: 'SMART_CLASS_DOOR_AUTO_CLOSE',
  LOST_ITEMS: 'school_lost_items_data_v1',
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}
