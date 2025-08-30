declare module "leafer-x-tooltip-canvas" {
  import { App } from "@leafer-ui/core";
  import { IFontWeight, ILeafer } from "@leafer-ui/interface";

  interface IUserConfig {
    reference?: "pointer" | "element";
    showDelay?: number;
    arrow?: boolean;
    hideDelay?: number;
    placement?:
      | "top"
      | "top-start"
      | "top-end"
      | "bottom"
      | "bottom-start"
      | "bottom-end"
      | "left"
      | "left-start"
      | "left-end"
      | "right"
      | "right-start"
      | "right-end";
    offset?: [number, number];
    info?: Array<string>;
    formatter?: (item?: any) => string | undefined;
    showType?: "value" | "key-value";
    preventOverflow?: boolean;
    includesType?: Array<string>;
    excludesType?: Array<string>;
    ignoreType?: Array<string>;
    throughExcludes?: boolean;
    theme?: "light" | "dark";
    style?: IStyleConfig;
  }

  interface IStyleConfig {
    backgroundColor?: string;
    stroke?: string;
    color?: string;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
    fontWeight?: IFontWeight;
    fontFamily?: string;
  }

  export class TooltipPlugin {
    constructor(instance: ILeafer | App, config?: IUserConfig);
    destroy(): void;
  }
}
