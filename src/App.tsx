import { useState, useMemo } from 'react';
import AstroMap from './components/AstroMap';
import PlanetControls from './components/PlanetControls';
import LineControls from './components/LineControls';
import InfoPanel from './components/InfoPanel';
import { jday, gst0, computePlanetData } from './lib/astronomy';
import type { LineType } from './lib/astronomy';
import { BIRTH, LINE_TYPES } from './lib/constants';
import type { PlanetName } from './lib/constants';

// Pre-compute birth chart data (static)
const JD = jday(BIRTH.year, BIRTH.month, BIRTH.day, BIRTH.hour);
const GST = gst0(JD);

export default function App() {
  const planets = useMemo(() => computePlanetData(JD), []);

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetName | null>('Sun');
  const [showAll, setShowAll] = useState(false);
  const [activeLineTypes, setActiveLineTypes] = useState<Set<LineType>>(new Set(LINE_TYPES));

  function handleSelectPlanet(name: PlanetName) {
    setSelectedPlanet(name);
    setShowAll(false);
  }

  function handleSelectAll() {
    setShowAll(true);
    setSelectedPlanet(null);
  }

  function handleToggleLine(lt: LineType) {
    setActiveLineTypes((prev) => {
      if (prev.has(lt) && prev.size === 1) return prev; // keep at least one active
      const next = new Set(prev);
      if (next.has(lt)) next.delete(lt);
      else next.add(lt);
      return next;
    });
  }

  const lineTypesArray = LINE_TYPES.filter((lt) => activeLineTypes.has(lt));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a1a] text-[#e0e0ff] font-serif">
      {/* Header */}
      <header className="text-center px-2 pt-2 pb-0.5 flex-shrink-0">
        <h1 className="text-[#FFD700] text-lg font-semibold tracking-wide">✦ Astrocartography ✦</h1>
        <p className="text-[#aabbcc] text-xs mt-0.5">{BIRTH.label}</p>
      </header>

      {/* Planet selector */}
      <PlanetControls
        selectedPlanet={selectedPlanet}
        showAll={showAll}
        onSelectPlanet={handleSelectPlanet}
        onSelectAll={handleSelectAll}
      />

      {/* Line type toggles */}
      <LineControls activeLineTypes={activeLineTypes} onToggle={handleToggleLine} />

      {/* Map — takes remaining space */}
      <AstroMap
        planets={planets}
        gst={GST}
        selectedPlanet={selectedPlanet}
        showAll={showAll}
        activeLineTypes={lineTypesArray}
      />

      {/* Interpretation panel */}
      <InfoPanel
        planets={planets}
        selectedPlanet={selectedPlanet}
        showAll={showAll}
        activeLineTypes={lineTypesArray}
      />
    </div>
  );
}
