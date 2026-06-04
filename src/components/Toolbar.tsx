import React from 'react';
import { WidgetType } from '../types';
import { Circle, PieChart, BarChartHorizontal, Users, Info, MousePointer2 } from 'lucide-react';

interface Props {
    onAdd: (type: WidgetType) => void;
}

export const Toolbar: React.FC<Props> = ({ onAdd }) => {
    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 bg-[#ece5d3] border border-[#d7ccc8] shadow-2xl rounded-sm p-3 z-50 flex flex-col gap-4">
            <div className="text-center pb-2 border-b border-[#d7ccc8] mb-2">
                <span className="text-[10px] uppercase font-bold text-[#795548] tracking-widest writing-vertical-rl">Elementos</span>
            </div>
            
            <button onClick={() => onAdd('donut')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Donut">
                <Circle size={24} />
            </button>
            <button onClick={() => onAdd('pie')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Pie">
                <PieChart size={24} />
            </button>
            <button onClick={() => onAdd('bars')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Barras Horizontales">
                <BarChartHorizontal size={24} />
            </button>
            <button onClick={() => onAdd('figures')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Figuras">
                <Users size={24} />
            </button>
            <div className="h-px bg-[#d7ccc8] my-1" />
            <button onClick={() => onAdd('info')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Información/Fuente">
                <Info size={24} />
            </button>
            <button onClick={() => onAdd('hotspot')} className="p-3 text-[#5d4037] hover:bg-[#d7ccc8]/30 rounded transition-colors" title="Añadir Navegación (Hotspot)">
                <MousePointer2 size={24} />
            </button>
        </div>
    );
};
