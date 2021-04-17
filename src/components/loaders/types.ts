import { GroupProps } from "react-three-fiber"

export type AssetProps = {
  url: string;
  /**
   * @default -1
   */
  label?: string;
  activeAnimationIndex?: number;
  /**
   * @default false
   */
  shadow?: boolean;
  maps?: {
    map?: string;
    aoMap?: string;
    normalMap?: string;
  };
  onProgress?: (event: ProgressEvent<EventTarget>) => void;
} & GroupProps
