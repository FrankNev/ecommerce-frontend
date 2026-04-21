'use client';

export default function ImageVariantMapper({ images, variants, value, onChange }) {
  if (images.length === 0 || variants.length === 0) return null;

  const toggle = (imageKey, clientId) => {
    const current = value[imageKey] ?? [];
    const next = current.includes(clientId)
      ? current.filter(id => id !== clientId)
      : [...current, clientId];
    onChange({ ...value, [imageKey]: next });
  };

  const isChecked = (imageKey, clientId) =>
    (value[imageKey] ?? []).includes(clientId);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700">Asignación imagen → variante</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Marcá qué variantes corresponden a cada imagen. Las imágenes sin marcar
          se muestran siempre (son genéricas del producto).
        </p>
      </div>

      <div className="space-y-3">
        {images.map((img) => (
          <div
            key={img.key}
            className="flex gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50 items-start"
          >
            {/* Thumbnail */}
            <img
              src={img.src}
              alt={img.label}
              className="rounded-lg object-cover shrink-0"
              style={{ width: '56px', height: '56px' }}
            />

            {/* Checkboxes */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 mb-2 truncate">{img.label}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {variants.map((v) => (
                  <label
                    key={v.clientId}
                    className="flex items-center gap-1.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked(img.key, v.clientId)}
                      onChange={() => toggle(img.key, v.clientId)}
                      className="w-3.5 h-3.5 rounded accent-black cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 transition select-none">
                      {v.name || `Variante ${v.clientId}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}