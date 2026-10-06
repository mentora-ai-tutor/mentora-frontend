declare module 'fabric' {
  export class Canvas {
    constructor(element?: string | HTMLCanvasElement | null, options?: any);
    isDrawingMode: boolean;
    freeDrawingBrush: any;
    on(event: string, handler: (e: any) => void): void;
    off(event: string, handler?: (e: any) => void): void;
    dispose(): void;
    clear(): void;
    renderAll(): void;
    loadFromJSON(json: any, callback?: () => void): void;
    toJSON(): any;
    [key: string]: any;
  }
  export const Rect: any;
  export const Circle: any;
  export const Line: any;
  export const Path: any;
  export const PencilBrush: any;
  export const Shadow: any;
  export const util: any;
  const fabric: any;
  export default fabric;
}
