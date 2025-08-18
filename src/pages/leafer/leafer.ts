/* eslint-disable no-unused-vars */
import { App, Image, Frame } from "leafer-ui";
import './proxyData.ts'
import type { IFrame } from "leafer-ui";
import "@leafer-in/editor"; // 导入交互状态插件
import "@leafer-in/viewport"; // 导入视口插件
import "@leafer-in/view"; // 导入视口插件
import "@leafer-in/state"; // 导入交互状态插件
import "@leafer-in/resize"; // 导入交互状态插件
import "@leafer-in/find";
import { Ruler } from "leafer-x-ruler";
import { Snap } from "leafer-x-easy-snap";
// import { Flow } from '@leafer-in/flow'  // 导入自动布局插件 //
import { cloneDeep } from "lodash";
import { loadImage, processMarksToRects } from "./leafer-helper.ts";
import type {
  LeaferAnnotateConfig,
  IMark,
  ILeaferAnnotate,
} from "./leafer.type.ts";

class LeaferAnnotate implements ILeaferAnnotate {
  config: LeaferAnnotateConfig;
  leafer!: App;
  pageFrame!: IFrame;
  mode: "view" | "edit" = "view";

  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
  }
  async init(): Promise<void> {
    let { view, pageUrl, marks } = this.config;
    this.leafer = new App({
      view: view,
      fill: "#333",
      tree: { type: "design" },
      zoom: { min: 0.1, max: 8 },
      editor: { rotateable: false },
      smooth:true,
      pixelSnap:true,
    });
    let { url, width, height } = await loadImage(pageUrl, "bg.png");

    this.pageFrame = new Frame({
      width: width,
      height: height,
    });

    this.leafer.tree?.add(this.pageFrame);
    this.pageFrame.add(new Image({ url: url, width: width, height: height }));
    this.leafer.zoom("fit", 0);
    this.initMarks(marks);

    const snap = new Snap(this.leafer, {
      parentContainer: this.pageFrame,
    });
    const ruler = new Ruler(this.leafer, {
      unit: "px",
    });

    snap.enable(true);
    ruler.enabled = true; 
    this.changeMode("view");
  }
  changeMode(mode: "view" | "edit"): void {
    this.mode = mode;
    if (mode === "view") {
      this.pageFrame.hitChildren = true;
      this.pageFrame.children?.forEach((child) => {
        if (child.className === "mark") {
          child.hoverStyle = {
            // fill: "rgba(50,205,121, 0.8)",
            fill: "transparent",
          };
        }
      });
    } else if (mode === "edit") {
      this.pageFrame.hitChildren = false;
      this.pageFrame.children?.forEach((child) => {
        if (child.className === "mark") {
          child.hoverStyle = {
            fill: "",
          };
        }
      });
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
  /**
   * 初始化接口中的标注矩形
   */
  private initMarks(marks: IMark[]): void {
    if (!Array.isArray(marks) || !this.pageFrame) return;
    const layer = this.pageFrame;
    const rects = processMarksToRects(marks,this);
    rects.forEach((rect) => {
      layer.add(rect);
    });
  }

  /**
   * 根据mark数据创建新的rect元素
   * @param mark 标注数据
   */
  addMarkElement(mark: IMark): void {
    if (!this.pageFrame) return;
    const rects = processMarksToRects([mark], this);
    if (rects.length > 0) {
      this.pageFrame.add(rects[0]);
    }
  }
}

export const createLeaferAnnotate = async (
  config: LeaferAnnotateConfig
): Promise<LeaferAnnotate> => {
  const instance = new LeaferAnnotate(cloneDeep(config));
  await instance.init();
  return instance;
};
