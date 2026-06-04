import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { WidgetData } from '../../types';
import { Move } from 'lucide-react';

interface WrapperProps {
    widget: WidgetData;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onUpdatePos: (id: string, x: number, y: number) => void;
    children: React.ReactElement;
    isEditorMode?: boolean;
    ratio?: number;
}

export const WidgetWrapper: React.FC<WrapperProps> = ({ widget, isSelected, onSelect, onUpdatePos, children, isEditorMode = true, ratio = 1 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-10%" });

    return (
        <motion.div
            ref={ref}
            drag={isEditorMode}
            dragMomentum={false}
            initial={{ x: widget.x * ratio, y: widget.y * ratio }}
            animate={{ x: widget.x * ratio, y: widget.y * ratio }}
            onDragEnd={(e, info) => {
                if (isEditorMode) {
                    onUpdatePos(widget.id, widget.x + info.offset.x / ratio, widget.y + info.offset.y / ratio);
                }
            }}
            onClick={(e) => {
                if (isEditorMode) {
                    e.stopPropagation();
                    onSelect(widget.id);
                }
            }}
            className={isEditorMode 
                ? `absolute top-0 left-0 group z-40 cursor-pointer p-4 border-2 border-dashed transition-colors ${isSelected ? 'border-white/80 bg-white/5' : 'border-transparent hover:border-white/30'}`
                : `absolute top-0 left-0 z-40 p-4`
            }
            style={{ touchAction: 'none' }}
        >
            {isEditorMode && (
                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity bg-black/80 text-[#ece5d3] p-1.5 rounded cursor-grab active:cursor-grabbing shadow-lg flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Move size={16} />
                </div>
            )}
            {React.cloneElement(children, { isInView, data: { ...widget.data, id: widget.id } })}
        </motion.div>
    );
}
