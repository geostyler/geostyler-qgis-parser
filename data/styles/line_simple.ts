import { Style } from 'geostyler-style';

const pointSimple: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Line',
      color: '#FF00FF',
      width: 3,
      dasharray: [12, 12],
      cap: 'square',
      join: 'round',
      offset: 2,
      opacity: 1
    }]
  }]
} as Style;

export default pointSimple;
