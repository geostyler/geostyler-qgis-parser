import { Style } from 'geostyler-style';

const pointExternalGraphic: Style = {
  name: 'QGIS Style',
  rules: [{
    name: 'QGIS Simple Symbol',
    symbolizers: [{
      kind: 'Icon',
      color: '#7D8B8F',
      size: 69,
      opacity: 1,
      rotate: 0,
      image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/OpenLayers_logo.svg'
    }]
  }]
} as Style;

export default pointExternalGraphic;
