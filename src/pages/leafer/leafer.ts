/* eslint-disable no-unused-vars */
import { App, Image, Frame, Rect, DragEvent, PointerEvent } from "leafer-ui";
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

  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
    this.isElementSelected = false;
    this.startPoint = null;
    this.isCreating = false;
    this.isElementSelected = false;
    this.previewRect = null;
  }
  async init(): Promise<void> {
    let { view, pageUrl, marks } = this.config;

    // 初始化画布，没有设置宽高，默认使用父元素的宽高
    this.leafer = new App({
      view: view,
      ...DEFAULT_LEAFER_CONFIG,
    });

    // 获取底图，这是整个画布的核心
    let { url, width, height } = await loadImage(pageUrl, "bg.png");

    this.pageFrame = new Frame({
      width: width,
      height: height,
    });

    this.leafer.tree?.add(this.pageFrame);
    this.pageFrame.add(new Image({ url: url, width: width, height: height }));

    // 让底图在整个画布中 上下左右，
    this.leafer.zoom("fit", 0);

    // 初始化标注
    this.initMarks(marks);

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
    // 监听拖拽开始事件,按住ctrl + 拖动元素时，复制一个元素
    this.leafer.on(DragEvent.START, (e) => {
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
        this.config?.onElementAdd(clonedRect);
      }
    });

    // 监听点击事件
    this.leafer.on(PointerEvent.TAP, (e) => {
      if (e.target.className === "mark") {
        this.config?.onElementSelect(e);
      }
    });

    // 监听选中事件
    this.leafer.editor.on(EditorEvent.SELECT, () => {
      if (this.leafer.editor.target) {
        this.isElementSelected = true;
      } else {
        this.isElementSelected = false;
      }
    });

    // 矩形绘制相关事件
    this.pageFrame.on(PointerEvent.DOWN, (e) => {
      if (this.isElementSelected) return;
      this.isCreating = true;
      this.startPoint = this.pageFrame.getLocalPoint(e);
    });

    this.pageFrame.on(PointerEvent.MOVE, (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = this.pageFrame.getLocalPoint(e);
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
    });

    this.pageFrame.on(PointerEvent.UP, (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = this.pageFrame.getLocalPoint(e);
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
          this.config?.onElementAdd(rect);
        }

        this.isCreating = false;
        this.startPoint = null;
      }
    });
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
    const canvasElement = getCanvasElement();
    if (!canvasElement) return;

    // 允许拖拽到画布上
    canvasElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // 处理拖拽释放
    canvasElement.addEventListener("drop", (e) => {
      e.preventDefault();

      const shapeData = parseDragData(e.dataTransfer);
      if (!shapeData) return;

      // 将浏览器坐标转换为世界坐标
      const worldPoint = this.leafer.getWorldPointByClient(e);
      // 将世界坐标转换为frame内坐标
      const framePoint = this.pageFrame.getInnerPoint(worldPoint);

      // 根据类型创建图形
      const shape = createRect({
        x: framePoint.x - shapeData.width / 2,
        y: framePoint.y - shapeData.height / 2,
        width: shapeData.width,
        height: shapeData.height,
        lockRatio: true,
        data: createElementData(shapeData.type),
      });
      this.pageFrame.add(shape);
      this.config?.onElementAdd(shape);
    });
  }

  private bindPlugins(): void {
    this.snap = new Snap(this.leafer, {
      ...DEFAULT_SNAP_CONFIG,
      parentContainer: this.pageFrame,
    });
    const ruler = new Ruler(this.leafer, DEFAULT_RULER_CONFIG);

    this.snap.enable(true);
    ruler.enabled = true;
  }
}

export const createLeaferAnnotate = async (
  config: LeaferAnnotateConfig
): Promise<LeaferAnnotate> => {
  const instance = new LeaferAnnotate(cloneDeep(config));
  await instance.init();
  return instance;
};
