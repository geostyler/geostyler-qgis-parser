import * as fs from 'fs';
import QGISStyleParser from './QGISStyleParser';
import { Style } from 'geostyler-style';
import line_simple from '../data/styles/line_simple';
import point_simple from '../data/styles/point_simple';
import point_multiple_symbols from '../data/styles/point_multiple_symbols';
import point_rules from '../data/styles/point_rules';
import point_categories from '../data/styles/point_categories';
import point_label from '../data/styles/point_label';
import point_ranges from '../data/styles/point_ranges';
import point_external_graphic from '../data/styles/point_external_graphic';
import polygon_simple from '../data/styles/polygon_simple';
import polygon_simple_nostyle from '../data/styles/polygon_simple_nostyle';
import no_symbolizer from '../data/styles/no_symbolizer';
import text_text_buffer from '../data/styles/text_text_buffer';
import { defaults } from 'xml2js';

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
      it('can read a simple QML PointSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_simple.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_simple);
      });
      it('can read a QML PointSymbolizer with an external graphic', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_external_graphic.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_external_graphic);
      });
      it('can read a QML PointSymbolizer with multiple symbols', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_multiple_symbols.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_multiple_symbols);
      });
    });
    describe('TextSymbolizer', () => {
      it('can read some basics of the QML Labeling for Points', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_label.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_label);
      });
    });
    describe('LineSymbolizer', () => {
      it('can read a simple QML LineSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/line_simple.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(line_simple);
      });
    });
    describe('FillSymbolizer', () => {
      it('can read a simple QML FillSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/polygon_simple.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(polygon_simple);
      });
    });
    describe('FillSymbolizer with no style', () => {
      it('can read a simple QML FillSymbol with no style', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/polygon_simple_nostyle.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(polygon_simple_nostyle);
      });
    });
    describe('Filter Parsing', () => {
      it('can read a rule based QML PointSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_rules.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_rules);
      });
      it('can read a category based QML PointSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_categories.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_categories);
      });
      it('can read a range based QML PointSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_ranges.qml', 'utf8');
        const { output: geoStylerStyle } = await styleParser.readStyle(qml);
        expect(geoStylerStyle).toBeDefined();
        expect(geoStylerStyle).toEqual(point_ranges);
      });
    });
  });

  describe('#writeStyle', () => {
    it('is defined', () => {
      expect(styleParser.writeStyle).toBeDefined();
    });
    describe('PointSymbolizer', () => {
      it('can write a simple QML PointSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_simple.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(point_simple);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
      it('can write a QML PointSymbolizer with an external graphic', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_external_graphic.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(point_external_graphic);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
      it('can write a QML PointSymbolizer with multiple symbols', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_multiple_symbols.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(point_multiple_symbols);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
    });
    describe('TextSymbolizer', () => {
      it('can write some basics of the QML Labeling for Points', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_label.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(point_label);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
      it('can write QML with text-buffer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/text_text_buffer.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(text_text_buffer);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
    });
    describe('LineSymbolizer', () => {
      it('can write a simple QML LineSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/line_simple.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(line_simple);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
    });
    describe('FillSymbolizer', () => {
      it('can write a simple QML FillSymbol', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/polygon_simple.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(polygon_simple);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
    });
    describe('Filter Parsing', () => {
      it('can write a rule based QML PointSymbolizer', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/point_rules.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(point_rules);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
      it('can write QML with no symbolizers', async () => {
        expect.assertions(2);
        const qml = fs.readFileSync('./data/qmls/no_symbolizer.qml', 'utf8');
        const { output: qgisStyle } = await styleParser.writeStyle(no_symbolizer);
        expect(qgisStyle).toBeDefined();
        expect(qgisStyle).toEqual(qml.trim());
      });
    });
  });

});
