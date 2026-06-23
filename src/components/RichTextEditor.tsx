'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline, Palette, Trash2, Check, Heading, Type, List, ListOrdered, ChevronDown } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const PRESET_COLORS = [
  { name: 'Dark Slate', value: '#1e293b' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
];

const HEADING_OPTIONS = [
  { label: 'Normal Text', tag: 'p' },
  { label: 'Heading 1', tag: 'h1' },
  { label: 'Heading 2', tag: 'h2' },
  { label: 'Heading 3', tag: 'h3' },
];

const FONT_SIZES = [
  { label: '12px (Small)', value: '12px' },
  { label: '14px (Normal)', value: '14px' },
  { label: '16px (Medium)', value: '16px' },
  { label: '18px (Large)', value: '18px' },
  { label: '20px (X-Large)', value: '20px' },
  { label: '24px (2X-Large)', value: '24px' },
  { label: '32px (3X-Large)', value: '32px' },
];

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingPicker, setShowHeadingPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [customColor, setCustomColor] = useState('#3b82f6');

  // Load the initial value into contentEditable when mounted
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, []);

  // Update editor text when value changes externally (e.g., loaded from API/modal reset)
  // Only update if it actually differs from innerHTML to avoid losing cursor focus
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, value);
      handleInput();
    }
  };

  const handleColorSelect = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleHeadingSelect = (tag: string) => {
    // formatBlock requires HTML wrapper for headings in some browsers e.g. "<h1>"
    const headingValue = tag === 'p' ? 'p' : `<${tag}>`;
    executeCommand('formatBlock', headingValue);
    setShowHeadingPicker(false);
  };

  const handleFontSizeSelect = (size: string) => {
    if (typeof document !== 'undefined') {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        // If selection is just cursor, apply to future typed text using font-size wrapping
        if (range.collapsed) {
          // Fallback selection wrap
          executeCommand('fontSize', '3'); // Set standard base size first
          setTimeout(() => {
            const fontEl = selection.anchorNode?.parentElement;
            if (fontEl && fontEl.tagName === 'FONT') {
              const span = document.createElement('span');
              span.style.fontSize = size;
              span.innerHTML = fontEl.innerHTML || '&#8203;'; // zero-width space
              fontEl.replaceWith(span);
              handleInput();
            }
          }, 10);
        } else {
          const span = document.createElement('span');
          span.style.fontSize = size;
          try {
            span.appendChild(range.extractContents());
            range.insertNode(span);
            handleInput();
          } catch (e) {
            console.error('Failed to apply font size wrapper:', e);
          }
        }
      }
      setShowSizePicker(false);
    }
  };

  const toggleListStyle = (command: 'insertUnorderedList' | 'insertOrderedList', listStyleType: string) => {
    if (typeof document !== 'undefined') {
      // First execute list command
      document.execCommand(command, false);
      
      // Post-process the generated ul/ol element to apply custom bullet style type
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          let node = selection.getRangeAt(0).commonAncestorContainer;
          if (node.nodeType === 3) {
            node = node.parentNode as Node;
          }
          const listEl = (node as HTMLElement).closest('ul, ol') as HTMLElement;
          if (listEl) {
            listEl.style.listStyleType = listStyleType;
            handleInput();
          }
        }
      }, 10);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-editor:empty::before {
            content: attr(data-placeholder);
            color: #94a3b8;
            pointer-events: none;
            display: block;
          }
          .rich-editor:focus {
            outline: none;
          }
          .rich-editor ul {
            list-style-position: outside;
            margin-left: 1.5rem;
            margin-top: 0.35rem;
            margin-bottom: 0.35rem;
          }
          .rich-editor ol {
            list-style-position: outside;
            margin-left: 1.5rem;
            margin-top: 0.35rem;
            margin-bottom: 0.35rem;
          }
          .rich-editor ul:not([style*="list-style-type"]) {
            list-style-type: disc;
          }
          .rich-editor ol:not([style*="list-style-type"]) {
            list-style-type: decimal;
          }
          .rich-editor li {
            margin-bottom: 0.25rem;
          }
          .rich-editor h1 {
            font-size: 1.5rem;
            font-weight: 800;
            margin-top: 0.85rem;
            margin-bottom: 0.5rem;
            color: #1e293b;
            line-height: 1.25;
          }
          .rich-editor h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 0.75rem;
            margin-bottom: 0.35rem;
            color: #1e293b;
            line-height: 1.3;
          }
          .rich-editor h3 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-top: 0.65rem;
            margin-bottom: 0.25rem;
            color: #1e293b;
            line-height: 1.35;
          }
          .rich-editor p {
            margin-bottom: 0.5rem;
          }
        `
      }} />

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-50 border-b border-slate-200 flex-wrap select-none">
        
        {/* Heading Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowHeadingPicker(!showHeadingPicker);
              setShowSizePicker(false);
              setShowColorPicker(false);
            }}
            className={`px-2 py-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
              showHeadingPicker ? 'bg-slate-200' : ''
            }`}
            title="Heading Options"
          >
            <Heading className="w-3.5 h-3.5" />
            <span>Heading</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showHeadingPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowHeadingPicker(false)} />
              <div 
                className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 z-50 w-36 flex flex-col gap-0.5"
                onMouseDown={(e) => e.preventDefault()}
              >
                {HEADING_OPTIONS.map((opt) => (
                  <button
                    key={opt.tag}
                    type="button"
                    onClick={() => handleHeadingSelect(opt.tag)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 active:bg-slate-200 text-xs text-slate-700 cursor-pointer font-medium"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowSizePicker(!showSizePicker);
              setShowHeadingPicker(false);
              setShowColorPicker(false);
            }}
            className={`px-2 py-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
              showSizePicker ? 'bg-slate-200' : ''
            }`}
            title="Font Size"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Size</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSizePicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSizePicker(false)} />
              <div 
                className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 z-50 w-36 flex flex-col gap-0.5"
                onMouseDown={(e) => e.preventDefault()}
              >
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => handleFontSizeSelect(size.value)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 active:bg-slate-200 text-xs text-slate-700 cursor-pointer font-medium"
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('bold')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('italic')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('underline')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* List: Dots */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleListStyle('insertUnorderedList', 'disc')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
          title="Bullets (Dots)"
        >
          <List className="w-4 h-4 text-slate-800" />
          <span className="text-[9px] font-black text-slate-400 select-none">●</span>
        </button>

        {/* List: Squares */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleListStyle('insertUnorderedList', 'square')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
          title="Bullets (Squares)"
        >
          <List className="w-4 h-4 text-slate-800" />
          <span className="text-[9px] font-black text-slate-400 select-none">■</span>
        </button>

        {/* List: Numbers */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleListStyle('insertOrderedList', 'decimal')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
          title="Numbered List (1, 2, 3)"
        >
          <ListOrdered className="w-4 h-4 text-slate-800" />
          <span className="text-[9px] font-black text-slate-400 select-none">123</span>
        </button>

        {/* List: Roman Numerals */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => toggleListStyle('insertOrderedList', 'upper-roman')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-0.5"
          title="Roman Numerals (I, II, III)"
        >
          <ListOrdered className="w-4 h-4 text-slate-800" />
          <span className="text-[9px] font-black text-slate-400 select-none">III</span>
        </button>

        {/* Vertical Divider */}
        <div className="w-px h-5 bg-slate-200 mx-0.5" />

        {/* Color Selector */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowHeadingPicker(false);
              setShowSizePicker(false);
            }}
            className={`p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-700 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 ${
              showColorPicker ? 'bg-slate-200' : ''
            }`}
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
            <div className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: customColor }} />
          </button>

          {/* Color Picker Dropdown Popover */}
          {showColorPicker && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowColorPicker(false)}
              />
              <div 
                className="absolute left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-2.5 z-50 w-48 flex flex-col gap-2.5"
                onMouseDown={(e) => e.preventDefault()} // prevent focus loss
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Preset Colors
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => {
                        setCustomColor(col.value);
                        handleColorSelect(col.value);
                      }}
                      className="w-6 h-6 rounded-full border border-slate-200 hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
                      style={{ backgroundColor: col.value }}
                      title={col.name}
                    >
                      {customColor === col.value && (
                        <Check className="w-3 h-3 text-white absolute inset-0 m-auto drop-shadow-sm font-bold" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-2 flex flex-col gap-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Custom Color
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-6 h-6 border border-slate-200 rounded cursor-pointer p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-full px-1.5 py-0.5 border border-slate-200 rounded text-slate-700 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleColorSelect(customColor)}
                      className="px-2 py-0.5 bg-primary text-white text-[10px] font-semibold rounded hover:bg-primary-dark transition-all cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Clear formatting */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => executeCommand('removeFormat')}
          className="p-1.5 hover:bg-slate-200 active:bg-slate-300 rounded text-slate-500 hover:text-red-600 transition-colors cursor-pointer ml-auto"
          title="Clear Selection Formatting"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        contentEditable
        ref={editorRef}
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder || 'Provide deep description of the vacancy role...'}
        className="rich-editor w-full min-h-[300px] p-4 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap overflow-y-auto"
        style={{ minHeight: '350px' }}
      />
    </div>
  );
}
