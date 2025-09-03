import { Style } from 'geostyler-style';

const unitsPixel: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Line',
      color: '#FF00FF',
      width: 3,
      widthUnit: 'px'
    }]
  }]
} as Style;

export default unitsPixel;
