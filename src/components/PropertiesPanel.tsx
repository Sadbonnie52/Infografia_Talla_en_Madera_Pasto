import React from 'react';
import { WidgetData } from '../types';
import { Trash2, Copy, X, Plus, Minus } from 'lucide-react';

export interface Props {
    widget: WidgetData;
    onUpdate: (id: string, updates: Partial<WidgetData>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onClose: () => void;
    scenes?: { id: string; name: string }[];
}

export const PropertiesPanel: React.FC<Props> = ({ widget, onUpdate, onDelete, onDuplicate, onClose, scenes = [] }) => {

    const handleDataChange = (field: string, value: any) => {
        onUpdate(widget.id, { data: { ...widget.data, [field]: value } });
    };

    return (
        <div className="fixed right-6 top-6 w-80 bg-[#ece5d3] border border-[#d7ccc8] shadow-2xl rounded-sm p-5 z-50 overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6 border-b border-[#d7ccc8] pb-3">
                <h3 className="font-serif text-[#3e2723] uppercase tracking-widest text-sm font-bold">Editar {widget.type}</h3>
                <div className="flex gap-2 text-[#795548]">
                    <button onClick={() => onDuplicate(widget.id)} className="hover:text-[#3e2723]" title="Duplicar"><Copy size={16} /></button>
                    <button onClick={() => onDelete(widget.id)} className="hover:text-red-700" title="Eliminar"><Trash2 size={16} /></button>
                    <button onClick={onClose} className="hover:text-[#3e2723] ml-2"><X size={18} /></button>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Escala ({widget.scale}x)</label>
                    <input 
                        type="range" min="0.5" max="2" step="0.1" 
                        value={widget.scale} 
                        onChange={(e) => onUpdate(widget.id, { scale: parseFloat(e.target.value) })}
                        className="w-full accent-[#795548]"
                    />
                </div>

                {widget.type === 'donut' && (
                    <>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Apertura Radial ({widget.data.aperture !== undefined ? widget.data.aperture : 360}°)</label>
                           <input 
                               type="range" min="10" max="360" step="5" 
                               value={widget.data.aperture !== undefined ? widget.data.aperture : 360} 
                               onChange={(e) => handleDataChange('aperture', parseInt(e.target.value))}
                               className="w-full accent-[#795548]"
                           />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Rotación Gráfica ({widget.data.rotation || 0}°)</label>
                           <input 
                               type="range" min="0" max="360" step="5" 
                               value={widget.data.rotation || 0} 
                               onChange={(e) => handleDataChange('rotation', parseInt(e.target.value))}
                               className="w-full accent-[#795548]"
                           />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Grosor del Aro ({widget.data.thickness || 18})</label>
                           <input 
                               type="range" min="5" max="40" step="1" 
                               value={widget.data.thickness || 18} 
                               onChange={(e) => handleDataChange('thickness', parseInt(e.target.value))}
                               className="w-full accent-[#795548]"
                           />
                        </div>
                    </>
                )}

                {widget.type === 'pie' && (
                    <>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Apertura Radial ({widget.data.aperture !== undefined ? widget.data.aperture : 360}°)</label>
                           <input 
                               type="range" min="10" max="360" step="5" 
                               value={widget.data.aperture !== undefined ? widget.data.aperture : 360} 
                               onChange={(e) => handleDataChange('aperture', parseInt(e.target.value))}
                               className="w-full accent-[#795548]"
                           />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Rotación Gráfica ({widget.data.rotation || 0}°)</label>
                           <input 
                               type="range" min="0" max="360" step="5" 
                               value={widget.data.rotation || 0} 
                               onChange={(e) => handleDataChange('rotation', parseInt(e.target.value))}
                               className="w-full accent-[#795548]"
                           />
                        </div>
                    </>
                )}

                {widget.type === 'figures' && (
                    <>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs text-[#5d4037] font-bold">Porcentaje Mujer</label>
                           <input type="number" value={widget.data.womanPercentage || 0} onChange={(e) => handleDataChange('womanPercentage', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs text-[#5d4037] font-bold">Etiqueta Mujer</label>
                           <input type="text" value={widget.data.womanLabel || ''} onChange={(e) => handleDataChange('womanLabel', e.target.value)} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>
                         <div className="flex flex-col gap-2 mt-4">
                           <label className="block text-xs text-[#5d4037] font-bold">Porcentaje Hombre</label>
                           <input type="number" value={widget.data.manPercentage || 0} onChange={(e) => handleDataChange('manPercentage', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs text-[#5d4037] font-bold">Etiqueta Hombre</label>
                           <input type="text" value={widget.data.manLabel || ''} onChange={(e) => handleDataChange('manLabel', e.target.value)} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Intercambiar Orden</label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={widget.data.swapOrder || false} onChange={(e) => handleDataChange('swapOrder', e.target.checked)} className="accent-[#795548] w-4 h-4" />
                                <span className="text-sm text-[#5d4037] font-serif">Hombre primero</span>
                            </label>
                        </div>
                        <div className="flex flex-col gap-2 mt-4">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Distancia Horizontal ({widget.data.gap !== undefined ? widget.data.gap : 32}px)</label>
                            <input 
                                type="range" min="-40" max="100" step="2" 
                                value={widget.data.gap !== undefined ? widget.data.gap : 32} 
                                onChange={(e) => handleDataChange('gap', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>
                    </>
                )}

                 {['bars', 'donut', 'pie'].includes(widget.type) && (
                    <div className="space-y-4">
                        <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold border-b border-[#d7ccc8] pb-2">Segmentos</label>
                        {widget.data.items?.map((item: any, i: number) => (
                            <div key={i} className="flex gap-2 items-center bg-black/5 p-2 rounded">
                                <div className="flex-1 space-y-2">
                                    <input type="text" value={item.label || ''} placeholder="Etiqueta" onChange={(e) => {
                                        const newItems = [...widget.data.items];
                                        newItems[i].label = e.target.value;
                                        handleDataChange('items', newItems);
                                    }} className="w-full px-2 py-1 text-xs border border-[#ccc] bg-white rounded" />
                                    <input type="number" value={item.percentage !== undefined ? item.percentage : item.value} placeholder="Valor" onChange={(e) => {
                                        const newItems = [...widget.data.items];
                                        if (widget.type === 'bars') {
                                            newItems[i].value = parseInt(e.target.value) || 0;
                                        } else {
                                            newItems[i].percentage = parseInt(e.target.value) || 0;
                                        }
                                        handleDataChange('items', newItems);
                                    }} className="w-full px-2 py-1 text-xs border border-[#ccc] bg-white rounded" />
                                    {['donut', 'pie'].includes(widget.type) && (
                                        <>
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={item.color || '#fbfaf8'} onChange={(e) => {
                                                const newItems = [...widget.data.items];
                                                newItems[i].color = e.target.value;
                                                handleDataChange('items', newItems);
                                            }} className="w-8 h-6 rounded cursor-pointer" />
                                            <input type="color" value={item.textureColor || widget.data.textureColor || '#000000'} onChange={(e) => {
                                                const newItems = [...widget.data.items];
                                                newItems[i].textureColor = e.target.value;
                                                handleDataChange('items', newItems);
                                            }} className="w-8 h-6 rounded cursor-pointer" />
                                            <span className="text-[10px] text-gray-500 uppercase leading-tight">Color / Textura</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <select 
                                                value={item.labelPosition || ''} 
                                                onChange={(e) => {
                                                    const newItems = [...widget.data.items];
                                                    newItems[i].labelPosition = e.target.value;
                                                    handleDataChange('items', newItems);
                                                }}
                                                className="w-1/2 px-2 py-1 text-xs border border-[#ccc] bg-white rounded"
                                            >
                                                <option value="">Pos global</option>
                                                <option value="inside">Dentro</option>
                                                <option value="outside">Fuera</option>
                                            </select>
                                            <select 
                                                value={item.labelContent || ''} 
                                                onChange={(e) => {
                                                    const newItems = [...widget.data.items];
                                                    newItems[i].labelContent = e.target.value;
                                                    handleDataChange('items', newItems);
                                                }}
                                                className="w-1/2 px-2 py-1 text-xs border border-[#ccc] bg-white rounded"
                                            >
                                                <option value="">Cont global</option>
                                                <option value="all">Nombre y Val</option>
                                                <option value="name">Solo Nomb</option>
                                                <option value="percent">Solo Val</option>
                                                <option value="hidden">Ocultar</option>
                                            </select>
                                        </div>
                                        </>
                                    )}
                                </div>
                                <button onClick={() => {
                                    const newItems = [...widget.data.items];
                                    newItems.splice(i, 1);
                                    handleDataChange('items', newItems);
                                }} className="text-red-700 hover:text-red-900 p-1"><Minus size={16} /></button>
                            </div>
                        ))}
                        <button onClick={() => {
                            const newValue = 50;
                            const newItem = widget.type === 'bars' 
                                ? { label: 'Nueva', value: newValue } 
                                : { label: 'Nueva', percentage: newValue, color: '#fbfaf8' };
                            const newItems = [...(widget.data.items || []), newItem];
                            handleDataChange('items', newItems);
                        }} className="w-full py-2 bg-[#795548] text-white rounded text-xs uppercase font-bold flex items-center justify-center gap-2 hover:bg-[#5d4037]">
                            <Plus size={14} /> Añadir Segmento
                        </button>
                    </div>
                 )}

                 {widget.type === 'info' && (
                     <div className="space-y-4">
                        <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold border-b border-[#d7ccc8] pb-1">Botón</label>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Título Botón</label>
                           <input type="text" value={widget.data.title || ''} onChange={(e) => handleDataChange('title', e.target.value)} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Tamaño Letra</label>
                               <input type="number" value={widget.data.btnFontSize !== undefined ? widget.data.btnFontSize : 10} onChange={(e) => handleDataChange('btnFontSize', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Padding (Botón)</label>
                               <input type="number" value={widget.data.btnPadding !== undefined ? widget.data.btnPadding : 6} onChange={(e) => handleDataChange('btnPadding', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color Fondo Botón</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.btnBgColor || '#ece5d3'} onChange={(e) => handleDataChange('btnBgColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color Texto Botón</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.btnTextColor || '#5d4037'} onChange={(e) => handleDataChange('btnTextColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Opacidad Fondo Botón: {(widget.data.btnOpacity !== undefined ? widget.data.btnOpacity : 0.95).toFixed(2)}</label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={widget.data.btnOpacity !== undefined ? widget.data.btnOpacity : 0.95} 
                                onChange={(e) => handleDataChange('btnOpacity', parseFloat(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Redondeo Botón ({widget.data.btnBorderRadius !== undefined ? widget.data.btnBorderRadius : 4}px)</label>
                            <input 
                                type="range" min="0" max="24" step="1" 
                                value={widget.data.btnBorderRadius !== undefined ? widget.data.btnBorderRadius : 4} 
                                onChange={(e) => handleDataChange('btnBorderRadius', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold border-b border-[#d7ccc8] pb-1 mt-6">Panel Desplegable</label>
                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Contenido Desplegable</label>
                           <textarea value={widget.data.content || ''} onChange={(e) => handleDataChange('content', e.target.value)} rows={4} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded resize-y" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Ancho (px)</label>
                               <input type="number" value={widget.data.blockWidth || 250} onChange={(e) => handleDataChange('blockWidth', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Tamaño Letra</label>
                               <input type="number" value={widget.data.fontSize || 14} onChange={(e) => handleDataChange('fontSize', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Alineación</label>
                            <select value={widget.data.alignment || 'left'} onChange={(e) => handleDataChange('alignment', e.target.value)} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded">
                                <option value="left">Izquierda</option>
                                <option value="center">Centro</option>
                                <option value="right">Derecha</option>
                                <option value="justify">Justificado</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color Fondo Panel</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.bgColor || '#ece5d3'} onChange={(e) => handleDataChange('bgColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color Texto Panel</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.textColor || '#3e2723'} onChange={(e) => handleDataChange('textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Opacidad Fondo Panel: {(widget.data.bgOpacity !== undefined ? widget.data.bgOpacity : 0.95).toFixed(2)}</label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={widget.data.bgOpacity !== undefined ? widget.data.bgOpacity : 0.95} 
                                onChange={(e) => handleDataChange('bgOpacity', parseFloat(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Padding Panel ({widget.data.padding !== undefined ? widget.data.padding : 16}px)</label>
                            <input 
                                type="range" min="0" max="40" step="2" 
                                value={widget.data.padding !== undefined ? widget.data.padding : 16} 
                                onChange={(e) => handleDataChange('padding', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Redondeo Panel ({widget.data.borderRadius !== undefined ? widget.data.borderRadius : 4}px)</label>
                            <input 
                                type="range" min="0" max="24" step="1" 
                                value={widget.data.borderRadius !== undefined ? widget.data.borderRadius : 4} 
                                onChange={(e) => handleDataChange('borderRadius', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={widget.data.showShadow !== false} onChange={(e) => handleDataChange('showShadow', e.target.checked)} className="accent-[#795548] w-4 h-4" />
                                 <span className="text-sm text-[#5d4037] font-serif font-bold uppercase tracking-wider">Sombra Suave</span>
                             </label>
                        </div>
                     </div>
                 )}

                 {widget.type === 'hotspot' && (
                     <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Ancho (px)</label>
                               <input type="number" value={widget.data.width || 120} onChange={(e) => handleDataChange('width', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                            <div className="flex flex-col gap-2 w-1/2">
                               <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Alto (px)</label>
                               <input type="number" value={widget.data.height || 80} onChange={(e) => handleDataChange('height', parseInt(e.target.value))} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Escena Destino</label>
                           <select 
                               value={widget.data.targetSceneId || ''} 
                               onChange={(e) => handleDataChange('targetSceneId', e.target.value)}
                               className="w-full px-2 py-1 border border-[#ccc] bg-white rounded"
                           >
                               <option value="">Ninguna</option>
                               {scenes.map(s => (
                                   <option key={s.id} value={s.id}>{s.name}</option>
                               ))}
                           </select>
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Texto Opcional</label>
                           <input type="text" value={widget.data.text || ''} onChange={(e) => handleDataChange('text', e.target.value)} className="w-full px-2 py-1 border border-[#ccc] bg-white rounded" />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color del Texto</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.textColor || '#3e2723'} onChange={(e) => handleDataChange('textColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                <input type="text" value={widget.data.textColor || '#3e2723'} onChange={(e) => handleDataChange('textColor', e.target.value)} className="w-24 px-2 py-1 text-xs border border-[#ccc] bg-white rounded uppercase font-mono" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Opacidad del Texto ({widget.data.textOpacity !== undefined ? widget.data.textOpacity : 100}%)</label>
                            <input 
                                type="range" min="0" max="100" step="1" 
                                value={widget.data.textOpacity !== undefined ? widget.data.textOpacity : 100} 
                                onChange={(e) => handleDataChange('textOpacity', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Modo de visualización del texto</label>
                            <select 
                                value={widget.data.textVisibility || 'hover'} 
                                onChange={(e) => handleDataChange('textVisibility', e.target.value)}
                                className="w-full px-2 py-1 border border-[#ccc] bg-white rounded"
                            >
                                <option value="hover">Mostrar al pasar el cursor</option>
                                <option value="always">Mostrar siempre</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Color</label>
                            <div className="flex gap-2 items-center">
                                <input type="color" value={widget.data.color || '#d7ccc8'} onChange={(e) => handleDataChange('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                <input type="text" value={widget.data.color || '#d7ccc8'} onChange={(e) => handleDataChange('color', e.target.value)} className="w-24 px-2 py-1 text-xs border border-[#ccc] bg-white rounded uppercase font-mono" />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Opacidad Base: {(widget.data.opacity !== undefined ? widget.data.opacity : 0).toFixed(2)}</label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={widget.data.opacity !== undefined ? widget.data.opacity : 0} 
                                onChange={(e) => handleDataChange('opacity', parseFloat(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Opacidad (Hover): {(widget.data.hoverOpacity !== undefined ? widget.data.hoverOpacity : 0.15).toFixed(2)}</label>
                            <input 
                                type="range" min="0" max="1" step="0.05" 
                                value={widget.data.hoverOpacity !== undefined ? widget.data.hoverOpacity : 0.15} 
                                onChange={(e) => handleDataChange('hoverOpacity', parseFloat(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold">Redondeo Esquinas ({widget.data.borderRadius !== undefined ? widget.data.borderRadius : 8}px)</label>
                            <input 
                                type="range" min="0" max="100" step="1" 
                                value={widget.data.borderRadius !== undefined ? widget.data.borderRadius : 8} 
                                onChange={(e) => handleDataChange('borderRadius', parseInt(e.target.value))}
                                className="w-full accent-[#795548]"
                            />
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input type="checkbox" checked={widget.data.showBorder || false} onChange={(e) => handleDataChange('showBorder', e.target.checked)} className="accent-[#795548] w-4 h-4" />
                                 <span className="text-sm text-[#5d4037] font-serif font-bold uppercase tracking-wider">Mostrar Borde Ligero</span>
                             </label>
                        </div>
                     </div>
                 )}
                 
                 {['donut', 'pie', 'bars', 'figures'].includes(widget.type) && (
                     <>
                         {['donut', 'pie'].includes(widget.type) && (
                             <div className="mt-6 pt-4 border-t border-[#d7ccc8] mb-4">
                                <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Visibilidad Global Texto</label>
                                <div className="flex flex-col gap-2">
                                    <select value={widget.data.labelPosition || 'inside'} onChange={(e) => handleDataChange('labelPosition', e.target.value)} className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white rounded">
                                        <option value="inside">Mostrar Dentro</option>
                                        <option value="outside">Mostrar Fuera</option>
                                        <option value="center">Centro del Anillo</option>
                                    </select>
                                    <select value={widget.data.labelContent || 'all'} onChange={(e) => handleDataChange('labelContent', e.target.value)} className="w-full px-2 py-1 text-sm border border-[#ccc] bg-white rounded">
                                        <option value="all">Nombre y Porcentaje</option>
                                        <option value="name">Solo Nombre</option>
                                        <option value="percent">Solo Porcentaje</option>
                                        <option value="hidden">Ocultar Completamente</option>
                                    </select>
                                </div>
                             </div>
                         )}
                         <div className="mt-6 pt-4 border-t border-[#d7ccc8]">
                             {/* Legacy compatibility toggle just for figures and bars now, pie/donut handle natively */}
                             {['bars', 'figures'].includes(widget.type) && (
                                 <label className="flex items-center gap-2 cursor-pointer mb-6">
                                     <input type="checkbox" checked={!widget.data.hidePercentage} onChange={(e) => handleDataChange('hidePercentage', !e.target.checked)} className="accent-[#795548] w-4 h-4" />
                                     <span className="text-sm text-[#5d4037] font-serif font-bold uppercase tracking-wider">Mostrar Porcentaje</span>
                                 </label>
                             )}
                             <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Color Base (Fondo)</label>
                             <div className="flex gap-2 items-center">
                                 <input type="color" value={widget.data.baseColor || '#3e2723'} onChange={(e) => handleDataChange('baseColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 shadow-sm" />
                                 <input type="text" value={widget.data.baseColor || '#3e2723'} onChange={(e) => handleDataChange('baseColor', e.target.value)} className="w-24 px-2 py-1 text-xs border border-[#ccc] bg-white rounded uppercase font-mono" />
                             </div>
                         </div>
                         {['bars', 'figures'].includes(widget.type) && (
                             <div className="mt-4">
                                 <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Color de Relleno (Datos)</label>
                                 <div className="flex gap-2 items-center">
                                     <input type="color" value={widget.data.color || '#fbfaf8'} onChange={(e) => handleDataChange('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0 shadow-sm" />
                                     <input type="text" value={widget.data.color || '#fbfaf8'} onChange={(e) => handleDataChange('color', e.target.value)} className="w-24 px-2 py-1 text-xs border border-[#ccc] bg-white rounded uppercase font-mono" />
                                 </div>
                             </div>
                         )}
                         <div className="mt-4 pt-4 border-t border-[#d7ccc8]">
                             <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Color de Textura (Ornamentos)</label>
                             <div className="flex gap-2 items-center">
                                 <input type="color" value={widget.data.textureColor || '#000000'} onChange={(e) => handleDataChange('textureColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                                 <input type="text" value={widget.data.textureColor || '#000000'} onChange={(e) => handleDataChange('textureColor', e.target.value)} className="w-24 px-2 py-1 text-xs border border-[#ccc] bg-white rounded uppercase font-mono" />
                             </div>
                         </div>
                         <div className="mt-4">
                             <label className="block text-xs uppercase tracking-wider text-[#5d4037] font-bold mb-2">Opacidad Textura: {(widget.data.textureOpacity !== undefined ? widget.data.textureOpacity : 0.15).toFixed(2)}</label>
                             <input 
                                 type="range" min="0" max="1" step="0.05" 
                                 value={widget.data.textureOpacity !== undefined ? widget.data.textureOpacity : 0.15} 
                                 onChange={(e) => handleDataChange('textureOpacity', parseFloat(e.target.value))}
                                 className="w-full accent-[#795548]"
                             />
                         </div>
                     </>
                 )}
            </div>
        </div>
    );
};
