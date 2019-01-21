import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Text',
      color: '#000000',
      label: 'ID: {{ID}}',
      lineHeight: 1,
      font: ['Courier 10 Pitch'],
      size: 10,
      offset: [13, 37]
    }]
  }]
};

export default pointStyledLabel;
