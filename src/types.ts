export type WidgetType = 'donut' | 'pie' | 'figures' | 'bars' | 'info' | 'hotspot';

export interface WidgetData {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  scale: number;
  data: any;
}

export interface SceneData {
  id: string;
  name: string;
  bgImage: string | null;
  widgets: WidgetData[];
}

export interface WidgetProps {
  id?: string;
  data: any;
  isInView: boolean;
  scale: number;
  onUpdateData?: (newData: any) => void;
  onNavigate?: (sceneId: string) => void;
}
