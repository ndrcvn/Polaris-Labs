import { PLANET_NAMES, COLORS, SYMBOLS } from '../lib/constants';
import type { PlanetName } from '../lib/constants';

interface PlanetControlsProps {
  selectedPlanet: PlanetName | null;
  showAll: boolean;
  onSelectPlanet: (name: PlanetName) => void;
  onSelectAll: () => void;
}

export default function PlanetControls({
  selectedPlanet,
  showAll,
  onSelectPlanet,
  onSelectAll,
}: PlanetControlsProps) {
  return (
    <div className="flex flex-wrap gap-1 justify-center px-2 py-1.5 flex-shrink-0">
      {PLANET_NAMES.map((name) => {
        const color = COLORS[name];
        const isActive = !showAll && selectedPlanet === name;
        return (
          <button
            key={name}
            onClick={() => onSelectPlanet(name)}
            style={{
              borderColor: color,
              color: color,
              background: isActive ? `${color}33` : '#1a1a2e',
            }}
            className="rounded-lg px-2 py-0.5 text-xs border cursor-pointer transition-colors duration-150"
          >
            {SYMBOLS[name]} {name}
          </button>
        );
      })}

      <button
        onClick={onSelectAll}
        style={{
          borderColor: '#888',
          color: '#ccc',
          background: showAll ? '#ffffff22' : '#1a1a2e',
        }}
        className="rounded-lg px-2 py-0.5 text-xs border cursor-pointer transition-colors duration-150"
      >
        🌐 All
      </button>
    </div>
  );
}
