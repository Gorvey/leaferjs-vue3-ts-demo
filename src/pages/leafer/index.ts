import {
  App,
  Image,
  Frame,
  Rect,
  DragEvent,
  PointerEvent,
  Resource,
} from "leafer-ui";
import { AdsorptionBinding } from "./leafer.adsorption.ts";
import { DropBinding } from "./leafer.drop.ts";
import "./leafer.proxyData.ts";
import type { IFrame } from "leafer-ui";
import "@leafer-in/editor";
import { EditorEvent } from "@leafer-in/editor";
import "@leafer-in/viewport";
import "@leafer-in/view";
import "@leafer-in/state";
import "@leafer-in/resize";
import "@leafer-in/find";
import { Ruler } from "leafer-x-ruler";
import { Snap } from "./plugins/snap/index.ts";
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
  configureInteractionMode,
  roundPoint,
} from "./leafer.helper.ts";
import type {
  LeaferAnnotateConfig,
  IMark,
  ILeaferAnnotate,
} from "./leafer.type.ts";

export class LeaferAnnotate implements ILeaferAnnotate {
  config: LeaferAnnotateConfig;
  app!: App;
  pageFrame!: IFrame;
  private mode: "view" | "edit" = "view";
  private isCreating = false;
  private startPoint: { x: number; y: number } | null = null;
  private isElementSelected = false;
  private previewRect: Rect | null = null;
  private snap!: Snap;
  private adsorptionBinding!: AdsorptionBinding;
  private dropBinding!: DropBinding;
  private ruler: Ruler | null = null;

  // 事件处理器引用存储
  private eventHandlers = {
    dragStart: null as ((e: any) => void) | null,
    pointerTap: null as ((e: any) => void) | null,
    editorSelect: null as (() => void) | null,
    pageFrameDown: null as ((e: any) => void) | null,
    pageFrameMove: null as ((e: any) => void) | null,
    pageFrameUp: null as ((e: any) => void) | null,
  };



  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
    this.isElementSelected = false;
    this.startPoint = null;
    this.isCreating = false;
    this.previewRect = null;

    // 初始化事件处理器引用
    Object.keys(this.eventHandlers).forEach((key) => {
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
    if (this.app && this.eventHandlers.dragStart) {
      this.app.off(DragEvent.START, this.eventHandlers.dragStart);
    }
    if (this.app && this.eventHandlers.pointerTap) {
      this.app.off(PointerEvent.TAP, this.eventHandlers.pointerTap);
    }
    if (this.app?.editor && this.eventHandlers.editorSelect) {
      this.app.editor.off(
        EditorEvent.SELECT,
        this.eventHandlers.editorSelect
      );
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

    // 注销插件
    if (this.snap) {
      this.snap.destroy();
      this.snap = null as any;
    }
    if (this.adsorptionBinding) {
      this.adsorptionBinding.uninstall();
      this.adsorptionBinding = null as any;
    }
    if (this.dropBinding) {
      this.dropBinding.uninstall();
      this.dropBinding = null as any;
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
    if (this.app) {
      await this.app.destroy(true);
      this.app = null as any;
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
    this.app = new App({
      view: view,
      ...DEFAULT_LEAFER_CONFIG,
    });

    // 设置图片和标记
    await this.setupImageAndMarks(pageUrl, marks);

    // 绑定事件
    this.bindEvent();

    // 启用插件
    this.bindPlugins();

    // 默认为view模式
    this.changeMode("view");
  }

  /**
   * 设置图片和标记
   */
  private async setupImageAndMarks(
    pageUrl: string,
    marks: IMark[]
  ): Promise<void> {
    // 获取底图，这是整个画布的核心
    let { url, width, height } = await loadImage(pageUrl, "bg.png");

    this.pageFrame = new Frame({
      id: "pageFrame",
      width: width,
      height: height,
    });

    this.app.tree?.add(this.pageFrame);
    this.app.zoom("fit-width", 12);
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
    if (!this.app) {
      throw new Error("Leafer实例未初始化");
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
    let interaction = this.app.tree?.interaction;
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
      if (this.app.editor.target) {
        this.isElementSelected = true;
      } else {
        this.isElementSelected = false;
      }
    };

    this.eventHandlers.pageFrameDown = (e) => {
      if (this.isElementSelected) return;
      this.isCreating = true;
      this.startPoint = roundPoint(this.pageFrame.getLocalPoint(e));
    };

    this.eventHandlers.pageFrameMove = (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = roundPoint(this.pageFrame.getLocalPoint(e));
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
        const currentPoint = roundPoint(this.pageFrame.getLocalPoint(e));
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
    this.app.on(DragEvent.START, this.eventHandlers.dragStart);
    this.app.on(PointerEvent.TAP, this.eventHandlers.pointerTap);
    this.app.editor.on(EditorEvent.SELECT, this.eventHandlers.editorSelect);
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

  private bindPlugins(): void {
    this.adsorptionBinding = new AdsorptionBinding();
    this.adsorptionBinding.install(this.app);
    this.dropBinding = new DropBinding();
    this.dropBinding.install(this.app, this.pageFrame, ".leafer-container");

    this.snap = new Snap(this.app, {
      ...DEFAULT_SNAP_CONFIG,
      parentContainer: this.pageFrame,
    });
    this.ruler = new Ruler(this.app, DEFAULT_RULER_CONFIG);

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
        console.warn("LeaferAnnotate instance has been destroyed");
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
