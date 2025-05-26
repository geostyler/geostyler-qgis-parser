import { Style } from 'geostyler-style';

const polygonPointPatternFill: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Fill',
      graphicFill: {
        kind: 'Mark',
        color: '#006C2B',
        opacity: 1,
        radius: 0.3,
        rotate: 0,
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWidth: 0.2,
        wellKnownName: 'circle',
      }
    }]
  }]
} as Style;

export default polygonPointPatternFill;
