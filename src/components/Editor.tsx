import React, { useState, useEffect, useRef } from 'react';
import { WidgetData, SceneData, WidgetType } from '../types';
import { DonutWidget } from './widgets/DonutWidget';
import { PieWidget } from './widgets/PieWidget';
import { BarsWidget } from './widgets/BarsWidget';
import { FiguresWidget } from './widgets/FiguresWidget';
import { WidgetWrapper } from './widgets/WidgetWrapper';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { InfoWidget } from './widgets/InfoWidget';
import { HotspotWidget } from './widgets/HotspotWidget';
import { Upload, Eye, Edit2, Save, FolderOpen } from 'lucide-react';

export const Editor: React.FC = () => {
    const [scenes, setScenes] = useState<SceneData[]>([
        { id: 'scene-1', name: 'Escena 1', bgImage: 'escenas/escena_1.webp', widgets: [] },
        { id: 'scene-2', name: 'Escena 2', bgImage: 'escenas/escena_2.webp', widgets: [] },
        { id: 'scene-3', name: 'Escena 3', bgImage: 'escenas/escena_3.webp', widgets: [] }
    ]);
    const [currentSceneId, setCurrentSceneId] = useState<string>('scene-1');
    const [isEditorMode, setIsEditorMode] = useState(false);
    
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const sequenceRef = useRef<string>('');

    useEffect(() => {
        const targetSequence = 'penepeneescrotopene';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            if (e.key.length === 1) {
                sequenceRef.current += e.key.toLowerCase();
                if (sequenceRef.current.length > targetSequence.length) {
                    sequenceRef.current = sequenceRef.current.slice(-targetSequence.length);
                }
                if (sequenceRef.current === targetSequence) {
                    setIsEditorMode(true);
                    sequenceRef.current = '';
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const ratio = viewportWidth / 1000;

    const currentScene = scenes.find(s => s.id === currentSceneId) || scenes[0];
    const currentIndex = scenes.findIndex(s => s.id === currentSceneId);

    const handleNavigate = (sceneId: string) => {
        if (!sceneId) return;
        const exists = scenes.some(s => s.id === sceneId);
        if (!exists) return;
        
        window.scrollTo(0, 0); // instantly scroll to top when changing scenes
        
        setSelectedId(null);
        setCurrentSceneId(sceneId);
    };

    const handleSaveProject = () => {
        const projectData = {
            version: '1.0',
            scenes: scenes.map(scene => ({
                ...scene,
                bgImage: scene.bgImage?.startsWith('blob:') ? null : scene.bgImage
            }))
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData));
        const element = document.createElement('a');
        element.setAttribute("href", dataStr);
        element.setAttribute("download", "proyecto_infografia.infografia");
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const loadProjectContent = (content: string) => {
        try {
            const projectData = JSON.parse(content);
            if (projectData && projectData.scenes && Array.isArray(projectData.scenes)) {
                setScenes(prev => {
                    return prev.map(scene => {
                        const loadedScene = projectData.scenes.find((s: any) => s.id === scene.id);
                        if (loadedScene && loadedScene.widgets) {
                            return { ...scene, widgets: loadedScene.widgets };
                        }
                        // Keep the scene completely intact, with its required static empty array if no loaded scene
                        return { ...scene, widgets: [] };
                    });
                });
                setSelectedId(null);
            }
        } catch (err) {
            console.error("Error al cargar el proyecto:", err);
            alert("El archivo no es válido.");
        }
    };

    const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            loadProjectContent(content);
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        let isMounted = true;
        fetch('/proyecto/proyecto_final.infografia')
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.text();
            })
            .then(content => {
                if (isMounted) {
                    loadProjectContent(content);
                    setIsEditorMode(false);
                }
            })
            .catch(err => {
                console.log("No default project loaded:", err);
            });
        return () => { isMounted = false };
    }, []);

    const handleAddWidget = (type: WidgetType) => {
        const newWidget: WidgetData = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            x: 100 + (currentScene.widgets.length % 5) * 50,
            y: 100 + (currentScene.widgets.length % 5) * 50,
            scale: 1,
            data: getDefaultData(type)
        };
        setScenes(prev => prev.map(s => s.id === currentSceneId ? { ...s, widgets: [...s.widgets, newWidget] } : s));
        setSelectedId(newWidget.id);
    };

    const handleUpdateWidget = (id: string, updates: Partial<WidgetData>) => {
        setScenes(prev => prev.map(s => s.id === currentSceneId ? {
            ...s,
            widgets: s.widgets.map(w => w.id === id ? { ...w, ...updates } : w)
        } : s));
    };

    const handleDeleteWidget = (id: string) => {
        setScenes(prev => prev.map(s => s.id === currentSceneId ? {
            ...s,
            widgets: s.widgets.filter(w => w.id !== id)
        } : s));
        if (selectedId === id) setSelectedId(null);
    };

    const handleDuplicateWidget = (id: string) => {
        const source = currentScene.widgets.find(w => w.id === id);
        if (source) {
            const newWidget = {
                ...source,
                id: Math.random().toString(36).substr(2, 9),
                x: source.x + 40,
                y: source.y + 40,
                data: JSON.parse(JSON.stringify(source.data))
            };
            setScenes(prev => prev.map(s => s.id === currentSceneId ? { ...s, widgets: [...s.widgets, newWidget] } : s));
            setSelectedId(newWidget.id);
        }
    };

    const selectedWidget = currentScene.widgets.find(w => w.id === selectedId);

    const renderSceneView = (scene: SceneData, index: number) => {
        const isCurrent = scene.id === currentSceneId;
        
        return (
            <div 
                key={scene.id}
                id={scene.id}
                className={`w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${isCurrent ? 'relative' : 'absolute top-0 left-0'}`}
                style={{
                    transform: `translateX(${(index - currentIndex) * 100}%)`,
                    height: isCurrent ? 'auto' : '100%',
                    overflow: isCurrent ? 'visible' : 'hidden'
                }}
            >
                {scene.bgImage ? (
                    <img 
                        src={scene.bgImage} 
                        alt="Fondo" 
                        className="w-full h-auto block pointer-events-none" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-[1200px] bg-[#fbfaf8]">
                        <p className="text-[#5d4037] font-serif">Escena sin imagen</p>
                    </div>
                )}
                
                {scene.widgets.map(widget => (
                    <WidgetWrapper 
                        key={widget.id}
                        widget={widget}
                        isSelected={selectedId === widget.id && isEditorMode}
                        onSelect={isEditorMode ? setSelectedId : () => {}}
                        onUpdatePos={(id, x, y) => { if (isEditorMode) handleUpdateWidget(id, { x, y }); }}
                        isEditorMode={isEditorMode}
                        ratio={ratio}
                    >
                        {renderWidget(widget, handleUpdateWidget, handleNavigate, true, ratio)}
                    </WidgetWrapper>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full min-h-screen flex flex-col overflow-x-hidden" onClick={() => setSelectedId(null)}>
            
            <div className="fixed top-6 right-6 z-50 flex gap-2">
                {isEditorMode && (
                    <>
                        <label className="flex items-center gap-2 px-4 py-2 bg-[#ece5d3]/95 backdrop-blur-sm border border-[#d7ccc8] shadow-lg rounded-sm text-[#5d4037] font-serif uppercase tracking-widest text-xs hover:bg-white transition-colors cursor-pointer" title="Cargar Proyecto">
                            <FolderOpen size={16} /> Cargar
                            <input type="file" accept=".infografia,.json" className="hidden" onChange={handleLoadProject} />
                        </label>
                        <button
                            onClick={handleSaveProject}
                            className="flex items-center gap-2 px-4 py-2 bg-[#ece5d3]/95 backdrop-blur-sm border border-[#d7ccc8] shadow-lg rounded-sm text-[#5d4037] font-serif uppercase tracking-widest text-xs hover:bg-white transition-colors"
                            title="Guardar Proyecto"
                        >
                            <Save size={16} /> Guardar
                        </button>
                        <button
                            onClick={() => setIsEditorMode(false)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#ece5d3]/95 backdrop-blur-sm border border-[#d7ccc8] shadow-lg rounded-sm text-[#5d4037] font-serif uppercase tracking-widest text-xs hover:bg-white transition-colors"
                            title="Cambiar a Modo Visualización"
                        >
                            <Eye size={16} /> Visualizar
                        </button>
                    </>
                )}
            </div>

            {isEditorMode && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#ece5d3]/95 backdrop-blur-sm p-1.5 rounded-sm shadow-2xl border border-[#d7ccc8] z-50">
                    {scenes.map((s) => (
                        <button 
                            key={s.id}
                            className={`px-4 py-1.5 rounded-sm text-xs font-serif font-bold uppercase tracking-widest transition-colors ${currentSceneId === s.id ? 'bg-[#795548] text-white shadow' : 'hover:bg-black/5 text-[#5d4037]'}`}
                            onClick={() => handleNavigate(s.id)}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            )}

            {isEditorMode && (
                <div className="fixed bottom-6 left-6 max-w-xs bg-[#ece5d3]/90 backdrop-blur-sm shadow-xl p-4 rounded-sm border border-[#d7ccc8] z-50 pointer-events-none">
                    <p className="text-[#795548] font-bold text-xs uppercase tracking-widest mb-1">Modo Editor</p>
                    <p className="text-xs text-[#5d4037]">Editando {currentScene.name}</p>
                </div>
            )}

            {isEditorMode && currentScene.bgImage && <Toolbar onAdd={handleAddWidget} />}

            {isEditorMode && selectedWidget && (
                <div onClick={e => e.stopPropagation()}>
                    <PropertiesPanel 
                        widget={selectedWidget}
                        onUpdate={handleUpdateWidget}
                        onDelete={handleDeleteWidget}
                        onDuplicate={handleDuplicateWidget}
                        onClose={() => setSelectedId(null)}
                        scenes={scenes.map(s => ({ id: s.id, name: s.name }))}
                    />
                </div>
            )}

            <div className="relative w-full flex-grow">
                {scenes.map((scene, index) => renderSceneView(scene, index))}
            </div>
        </div>
    );
};

const getDefaultData = (type: WidgetType) => {
    switch(type) {
        case 'donut': return { items: [{ percentage: 75, label: 'Madera', color: '#fbfaf8' }], baseColor: '#3e2723', hidePercentage: false, aperture: 360, rotation: 0, thickness: 18 };
        case 'pie': return { items: [{ percentage: 40, label: 'Exportación', color: '#fbfaf8' }], baseColor: '#3e2723', hidePercentage: false, aperture: 360, rotation: 0 };
        case 'figures': return { manPercentage: 45, manLabel: 'Hombres', womanPercentage: 55, womanLabel: 'Mujeres', color: '#fbfaf8', baseColor: '#3e2723' };
        case 'bars': return { items: [{ label: 'Cincel', value: 45 }, { label: 'Martillo', value: 80 }], color: '#fbfaf8', baseColor: '#3e2723' };
        case 'info': return { title: 'Fuente', content: 'Datos obtenidos del censo histórico.', blockWidth: 220, bgColor: '#ece5d3', textColor: '#5d4037', bgOpacity: 0.95, padding: 16, borderRadius: 4, fontSize: 14, alignment: 'left' };
        case 'hotspot': return { width: 120, height: 80, opacity: 0, hoverOpacity: 0.15, color: '#d7ccc8', text: 'Descubrir más', borderRadius: 8, showBorder: false };
        default: return {};
    }
};

const renderWidget = (widget: WidgetData, onUpdateData: (id: string, updates: Partial<WidgetData>) => void, onNavigate: (url: string) => void, isActive: boolean, ratio: number) => {
    switch(widget.type) {
        case 'donut': return <DonutWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} />;
        case 'pie': return <PieWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} />;
        case 'figures': return <FiguresWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} />;
        case 'bars': return <BarsWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} />;
        case 'info': return <InfoWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} onUpdateData={(newData) => onUpdateData(widget.id, { data: { ...widget.data, ...newData } })} />;
        case 'hotspot': return <HotspotWidget id={widget.id} data={widget.data} scale={widget.scale * ratio} isInView={isActive} onNavigate={onNavigate} />;
        default: return <div>Unknown</div>;
    }
}

