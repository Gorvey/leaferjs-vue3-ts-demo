import { App, Image, Frame, Resource } from "leafer-ui";
import { AdsorptionBinding } from "./leafer.adsorption.ts";
import { DropBinding } from "./leafer.drop.ts";
import { CopyRectBinding } from "./leafer.copyRect.ts";
import { CreateRectBinding } from "./leafer.createRect.ts";
import "./leafer.proxyData.ts";
import type { IFrame } from "leafer-ui";
import "@leafer-in/editor";
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
  DEFAULT_LEAFER_CONFIG,
  DEFAULT_SNAP_CONFIG,
  DEFAULT_RULER_CONFIG,
  configureInteractionMode,
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
  snap!: Snap;
  limitWidth!: number;
  limitHeight!: number;
  private mode: "view" | "edit" = "view";
  private adsorptionBinding!: AdsorptionBinding;
  private dropBinding!: DropBinding;
  private copyRectBinding!: CopyRectBinding;
  private createRectBinding!: CreateRectBinding;
  private ruler!: Ruler;

  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config);
  }
  public async destroy(): Promise<void> {
    // 清理资源
    Resource.destroy();

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
    if (this.copyRectBinding) {
      this.copyRectBinding.uninstall();
      this.copyRectBinding = null as any;
    }
    if (this.createRectBinding) {
      this.createRectBinding.uninstall();
      this.createRectBinding = null as any;
    }
    if (this.ruler) {
      this.ruler.enabled = false;
      this.ruler = null as any;
    }

    if (this.pageFrame) {
      this.pageFrame.removeAll();
      this.pageFrame = null as any;
    }

    if (this.app) {
      await this.app.destroy(true);
      this.app = null as any;
    }

    this.config = null as any;

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

    // 启用插件
    this.bindPlugins();

    // 默认为view模式
    this.changeMode("view");
  }

  public resetView(): void {
    this.app.tree?.zoom("fit-width", 0);
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
    this.app.zoom("fit-width", 0);
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
    this.snap = new Snap(this.app, {
      ...DEFAULT_SNAP_CONFIG,
      parentContainer: this.pageFrame,
    });
    this.ruler = new Ruler(this.app, DEFAULT_RULER_CONFIG);

    // 精确控制元素，x,y,width,height在1px单位步进变化,去除小数点
    this.adsorptionBinding = new AdsorptionBinding();
    this.adsorptionBinding.install(this.app);
    // 在画布上拖拽图元
    this.dropBinding = new DropBinding();
    this.dropBinding.install(this.app, this.pageFrame, ".leafer-container");
    // 按住ctrl复制矩形
    this.copyRectBinding = new CopyRectBinding();
    this.copyRectBinding.install(this, "mark");
    // 创建矩形工具
    this.createRectBinding = new CreateRectBinding();
    this.createRectBinding.install(this);

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
