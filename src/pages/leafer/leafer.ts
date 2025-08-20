/* eslint-disable no-unused-vars */
import { App, Image, Frame, Rect, DragEvent, PointerEvent } from "leafer-ui";
import "./proxyData.ts";
import type { IFrame, IApp } from "leafer-ui";
import "@leafer-in/editor"; // 导入交互状态插件
import { EditorEvent } from "@leafer-in/editor";
import "@leafer-in/viewport"; // 导入视口插件
import "@leafer-in/view"; // 导入视口插件
import "@leafer-in/state"; // 导入交互状态插件
import "@leafer-in/resize"; // 导入交互状态插件
import "@leafer-in/find";
import { Ruler } from "leafer-x-ruler";
import { Snap } from "./plugins/snap";
// import { Flow } from '@leafer-in/flow'  // 导入自动布局插件 //
import { cloneDeep } from "lodash";
import { loadImage, processMarksToRects } from "./leafer-helper.ts";
import type {
  LeaferAnnotateConfig,
  IMark,
  ILeaferAnnotate,
  ActiveTool,
} from "./leafer.type.ts";

class LeaferAnnotate implements ILeaferAnnotate {
  config: LeaferAnnotateConfig;
  leafer!: App;
  pageFrame!: IFrame;
  activeTool: ActiveTool = "move";
  fillColor: "transparent" | "" = "transparent";
  private mode: "view" | "edit" = "view";
  private isCreating = false;
  private startPoint: { x: number; y: number } | null = null;
  private isElementSelected = false;
  private previewRect: Rect | null = null;
  private snap!: Snap;
  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
    this.isElementSelected = false;
  }
  async init(): Promise<void> {
    let { view, pageUrl, marks } = this.config;

    // 初始化APP，没有设置宽高，默认使用父元素的宽高
    this.leafer = new App({
      view: view,
      fill: "#333",
      tree: { type: "design" },
      zoom: { min: 0.1, max: 8 },
      wheel: {
        zoomSpeed: 0.02,
      },
      editor: {
        skewable: false,
        rotateable: false,
        boxSelect: false,
        multipleSelect: false,
        stroke: "#0088ff",
        strokeWidth: 3,
        pointSize: 5,
        openInner: "double",
      },
      smooth: true,
      pixelSnap: true,
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
    this.bindEvent(this.leafer);

    // 加载插件
    this.snap = new Snap(this.leafer, {
      lineColor: "#0088ff",
      parentContainer: this.pageFrame,
      showEqualSpacingBoxes: true,
    });
    const ruler = new Ruler(this.leafer, {
      unit: "px",
    });

    this.snap.enable(true);
    ruler.enabled = true;

    // 默认为view模式
    this.changeMode("view");
    this.setActiveTool("rect");
  }
  setActiveTool(tool: ActiveTool): void {
    this.activeTool = tool;
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
    if (this.mode === "view") {
      this.pageFrame.cursor = "crosshair";

      this.pageFrame.hitChildren = true;
      // this.pageFrame.children?.forEach((child) => {
      //   if (child.className === 'mark') {
      //     child.hoverStyle = {
      //       fill: 'transparent',
      //     }
      //   }
      // })
      let interaction = this.leafer.tree?.interaction;
      if (interaction) {
        // interaction.config.move!.drag = true;
        interaction.config.move!.holdMiddleKey = true;
        interaction.config.move!.holdSpaceKey = true;
        interaction.config.wheel!.disabled = false;
      }
    } else if (this.mode === "edit") {
      this.pageFrame.hitChildren = false;
      this.pageFrame.cursor = "crosshair";

      let interaction = this.leafer.tree?.interaction;
      if (interaction) {
        interaction.config.move!.drag = false;
        interaction.config.move!.holdMiddleKey = false;
        interaction.config.move!.holdSpaceKey = false;
        interaction.config.wheel!.disabled = true;
      }
    }
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
  private bindEvent(app: IApp) {
    // 监听拖拽开始事件
    app.on(DragEvent.START, (e) => {
      if (e.ctrlKey && e.left) {
        const rect = e.target;
        const clonedRect = rect.clone({
          x: rect.x,
          y: rect.y,
          data: {
            createTime: "000",
          },
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
    app.on(PointerEvent.TAP, (e) => {
      this.config?.onElementSelect(e);
    });
    app.editor.on(EditorEvent.SELECT, (e) => {
      if (app.editor.target) {
        app.editor.target.fill = "transparent";
        this.isElementSelected = true;
      } else {
        e.oldValue.fill = "";
        this.isElementSelected = false;
      }
    });

    // 添加画布拖拽处理
    this.initDragDropHandlers();

    // 矩形绘制相关事件
    this.pageFrame.on(PointerEvent.DOWN, (e) => {
      if (this.isElementSelected) return;
      if (this.activeTool === "rect") {
        this.isCreating = true;
        this.startPoint = this.pageFrame.getLocalPoint(e);
      }
    });

    this.pageFrame.on(PointerEvent.MOVE, (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = this.pageFrame.getLocalPoint(e);

        const x = Math.min(this.startPoint.x, currentPoint.x);
        const y = Math.min(this.startPoint.y, currentPoint.y);
        const width = Math.abs(currentPoint.x - this.startPoint.x);
        const height = Math.abs(currentPoint.y - this.startPoint.y);

        if (width > 5 && height > 5) {
          if (!this.previewRect) {
            this.previewRect = new Rect({
              id: "preview-rect",
              x,
              y,
              width,
              height,
              fill: "",
              stroke: "#0088ff",
              editable: true,
              strokeWidth: 1,
              isSnap: true, // 启用吸附
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

        const x = Math.min(this.startPoint.x, currentPoint.x);
        const y = Math.min(this.startPoint.y, currentPoint.y);
        const width = Math.abs(currentPoint.x - this.startPoint.x);
        const height = Math.abs(currentPoint.y - this.startPoint.y);

        if (this.previewRect) {
          this.previewRect.remove();
          this.previewRect = null;
        }

        // 清除吸附线
        this.snap.destroy();

        if (width > 5 && height > 5) {
          const rect = new Rect({
            x,
            y,
            width,
            height,
            fill: this.fillColor,
            hitRadius: this.fillColor === "" ? 8 : 0,
            stroke: "#0088ff",
            strokeWidth: 1,
            draggable: true,
            dragBounds: "parent",
            editable: true,
            className: "mark",
            isSnap: true,
            data: {
              id: `rect_${Date.now()}`,
              createTime: new Date().toISOString(),
            },   
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
  private initDragDropHandlers(): void {
    const canvasElement = document.querySelector(
      "#leafer-container"
    ) as HTMLElement;
    if (!canvasElement) return;

    // 允许拖拽到画布上
    canvasElement.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // 处理拖拽释放
    canvasElement.addEventListener("drop", (e) => {
      e.preventDefault();

      try {
        const dataString = e.dataTransfer?.getData("application/json");
        if (!dataString) return;

        const shapeData = JSON.parse(dataString);
        if (shapeData.source !== "toolbar") return;

        // 将浏览器坐标转换为世界坐标
        const worldPoint = this.leafer.getWorldPointByClient(e);
        // 将世界坐标转换为frame内坐标
        const framePoint = this.pageFrame.getInnerPoint(worldPoint);

        // 根据类型创建图形
        let shape;
        const baseConfig = {
          x: framePoint.x - shapeData.width / 2,
          y: framePoint.y - shapeData.height / 2,
          width: shapeData.width,
          height: shapeData.height,
          fill: "",
          stroke: "#0088ff",
          strokeWidth: 2,
          hitSoroke: "all",
          hitRadius: 10,
          draggable: true,
          dragBounds: "parent" as const,
          editable: true,
          className: "mark",
          lockRatio: true,
          isSnap: true,
          data: {
            id: `${shapeData.type}_${Date.now()}`,
            createTime: new Date().toISOString(),
          },
        };

        shape = new Rect(baseConfig);

        if (shape) {
          this.pageFrame.add(shape);
          this.config?.onElementAdd(shape);
          this.setActiveTool("rect");
          console.log(`创建了 ${shapeData.type} 图形`, shape);
        }
      } catch (error) {
        console.error("处理拖拽数据时出错:", error);
      }
    });
  }
}

export const createLeaferAnnotate = async (
  config: LeaferAnnotateConfig
): Promise<LeaferAnnotate> => {
  const instance = new LeaferAnnotate(cloneDeep(config));
  await instance.init();
  return instance;
};
