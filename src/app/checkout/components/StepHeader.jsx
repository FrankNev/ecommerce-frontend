'use client';

import { CheckCircle2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * @param {number}   step    
 * @param {string}   title
 * @param {boolean}  isCompleted
 * @param {boolean}  isActive
 * @param {string}   summary
 * @param {Function} onEdit
 * @param {ReactNode} children
 */
export default function StepHeader({ step, title, isCompleted, isActive, summary, onEdit, children }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isActive ? 'border-gray-900 shadow-sm' : 'border-gray-200'
      } ${!isActive && !isCompleted ? 'opacity-50 pointer-events-none' : ''}`}>

      <div className={`flex items-center gap-4 px-5 py-4 ${isActive ? 'bg-white' : 'bg-gray-50'}`}>
        <div className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 text-sm font-bold transition-colors ${isCompleted
            ? 'bg-green-500 text-white'
            : isActive
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
          {isCompleted ? <CheckCircle2 size={16} /> : step}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
            {title}
          </p>
          {isCompleted && !isActive && summary && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{summary}</p>
          )}
        </div>

        {isCompleted && !isActive && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="shrink-0 text-xs"
            onClick={onEdit}
          >
            <Pencil size={12} />
            Modificar
          </Button>
        )}
      </div>

      {isActive && (
        <div className="px-5 pb-5 pt-1 bg-white border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}