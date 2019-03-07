import { Style } from 'geostyler-style';

const pointStyledLabel: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    filter: ['>', 'value', 0.1],
    symbolizers: []
  }]
};

export default pointStyledLabel;
