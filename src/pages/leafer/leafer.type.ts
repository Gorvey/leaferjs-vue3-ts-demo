/*
 * @Author: zengzhe
 * @Date: 2025-08-18 18:53:16
 * @LastEditors: zengzhe
 * @LastEditTime: 2025-08-18 20:44:37
 * @Description:
 */
import { type IFrame, App, type IUI } from 'leafer-ui'

export interface IImageInfo {
  /** 图片的url, leafer Resource 的资源路径 */
  url: string;
  /** 图片的宽度，单位px */
  width: number;
  /** 图片的高度，单位px */
  height: number;
}

// 定义坐标点类型
export interface IMarkPoint {
  x: number
  y: number
}
export interface IMark {
  top: IMarkPoint
  bottom: IMarkPoint
  id: string
  PaperType?: string
  questionID?: string | number
  childQuestionID?: string | number
  [key: string]: any // 允许其他动态属性
}

// LeaferAnnotate 构造函数的配置项接口
export interface LeaferAnnotateConfig {
  view: string // 挂载的视图
  pageUrl: string // 背景图片的URL
  marks: IMark[] // 标注数据数组
  onElementAdd?: (element: IUI) => void
  onElementSelect?: (element: IUI) => void
}

export type ActiveTool = 'move' | 'rect' | 'drag' | ''

export interface IPoint {
  x: number
  y: number
}

// 定义 LeaferAnnotate 类的接口，使其结构更清晰
export interface ILeaferAnnotate {
  config: LeaferAnnotateConfig
  app: App
  pageFrame: IFrame

  init(): Promise<void>
  delElement(id: string): void
  destroy(): Promise<void>
}
