import * as fs from 'fs';
import QGISStyleParser from './QGISStyleParser';
import { Style } from 'geostyler-style';
import line_simple from '../data/styles/line_simple';
import point_simple from '../data/styles/point_simple';
import point_multiple_symbols from '../data/styles/point_multiple_symbols';
import point_rules from '../data/styles/point_rules';
import point_categories from '../data/styles/point_categories';
import point_ranges from '../data/styles/point_ranges';
import point_external_graphic from '../data/styles/point_external_graphic';

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
    describe('PointSymbolizer', () => {
      it('can read a simple QML PointSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync( './data/qmls/point_simple.qml', 'utf8');
        return styleParser.readStyle(qml)
          .then((geoStylerStyle: Style) => {
            expect(geoStylerStyle).toBeDefined();
            expect(geoStylerStyle).toEqual(point_simple);
          });
      });
      it('can read a QML PointSymbolizer with an external graphic', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync( './data/qmls/point_external_graphic.qml', 'utf8');
        return styleParser.readStyle(qml)
          .then((geoStylerStyle: Style) => {
            expect(geoStylerStyle).toBeDefined();
            expect(geoStylerStyle).toEqual(point_external_graphic);
          });
      });
      it('can read a QML PointSymbolizer with multiple symbols', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync( './data/qmls/point_multiple_symbols.qml', 'utf8');
        return styleParser.readStyle(qml)
          .then((geoStylerStyle: Style) => {
            expect(geoStylerStyle).toBeDefined();
            expect(geoStylerStyle).toEqual(point_multiple_symbols);
          });
      });
    });
    describe('LineSymbolizer', () => {
      it('can read a simple QML LineSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync( './data/qmls/line_simple.qml', 'utf8');
        return styleParser.readStyle(qml)
          .then((geoStylerStyle: Style) => {
            expect(geoStylerStyle).toBeDefined();
            expect(geoStylerStyle).toEqual(line_simple);
          });
      });
    });
    describe('Filter Parsing', () => {
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

});
