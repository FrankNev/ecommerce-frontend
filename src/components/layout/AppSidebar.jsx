'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, ChevronDown } from 'lucide-react';

export default function AppSidebar({ open, onClose, header, sections = [] }) {
  const overlayRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

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
      />

      {/* Panel */}
      <aside
        className="fixed top-0 right-0 z-50 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0 bg-white">
          <div className="flex-1 min-w-0">{header}</div>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-black transition">
            <X size={20} />
          </button>
        </div>

        {/* Listado de items */}
        <div className="flex-1 overflow-y-auto bg-white">
          <nav>
            {sections.map((section) => (
              <SidebarItem 
                key={section.id} 
                section={section} 
                onClose={onClose} 
                router={router} 
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ section, onClose, router }) {
  const [isOpen, setIsOpen] = useState(section.defaultOpen || false);
  
  // Diseño base
  const base = "w-full flex items-center justify-between px-5 py-4 text-sm transition-colors border-b border-gray-100";
  const variantClass = section.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50';

  // Si es un menú colapsable (con hijos)
  if (section.children && section.children.length > 0) {
    return (
      <div className="flex flex-col">
        <button onClick={() => setIsOpen(!isOpen)} className={`${base}`}>
          <span className="flex items-center gap-3 text-sm">
            {section.icon && <span className="text-gray-400 shrink-0">{section.icon}</span>}
            {section.label}
          </span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="bg-gray-50/30">
            {section.children.map((child) => (
              <SidebarChild key={child.id} child={child} onClose={onClose} router={router} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        if (section.href) router.push(section.href);
        if (section.onClick) section.onClick();
        if (section.action) section.action();
        onClose();
      }}
      className={`${base} ${variantClass} font-medium`}
    >
      <span className="flex items-center gap-3">
        {section.icon && <span className="text-gray-400">{section.icon}</span>}
        {section.label}
      </span>
      <ChevronRight size={16} />
    </button>
  );
}

function SidebarChild({ child, onClose, router }) {
  const variantClass = child.variant === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50';
  
  return (
    <button
      onClick={() => {
        if (child.href) router.push(child.href);
        if (child.action) child.action();
        onClose();
      }}
      className={`flex items-center justify-between w-full pl-12 pr-5 py-4 text-sm transition-colors border-b border-gray-100/50 ${variantClass}`}
    >
      <span className="flex items-center gap-2">
        {child.icon && <span className="text-gray-400 shrink-0">{child.icon}</span>}
        {child.label}
      </span>
      <ChevronRight size={14} />
    </button>
  );
}