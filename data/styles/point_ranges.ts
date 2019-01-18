import { Style } from 'geostyler-style';

const pointRanges: Style = {
  name: 'QGIS Style',
  rules: [
    {
      name: ' 1,0000 - 20,0000 ',
      filter: [
        '&&',
        [
          '>=',
          'PlotNr',
          '1.000000000000000'
        ],
        [
          '<=',
          'PlotNr',
          '20.000000000000000'
        ]
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'Circle',
          opacity: 1,
          color: '#FFFFFF',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: ' 20,0000 - 39,0000 ',
      filter: [
        '&&',
        [
          '>=',
          'PlotNr',
          '20.000000000000000'
        ],
        [
          '<=',
          'PlotNr',
          '39.000000000000000'
        ]
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'Circle',
          opacity: 1,
          color: '#FFBFBF',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: ' 39,0000 - 58,0000 ',
      filter: [
        '&&',
        [
          '>=',
          'PlotNr',
          '39.000000000000000'
        ],
        [
          '<=',
          'PlotNr',
          '58.000000000000000'
        ]
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'Circle',
          opacity: 1,
          color: '#FF8080',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: ' 58,0000 - 77,0000 ',
      filter: [
        '&&',
        [
          '>=',
          'PlotNr',
          '58.000000000000000'
        ],
        [
          '<=',
          'PlotNr',
          '77.000000000000000'
        ]
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'Circle',
          opacity: 1,
          color: '#FF4040',
          rotate: 0,
          radius: 2,
          strokeOpacity: 1,
          strokeColor: '#232323',
          strokeWidth: 0
        }
      ]
    },
    {
      name: ' 77,0000 - 96,0000 ',
      filter: [
        '&&',
        [
          '>=',
          'PlotNr',
          '77.000000000000000'
        ],
        [
          '<=',
          'PlotNr',
          '96.000000000000000'
        ]
      ],
      symbolizers: [
        {
          kind: 'Mark',
          wellKnownName: 'Circle',
          opacity: 1,
          color: '#FF0000',
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

export default pointRanges;
