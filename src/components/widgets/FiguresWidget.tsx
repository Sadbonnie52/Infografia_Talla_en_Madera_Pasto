import React from 'react';
import { motion } from 'motion/react';
import { WidgetProps } from '../../types';
import { OrganicDefs } from './OrganicDefs';

export const FiguresWidget: React.FC<WidgetProps> = ({ id, data, isInView, scale }) => {
    const gap = data.gap !== undefined ? data.gap : 32;
    const swapOrder = data.swapOrder || false;
    const hidePercentage = data.hidePercentage || false;
    const idPrefix = id || data.id || 'fig';

    const woman = (
        <Figure 
            key="woman"
            idPrefix={`${idPrefix}-woman`}
            icon="woman" 
            percentage={data.womanPercentage || 0} 
            isInView={isInView} 
            baseColor={data.baseColor} 
            fillColor={data.color} 
            textureColor={data.textureColor}
            textureOpacity={data.textureOpacity}
            label={data.womanLabel}
            hidePercentage={hidePercentage}
        />
    );

    const man = (
        <Figure 
            key="man"
            idPrefix={`${idPrefix}-man`}
            icon="man" 
            percentage={data.manPercentage || 0} 
            isInView={isInView} 
            baseColor={data.baseColor} 
            fillColor={data.color} 
            textureColor={data.textureColor}
            textureOpacity={data.textureOpacity}
            label={data.manLabel}
            hidePercentage={hidePercentage}
        />
    );

    const figures = swapOrder ? [man, woman] : [woman, man];

    return (
        <div className="relative flex pointer-events-none origin-center items-center justify-center" style={{ transform: `scale(${scale})` }}>
            {figures.map((fig, i) => (
                <div key={fig.key} style={{ marginLeft: i > 0 ? `${gap}px` : '0px' }}>
                    {fig}
                </div>
            ))}
        </div>
    )
}

const Figure = ({ icon, percentage, isInView, baseColor = '#3e2723', fillColor = '#fbfaf8', label, idPrefix, textureColor = '#000000', textureOpacity = 0.15, hidePercentage = false }: any) => {
    // Organic Rounded Woman Icon (Editorial/Artisanal)
    const womanPath = "M 50 12 C 43 12 38 17 38 24 C 38 31 43 36 50 36 C 57 36 62 31 62 24 C 62 17 57 12 50 12 Z M 44 40 C 40 40 37 43 35 48 L 21 102 C 20 107 23 112 28 112 L 37 112 L 37 136 C 37 140 40 143 44 143 L 48 143 C 52 143 55 140 55 136 L 55 112 L 55 136 C 55 140 58 143 62 143 L 66 143 C 70 143 73 140 73 136 L 73 112 L 82 112 C 87 112 90 107 89 102 L 75 48 C 73 43 70 40 66 40 L 44 40 Z";
    // Organic Rounded Man Icon (Editorial/Artisanal)
    const manPath = "M 50 12 C 43 12 38 17 38 24 C 38 31 43 36 50 36 C 57 36 62 31 62 24 C 62 17 57 12 50 12 Z M 35 40 C 29 40 25 45 25 51 L 25 82 C 25 85 27 88 31 88 L 35 88 L 35 136 C 35 140 38 143 42 143 L 47 143 C 51 143 54 140 54 136 L 54 92 L 54 136 C 54 140 57 143 61 143 L 66 143 C 70 143 73 140 73 136 L 73 88 L 77 88 C 81 88 84 85 84 82 L 84 51 C 84 45 79 40 73 40 L 35 40 Z";
    
    const path = icon === 'woman' ? womanPath : manPath;
    
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-[80px] h-[150px]">
                <svg viewBox="0 0 100 150" className="absolute inset-0 w-full h-full" style={{ color: baseColor, filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}>
                    <OrganicDefs idPrefix={idPrefix} color={textureColor} opacity={textureOpacity} />
                    <path d={path} fill="currentColor" />
                    <path d={path} fill={`url(#${idPrefix}-pattern-dense)`} style={{ mixBlendMode: 'multiply' }} />
                </svg>
                <motion.svg 
                    viewBox="0 0 100 150" 
                    className="absolute inset-0 w-full h-full drop-shadow-sm"
                    style={{ color: fillColor }}
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={isInView ? { clipPath: `inset(${100 - percentage}% 0 0 0)` } : { clipPath: "inset(100% 0 0 0)" }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                >
                    <path d={path} fill="currentColor" />
                    <path d={path} fill={`url(#${idPrefix}-pattern)`} style={{ mixBlendMode: 'multiply' }} />
                </motion.svg>
            </div>
            <div className="text-2xl font-serif drop-shadow-lg font-bold flex flex-col items-center" style={{ color: fillColor }}>
              {!hidePercentage && <span>{Math.round(percentage)}%</span>}
              {label && <span className="text-sm mt-1 uppercase tracking-widest">{label}</span>}
            </div>
        </div>
    )
}
