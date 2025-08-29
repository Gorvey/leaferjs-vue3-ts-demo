/*
 * @Author: zengzhe
 * @Date: 2025-08-18 18:53:16
 * @LastEditors: zengzhe
 * @LastEditTime: 2025-08-18 21:49:59
 * @Description:
 */
import {
  Resource,
  Rect,
  type IRectInputData,
  type IInteraction,
} from "leafer-ui";
import type { IMark, IImageInfo, IPoint } from "./leafer.type";
import { toRaw } from "vue";

//#region 默认配置
export const DEFAULT_LEAFER_CONFIG = {
  fill: "#333",
  tree: { type: "design" as const },
  zoom: { min: 0.1, max: 8 },
  wheel: {
    zoomSpeed: 0.02,
  },
  editor: {
    moveable: true,
    skewable: false,
    rotateable: false,
    boxSelect: false,
    multipleSelect: false,
    stroke: "#0088ff",
    strokeWidth: 3,
    pointSize: 4,
  },
  smooth: true,
  pixelSnap: true,
};

export const DEFAULT_SNAP_CONFIG = {
  lineColor: "#0088ff",
  showEqualSpacingBoxes: true,
};

export const DEFAULT_RULER_CONFIG = {
  unit: "px" as const,
};

export const DEFAULT_RECT_CONFIG = {
  className: "mark",
  fill: "transparent",
  stroke: "#0088ff",
  strokeWidth: 2,
  isSnap: true,
  editable: true,
  draggable: true,
  dragBounds: "parent" as const,
};
export const CANVAS_SELECTOR = "#leafer-container";
export const MIN_RECT_SIZE = 5;
//#endregion

//#region 工具函数

/**
 * 四舍五入坐标点到整数
 * @param point 坐标点
 * 
 * @example
 * const point = { x: 1.2, y: 2.5 };
 * const roundedPoint = roundPoint(point);
 * console.log(roundedPoint); // { x: 1, y: 3 }
 * @returns 四舍五入后的坐标点
 */
export function roundPoint(point: IPoint): IPoint {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}

/**
 * 设置一个对象的属性值
 * @param obj 对象实例
 * @param key 属性
 * @param val 值
 */
export function assign<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  val: T[K]
) {
  obj[key] = val; // okay
}

/**
 * 计算矩形边界
 */
export function calculateRectBounds(
  startPoint: { x: number; y: number },
  currentPoint: { x: number; y: number }
) {
  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const width = Math.abs(currentPoint.x - startPoint.x);
  const height = Math.abs(currentPoint.y - startPoint.y);

  return { x, y, width, height };
}

/**
 * 创建带时间戳的元素数据
 */
export function createElementData(type: string = "rect") {
  return {
    id: `${type}_${Date.now()}`,
    createTime: new Date().toISOString(),
  };
}

/**
 * 检查矩形尺寸是否有效
 */
export function isValidRectSize(
  width: number,
  height: number,
  minSize: number = MIN_RECT_SIZE
) {
  return width > minSize && height > minSize;
}

/**
 * 获取Canvas元素
 */
export function getCanvasElement(
  selector: string = CANVAS_SELECTOR
): HTMLElement {
  return document.querySelector(selector) as HTMLElement;
}

/**
 * 解析拖拽数据
 */
export function parseDragData(dataTransfer: DataTransfer | null) {
  try {
    const dataString = dataTransfer?.getData("application/json");
    if (!dataString) return null;

    const shapeData = JSON.parse(dataString);
    if (shapeData.source !== "toolbar") return null;

    return shapeData;
  } catch (error) {
    return null;
  }
}

/**
 * 创建矩形拖拽预览Canvas元素
 * @param width 矩形宽度
 * @param height 矩形高度
 * @param scale 缩放比率
 * @returns 返回配置好的Canvas元素
 */
export function createRectDragPreview(
  width: number,
  height: number,
  scale: number = 1
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  // 确保边框在任何缩放比例下都可见，最小2像素
  const strokeWidth = Math.max(2, DEFAULT_RECT_CONFIG.strokeWidth);

  // 获取设备像素比，确保高DPI设备下的清晰度
  const devicePixelRatio = window.devicePixelRatio || 1;

  // 设置canvas实际尺寸
  canvas.width = scaledWidth * devicePixelRatio;
  canvas.height = scaledHeight * devicePixelRatio;

  // 设置canvas显示尺寸
  canvas.style.width = `${scaledWidth}px`;
  canvas.style.height = `${scaledHeight}px`;
  canvas.style.position = "fixed";
  canvas.style.top = "-9999px";
  canvas.style.left = "-9999px";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "1000";
  canvas.style.opacity = "1";

  // 缩放上下文以匹配设备像素比
  ctx.scale(devicePixelRatio, devicePixelRatio);

  // 设置绘制样式
  ctx.strokeStyle = DEFAULT_RECT_CONFIG.stroke;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = DEFAULT_RECT_CONFIG.fill || "transparent";

  // 计算绘制区域，确保边框完全可见
  const halfStroke = strokeWidth / 2;
  const rectX = halfStroke;
  const rectY = halfStroke;
  const rectWidth = scaledWidth - strokeWidth;
  const rectHeight = scaledHeight - strokeWidth;

  // 填充矩形
  if (DEFAULT_RECT_CONFIG.fill && DEFAULT_RECT_CONFIG.fill !== "transparent") {
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  // 绘制边框
  ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

  document.body.appendChild(canvas);

  return canvas;
}

/**
 * 配置交互模式
 */
export function configureInteractionMode(
  interaction: IInteraction | undefined,
  mode: "view" | "edit"
) {
  if (!interaction) return;

  if (mode === "view") {
    interaction.config.move!.holdMiddleKey = true;
    interaction.config.move!.holdSpaceKey = true;
    interaction.config.wheel!.disabled = false;
  } else {
    interaction.config.move!.drag = false;
    interaction.config.move!.holdMiddleKey = false;
    interaction.config.move!.holdSpaceKey = false;
    interaction.config.wheel!.disabled = true;
  }
}
//#endregion

export function loadImage(src: string, name: string): Promise<IImageInfo> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    if (src.includes(";base64")) {
      image.src = src;
    } else {
      image.src = src + "?time=" + new Date().valueOf();
      image.crossOrigin = "Anonymous";
    }

    image.onload = () => {
      const { url } = Resource.setImage(`leafer://${name}`, image);
      resolve({
        url: url,
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = () => {
      console.error("底图加载失败");
      reject("file load iamge");
    };
  });
}

//#region 初始化标注

/**
 * 将接口给的标注信息处理成leafer rect
 * @param marks 标注信息
 * @returns leafer rects
 */
export function processMarksToRects(marks: IMark[]): Rect[] {
  return marks
    .filter((mark) => {
      const hasPoint = mark && mark.top && mark.bottom;
      if (!hasPoint) return false;
      return true;
    })
    .map((mark) => {
      const left = Math.min(mark.top.x, mark.bottom.x);
      const right = Math.max(mark.top.x, mark.bottom.x);
      const top = Math.min(mark.top.y, mark.bottom.y);
      const bottom = Math.max(mark.top.y, mark.bottom.y);

      const p1 = { x: left, y: top };
      const p2 = { x: right, y: bottom };

      return createRect({
        x: p1.x,
        y: p1.y,
        width: Math.max(0, Math.abs(p2.x - p1.x)),
        height: Math.max(0, Math.abs(p2.y - p1.y)),
        data: toRaw(mark),
      });
    });
}

//#endregion

//#region 默认rect图形配置
/**
 * 创建一个rect
 *
 * 需要填充x,y,width,height，data业务属性
 */
export const createRect = (data: IRectInputData): Rect => {
  return new Rect({
    ...DEFAULT_RECT_CONFIG,
    ...data,
  });
};

//#endregion
