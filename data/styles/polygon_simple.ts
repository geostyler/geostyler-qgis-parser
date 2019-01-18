import { Style } from 'geostyler-style';

const polygonSimple: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Fill',
      color: '#4BFF7E',
      outlineColor: '#FF070B',
      outlineWidth: 4,
      opacity: 0.5,
      outlineDasharray: [10, 2]
    }]
  }]
} as Style;

export default polygonSimple;
