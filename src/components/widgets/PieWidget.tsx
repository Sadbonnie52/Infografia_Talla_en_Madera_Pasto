import React from 'react';
import { motion } from 'motion/react';
import { WidgetProps } from '../../types';
import { OrganicDefs } from './OrganicDefs';

export const PieWidget: React.FC<WidgetProps> = ({ id, data, isInView, scale }) => {
    // Legacy support for percentage/color or default items
    const items = data.items || [{ percentage: data.percentage || 50, label: data.label, color: data.color || '#fbfaf8' }];
    
    const baseColor = data.baseColor || '#3e2723';
    const textureColor = data.textureColor || '#000000';
    const textureOpacity = data.textureOpacity !== undefined ? data.textureOpacity : 0.15;
    const idPrefix = id || data.id || 'pie';

    const rotation = data.rotation || 0;
    const aperture = data.aperture !== undefined ? data.aperture : 360;

    // Radius for Pie is different. R = 25, so we use strokeWidth 50 to fill it.
    const radius = 25;
    const strokeWidth = 50;
    const circumference = 2 * Math.PI * radius; // 157.08
    const baseArcLength = (aperture / 360) * circumference;
    
    // Labels global configuration
    const globalLabelPosition = data.labelPosition || 'inside'; // 'inside' | 'outside' | 'center'
    const globalLabelContent = data.labelContent || 'all'; // 'all' | 'name' | 'percent' | 'hidden'
    
    const total = items.reduce((sum: number, item: any) => sum + (Number(item.percentage) || 0), 0) || 1;
    
    let cumulativeValue = 0;

    return (
        <div className="relative w-52 h-52 flex items-center justify-center pointer-events-none origin-center" style={{ transform: `scale(${scale})` }}>
            <svg 
                className="absolute inset-0 w-full h-full drop-shadow-lg overflow-visible" 
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
                        stroke={`url(#${idPrefix}-pattern-dense)`} 
                        strokeWidth={strokeWidth} 
                        style={{ mixBlendMode: 'multiply' }} 
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
            <div className="absolute inset-0 w-full h-full pointer-events-none z-10 font-serif">
                {(() => {
                    let textCumulative = 0;
                    return items.map((item: any, i: number) => {
                        const val = Number(item.percentage) || 0;
                        // Use segment-specific label settings, defaulting to global settings
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
                        
                        // Radii for text placement. Pie is solid, so inside is halfway full radius (25)
                        const textR = isOutside ? 50 + 20 : 25;

                        // Values relative to standard 208x208 (w-52 h-52) layout. 
                        // Center is 104, 104
                        const centerX = 104;
                        const centerY = 104;
                        
                        // 1 viewBox unit = 2.08 pixels (w-52 = 208px)
                        const renderR = textR * 2.08;
                        
                        const textX = centerX + Math.cos(absoluteMiddleAngleRad) * renderR;
                        const textY = centerY + Math.sin(absoluteMiddleAngleRad) * renderR;

                        const showName = content === 'all' || content === 'name';
                        const showPercent = content === 'all' || content === 'percent';

                        return (
                            <motion.div 
                                key={`label-${i}`}
                                className="absolute flex flex-col items-center justify-center font-serif leading-tight"
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
                                 <span className="font-serif text-xl font-bold px-2 py-1 bg-black/20 rounded backdrop-blur-sm text-center drop-shadow-md" style={{ color: firstItem.color || '#fbfaf8' }}>
                                     {showName && firstItem.label}{showName && showPercent && ': '}
                                     {showPercent && <Counter from={0} to={val} duration={1.5} suffix="%" isInView={isInView} />}
                                 </span>
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
