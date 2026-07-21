import { useContext } from 'react';
import { EditorContext } from './EditorContext.jsx';

export const useEditorContext = () => useContext(EditorContext);
