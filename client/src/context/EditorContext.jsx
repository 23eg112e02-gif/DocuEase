import { createContext, useMemo, useState } from 'react';

export const EditorContext = createContext(null);

const initialGuestDocument = {
  title: 'Untitled Guest Document',
  content: ''
};

export const EditorProvider = ({ children }) => {
  const [guestDocument, setGuestDocument] = useState(initialGuestDocument);

  const value = useMemo(
    () => ({
      guestDocument,
      setGuestDocument,
      setGuestTitle: (title) => setGuestDocument((current) => ({ ...current, title })),
      setGuestContent: (content) => setGuestDocument((current) => ({ ...current, content })),
      resetGuestDocument: () => setGuestDocument(initialGuestDocument)
    }),
    [guestDocument]
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
