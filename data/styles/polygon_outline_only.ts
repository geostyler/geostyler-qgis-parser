import { Style } from 'geostyler-style';

const polygonOutlineOnly: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Fill',
      color: 'transparent',
      outlineColor: '#FF070B',
      outlineWidth: 4,
    }]
  }]
} as Style;

export default polygonOutlineOnly;
