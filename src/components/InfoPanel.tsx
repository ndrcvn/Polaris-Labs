import type { PlanetMap, LineType } from '../lib/astronomy';
import { COLORS, SYMBOLS, MEANINGS, zodiacSign, LINE_TYPES } from '../lib/constants';
import type { PlanetName } from '../lib/constants';

interface InfoPanelProps {
  planets: PlanetMap;
  selectedPlanet: PlanetName | null;
  showAll: boolean;
  activeLineTypes: LineType[];
}

export default function InfoPanel({ planets, selectedPlanet, showAll, activeLineTypes }: InfoPanelProps) {
  if (showAll) {
    return (
      <div className="bg-[#12122a] border-t border-[#2a2a4a] px-4 py-2 text-xs flex-shrink-0 min-h-[48px]">
        <h3 className="text-[#FFD700] font-semibold mb-0.5">All Planets</h3>
        <p className="text-[#bbbbdd] leading-snug">
          Showing {activeLineTypes.join(', ')} lines for all planets. Click a planet to focus.
        </p>
      </div>
    );
  }

  if (!selectedPlanet) {
    return (
      <div className="bg-[#12122a] border-t border-[#2a2a4a] px-4 py-2 text-xs flex-shrink-0 min-h-[48px]">
        <p className="text-gray-600">Select a planet to see its lines.</p>
      </div>
    );
  }

  const color = COLORS[selectedPlanet];
  const symbol = SYMBOLS[selectedPlanet];
  const planet = planets[selectedPlanet];
  const displayTypes = activeLineTypes.length > 0 ? activeLineTypes : LINE_TYPES;

  return (
    <div className="bg-[#12122a] border-t border-[#2a2a4a] px-4 py-2 text-xs flex-shrink-0 min-h-[48px]">
      <h3 className="font-semibold mb-1" style={{ color }}>
        {symbol} {selectedPlanet} · {zodiacSign(planet.lon)}
      </h3>
      <p className="text-[#bbbbdd] leading-relaxed">
        {displayTypes.map((lt, i) => (
          <span key={lt}>
            <strong style={{ color }}>{lt}:</strong>{' '}
            {MEANINGS[lt][selectedPlanet]}
            {i < displayTypes.length - 1 ? <br /> : null}
          </span>
        ))}
      </p>
    </div>
  );
}
