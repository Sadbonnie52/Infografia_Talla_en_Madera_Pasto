import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WidgetProps } from '../../types';
import { Info } from 'lucide-react';

export const InfoWidget: React.FC<WidgetProps> = ({ data, scale, onUpdateData }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Button Customization
    const btnTitle = data.title || 'Fuente';
    const btnBgColor = data.btnBgColor || '#ece5d3';
    const btnTextColor = data.btnTextColor || '#5d4037';
    const btnFontSize = data.btnFontSize !== undefined ? data.btnFontSize : 10;
    const btnPadding = data.btnPadding !== undefined ? data.btnPadding : 6;
    const btnOpacity = data.btnOpacity !== undefined ? data.btnOpacity : 0.95;
    const btnBorderRadius = data.btnBorderRadius !== undefined ? data.btnBorderRadius : 4;

    // Panel Customization
    const content = data.content || 'Añade aquí la fuente de información o nota aclaratoria.';
    const panelBgColor = data.bgColor || '#ece5d3';
    const panelTextColor = data.textColor || '#3e2723';
    const panelBgOpacity = data.bgOpacity !== undefined ? data.bgOpacity : 0.95;
    const panelPadding = data.padding !== undefined ? data.padding : 16;
    const panelBorderRadius = data.borderRadius !== undefined ? data.borderRadius : 4;
    const panelFontSize = data.fontSize !== undefined ? data.fontSize : 14;
    const alignment = data.alignment || 'left';
    const blockWidth = data.blockWidth || 250;
    const showShadow = data.showShadow !== undefined ? data.showShadow : true;

    // Panel Offset
    const panelOffsetX = data.panelOffsetX || 0;
    const panelOffsetY = data.panelOffsetY || 0;

    const hexToRgba = (hex: string, opacity: number) => {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
            
        if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return `rgba(236, 229, 211, ${opacity})`;
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const containerStyle = {
        backgroundColor: hexToRgba(panelBgColor, panelBgOpacity),
        color: panelTextColor,
        borderRadius: `${panelBorderRadius}px`,
        boxShadow: showShadow ? '0 10px 40px -5px rgba(0,0,0,0.15), 0 0 10px rgba(0,0,0,0.05)' : 'none',
        border: '1px solid rgba(0,0,0,0.08)',
        backdropFilter: panelBgOpacity < 1 ? 'blur(4px)' : 'none'
    };

    return (
        <div className="relative font-serif pointer-events-none origin-top-left flex flex-col items-center" style={{ transform: `scale(${scale})` }}>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button 
                        key="btn"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                        className="flex items-center gap-2 rounded shadow-sm border border-black/5 hover:shadow-md transition-all duration-500 cursor-pointer select-none pointer-events-auto"
                        style={{
                            backgroundColor: hexToRgba(btnBgColor, btnOpacity),
                            color: btnTextColor,
                            padding: `${btnPadding}px ${btnPadding * 2}px`,
                            borderRadius: `${btnBorderRadius}px`
                        }}
                    >
                        <Info size={Math.max(12, btnFontSize + 2)} className="opacity-70" />
                        <span className="uppercase tracking-[0.2em] font-bold" style={{ fontSize: `${btnFontSize}px` }}>{btnTitle}</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="panel"
                        drag
                        dragMomentum={false}
                        onDragEnd={(_, info) => {
                            if (onUpdateData) {
                                onUpdateData({
                                    panelOffsetX: panelOffsetX + info.offset.x / scale,
                                    panelOffsetY: panelOffsetY + info.offset.y / scale
                                });
                            }
                        }}
                        initial={{ opacity: 0, y: panelOffsetY - 10, x: panelOffsetX, scale: 0.95, filter: 'blur(2px)' }}
                        animate={{ opacity: 1, y: panelOffsetY, x: panelOffsetX, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: panelOffsetY - 10, x: panelOffsetX, scale: 0.95, filter: 'blur(2px)' }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-0 flex flex-col pointer-events-auto cursor-pointer"
                        style={{ width: `${blockWidth}px`, zIndex: 50 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                        }}
                    >
                        <div 
                            className="w-full relative overflow-hidden" 
                            style={containerStyle}
                        >
                            <div style={{ padding: `${panelPadding}px`, fontSize: `${panelFontSize}px`, textAlign: alignment as any }} className="leading-[1.6] opacity-90 italic">
                                {content}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
