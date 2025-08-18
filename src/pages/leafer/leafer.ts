/* eslint-disable no-unused-vars */
import { App, Image, Frame, DragEvent, PointerEvent } from 'leafer-ui'
import './proxyData.ts'
import type { IFrame, IApp } from 'leafer-ui'
import '@leafer-in/editor' // 导入交互状态插件
import '@leafer-in/viewport' // 导入视口插件
import '@leafer-in/view' // 导入视口插件
import '@leafer-in/state' // 导入交互状态插件
import '@leafer-in/resize' // 导入交互状态插件
import '@leafer-in/find'
import { Ruler } from 'leafer-x-ruler'
import { Snap } from 'leafer-x-easy-snap'
// import { Flow } from '@leafer-in/flow'  // 导入自动布局插件 //
import { cloneDeep } from 'lodash'
import { loadImage, processMarksToRects } from './leafer-helper.ts'
import type {
  LeaferAnnotateConfig,
  IMark,
  ILeaferAnnotate,
} from './leafer.type.ts'

class LeaferAnnotate implements ILeaferAnnotate {
  config: LeaferAnnotateConfig
  leafer!: App
  pageFrame!: IFrame
  private mode: 'view' | 'edit' = 'view'

  constructor(config: LeaferAnnotateConfig) {
    this.config = cloneDeep(config)
  }
  async init(): Promise<void> {
    let { view, pageUrl, marks } = this.config

    // 初始化APP，没有设置宽高，默认使用父元素的宽高
    this.leafer = new App({
      view: view,
      fill: '#333',
      tree: { type: 'design' },
      zoom: { min: 0.1, max: 8 },
      wheel: {
        zoomSpeed: 0.05,
      },
      editor: { rotateable: false, boxSelect: false, multipleSelect: false },
      smooth: true,
      pixelSnap: true,
    })

    // 获取底图，这是整个画布的核心
    let { url, width, height } = await loadImage(pageUrl, 'bg.png')

    this.pageFrame = new Frame({
      width: width,
      height: height,
    })

    this.leafer.tree?.add(this.pageFrame)
    this.pageFrame.add(new Image({ url: url, width: width, height: height }))

    // 让底图在整个画布中 上下左右，
    this.leafer.zoom('fit', 0)

    // 初始化标注
    this.initMarks(marks)

    // 绑定事件
    this.bindEvent(this.leafer)

    // 加载插件
    const snap = new Snap(this.leafer, {
      lineColor:'#0088ff',
      parentContainer: this.pageFrame,
      showEqualSpacingBoxes: false,
    })
    const ruler = new Ruler(this.leafer, {
      unit: 'px',
    })

    snap.enable(true)
    ruler.enabled = true

    // 默认为view模式
    this.changeMode('view')
  }
  /**
   * 切换模式
   *
   * view: 可以缩放，移动页面，可以编辑元素
   *
   * edit: 不可以缩放，移动，不可以编辑元素，根据选择的元素在页面中进行添加操作
   * @param mode
   */
  changeMode(mode: 'view' | 'edit'): void {
    this.mode = mode
    if (this.mode === 'view') {
      this.pageFrame.hitChildren = true
      this.pageFrame.children?.forEach((child) => {
        if (child.className === 'mark') {
          child.hoverStyle = {
            // fill: "rgba(50,205,121, 0.8)",
            fill: 'transparent',
          }
        }
      })
    } else if (this.mode === 'edit') {
      this.pageFrame.hitChildren = false
      this.pageFrame.children?.forEach((child) => {
        if (child.className === 'mark') {
          child.hoverStyle = {
            fill: '',
          }
        }
      })
    }
  }
  /**
   * 根据ID删除元素
   * @param id 元素ID
   */
  delElement(id: string): void {
    const element = this.pageFrame.find(`[data.id="${id}"]`)[0]
    if (element) {
      element.remove()
    }
  }
  private bindEvent(app: IApp) {
    // 监听拖拽开始事件
    app.on(DragEvent.START, (e) => {
      if (e.ctrlKey && e.left) {
        const rect = e.target
        const clonedRect = rect.clone({
          x: rect.x,
          y: rect.y,
          data: {
            createTime: '000',
          },
        })

        // 交换业务数据
        const originalData = rect.data
        const clonedData = clonedRect.data
        rect.data = clonedData
        clonedRect.data = originalData

        this.pageFrame.add(clonedRect)
        this.config?.onElementAdd(clonedRect)
      }
    })

    // 监听点击事件
    app.on(PointerEvent.TAP, (e) => {
      this.config?.onElementSelect(e)
    })
  }
  /**
   * 初始化接口中的标注矩形
   */
  private initMarks(marks: IMark[]): void {
    if (!Array.isArray(marks) || !this.pageFrame) return
    const layer = this.pageFrame
    const rects = processMarksToRects(marks)
    rects.forEach((rect) => {
      layer.add(rect)
    })
  }
}

export const createLeaferAnnotate = async (
  config: LeaferAnnotateConfig
): Promise<LeaferAnnotate> => {
  const instance = new LeaferAnnotate(cloneDeep(config))
  await instance.init()
  return instance
}
