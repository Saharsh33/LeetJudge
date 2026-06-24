"use client";

import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, value, onChange, readOnly = false, onSubmit }) {
  const [theme, setTheme] = useState("light");
  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme("vs-dark");
      }
      const listener = (e) => setTheme(e.matches ? "vs-dark" : "light");
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);
      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    }
  }, []);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    if (onSubmit) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onSubmit();
      });
    }
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={theme}
      onChange={onChange}
      onMount={handleEditorMount}
      options={{
        fontFamily: 'var(--font-jetbrains-mono), monospace',
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16, bottom: 16 },
        lineHeight: 24,
        readOnly: readOnly,
        domReadOnly: readOnly,
        cursorBlinking: readOnly ? 'solid' : 'blink',
      }}
    />
  );
}
