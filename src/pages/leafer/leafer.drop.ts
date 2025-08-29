import { App, type IFrame } from "leafer-ui";
import {
  getCanvasElement,
  parseDragData,
  roundPoint,
  createRect,
  createElementData,
} from "./leafer.helper";

/**
 * 拖拽
 */
export class DropBinding {
  private _app!: App;
  private _pageFrame!: IFrame;
  private canvasElement!: HTMLElement;
  private _boundDragOverHandler!: (e: Event) => void;
  private _boundDropHandler!: (e: DragEvent) => void;
  /**
   * 加载服务
   * @param app 容器
   * @param gridSize 网格尺寸
   */
  public install(app: App, pageFrame: IFrame, selector: string) {
    this._app = app;
    this._pageFrame = pageFrame;
    this.canvasElement = getCanvasElement(selector);
    if (!this.canvasElement) {
      throw new Error("canvasElement is not found");
    }
    this._boundDragOverHandler = this.onDragOver.bind(this);
    this._boundDropHandler = this.onDrop.bind(this);

    //监听tree层图元更改事件
    this.canvasElement.addEventListener("dragover", this._boundDragOverHandler);
    this.canvasElement.addEventListener("drop", this._boundDropHandler);
  }

  /**
   * 卸载服务
   */
  public uninstall() {
    if (
      this.canvasElement &&
      this._boundDragOverHandler &&
      this._boundDropHandler
    ) {
      this.canvasElement.removeEventListener(
        "dragover",
        this._boundDragOverHandler
      );
      this.canvasElement.removeEventListener("drop", this._boundDropHandler);
    }
    this._boundDragOverHandler = null as any;
    this._boundDropHandler = null as any;
    this.canvasElement = null as any;
    this._app = null as any;
  }

  private onDragOver(e: Event) {
    e.preventDefault();
  }
  /**
   * 确保元素位置在frame边界内
   */
  private constrainToFrameBounds(
    x: number,
    y: number,
    width: number,
    height: number
  ): { x: number; y: number } {
    const frameWidth = this._pageFrame.width ?? 0;
    const frameHeight = this._pageFrame.height ?? 0;

    let constrainedX = x;
    let constrainedY = y;

    // 如果frame尺寸无效，返回原坐标
    if (frameWidth <= 0 || frameHeight <= 0) {
      return { x: constrainedX, y: constrainedY };
    }

    // 如果元素宽度大于frame宽度，将其居左放置
    if (width >= frameWidth) {
      constrainedX = 0;
    } else {
      // 确保左边界不超出
      if (constrainedX < 0) {
        constrainedX = 0;
      }
      // 确保右边界不超出
      if (constrainedX + width > frameWidth) {
        constrainedX = frameWidth - width;
      }
    }

    // 如果元素高度大于frame高度，将其居顶放置
    if (height >= frameHeight) {
      constrainedY = 0;
    } else {
      // 确保上边界不超出
      if (constrainedY < 0) {
        constrainedY = 0;
      }
      // 确保下边界不超出
      if (constrainedY + height > frameHeight) {
        constrainedY = frameHeight - height;
      }
    }

    return { x: constrainedX, y: constrainedY };
  }
  private onDrop(e: DragEvent) {
    e.preventDefault();
    const dragEvent = e as globalThis.DragEvent;
    const shapeData = parseDragData(dragEvent.dataTransfer);
    if (!shapeData) return;

    // 将浏览器坐标转换为世界坐标
    const worldPoint = this._app.getWorldPointByClient(dragEvent);
    // 将世界坐标转换为frame内坐标
    const framePoint = roundPoint(this._pageFrame.getInnerPoint(worldPoint));

    // 计算初始位置（以framePoint为中心）
    const initialX = framePoint.x - shapeData.width / 2;
    const initialY = framePoint.y - shapeData.height / 2;

    // 使用边界检查确保元素在frame内
    const { x: constrainedX, y: constrainedY } = this.constrainToFrameBounds(
      initialX,
      initialY,
      shapeData.width,
      shapeData.height
    );

    // 根据类型创建图形
    const shape = createRect({
      x: constrainedX,
      y: constrainedY,
      width: shapeData.width,
      height: shapeData.height,
      lockRatio: true,
      data: createElementData(shapeData.type),
    });
    this._pageFrame.add(shape);
  }
}
