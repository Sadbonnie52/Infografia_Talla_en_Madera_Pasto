import React from 'react';
import { motion } from 'motion/react';
import { WidgetProps } from '../../types';
import { OrganicDefs } from './OrganicDefs';

export const DonutWidget: React.FC<WidgetProps> = ({ id, data, isInView, scale }) => {
    // Legacy support for percentage/color or default items
    const items = data.items || [{ percentage: data.percentage || 0, label: data.label, color: data.color || '#fbfaf8' }];
    
    const baseColor = data.baseColor || '#3e2723';
    const textureColor = data.textureColor || '#000000';
    const textureOpacity = data.textureOpacity !== undefined ? data.textureOpacity : 0.15;
    const strokeWidth = data.thickness || 18;
    const radius = 50 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const idPrefix = id || data.id || 'donut';
    
    const rotation = data.rotation || 0;
    const aperture = data.aperture !== undefined ? data.aperture : 360;
    const baseArcLength = (aperture / 360) * circumference;
    
    // Labels global configuration
    const globalLabelPosition = data.labelPosition || 'inside'; // 'inside' | 'outside' | 'center'
    const globalLabelContent = data.labelContent || 'all'; // 'all' | 'name' | 'percent' | 'hidden'
    // Legacy fallback
    if (data.hidePercentage !== undefined) {
        // If it was true, and we are migrating:
    }

    const total = items.reduce((sum: number, item: any) => sum + (Number(item.percentage) || 0), 0) || 1;
    
    let cumulativeValue = 0;

    return (
        <div className="relative w-56 h-56 flex items-center justify-center pointer-events-none origin-center" style={{ transform: `scale(${scale})` }}>
            <svg 
                className="absolute inset-0 w-full h-full drop-shadow-md overflow-visible" 
                viewBox="0 0 100 100"
            >
                <OrganicDefs idPrefix={idPrefix} color={textureColor} opacity={textureOpacity} />
                {items.map((item: any, i: number) => {
                    const itemTextureColor = item.textureColor || textureColor;
                    return itemTextureColor !== textureColor ? <OrganicDefs key={`def-${i}`} idPrefix={`${idPrefix}-${i}`} color={itemTextureColor} opacity={textureOpacity} /> : null;
                })}
                <g style={{ transform: `rotate(${-90 + rotation}deg)`, transformOrigin: '50px 50px' }}>
                    <circle 
                        cx="50" cy="50" r={radius} 
                        fill="transparent" 
                        stroke={baseColor} 
                        strokeWidth={strokeWidth} 
                        strokeDasharray={`${baseArcLength} ${circumference}`}
                        strokeDashoffset={0}
                    />
                    <circle 
                        cx="50" cy="50" r={radius} 
                        fill="transparent" 
                        stroke={`url(#${idPrefix}-pattern)`} 
                        strokeWidth={strokeWidth} 
                        style={{ mixBlendMode: 'overlay' }} 
                        strokeDasharray={`${baseArcLength} ${circumference}`}
                        strokeDashoffset={0}
                    />

                    {items.map((item: any, i: number) => {
                        const val = Number(item.percentage) || 0;
                        const arcLength = (val / total) * baseArcLength;
                        const startOffset = (cumulativeValue / total) * baseArcLength;
                        cumulativeValue += val;
                        const itemTextureId = item.textureColor && item.textureColor !== textureColor ? `${idPrefix}-${i}-pattern` : `${idPrefix}-pattern`;

                        return (
                            <g key={i}>
                                <motion.circle 
                                    cx="50" cy="50" r={radius} 
                                    fill="transparent" 
                                    stroke={item.color || '#fbfaf8'} 
                                    strokeWidth={strokeWidth}
                                    strokeDashoffset={-startOffset}
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={isInView ? { strokeDasharray: `${arcLength} ${circumference}` } : { strokeDasharray: `0 ${circumference}` }}
                                    transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                                />
                                <motion.circle 
                                    cx="50" cy="50" r={radius} 
                                    fill="transparent" 
                                    stroke={`url(#${itemTextureId})`} 
                                    strokeWidth={strokeWidth}
                                    strokeDashoffset={-startOffset}
                                    initial={{ strokeDasharray: `0 ${circumference}` }}
                                    animate={isInView ? { strokeDasharray: `${arcLength} ${circumference}` } : { strokeDasharray: `0 ${circumference}` }}
                                    transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                                    style={{ mixBlendMode: 'multiply' }}
                                />
                            </g>
                        );
                    })}
                </g>
            </svg>

            {/* Labels overlay */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {(() => {
                    let textCumulative = 0;
                    return items.map((item: any, i: number) => {
                        const val = Number(item.percentage) || 0;
                        const pos = item.labelPosition || globalLabelPosition;
                        const content = item.labelContent || globalLabelContent;
                        
                        if (content === 'hidden' || pos === 'center') {
                            textCumulative += val;
                            return null;
                        }

                        // Calculate visual angle
                        const itemAngle = (val / total) * aperture;
                        const middleAngle = textCumulative * (aperture / total) + itemAngle / 2;
                        textCumulative += val;

                        const absoluteMiddleAngle = -90 + rotation + middleAngle;
                        const absoluteMiddleAngleRad = (absoluteMiddleAngle * Math.PI) / 180;
                        
                        const isOutside = pos === 'outside';
                        
                        // Radii for text placement
                        const textR = isOutside ? 50 + 20 : radius;

                        // Values relative to standard 224x224 (w-56 h-56) layout. 
                        // Center is 112, 112
                        const centerX = 112;
                        const centerY = 112;
                        
                        // We scale the 0-100 viewport to full pixels
                        // 1 viewBox unit = 2.24 pixels
                        const renderR = textR * 2.24;
                        
                        const textX = centerX + Math.cos(absoluteMiddleAngleRad) * renderR;
                        const textY = centerY + Math.sin(absoluteMiddleAngleRad) * renderR;

                        const showName = content === 'all' || content === 'name';
                        const showPercent = content === 'all' || content === 'percent';

                        return (
                            <motion.div 
                                key={`label-${i}`}
                                className="absolute flex flex-col items-center justify-center font-serif"
                                style={{ 
                                    left: textX, 
                                    top: textY,
                                    transform: 'translate(-50%, -50%)',
                                    color: isOutside ? item.color : '#ffffff',
                                    textShadow: isOutside ? 'none' : '0 1px 3px rgba(0,0,0,0.5)',
                                    width: 'max-content'
                                }}
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                {showName && item.label && <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>}
                                {showPercent && <Counter from={0} to={val} duration={1.5} suffix="%" className={`font-bold ${isOutside ? 'text-lg' : 'text-sm'}`} isInView={isInView} />}
                            </motion.div>
                        );
                    });
                })()}

                {globalLabelPosition === 'center' && globalLabelContent !== 'hidden' && items.length > 0 && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                         {(() => {
                             const firstItem = items[0];
                             const val = Number(firstItem.percentage) || 0;
                             const showName = globalLabelContent === 'all' || globalLabelContent === 'name';
                             const showPercent = globalLabelContent === 'all' || globalLabelContent === 'percent';
                             return (
                                 <>
                                     {showPercent && <Counter from={0} to={val} duration={1.5} suffix="%" className="text-5xl font-serif drop-shadow-md font-bold" color={firstItem.color || '#fbfaf8'} isInView={isInView} />}
                                     {showName && firstItem.label && <span className="font-serif text-sm mt-1 drop-shadow-md uppercase tracking-widest font-bold" style={{ color: firstItem.color || '#fbfaf8' }}>{firstItem.label}</span>}
                                 </>
                             );
                         })()}
                     </div>
                )}
            </div>
        </div>
    )
}

const Counter = ({ from, to, duration, suffix = "", className = "", color, isInView }: any) => {
    const [count, React_setCount] = React.useState(from);
    React.useEffect(() => {
        if (!isInView) {
            React_setCount(0);
            return;
        }
        let startTemplate = performance.now();
        let animationFrameId: number;
        const step = (now: number) => {
            const elapsed = now - startTemplate;
            const p = Math.min(elapsed / (duration * 1000), 1);
            const easeOutQuart = 1 - Math.pow(1 - p, 4);
            React_setCount(Math.round(from + (to - from) * easeOutQuart));
            if (p < 1) animationFrameId = requestAnimationFrame(step);
        };
        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [from, to, duration, isInView]);

    return <span className={className} style={{ color }}>{count}{suffix}</span>;
}
