import { Style } from 'geostyler-style';

const polygonSimpleNoStyle: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Fill',
      outlineColor: '#FF070B',
      outlineWidth: 4,
      outlineDasharray: [10, 2]
    }]
  }]
} as Style;

export default polygonSimpleNoStyle;
