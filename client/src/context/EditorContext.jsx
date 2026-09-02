import { createContext, useEffect, useMemo, useState } from 'react';

export const EditorContext = createContext(null);

const STORAGE_KEY = 'docuease_guest_document';

const defaultGuestDocument = {
  title: 'Untitled Document',
  content: ''
};

const getStoredGuestDocument = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        title: parsed.title || defaultGuestDocument.title,
        content: parsed.content || ''
      };
    }
  } catch (_e) {}
  return defaultGuestDocument;
};

export const EditorProvider = ({ children }) => {
  const [guestDocument, setGuestDocument] = useState(getStoredGuestDocument);
  const [lastSavedAt, setLastSavedAt] = useState(Date.now());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestDocument));
      setLastSavedAt(Date.now());
    } catch (_e) {}
  }, [guestDocument]);

  const value = useMemo(
    () => ({
      guestDocument,
      setGuestDocument,
      lastSavedAt,
      setGuestTitle: (title) => setGuestDocument((current) => ({ ...current, title })),
      setGuestContent: (content) => setGuestDocument((current) => ({ ...current, content })),
      resetGuestDocument: () => {
        setGuestDocument(defaultGuestDocument);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_e) {}
      }
    }),
    [guestDocument, lastSavedAt]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
