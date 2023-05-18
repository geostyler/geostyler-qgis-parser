import { Style } from 'geostyler-style';

const pointSimple: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Line',
      cap: 'square',
      color: '#FF00FF',
      width: 3,
      dasharray: [12, 12],
      join: 'round',
      perpendicularOffset: 2,
      opacity: 1
    }]
  }]
} as Style;

export default pointSimple;
