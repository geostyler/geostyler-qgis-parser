import { Style } from 'geostyler-style';

const pointSimplePoint: Style = {
  name: 'QGIS Style',
  rules: [{
    filter: ['==', 'Bildpositi', 1],
    name: 'Bildpositi = 1',
    scaleDenominator: {
      max: 2000,
      min: 100
    },
    symbolizers: [{
      color: '#4BFF7E',
      kind: 'Mark',
      opacity: 1,
      radius: 12,
      rotate: 0,
      strokeColor: '#000000',
      strokeOpacity: 1,
      strokeWidth: 1,
      wellKnownName: 'Square'
    }]
  }, {
    filter: ['&&',
      ['>', 'Bildpositi', 1],
      ['<', 'Bildpositi', 3]
    ],
    name: 'Bildpositi > 1 AND Bildpositi < 3',
    scaleDenominator: {
      max: 2000,
      min: 100
    },
    symbolizers: [{
      color: '#91522D',
      kind: 'Mark',
      opacity: 1,
      radius: 6,
      rotate: 0,
      strokeColor: '#232323',
      strokeOpacity: 1,
      strokeWidth: 1,
      wellKnownName: 'Circle'
    }]
  }, {
    filter: ['==', 'Bildpositi', 3],
    name: 'Bildpositi = 3',
    scaleDenominator: {
      max: 2000,
      min: 100
    },
    symbolizers: [{
      color: '#BEB297',
      kind: 'Mark',
      opacity: 1,
      radius: 6,
      rotate: 0,
      strokeColor: '#232323',
      strokeOpacity: 1,
      strokeWidth: 1,
      wellKnownName: 'Circle'
    }]
  }]
};

export default pointSimplePoint;
