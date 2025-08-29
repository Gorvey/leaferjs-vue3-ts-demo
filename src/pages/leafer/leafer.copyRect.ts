import { DragEvent, Rect } from "leafer-ui";
import type { ILeaferAnnotate } from "./leafer.type";

/**
 * 复制矩形
 */
export class CopyRectBinding {
  private _instance!: ILeaferAnnotate;
  private _boundDragStartHandler!: (e: DragEvent) => void;
  private _targetClassName!: string;
  /**
   * 加载服务
   */
  public install(instance: ILeaferAnnotate, targetClassName: string = "mark") {
    this._instance = instance;
    this._targetClassName = targetClassName;
    this._boundDragStartHandler = this.onDragStartEvent.bind(this);
    this._instance.app.on(DragEvent.START, this._boundDragStartHandler);
  }

  /**
   * 卸载服务
   */
  public uninstall() {
    if (this._instance.app && this._boundDragStartHandler) {
      this._instance.app.off(DragEvent.START, this._boundDragStartHandler);
    }
    this._boundDragStartHandler = null as any;
    this._targetClassName = null as any;
    this._instance = null as any;
  }

  private onDragStartEvent(e: DragEvent) {
    if (e.target.className !== this._targetClassName) return;
    if (e.ctrlKey && e.left) {
      const rect = e.target as Rect;
      const clonedRect = rect.clone({
        x: rect.x,
        y: rect.y,
        data: {},
      });

      // 交换业务数据
      const originalData = rect.data;
      const clonedData = clonedRect.data;
      rect.data = clonedData;
      clonedRect.data = originalData;

      this._instance.pageFrame.add(clonedRect);
      if (this._instance.config?.onElementAdd) {
        this._instance.config.onElementAdd(clonedRect);
      }
    }
  }
}
