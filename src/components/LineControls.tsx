import { LINE_TYPES } from '../lib/constants';
import type { LineType } from '../lib/astronomy';

interface LineControlsProps {
  activeLineTypes: Set<LineType>;
  onToggle: (lt: LineType) => void;
}

export default function LineControls({ activeLineTypes, onToggle }: LineControlsProps) {
  return (
    <div className="flex gap-1.5 justify-center px-2 py-1 flex-shrink-0">
      {LINE_TYPES.map((lt) => {
        const isOn = activeLineTypes.has(lt);
        return (
          <button
            key={lt}
            onClick={() => onToggle(lt)}
            className={[
              'border rounded px-3 py-0.5 text-xs cursor-pointer transition-colors',
              isOn
                ? 'text-white border-gray-400 bg-white/10'
                : 'text-gray-500 border-gray-600 bg-[#1a1a2e]',
            ].join(' ')}
          >
            {lt}
          </button>
        );
      })}
    </div>
  );
}
