'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function ExcludedBrandsInput({ value, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const brand = input.trim();
    if (!brand) return;
    if (value.map(b => b.toLowerCase()).includes(brand.toLowerCase())) {
      setInput('');
      return;
    }
    onChange([...value, brand]);
    setInput('');
  };

  const remove = (brand) => onChange(value.filter(b => b !== brand));

  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-500">Excluir marcas</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Ej: Apple"
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>
          Agregar
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(brand => (
            <span
              key={brand}
              className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-full text-xs font-medium"
            >
              {brand}
              <button
                type="button"
                onClick={() => remove(brand)}
                className="hover:text-red-800 transition ml-0.5"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400">Las marcas listadas quedan excluidas del descuento</p>
    </div>
  );
}