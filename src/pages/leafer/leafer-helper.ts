/*
 * @Author: zengzhe
 * @Date: 2025-08-18 18:53:16
 * @LastEditors: zengzhe
 * @LastEditTime: 2025-08-18 21:49:59
 * @Description:
 */
import { Resource, Rect, type IRect,  } from 'leafer-ui'
import type { IMark,  } from './leafer.type'
//#region loadImage
export interface IImageInfo {
  /** 图片的url, leafer Resource 的资源路径 */
  url: string
  /** 图片的宽度，单位px */
  width: number
  /** 图片的高度，单位px */
  height: number
}

export function loadImage(src: string, name: string): Promise<IImageInfo> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    if (src.includes(';base64')) {
      image.src = src
    } else {
      image.src = src + '?time=' + new Date().valueOf()
      image.crossOrigin = 'Anonymous'
    }

    image.onload = () => {
      const { url } = Resource.setImage(`leafer://${name}`, image)
      resolve({
        url: url,
        width: image.width,
        height: image.height,
      })
    }
    image.onerror = () => {
      console.error('底图加载失败')
      reject('file load iamge')
    }
  })
}

//#endregion

//#region 初始化标注

/**
 * 将接口给的标注信息处理成leafer rect
 * @param marks 标注信息
 * @returns leafer rects
 */
export function processMarksToRects(marks: IMark[]): IRect[] {
  return marks
    .filter((mark) => {
      const hasPoint = mark && mark.top && mark.bottom
      if (!hasPoint) return false
      return true
    })
    .map((mark) => {
      const left = Math.min(mark.top.x, mark.bottom.x)
      const right = Math.max(mark.top.x, mark.bottom.x)
      const top = Math.min(mark.top.y, mark.bottom.y)
      const bottom = Math.max(mark.top.y, mark.bottom.y)

      const p1 = { x: left, y: top }
      const p2 = { x: right, y: bottom }
      const rect = new Rect({
        className: 'mark',
        x: p1.x,
        y: p1.y,
        width: Math.max(0, Math.abs(p2.x - p1.x)),
        height: Math.max(0, Math.abs(p2.y - p1.y)),
        fill: 'transparent',
        stroke: '#0088ff',
        strokeWidth: 1,
        cornerRadius: 0,
        isSnap: true,
        draggable: true,
        dragBounds: 'parent', // 限制元素拖动范围 //
        editable: true,
        data: mark,
      })

      return rect
    })
}

//#endregion
