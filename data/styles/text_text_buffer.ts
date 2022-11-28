import { Style } from 'geostyler-style';

const labelSample: Style = {
  name: 'roads_oneways',
  rules: [
    {
      name: '',
      scaleDenominator: {
        max: 1000
      },
      symbolizers: [
        {
          kind: 'Text',
          label: 'Sample label',
          padding: 0,
          font: ['DejaVuSans'],
          size: 10.6135611907387,
          haloColor: '#fafafa',
          haloWidth: 0.7938257993384785
        }
      ]
    }
  ]
} as Style;

export default labelSample;
