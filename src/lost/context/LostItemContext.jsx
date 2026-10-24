import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_LOST_ITEMS } from '../constants/data';
import { formatDateTime } from '../utils/helpers';
import { STORAGE_KEYS } from '../../shared/storageKeys';

const LostItemContext = createContext(null);

const LOCAL_STORAGE_KEY = STORAGE_KEYS.LOST_ITEMS;

export const LostItemProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse localStorage items:', e);
    }
    return INITIAL_LOST_ITEMS;
  });

  // Current role: 'STUDENT' or 'STAFF'
  const [userRole, setUserRole] = useState('STUDENT');
  
  // Current user display name
  const [staffNameInput, setStaffNameInput] = useState('김선생님 (교직원)');

  // Toast notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [items]);

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 3500);
  };

  const addItem = (itemData) => {
    const newItem = {
      id: `item-${Date.now()}`,
      title: itemData.title || `${itemData.category} 분실물`,
      category: itemData.category,
      locationDetail: itemData.locationDetail,
      foundAt: itemData.foundAt,
      storageLocation: itemData.storageLocation,
      finderName: itemData.finderName,
      status: '보관 중',
      createdAt: new Date().toISOString(),
      images: itemData.images && itemData.images.length > 0 
        ? itemData.images 
        : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'],
      notes: itemData.notes || '',
      handedOverAgreed: itemData.handedOverAgreed || true,
      returnedLog: null
    };

    setItems(prev => [newItem, ...prev]);
    showToast('분실물이 성공적으로 등록되었습니다.', 'success');
    return newItem;
  };

  const markAsReturned = (itemId, staffName = staffNameInput) => {
    const currentNow = formatDateTime(new Date());
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: '반환 완료',
          returnedLog: {
            returnedAt: currentNow,
            staffName: staffName || '교직원'
          }
        };
      }
      return item;
    }));
    showToast('상태가 [반환 완료]로 변경되었습니다.', 'success');
  };

  const markAsStored = (itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: '보관 중',
          returnedLog: null
        };
      }
      return item;
    }));
    showToast('상태가 [보관 중]으로 변경되었습니다.', 'info');
  };

  const deleteItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    showToast('해당 항목이 삭제되었습니다.', 'warning');
  };

  const resetToInitialData = () => {
    setItems(INITIAL_LOST_ITEMS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    showToast('초기 모의 데이터로 재설정되었습니다.', 'info');
  };

  return (
    <LostItemContext.Provider
      value={{
        items,
        userRole,
        setUserRole,
        staffNameInput,
        setStaffNameInput,
        addItem,
        markAsReturned,
        markAsStored,
        deleteItem,
        resetToInitialData,
        toast,
        showToast
      }}
    >
      {children}
    </LostItemContext.Provider>
  );
};

export const useLostItems = () => {
  const context = useContext(LostItemContext);
  if (!context) {
    throw new Error('useLostItems must be used within a LostItemProvider');
  }
  return context;
};
