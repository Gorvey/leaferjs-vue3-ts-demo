/*
 * @Author: zengzhe
 * @Date: 2025-08-18 18:53:16
 * @LastEditors: zengzhe
 * @LastEditTime: 2025-08-18 20:44:37
 * @Description:
 */
import { type IFrame, App, type IUI } from 'leafer-ui'

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
  onElementAdd(element: IUI): void
  onElementSelect(element: IUI): void
}

// 定义 LeaferAnnotate 类的接口，使其结构更清晰
export interface ILeaferAnnotate {
  config: LeaferAnnotateConfig
  leafer: App
  pageFrame: IFrame

  // mode: 'view' | 'edit'
  editType?: ''

  init(): Promise<void>
  /**
   * view: 可以缩放，移动页面，可以编辑元素
   *
   * edit: 不可以缩放，移动，不可以编辑元素，根据选择的元素在页面中进行添加操作
   */
  changeMode(mode: 'view' | 'edit'): void
  delElement(id: string): void
}
