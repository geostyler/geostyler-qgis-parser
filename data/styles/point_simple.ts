import { Style } from 'geostyler-style';

const pointSimple: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'Circle',
      color: '#BEB297',
      radius: 2,
      opacity: 1,
      rotate: 0,
      strokeColor: '#232323',
      strokeOpacity: 1,
      strokeWidth: 0
    }]
  }]
} as Style;

export default pointSimple;
