interface propTypes {
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
}

declare module "react-fps-stats" {
  export default class FPSStats extends React.PureComponent<propTypes> {}
}
