import React from 'react';
import { motion } from 'motion/react';
import { WidgetProps } from '../../types';
import { OrganicDefs } from './OrganicDefs';

export const BarsWidget: React.FC<WidgetProps> = ({ id, data, isInView, scale }) => {
    const items = data.items || [];
    const baseColor = data.baseColor || '#3e2723';
    const fillColor = data.color || '#fbfaf8';
    const textureColor = data.textureColor || '#000000';
    const textureOpacity = data.textureOpacity !== undefined ? data.textureOpacity : 0.15;
    const idPrefix = id || data.id || 'bars';
    const hidePercentage = data.hidePercentage || false;

    return (
        <div className="relative flex flex-col gap-6 p-6 pointer-events-none origin-top-left" style={{ transform: `scale(${scale})`, minWidth: '350px' }}>
            {items.map((item: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                    <div className="flex justify-between font-serif font-bold text-sm drop-shadow-md" style={{ color: fillColor }}>
                        <span className="uppercase tracking-widest">{item.label}</span>
                        {!hidePercentage && <Counter from={0} to={item.value} duration={1.6 + (0.2 * i)} suffix="%" isInView={isInView} color={fillColor} />}
                    </div>
                    <div className="relative h-6 rounded-r-md shadow-inner overflow-hidden border border-black/10" style={{ backgroundColor: baseColor }}>
                         <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                             <OrganicDefs idPrefix={`${idPrefix}-${i}`} color={textureColor} opacity={textureOpacity} />
                             <rect width="100%" height="100%" fill={`url(#${idPrefix}-${i}-pattern-dense)`} style={{ mixBlendMode: 'multiply' }} />
                         </svg>
                         <motion.div 
                             initial={{ opacity: 0, width: "0%" }}
                             animate={isInView ? { opacity: 1, width: `${item.value}%` } : { opacity: 0, width: "0%" }}
                             transition={{ duration: 1.6, delay: i * 0.2, ease: "easeInOut" }}
                             className="absolute left-0 top-0 bottom-0 rounded-r-md shadow-[4px_0_15px_rgba(255,255,255,0.2)] overflow-hidden"
                             style={{ backgroundColor: fillColor }}
                         >
                             <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                                 <rect width="100%" height="100%" fill={`url(#${idPrefix}-${i}-pattern)`} style={{ mixBlendMode: 'multiply' }} />
                             </svg>
                         </motion.div>
                    </div>
                </div>
            ))}
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
