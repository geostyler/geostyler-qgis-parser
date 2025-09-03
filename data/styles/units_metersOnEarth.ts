import { Style } from 'geostyler-style';

const unitsMetersOnEarth: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Line',
      color: '#FF00FF',
      width: 3500,
      widthUnit: 'm'
    }]
  }]
} as Style;

export default unitsMetersOnEarth;
