import { useEffect, useState } from 'react';
import { getDocument } from '../services/documentService.js';

export const useDocument = (documentId) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(Boolean(documentId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!documentId || documentId === 'new') {
      setLoading(false);
      setDocument(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getDocument(documentId)
      .then((data) => {
        if (isMounted) {
          setDocument(data.document);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError?.response?.data?.message || 'Unable to load document');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [documentId]);

  return { document, loading, error, setDocument };
};
