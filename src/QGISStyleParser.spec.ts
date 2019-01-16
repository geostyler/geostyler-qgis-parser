import * as fs from 'fs';
import QGISStyleParser from './QGISStyleParser';
import { Style } from 'geostyler-style';
import point_simple from '../data/styles/point_simple';
import point_rules from '../data/styles/point_rules';
import point_categories from '../data/styles/point_categories';
import point_ranges from '../data/styles/point_ranges';

it('QGISStyleParser is defined', () => {
  expect(QGISStyleParser).toBeDefined();
});

describe('QMLStyleParser implements StyleParser', () => {
  let styleParser: QGISStyleParser;

  beforeEach(() => {
    styleParser = new QGISStyleParser();
  });

  describe('#readStyle', () => {
    it('is defined', () => {
      expect(styleParser.readStyle).toBeDefined();
    });
    it('can read a simple QML PointSymbolizer', async () => {
      expect.assertions(2);
      const qml = fs.readFileSync( './data/qmls/point_simple.qml', 'utf8');
      return styleParser.readStyle(qml)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simple);
        });
    });
    it('can read a rule based QML PointSymbolizer', async () => {
      expect.assertions(2);
      const qml = fs.readFileSync( './data/qmls/point_rules.qml', 'utf8');
      return styleParser.readStyle(qml)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_rules);
        });
    });
    it('can read a category based QML PointSymbolizer', async () => {
      expect.assertions(2);
      const qml = fs.readFileSync( './data/qmls/point_categories.qml', 'utf8');
      return styleParser.readStyle(qml)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_categories);
        });
    });
    it('can read a range based QML PointSymbolizer', async () => {
      expect.assertions(2);
      const qml = fs.readFileSync( './data/qmls/point_ranges.qml', 'utf8');
      return styleParser.readStyle(qml)
        .then((geoStylerStyle: Style) => {
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_ranges);
        });
    });
  });

});
