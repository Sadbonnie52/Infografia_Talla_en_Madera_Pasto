import React from 'react';
import { WidgetProps } from '../../types';

export const HotspotWidget: React.FC<WidgetProps> = ({ data, scale, onNavigate }) => {
    const width = data.width || 120;
    const height = data.height || 80;
    const opacity = data.opacity !== undefined ? data.opacity : 0;
    const hoverOpacity = data.hoverOpacity !== undefined ? data.hoverOpacity : 0.15;
    const color = data.color || '#d7ccc8';
    const text = data.text || '';
    const textColor = data.textColor || '#3e2723';
    const textOpacity = data.textOpacity !== undefined ? data.textOpacity : 100;
    const textVisibility = data.textVisibility || 'hover';
    const borderRadius = data.borderRadius !== undefined ? data.borderRadius : 8;
    const showBorder = data.showBorder || false;

    const hexToRgba = (hex: string, op: number) => {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
            
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return `rgba(255,255,255,${op})`;
        }
        return `rgba(${r}, ${g}, ${b}, ${op})`;
    };

    const handleNavigate = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        
        const target = e.currentTarget;
        target.animate([
            { filter: 'brightness(1)' },
            { filter: 'brightness(1.5)', transform: 'scale(1.02)' },
            { filter: 'brightness(1)', transform: 'scale(1)' }
        ], { duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        
        if (data.targetSceneId && typeof data.targetSceneId === 'string' && onNavigate) {
            onNavigate(data.targetSceneId);
        } else {
            console.log("Navigating editorial flow...");
        }
    };

    return (
        <div 
            className="group relative pointer-events-auto origin-top-left cursor-pointer transition-all duration-[800ms] ease-out flex items-center justify-center p-4 outline-none" 
            style={{ 
                width: `${width}px`, 
                height: `${height}px`, 
                transform: `scale(${scale})`,
                backgroundColor: hexToRgba(color, opacity),
                borderRadius: `${borderRadius}px`,
                border: showBorder ? `1px solid ${hexToRgba(color, Math.min(1, opacity + 0.3))}` : 'none'
            }}
            onClick={handleNavigate}
        >
            <div 
                className="absolute inset-0 rounded-inherit pointer-events-none transition-opacity duration-700 ease-out"
                style={{ 
                    backgroundColor: hexToRgba(color, hoverOpacity),
                    opacity: 0
                }}
            />
            {/* We apply hover effect using a style tag to target the before element for cleaner inline styling or just rely on group-hover */}
            <style>{`
                .hotspot-${data.id || 'default'}:hover .hotspot-hover-layer {
                    opacity: 1 !important;
                }
            `}</style>
            
            <div className={`absolute inset-0 hotspot-hover-layer rounded-[inherit] pointer-events-none transition-opacity duration-[800ms] ease-out opacity-0`} style={{ backgroundColor: hexToRgba(color, hoverOpacity), filter: 'blur(4px)' }} />

            {text && (
                <span 
                    className={`font-serif text-sm transition-opacity duration-700 ease-in-out italic drop-shadow-md z-10 select-none text-center ${
                        textVisibility === 'hover' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                    style={{ color: hexToRgba(textColor, textOpacity / 100) }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};
