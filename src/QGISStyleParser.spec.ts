import * as fs from 'fs';
import line_simple from '../data/styles/line_simple';
import no_symbolizer from '../data/styles/no_symbolizer';
import point_categories from '../data/styles/point_categories';
import point_external_graphic from '../data/styles/point_external_graphic';
import point_label from '../data/styles/point_label';
import point_multiple_symbols from '../data/styles/point_multiple_symbols';
import point_ranges from '../data/styles/point_ranges';
import point_rules from '../data/styles/point_rules';
import point_simple from '../data/styles/point_simple';
import polygon_outline_only from '../data/styles/polygon_outline_only';
import polygon_point_pattern_fill from '../data/styles/polygon_point_pattern_fill';
import polygon_simple from '../data/styles/polygon_simple';
import polygon_simple_nostyle from '../data/styles/polygon_simple_nostyle';
import text_text_buffer from '../data/styles/text_text_buffer';
import QGISStyleParser from './QGISStyleParser';
import { TextSymbolizer } from 'geostyler-style';

it('QGISStyleParser is defined', () => {
  expect(QGISStyleParser).toBeDefined();
});

describe('QMLStyleParser implements StyleParser', () => {
  let styleParser: QGISStyleParser;

  beforeEach(() => {
    styleParser = (expect.getState().currentTestName.includes('>=3.28.0'))
      ? new QGISStyleParser()
      : new QGISStyleParser({qgisVersion: '3.22.16-Białowieża'});
  });

  const QML_FOLDERS = [
    ['>=3.28.0',  'qmls'],
    ['<3.28.0', 'qmls_old']
  ];

  QML_FOLDERS.forEach(qmlVersionFolder => {
    const [qmlVersion, qmlFolder] = qmlVersionFolder;
    describe(`#readStyle ${qmlVersion}`, () => {
      it('is defined', () => {
        expect(styleParser.readStyle).toBeDefined();
      });
      describe('PointSymbolizer', () => {
        it('can read a simple QML PointSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_simple.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_simple);
        });
        it('can read a QML PointSymbolizer with an external graphic', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_external_graphic.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_external_graphic);
        });
        it('can read a QML PointSymbolizer with multiple symbols', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_multiple_symbols.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_multiple_symbols);
        });
      });
      describe('TextSymbolizer', () => {
        it('can read some basics of the QML Labeling for Points', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_label.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_label);
        });
        it('can read anchor of the QML Labeling for Points', async () => {
          expect.assertions(5);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_label_anchor.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Text');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as TextSymbolizer).anchor).toBe('bottom');
        });
        it('preserves line-arranged-placement if reading QML Labeling for Lines', async () => {
          expect.assertions(5);
          const qml = fs.readFileSync(`./data/${qmlFolder}/line_label_follow_line.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Text');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as TextSymbolizer).placement).toBe('line');
        });
      });
      describe('LineSymbolizer', () => {
        it('can read a simple QML LineSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/line_simple.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(line_simple);
        });
      });
      describe('FillSymbolizer', () => {
        it('can read a simple QML FillSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/polygon_simple.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(polygon_simple);
        });
        it('can read a QML FillSymbolizer with only an outline', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/polygon_outline_only.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(polygon_outline_only);
        });
        it('can read a QML FillSymbolizer with a PointPatternFill', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/polygon_point_pattern_fill.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(polygon_point_pattern_fill);
        });
      });
      describe('FillSymbolizer with no style', () => {
        it('can read a simple QML FillSymbol with no style', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/polygon_simple_nostyle.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(polygon_simple_nostyle);
        });
      });
      describe('Filter Parsing', () => {
        it('can read a rule based QML PointSymbolizer', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_rules.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_rules);
        });
        it('can read a category based QML PointSymbolizer', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_categories.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_categories);
        });
        it('can read a range based QML PointSymbolizer', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_ranges.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_ranges);
        });
      });
    });
  });

  QML_FOLDERS.forEach(qmlVersionFolder => {
    const [qmlVersion, qmlFolder] = qmlVersionFolder;
    describe(`#writeStyle ${qmlVersion}`, () => {
      it('is defined', () => {
        expect(styleParser.writeStyle).toBeDefined();
      });
      describe('PointSymbolizer', () => {
        it('can write a simple QML PointSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_simple.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(point_simple);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
        it('can write a QML PointSymbolizer with an external graphic', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_external_graphic.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(point_external_graphic);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
        it('can write a QML PointSymbolizer with multiple symbols', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_multiple_symbols.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(point_multiple_symbols);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
      });
      describe('TextSymbolizer', () => {
        it('can write some basics of the QML Labeling for Points', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_label.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(point_label);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
        it('can write QML with text-buffer', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/text_text_buffer.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(text_text_buffer);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
      });
      describe('LineSymbolizer', () => {
        it('can write a simple QML LineSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/line_simple.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(line_simple);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
      });
      describe('FillSymbolizer', () => {
        it('can write a simple QML FillSymbol', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/polygon_simple.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(polygon_simple);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
      });
      describe('Filter Parsing', () => {
        it('can write a rule based QML PointSymbolizer', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_rules.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(point_rules);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
        it('can write QML with no symbolizers', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/no_symbolizer.qml`, 'utf8');
          const { output: qgisStyle } = await styleParser.writeStyle(no_symbolizer);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle).toEqual(qml.trim());
        });
      });
    });
  });
});
