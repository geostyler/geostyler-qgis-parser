import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    filter: ['>', 'value', 0.1],
    symbolizers: [{
      kind: 'Text',
      color: '#000000',
      label: '{{locality_name}}',
      lineHeight: 1,
      font: ['Sans Serif'],
      size: 10,
      offset: [13, 37]
    }]
  }]
};

export default pointStyledLabel;
