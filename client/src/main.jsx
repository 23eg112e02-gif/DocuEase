import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { EditorProvider } from './context/EditorContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EditorProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </EditorProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
