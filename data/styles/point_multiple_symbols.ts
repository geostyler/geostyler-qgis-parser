import { Style } from 'geostyler-style';

const pointMultipleSymbols: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Mark',
      wellKnownName: 'Square',
      color: '#4BFF7E',
      radius: 12,
      opacity: 1,
      rotate: 0,
      strokeColor: '#000000',
      strokeOpacity: 1,
      strokeWidth: 1
    }, {
      kind: 'Mark',
      wellKnownName: 'Circle',
      color: '#FF0000',
      radius: 2,
      opacity: 1,
      rotate: 0,
      strokeColor: '#232323',
      strokeOpacity: 1,
      strokeWidth: 0
    }]
  }]
};

export default pointMultipleSymbols;
