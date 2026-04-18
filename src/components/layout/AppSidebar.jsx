'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';


export default function AppSidebar({ open, onClose, header, sections = [] }) {
  const overlayRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {header ?? <span className="font-semibold text-gray-900 text-sm">Menú</span>}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <nav className="flex-1 overflow-y-auto py-3">
          {sections.map((section, idx) => (
            <SidebarSection key={section.id} section={section} onClose={onClose} isLast={idx === sections.length - 1} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarSection({ section, onClose, isLast }) {
  const [expanded, setExpanded] = useState(section.defaultOpen ?? false);

  const base =
    'flex items-center justify-between w-full px-5 py-3 text-sm transition-colors';

  const variantClass =
    section.variant === 'danger'
      ? 'text-red-500 hover:bg-red-50'
      : 'text-gray-700 hover:bg-gray-50';

  // Sección con acordeón
  if (section.collapsible && section.children?.length) {
    return (
      <div>
        {section.dividerBefore && <div className="my-2 border-t border-gray-100" />}
        <button
          onClick={() => setExpanded((v) => !v)}
          className={`${base} ${variantClass} font-medium`}
        >
          <span className="flex items-center gap-3">
            {section.icon && <span className="text-gray-400">{section.icon}</span>}
            {section.label}
          </span>
          <ChevronDown
            size={16}
            className="text-gray-400 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        {/* Children del acordeón */}
        <div
          style={{
            maxHeight: expanded ? `${section.children.length * 56}px` : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.25s ease',
          }}
        >
          {section.children.map((child) => (
            <SidebarChild key={child.id} child={child} onClose={onClose} />
          ))}
        </div>

        {!isLast && !section.dividerAfter && <div className="my-1" />}
        {section.dividerAfter && <div className="my-2 border-t border-gray-100" />}
      </div>
    );
  }

  // Link directo
  if (section.href) {
    return (
      <>
        {section.dividerBefore && <div className="my-2 border-t border-gray-100" />}
        <Link
          href={section.href}
          onClick={onClose}
          className={`${base} ${variantClass} font-medium`}
        >
          <span className="flex items-center gap-3">
            {section.icon && <span className="text-gray-400">{section.icon}</span>}
            {section.label}
          </span>
          <ChevronRight size={16} className="text-gray-300" />
        </Link>
        {section.dividerAfter && <div className="my-2 border-t border-gray-100" />}
      </>
    );
  }

  // Botón con acción (ej: logout)
  return (
    <>
      {section.dividerBefore && <div className="my-2 border-t border-gray-100" />}
      <button
        onClick={() => { section.onClick?.(); onClose(); }}
        className={`${base} ${variantClass} font-medium`}
      >
        <span className="flex items-center gap-3">
          {section.icon && <span className="text-gray-400">{section.icon}</span>}
          {section.label}
        </span>
      </button>
      {section.dividerAfter && <div className="my-2 border-t border-gray-100" />}
    </>
  );
}

function SidebarChild({ child, onClose }) {
  const variantClass =
    child.variant === 'danger'
      ? 'text-red-500 hover:bg-red-50'
      : 'text-gray-600 hover:bg-gray-50';

  if (child.href) {
    return (
      <Link
        href={child.href}
        onClick={onClose}
        className={`flex items-center justify-between w-full pl-12 pr-5 py-3 text-sm transition-colors ${variantClass}`}
      >
        <span className="flex items-center gap-2">
          {child.icon && <span className="text-gray-400">{child.icon}</span>}
          {child.label}
        </span>
        <ChevronRight size={14} className="text-gray-300" />
      </Link>
    );
  }

  return (
    <button
      onClick={() => { child.onClick?.(); onClose(); }}
      className={`flex items-center w-full pl-12 pr-5 py-3 text-sm transition-colors ${variantClass}`}
    >
      {child.icon && <span className="text-gray-400 mr-2">{child.icon}</span>}
      {child.label}
    </button>
  );
}