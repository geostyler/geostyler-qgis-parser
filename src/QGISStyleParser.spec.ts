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
import point_transparent_fill from '../data/styles/point_transparent_fill';
import polygon_outline_only from '../data/styles/polygon_outline_only';
import polygon_point_pattern_fill from '../data/styles/polygon_point_pattern_fill';
import polygon_simple from '../data/styles/polygon_simple';
import polygon_simple_nostyle from '../data/styles/polygon_simple_nostyle';
import text_text_buffer from '../data/styles/text_text_buffer';
import QGISStyleParser from './QGISStyleParser';
import { LineSymbolizer } from 'geostyler-style';
import unitsMetersOnEarth from '../data/styles/units_metersOnEarth';
import unitsPixel from '../data/styles/units_Pixel';

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
        it('can read a QML PointSymbol with transparent fill and opaque border', async () => {
          expect.assertions(2);
          const qml = fs.readFileSync(`./data/${qmlFolder}/point_transparent_fill.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle).toEqual(point_transparent_fill);
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
      describe('Getting Rules (getRulesFromQmlObject)', () => {
        it('can read rules from QML containing simple symbolization and simple labeling', async () => {
          expect.assertions(6);
          const qml = fs.readFileSync(`./data/${qmlFolder}/rules_simple_symbol_simple_label.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(2);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[0].symbolizers[1].kind).toBe('Text');
          expect(geoStylerStyle?.rules[0].name).toBe('QGIS Simple Symbol');
        });
        it('can read rules from QML containing rule-based symbolization and simple labeling', async () => {
          expect.assertions(11);
          const qml = fs.readFileSync(`./data/${qmlFolder}/rules_ruled_symbol_simple_label.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(3);
          expect(geoStylerStyle?.rules[0].name).toBe('Symbol-Rule 1');
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[1].name).toBe('Symbol-Rule 2');
          expect(geoStylerStyle?.rules[1].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[1].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[2].name).toBe('QGIS Simple Symbol');
          expect(geoStylerStyle?.rules[2].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[2].symbolizers[0].kind).toBe('Text');
        });
        it('can read rules from QML containing simple symbolization and rule-based labeling', async () => {
          expect.assertions(13);
          const qml = fs.readFileSync(`./data/${qmlFolder}/rules_simple_symbol_ruled_label.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(3);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(3);
          expect(geoStylerStyle?.rules[0].name).toBe('QGIS Simple Symbol');
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[1].name).toBe('Text-Rule 1');
          expect(geoStylerStyle?.rules[1].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[1].symbolizers[0].kind).toBe('Text');
          expect(geoStylerStyle?.rules[2].name).toBe('Text-Rule 2');
          expect(geoStylerStyle?.rules[2].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[2].symbolizers[0].kind).toBe('Text');
        });
        it('can read rules from QML containing rule-based symbolization and rule-based labeling', async () => {
          expect.assertions(14);
          const qml = fs.readFileSync(`./data/${qmlFolder}/rules_ruled_symbol_ruled_label.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(4);
          expect(geoStylerStyle?.rules[0].name).toBe('Symbol-Rule 1');
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[1].name).toBe('Symbol-Rule 2');
          expect(geoStylerStyle?.rules[1].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[1].symbolizers[0].kind).toBe('Mark');
          expect(geoStylerStyle?.rules[2].name).toBe('Text-Rule 1');
          expect(geoStylerStyle?.rules[2].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[2].symbolizers[0].kind).toBe('Text');
          expect(geoStylerStyle?.rules[3].name).toBe('Text-Rule 2');
          expect(geoStylerStyle?.rules[3].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[3].symbolizers[0].kind).toBe('Text');
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
      describe('Handling of DistanceUnits', () => {
        it('can read a Symbolizer with Unit=RenderMetersInMapUnits', async () => {
          expect.assertions(6);
          const qml = fs.readFileSync(`./data/${qmlFolder}/units_metersOnEarth.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Line');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).width).toBe(1500);
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).widthUnit).toBe('m');
        });
        it('can read a Symbolizer with Unit=Point', async () => {
          expect.assertions(6);
          const qml = fs.readFileSync(`./data/${qmlFolder}/units_points.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Line');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).width).toBe(10.7);
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).widthUnit)
            .toBeUndefined(); // because it's Pixel which is default-unit
        });
        it('can read a Symbolizer with Unit=Millimeter', async () => {
          expect.assertions(6);
          const qml = fs.readFileSync(`./data/${qmlFolder}/units_mm.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Line');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).width).toBe(5.7);
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).widthUnit)
            .toBeUndefined(); // because it's Pixel which is default-unit
        });
        it('can read a Symbolizer with Unit=Inch', async () => {
          expect.assertions(6);
          const qml = fs.readFileSync(`./data/${qmlFolder}/units_inch.qml`, 'utf8');
          const { output: geoStylerStyle } = await styleParser.readStyle(qml);
          expect(geoStylerStyle).toBeDefined();
          expect(geoStylerStyle?.rules.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers.length).toBe(1);
          expect(geoStylerStyle?.rules[0].symbolizers[0].kind).toBe('Line');
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).width).toBe(9.6);
          expect((geoStylerStyle?.rules[0].symbolizers[0] as LineSymbolizer).widthUnit)
            .toBeUndefined(); // because it's Pixel which is default-unit
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
      describe('Handling of DistanceUnits', () => {
        it('can write a Symbolizer with DistanceUnit Meter', async () => {
          expect.assertions(2);
          const { output: qgisStyle } = await styleParser.writeStyle(unitsMetersOnEarth);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle?.includes(
            '<Option name="line_width_unit" value="RenderMetersInMapUnits" type="QString"/>') ||
            qgisStyle?.includes('<prop k="line_width_unit" v="RenderMetersInMapUnits"/>')).toBe(true);
        });
        it('can write a Symbolizer with DistanceUnit Pixel', async () => {
          expect.assertions(2);
          const { output: qgisStyle } = await styleParser.writeStyle(unitsPixel);
          expect(qgisStyle).toBeDefined();
          expect(qgisStyle?.includes('<Option name="line_width_unit" value="Pixel" type="QString"/>') ||
            qgisStyle?.includes('<prop k="line_width_unit" v="Pixel"/>')).toBe(true);
        });
      });
    });
  });
});
