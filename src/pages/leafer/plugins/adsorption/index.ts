import { App, PropertyEvent, UI } from "leafer-ui";

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
 * 吸附服务,控制移动图元时是否自动吸附功能
 */
export class AdsorptionBinding {
  /**
   * 网格尺寸
   */
  private _app!: App;


  /**
   * 加载服务
   * @param app 容器
   * @param gridSize 网格尺寸
   */
  public install(app: App) {
    this._app = app;
    //监听tree层图元更改事件
    this._app.tree.on(PropertyEvent.CHANGE, this.onPropertyEvent.bind(this));
  }

  /**
   * 卸载服务
   */
  public uninstall() {
  
    this._app.tree.off(PropertyEvent.CHANGE, this.onPropertyEvent.bind(this));
  }



  private onPropertyEvent(e: PropertyEvent) {
    //仅处理x,y,width,height属性更改事件
    if (
      e.attrName != "x" &&
      e.attrName != "y" &&
      e.attrName != "width" &&
      e.attrName != "height"
    )
      return;

    //有时会有undefined的情况
    if (e.newValue == undefined || e.oldValue == undefined) return;
    //仅处理新旧值不一致的对象
    if (e.newValue == e.oldValue) return;
    let v: number;
    let size: number = 1;


        v = Math.round((e.newValue as number) / size) * size;

    let o: UI = e.target as UI;
    assign(o, e.attrName, v);
  }
}
