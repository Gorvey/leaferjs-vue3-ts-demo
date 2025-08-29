import { App, Image, Frame, Rect, DragEvent, PointerEvent,Resource } from "leafer-ui";
import { AdsorptionBinding } from "./plugins/adsorption/index.ts";
import "./proxyData.ts";
import type { IFrame } from "leafer-ui";
import "@leafer-in/editor";
import { EditorEvent } from "@leafer-in/editor";
import "@leafer-in/viewport";
import "@leafer-in/view";
import "@leafer-in/state";
import "@leafer-in/resize";
import "@leafer-in/find";
import { Ruler } from "leafer-x-ruler";
import { Snap } from "./plugins/snap";
import { cloneDeep } from "lodash";
import {
  loadImage,
  processMarksToRects,
  createRect,
  DEFAULT_LEAFER_CONFIG,
  DEFAULT_SNAP_CONFIG,
  DEFAULT_RULER_CONFIG,
  calculateRectBounds,
  createElementData,
  isValidRectSize,
  getCanvasElement,
  parseDragData,
  configureInteractionMode,
} from "./leafer-helper.ts";
import type {
  LeaferAnnotateConfig,
  IMark,
  ILeaferAnnotate,
} from "./leafer.type.ts";

export class LeaferAnnotate implements ILeaferAnnotate {
  config: LeaferAnnotateConfig;
  leafer!: App;
  pageFrame!: IFrame;
  private mode: "view" | "edit" = "view";
  private isCreating = false;
  private startPoint: { x: number; y: number } | null = null;
  private isElementSelected = false;
  private previewRect: Rect | null = null;
  private snap!: Snap;
  private adsorptionBinding!: AdsorptionBinding;
  private ruler: Ruler | null = null;
  private dragOverHandler: ((e: Event) => void) | null = null;
  private dropHandler: ((e: Event) => void) | null = null;
  private canvasElement: HTMLElement | null = null;

  // 事件处理器引用存储
  private eventHandlers = {
    dragStart: null as ((e: any) => void) | null,
    pointerTap: null as ((e: any) => void) | null,
    editorSelect: null as (() => void) | null,
    pageFrameDown: null as ((e: any) => void) | null,
    pageFrameMove: null as ((e: any) => void) | null,
    pageFrameUp: null as ((e: any) => void) | null,
  };

  /**
   * 四舍五入坐标点到整数
   */
  private roundPoint(point: { x: number; y: number }): {
    x: number;
    y: number;
  } {
    return {
      x: Math.round(point.x),
      y: Math.round(point.y),
    };
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
    const frameWidth = this.pageFrame.width ?? 0;
    const frameHeight = this.pageFrame.height ?? 0;

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

  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
    this.isElementSelected = false;
    this.startPoint = null;
    this.isCreating = false;
    this.previewRect = null;
    this.dragOverHandler = null;
    this.dropHandler = null;
    this.canvasElement = null;
    
    // 初始化事件处理器引用
    Object.keys(this.eventHandlers).forEach(key => {
      (this.eventHandlers as any)[key] = null;
    });
  }
  public async destroy(): Promise<void> {
    // 清理资源
    Resource.destroy();
    // 清理预览矩形
    if (this.previewRect) {
      this.previewRect.remove();
      this.previewRect = null;
    }

    // 精确移除所有事件监听器
    if (this.leafer && this.eventHandlers.dragStart) {
      this.leafer.off(DragEvent.START, this.eventHandlers.dragStart);
    }
    if (this.leafer && this.eventHandlers.pointerTap) {
      this.leafer.off(PointerEvent.TAP, this.eventHandlers.pointerTap);
    }
    if (this.leafer?.editor && this.eventHandlers.editorSelect) {
      this.leafer.editor.off(EditorEvent.SELECT, this.eventHandlers.editorSelect);
    }
    if (this.pageFrame && this.eventHandlers.pageFrameDown) {
      this.pageFrame.off(PointerEvent.DOWN, this.eventHandlers.pageFrameDown);
    }
    if (this.pageFrame && this.eventHandlers.pageFrameMove) {
      this.pageFrame.off(PointerEvent.MOVE, this.eventHandlers.pageFrameMove);
    }
    if (this.pageFrame && this.eventHandlers.pageFrameUp) {
      this.pageFrame.off(PointerEvent.UP, this.eventHandlers.pageFrameUp);
    }

    // 清理事件处理器引用
    this.eventHandlers.dragStart = null;
    this.eventHandlers.pointerTap = null;
    this.eventHandlers.editorSelect = null;
    this.eventHandlers.pageFrameDown = null;
    this.eventHandlers.pageFrameMove = null;
    this.eventHandlers.pageFrameUp = null;

    // 移除DOM事件监听器
    if (this.canvasElement && this.dragOverHandler && this.dropHandler) {
      this.canvasElement.removeEventListener("dragover", this.dragOverHandler);
      this.canvasElement.removeEventListener("drop", this.dropHandler);
    }

    // 清理DOM事件处理器引用
    this.dragOverHandler = null;
    this.dropHandler = null;
    this.canvasElement = null;

    // 注销插件
    if (this.snap) {
      this.snap.destroy();
      this.snap = null as any;
    }
    if (this.adsorptionBinding) {
      this.adsorptionBinding.uninstall();
      this.adsorptionBinding = null as any;
    }
    if (this.ruler) {
      this.ruler.enabled = false;
      this.ruler = null;
    }

    // 清理页面框架（在销毁leafer之前）
    if (this.pageFrame) {
      this.pageFrame.removeAll();
      this.pageFrame = null as any;
    }

    // 销毁画布（最后执行）
    if (this.leafer) {
      await this.leafer.destroy(true);
      this.leafer = null as any;
    }

    // 清理所有引用
    this.startPoint = null;
    this.isCreating = false;
    this.isElementSelected = false;

    return;
  }
  async init(): Promise<void> {
    let { view, pageUrl, marks } = this.config;

    // 初始化画布，没有设置宽高，默认使用父元素的宽高
    this.leafer = new App({
      view: view,
      ...DEFAULT_LEAFER_CONFIG,
    });

    // 设置图片和标记
    await this.setupImageAndMarks(pageUrl, marks);

    // 绑定事件
    this.bindEvent();

    // 添加画布拖拽
    this.bindDragDropHandlers();

    // 启用插件
    this.bindPlugins();

    // 默认为view模式
    this.changeMode("view");
  }

  /**
   * 设置图片和标记
   */
  private async setupImageAndMarks(pageUrl: string, marks: IMark[]): Promise<void> {
    // 获取底图，这是整个画布的核心
    let { url, width, height } = await loadImage(pageUrl, "bg.png");

    this.pageFrame = new Frame({
      width: width,
      height: height,
    });

    this.leafer.tree?.add(this.pageFrame);
    this.leafer.zoom("fit-width", 12);
    this.pageFrame.add(new Image({ url: url, width: width, height: height }));

    // 初始化标注
    this.initMarks(marks);
  }

  /**
   * 根据ID删除元素
   * @param id 元素ID
   */
  delElement(id: string): void {
    const element = this.pageFrame.find(`[data.id="${id}"]`)[0];
    if (element) {
      element.remove();
    }
  }

  /**
   * 更新数据，切换图片和标记
   * @param pageUrl 新的页面图片URL
   * @param marks 新的标记数据
   */
  async updateData(pageUrl: string, marks: IMark[]): Promise<void> {
    if (!this.leafer) {
      throw new Error('Leafer实例未初始化');
    }

    // 清除当前的pageFrame
    if (this.pageFrame) {
      this.pageFrame.removeAll();
      this.pageFrame.remove();
    }

    // 重新设置图片和标记
    await this.setupImageAndMarks(pageUrl, marks);
    

    
    // 更新配置
    this.config.pageUrl = pageUrl;
    this.config.marks = marks;
  }
  /**
   * 切换模式
   *
   * view: 可以缩放，移动页面，可以编辑元素
   *
   * edit: 不可以缩放，移动，不可以编辑元素
   * @param mode
   */
  private changeMode(mode: "view" | "edit"): void {
    this.mode = mode;
    this.pageFrame.cursor = "crosshair";
    let interaction = this.leafer.tree?.interaction;
    configureInteractionMode(interaction, mode);

    if (this.mode === "view") {
      this.pageFrame.hitChildren = true;
    } else if (this.mode === "edit") {
      this.pageFrame.hitChildren = false;
    }
  }

  private bindEvent() {
    // 创建并存储事件处理器引用
    this.eventHandlers.dragStart = (e) => {
      if (e.target.className !== "mark") return;
      if (e.ctrlKey && e.left) {
        const rect = e.target;
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

        this.pageFrame.add(clonedRect);
        if (this.config?.onElementAdd) {
          this.config.onElementAdd(clonedRect);
        }
      }
    };

    this.eventHandlers.pointerTap = (e) => {
      if (e.target.className === "mark") {
        if (this.config?.onElementSelect) {
          this.config.onElementSelect(e);
        }
      }
    };

    this.eventHandlers.editorSelect = () => {
      if (this.leafer.editor.target) {
        this.isElementSelected = true;
      } else {
        this.isElementSelected = false;
      }
    };

    this.eventHandlers.pageFrameDown = (e) => {
      if (this.isElementSelected) return;
      this.isCreating = true;
      this.startPoint = this.roundPoint(this.pageFrame.getLocalPoint(e));
    };

    this.eventHandlers.pageFrameMove = (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = this.roundPoint(this.pageFrame.getLocalPoint(e));
        const { x, y, width, height } = calculateRectBounds(
          this.startPoint,
          currentPoint
        );

        if (isValidRectSize(width, height)) {
          if (!this.previewRect) {
            this.previewRect = createRect({
              id: "preview-rect",
              x,
              y,
              width,
              height,
            });
            this.pageFrame.add(this.previewRect);
            // 触发吸附计算
            this.snap.triggerSnap(this.previewRect);
          } else {
            this.previewRect.set({ x, y, width, height });
            // 触发吸附计算
            this.snap.triggerSnap(this.previewRect);
          }
        } else if (this.previewRect) {
          this.previewRect.remove();
          this.previewRect = null;
          // 清除吸附线
          this.snap.destroy();
        }
      }
    };

    this.eventHandlers.pageFrameUp = (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = this.roundPoint(this.pageFrame.getLocalPoint(e));
        const { x, y, width, height } = calculateRectBounds(
          this.startPoint,
          currentPoint
        );

        if (this.previewRect) {
          this.previewRect.remove();
          this.previewRect = null;
        }

        // 清除吸附线
        this.snap.destroy();

        if (isValidRectSize(width, height)) {
          const rect = createRect({
            x,
            y,
            width,
            height,
            data: createElementData("rect"),
          });
          this.pageFrame.add(rect);
          if (this.config?.onElementAdd) {
            this.config.onElementAdd(rect);
          }
        }

        this.isCreating = false;
        this.startPoint = null;
      }
    };

    // 绑定事件监听器
    this.leafer.on(DragEvent.START, this.eventHandlers.dragStart);
    this.leafer.on(PointerEvent.TAP, this.eventHandlers.pointerTap);
    this.leafer.editor.on(EditorEvent.SELECT, this.eventHandlers.editorSelect);
    this.pageFrame.on(PointerEvent.DOWN, this.eventHandlers.pageFrameDown);
    this.pageFrame.on(PointerEvent.MOVE, this.eventHandlers.pageFrameMove);
    this.pageFrame.on(PointerEvent.UP, this.eventHandlers.pageFrameUp);
  }
  /**
   * 初始化接口中的标注矩形
   */
  private initMarks(marks: IMark[]): void {
    if (!Array.isArray(marks) || !this.pageFrame) return;
    const layer = this.pageFrame;
    const rects = processMarksToRects(marks);
    rects.forEach((rect) => {
      layer.add(rect);
    });
  }

  /**
   * 初始化拖拽处理事件
   */
  private bindDragDropHandlers(): void {
    this.canvasElement = getCanvasElement();
    if (!this.canvasElement) return;

    // 创建事件处理器并保存引用
    this.dragOverHandler = (e: Event) => {
      e.preventDefault();
    };

    this.dropHandler = (e: Event) => {
      e.preventDefault();

      const dragEvent = e as globalThis.DragEvent;
      const shapeData = parseDragData(dragEvent.dataTransfer);
      if (!shapeData) return;

      // 将浏览器坐标转换为世界坐标
      const worldPoint = this.leafer.getWorldPointByClient(dragEvent);
      // 将世界坐标转换为frame内坐标
      const framePoint = this.roundPoint(
        this.pageFrame.getInnerPoint(worldPoint)
      );

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
      this.pageFrame.add(shape);
      if (this.config?.onElementAdd) {
        this.config.onElementAdd(shape);
      }
    };

    // 添加事件监听器
    this.canvasElement.addEventListener("dragover", this.dragOverHandler);
    this.canvasElement.addEventListener("drop", this.dropHandler);
  }

  private bindPlugins(): void {
    this.adsorptionBinding = new AdsorptionBinding();
    this.adsorptionBinding.install(this.leafer);

    this.snap = new Snap(this.leafer, {
      ...DEFAULT_SNAP_CONFIG,
      parentContainer: this.pageFrame,
    });
    this.ruler = new Ruler(this.leafer, DEFAULT_RULER_CONFIG);

    this.snap.enable(true);
    this.ruler.enabled = true;
  }
}

export const createLeaferAnnotate = async (
  config: LeaferAnnotateConfig
): Promise<{
  getInstance: () => LeaferAnnotate | null;
  destroy: () => Promise<void>;
}> => {
  let instance: LeaferAnnotate | null = new LeaferAnnotate(cloneDeep(config));
  await instance.init();
  
  let isDestroyed = false;
  
  return {
    getInstance: function () {
      if (isDestroyed) {
        console.warn('LeaferAnnotate instance has been destroyed');
        return null;
      }
      return instance;
    },
    destroy: async () => {
      if (instance && !isDestroyed) {
        await instance.destroy();
        instance = null;
        isDestroyed = true;
      }
    },
  };
};
