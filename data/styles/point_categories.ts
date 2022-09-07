import { Style } from 'geostyler-style';

const pointCategories: Style = {
  name: 'QGIS Style',
  rules: [
    {
      name: 'Bildpositi = 1',
      filter: [
        '==',
        'Bildpositi',
        '1'
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          opacity: 1,
          color: '#8ADC38',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: 'Bildpositi = 2',
      filter: [
        '==',
        'Bildpositi',
        '2'
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          opacity: 1,
          color: '#EA5D5D',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: 'Bildpositi = 3',
      filter: [
        '==',
        'Bildpositi',
        '3'
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          opacity: 1,
          color: '#69DBDB',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: 'Bildpositi = ',
      filter: [
        '==',
        'Bildpositi',
        ''
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'circle',
          opacity: 1,
          color: '#9E6ECD',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    }
  ]
} as Style;

export default pointCategories;
