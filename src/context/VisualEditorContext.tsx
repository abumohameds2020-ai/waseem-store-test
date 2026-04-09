"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EditorContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  login: (password: string) => boolean;
  logout: () => void;
  draftConfig: any;
  updateDraft: (path: string, value: any) => void;
  publish: () => Promise<void>;
  discard: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function VisualEditorProvider({ children, initialConfig }: { children: React.ReactNode, initialConfig: any }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [draftConfig, setDraftConfig] = useState(initialConfig);
  const [accentColor, setAccentColor] = useState('#06b6d4'); // Default Cyan

  useEffect(() => {
    const auth = localStorage.getItem('kz_admin_auth');
    if (auth === 'true') setIsAdmin(true);
  }, []);

  const login = (password: string) => {
    if (password === 'admin123') { // Simple placeholder for now
      localStorage.setItem('kz_admin_auth', 'true');
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('kz_admin_auth');
    setIsAdmin(false);
    setEditMode(false);
  };

  const updateDraft = (path: string, value: any) => {
    const keys = path.split('.');
    setDraftConfig((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const publish = async () => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftConfig),
      });
      if (response.ok) {
        alert('Changes Published Successfully! 🚀');
        window.location.reload();
      }
    } catch (error) {
      console.error('Publish failed:', error);
    }
  };

  const discard = () => {
    setDraftConfig(initialConfig);
    setEditMode(false);
  };

  return (
    <EditorContext.Provider value={{ 
      isAdmin, isEditMode, setEditMode, login, logout, 
      draftConfig, updateDraft, publish, discard,
      accentColor, setAccentColor
    }}>
      {children}
    </EditorContext.Provider>
  );
}

export const useVisualEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    // Provide a safe fallback if used outside of VisualEditorProvider (e.g. on Checkout or Shop pages)
    return {
      isAdmin: false,
      isEditMode: false,
      setEditMode: () => {},
      login: () => false,
      logout: () => {},
      draftConfig: null,
      updateDraft: () => {},
      publish: async () => {},
      discard: () => {},
      accentColor: '#06b6d4',
      setAccentColor: () => {}
    } as EditorContextType;
  }
  return context;
};
