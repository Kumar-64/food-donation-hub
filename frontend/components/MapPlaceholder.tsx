import { MapPin } from 'lucide-react';

interface MapPlaceholderProps {
  title?: string;
  address?: string;
  className?: string;
  height?: string;
}

export default function MapPlaceholder({
  title = 'Map View',
  address,
  className = '',
  height = 'h-64',
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative ${height} bg-gradient-to-br from-green-50 to-blue-50 rounded-card border border-border overflow-hidden ${className}`}
    >
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Fake roads */}
      <div className="absolute top-1/3 left-0 right-0 h-1 bg-gray-200/60" />
      <div className="absolute top-0 bottom-0 left-1/3 w-1 bg-gray-200/60" />
      <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-200/40" />
      <div className="absolute top-0 bottom-0 left-2/3 w-0.5 bg-gray-200/40" />

      {/* Location pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute inset-0" />
          <div className="relative w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-surface/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-card">
          <p className="text-sm font-medium text-text">{title}</p>
          {address && (
            <p className="text-xs text-text-secondary mt-0.5">{address}</p>
          )}
        </div>
      </div>
    </div>
  );
}
