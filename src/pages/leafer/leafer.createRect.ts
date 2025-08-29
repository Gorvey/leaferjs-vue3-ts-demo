import { PointerEvent, Rect, type IUI } from "leafer-ui";
import { EditorEvent } from "@leafer-in/editor";
import type { ILeaferAnnotate } from "./leafer.type";
import {
  calculateRectBounds,
  createRect,
  createElementData,
  isValidRectSize,
  roundPoint,
} from "./leafer.helper";

/**
 * 创建矩形
 */
export class CreateRectBinding {
  private _instance!: ILeaferAnnotate;
  private isCreating = false;
  private startPoint: { x: number; y: number } | null = null;
  private isElementSelected = false;
  private previewRect: Rect | null = null;

  private eventHandlers = {
    pointerTap: null as ((e: PointerEvent) => void) | null,
    editorSelect: null as (() => void) | null,
    pageFrameDown: null as ((e: PointerEvent) => void) | null,
    pageFrameMove: null as ((e: PointerEvent) => void) | null,
    pageFrameUp: null as ((e: PointerEvent) => void) | null,
  };

  /**
   * 加载服务
   */
  public install(instance: ILeaferAnnotate) {
    this._instance = instance;
    this.bindEvents();
  }

  /**
   * 卸载服务
   */
  public uninstall() {
    this.unbindEvents();

    if (this.previewRect) {
      this.previewRect.remove();
      this.previewRect = null;
    }

    this.startPoint = null;
    this.isCreating = false;
    this.isElementSelected = false;
    this._instance = null as unknown as ILeaferAnnotate;
  }

  private bindEvents() {
    this.eventHandlers.pointerTap = (e) => {
      if (e.target.className === "mark") {
        if (this._instance.config?.onElementSelect) {
          this._instance.config.onElementSelect(e.target as IUI);
        }
      }
    };

    this.eventHandlers.editorSelect = () => {
      if (this._instance.app.editor.target) {
        this.isElementSelected = true;
      } else {
        this.isElementSelected = false;
      }
    };

    this.eventHandlers.pageFrameDown = (e) => {
      if (this.isElementSelected) return;
      this.isCreating = true;
      this.startPoint = roundPoint(this._instance.pageFrame.getLocalPoint(e));
    };

    this.eventHandlers.pageFrameMove = (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = roundPoint(
          this._instance.pageFrame.getLocalPoint(e)
        );
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
            this._instance.pageFrame.add(this.previewRect);
            if (this._instance.snap) {
              this._instance.snap.triggerSnap(this.previewRect);
            }
          } else {
            this.previewRect.set({ x, y, width, height });
            if (this._instance.snap) {
              this._instance.snap.triggerSnap(this.previewRect);
            }
          }
        } else if (this.previewRect) {
          this.previewRect.remove();
          this.previewRect = null;
          if (this._instance.snap) {
            this._instance.snap.destroy();
          }
        }
      }
    };

    this.eventHandlers.pageFrameUp = (e) => {
      if (this.isElementSelected) return;
      if (this.isCreating && this.startPoint) {
        const currentPoint = roundPoint(
          this._instance.pageFrame.getLocalPoint(e)
        );
        const { x, y, width, height } = calculateRectBounds(
          this.startPoint,
          currentPoint
        );

        if (this.previewRect) {
          this.previewRect.remove();
          this.previewRect = null;
        }

        if (this._instance.snap) {
          this._instance.snap.destroy();
        }

        if (isValidRectSize(width, height)) {
          const rect = createRect({
            x,
            y,
            width,
            height,
            data: createElementData("rect"),
          });
          this._instance.pageFrame.add(rect);
          if (this._instance.config?.onElementAdd) {
            this._instance.config.onElementAdd(rect);
          }
        }

        this.isCreating = false;
        this.startPoint = null;
      }
    };

    this._instance.app.on(PointerEvent.TAP, this.eventHandlers.pointerTap);
    this._instance.app.editor.on(
      EditorEvent.SELECT,
      this.eventHandlers.editorSelect
    );
    this._instance.pageFrame.on(
      PointerEvent.DOWN,
      this.eventHandlers.pageFrameDown
    );
    this._instance.pageFrame.on(
      PointerEvent.MOVE,
      this.eventHandlers.pageFrameMove
    );
    this._instance.pageFrame.on(
      PointerEvent.UP,
      this.eventHandlers.pageFrameUp
    );
  }

  private unbindEvents() {
    if (this._instance.app && this.eventHandlers.pointerTap) {
      this._instance.app.off(PointerEvent.TAP, this.eventHandlers.pointerTap);
    }
    if (this._instance.app?.editor && this.eventHandlers.editorSelect) {
      this._instance.app.editor.off(
        EditorEvent.SELECT,
        this.eventHandlers.editorSelect
      );
    }
    if (this._instance.pageFrame && this.eventHandlers.pageFrameDown) {
      this._instance.pageFrame.off(
        PointerEvent.DOWN,
        this.eventHandlers.pageFrameDown
      );
    }
    if (this._instance.pageFrame && this.eventHandlers.pageFrameMove) {
      this._instance.pageFrame.off(
        PointerEvent.MOVE,
        this.eventHandlers.pageFrameMove
      );
    }
    if (this._instance.pageFrame && this.eventHandlers.pageFrameUp) {
      this._instance.pageFrame.off(
        PointerEvent.UP,
        this.eventHandlers.pageFrameUp
      );
    }

    this.eventHandlers.pointerTap = null;
    this.eventHandlers.editorSelect = null;
    this.eventHandlers.pageFrameDown = null;
    this.eventHandlers.pageFrameMove = null;
    this.eventHandlers.pageFrameUp = null;
  }
}
