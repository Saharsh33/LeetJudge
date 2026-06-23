"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ language, value, onChange, readOnly = false }) {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="light"
      onChange={onChange}
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
