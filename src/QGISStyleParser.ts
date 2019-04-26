import {
  Filter,
  StyleParser,
  Style,
  Rule,
  ScaleDenominator,
  PointSymbolizer,
  Symbolizer,
  IconSymbolizer,
  LineSymbolizer,
  MarkSymbolizer,
  WellKnownName,
  FillSymbolizer,
  TextSymbolizer
} from 'geostyler-style';

import { CqlParser } from 'geostyler-cql-parser';

const Color = require('color');

import {
  parseString,
  Builder
} from 'xml2js';

const _get = require('lodash/get');

type SymbolizerMap = {
  [key: string]: Symbolizer[]
};

type LabelMap = {
  [filter: string]: TextSymbolizer[]
};

type QmlProp = {
  $: {
    k: any,
    v: any
  }
};

type QmlRule = {
  $: {
    filter?: string,
    scalemaxdenom?: number,
    scalemindenom?: number,
    symbol: string,
    key: string,
    label: string
  }
};

type QmlCategory = {
  $: {
    label: string,
    render: string,
    symbol: string,
    value: string
  }
};

type QmlRange = {
  $: {
    upper: string,
    lower: string,
    label: string,
    symbol: string,
    render: string,
  }
};

export const outlineStyleDashArrays = {
  dot: [2, 2],
  dash: [10, 2]
};

const AnchorMap = {
  left: 'L',
  right: 'R',
  top: 'T',
  bottom: 'B',
  'top-left': 'TL',
  'top-right': 'TR',
  'bottom-left': 'BL',
  'bottom-right': 'BR'
};

/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style StyleParser interface.
 *
 * @class QGISStyleParser
 * @implements StyleParser
 */
export class QGISStyleParser implements StyleParser {

  cqlParser = new CqlParser();

  /**
   * The name of the QGIS Style Parser.
   */
  public static title = 'QGIS Style Parser';

  title = 'QGIS Style Parser';

  /**
   * The readStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a QML as a string and returns a Promise.
   * The Promise itself resolves with a GeoStyler-Style Style.
   *
   * @param {string} qmlString A QML as a string.
   * @return {Promise} The Promise resolving with the GeoStyler-Style Style
   */
  readStyle(qmlString: string): Promise<Style> {
    return new Promise<Style>((resolve, reject) => {
      const options = {};
      try {
        parseString(qmlString, options, (err: any, result: any) => {
          if (err) {
            reject(`Error while parsing qmlString: ${err}`);
          }
          const geoStylerStyle: Style = this.qmlObjectToGeoStylerStyle(result);
          resolve(geoStylerStyle);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param qmlLabel
   */
  parseLabelTemplates(qmlLabel: string): string {
    let geostylerLabel: string = '';
    const qmlLabelArray = qmlLabel.split('||');

    qmlLabelArray.forEach((part: string) => {
      const singleQuotedText = part.match(/[']([^']+)[']/);
      if (singleQuotedText) {
        geostylerLabel += singleQuotedText[1];
      } else {
        geostylerLabel += `{{${part.trim()}}}`;
      }
    });

    return geostylerLabel;
  }

  /**
   *
   * @param qmlSymbolizer
   */
  qmlSymbolizerLayerPropsToObject(qmlSymbolizer: any) {
    const qmlMarkerProps: any = {};
    qmlSymbolizer.prop.forEach((prop: QmlProp) => {
      const key = prop.$.k;
      const value = prop.$.v;
      qmlMarkerProps[key] = value;
    });
    return qmlMarkerProps;
  }

  /**
   * Get the GeoStyler-Style Style from an QML Object (created with xml2js).
   *
   * @param {object} qmlObject The QML object representation (created with xml2js)
   * @return {Style} The GeoStyler-Style Style
   */
  qmlObjectToGeoStylerStyle(qmlObject: object): Style {
    const rules = this.getRulesFromQmlObject(qmlObject);
    return {
      name: 'QGIS Style',
      rules
    };
  }

  /**
   *
   * @param hex
   * @param opacity
   */
  qmlColorFromHexAndOpacity(hex?: string, opacity?: number): string | undefined {
    const colorArray = Color(hex).alpha(opacity).rgb().array();
    const alpha = colorArray[3] === undefined || isNaN(colorArray[3]) ? 255
      : colorArray[3] === 0 ? 0
        : 255 * colorArray[3];
    const color = `${colorArray[0]},${colorArray[1]},${colorArray[2]},${Math.round(alpha)}`;

    return color;
  }

  /**
   *
   * @param color
   */
  qmlColorToOpacity(color: string): number {
    const colorArray = color.split(',');
    const opacity = parseFloat(colorArray[3]) / 255;
    return Math.round(opacity * 100) / 100;
  }

  /**
   *
   * @param color
   */
  qmlColorToHex(qmlColor: string): string {
    const colorArray = qmlColor.split(',');
    const color = Color(`rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`);
    return color.hex();
  }

  /**
   * Get the GeoStyler-Style Rule from an QML Object (created with xml2js).
   *
   * @param {object} qmlObject The QML object representation (created with xml2js)
   * @return {Rule} The GeoStyler-Style Rule
   */
  getRulesFromQmlObject(qmlObject: any): Rule[] {
    const qmlRenderer = _get(qmlObject, 'qgis.renderer-v2.[0]');
    const qmlRules: QmlRule[] = _get(qmlRenderer, 'rules[0].rule');
    const qmlCategories: QmlCategory[] = _get(qmlRenderer, 'categories[0].category');
    const qmlRanges: QmlRange[] = _get(qmlRenderer, 'ranges[0].range');
    const qmlSymbols = _get(qmlRenderer, 'symbols[0].symbol');
    const qmlLabeling = _get(qmlObject, 'qgis.labeling.[0]');
    let rules: Rule[] = [];
    let symbolizerMap: SymbolizerMap = {};
    let labelMap: LabelMap = {};

    if (Array.isArray(qmlSymbols)) {
      symbolizerMap = this.parseQmlSymbolizers(qmlSymbols);
    }

    if (qmlLabeling) {
      labelMap = this.parseQmlLabeling(qmlLabeling);
    }

    if (Array.isArray(qmlRules) && qmlRules.length > 0) {
      qmlRules.forEach((qmlRule: QmlRule, index: number) => {
        const filter: Filter | undefined = this.getFilterFromQmlRule(qmlRule);
        const scaleDenominator: ScaleDenominator | undefined = this.getScaleDenominatorFromRule(qmlRule);
        const name = qmlRule.$.label || qmlRule.$.filter;
        let rule: Rule = <Rule> {
          name
        };
        if (filter) {
          rule.filter = filter;
        }
        if (scaleDenominator) {
          rule.scaleDenominator = scaleDenominator;
        }
        if (Object.keys(symbolizerMap).length > 0 && symbolizerMap[qmlRule.$.symbol]) {
          rule.symbolizers = symbolizerMap[qmlRule.$.symbol];
        }
        rules.push(rule);
      });
    } else if (Array.isArray(qmlCategories) && qmlCategories.length > 0) {
      const attribute = _get(qmlObject, 'qgis.renderer-v2.[0].$.attr');
      qmlCategories.forEach((qmlCategory: QmlCategory, index: number) => {
        const value = qmlCategory.$.value;
        const filter = ['==', attribute, value];
        const name = `${attribute} = ${value}`;
        let rule: Rule = <Rule> {
          name,
          filter
        };
        if (symbolizerMap && symbolizerMap[qmlCategory.$.symbol]) {
          rule.symbolizers = symbolizerMap[qmlCategory.$.symbol];
        }
        rules.push(rule);
      });
    } else if (Array.isArray(qmlRanges) && qmlRanges.length > 0) {
      const attribute = _get(qmlObject, 'qgis.renderer-v2.[0].$.attr');
      qmlRanges.forEach((qmlRange: QmlRange, index: number) => {
        const name = qmlRange.$.label;
        const lower = qmlRange.$.lower;
        const upper = qmlRange.$.upper;
        const filter = [
          '&&',
          ['>=', attribute, lower],
          ['<=', attribute, upper]
        ]  ;
        let rule: Rule = <Rule> {
          name,
          filter
        };
        if (symbolizerMap && symbolizerMap[qmlRange.$.symbol]) {
          rule.symbolizers = symbolizerMap[qmlRange.$.symbol];
        }
        rules.push(rule);
      });
    } else {
      const symbolizers = symbolizerMap[Object.keys(symbolizerMap)[0]] || [];
      const labels = labelMap[Object.keys(labelMap)[0]] || [];
      const rule: Rule = {
        name: 'QGIS Simple Symbol',
        symbolizers:  [
          ...symbolizers,
          ...labels
        ]
      };

      try {
        const filter = this.cqlParser.read(Object.keys(labelMap)[0]);
        if (filter) {
          rule.filter = filter;
        }
      } catch (e) {
        // in the case of made up filters
      }

      rules.push(rule);
    }

    return rules;
  }

  /**
   * Get the GeoStyler-Style Filter from an QML Rule.
   *
   * Currently only supports one Filter per Rule.
   *
   * @param {object} qmlRule The QML Rule
   * @return {Filter} The GeoStyler-Style Filter
   */
  getFilterFromQmlRule(qmlRule: QmlRule): Filter | undefined {
    const qmlFilter = _get(qmlRule, '$.filter');
    let filter;
    if (qmlFilter) {
      filter = this.cqlParser.read(qmlFilter);
      return filter;
    }
    return undefined;
  }

  /**
   * Get the GeoStyler-Style ScaleDenominator from an QML Rule.
   *
   * @param {object} qmlRule The QML Rule
   * @return {ScaleDenominator} The GeoStyler-Style ScaleDenominator
   */
  getScaleDenominatorFromRule(qmlRule: QmlRule): ScaleDenominator | undefined {
    const maxScaleDenominator = _get(qmlRule, '$.scalemaxdenom');
    const minScaleDenominator = _get(qmlRule, '$.scalemindenom');
    let scaleDenominator: ScaleDenominator = <ScaleDenominator> {};
    if (minScaleDenominator) {
      scaleDenominator.min = parseFloat(minScaleDenominator);
    }
    if (maxScaleDenominator) {
      scaleDenominator.max = parseFloat(maxScaleDenominator);
    }

    return (scaleDenominator.min || scaleDenominator.max)
      ? scaleDenominator
      : undefined;
  }

  /**
   *
   * @param qmlLabels
   */
  parseQmlLabeling(qmlLabeling: any): LabelMap {
    const type = qmlLabeling.$.type;
    const labelMap: LabelMap = {};

    if (type === 'rule-based') {
      const rules = _get(qmlLabeling, 'rules[0].rule');
      rules.forEach((rule: QmlRule, index: number) => {
        const settings = _get(rule, 'settings[0]');
        const textSymbolizer = this.getTextSymbolizerFromLabelSettings(settings);
        labelMap[rule.$.filter || index] = [textSymbolizer];
      });
    }
    if (type === 'simple') {
      const settings = _get(qmlLabeling, 'settings[0]');
      const textSymbolizer = this.getTextSymbolizerFromLabelSettings(settings);
      labelMap.a = [textSymbolizer];
    }

    return labelMap;
  }

  /**
   *
   * @param settings
   */
  getTextSymbolizerFromLabelSettings(settings: any): TextSymbolizer {
    let textSymbolizer: TextSymbolizer = {
      kind: 'Text',
    } as TextSymbolizer;
    const styleProperties = _get(settings, 'text-style[0].$');
    const placementProperties = _get(settings, 'placement[0].$');

    if (styleProperties.textColor) {
      textSymbolizer.color = this.qmlColorToHex(styleProperties.textColor);
    }
    if (styleProperties.fieldName) {
      // TODO parse fieldName templates like: "'ID: ' || ID"
      textSymbolizer.label = this.parseLabelTemplates(styleProperties.fieldName);
    }
    if (styleProperties.fontSize) {
      textSymbolizer.size = parseFloat(styleProperties.fontSize);
    }
    if (styleProperties.fontFamily) {
      textSymbolizer.font = [styleProperties.fontFamily];
    }
    if (styleProperties.fontLetterSpacing && parseFloat(styleProperties.fontLetterSpacing) > 0) {
      textSymbolizer.letterSpacing = parseFloat(styleProperties.fontLetterSpacing);
    }
    if (styleProperties.multilineHeight && parseFloat(styleProperties.multilineHeight) > 0) {
      textSymbolizer.lineHeight = parseFloat(styleProperties.multilineHeight);
    }
    if (parseFloat(placementProperties.xOffset) > 0 || parseFloat(placementProperties.yOffset) > 0) {
      textSymbolizer.offset = [
        parseFloat(placementProperties.xOffset),
        parseFloat(placementProperties.yOffset)
      ];
    }
    return textSymbolizer;
  }

  /**
   *
   */
  parseQmlSymbolizers(qmlSymbolizers: any[]): SymbolizerMap {
    const symbolizerMap: SymbolizerMap = {};

    qmlSymbolizers.forEach((qmlSymbolizer: any) => {
      const symbolizerKey = _get(qmlSymbolizer, '$.name');
      const symbolizerType = _get(qmlSymbolizer, '$.type');
      let symbolizers;
      switch (symbolizerType) {
        case 'marker':
          symbolizers = this.getPointSymbolizersFromQmlSymbolizer(qmlSymbolizer);
          break;
        case 'line':
          symbolizers = this.getLineSymbolizersFromQmlSymbolizer(qmlSymbolizer);
          break;
        case 'fill':
          symbolizers = this.getFillSymbolizerFromQmlSymbolizer(qmlSymbolizer);
          break;
        default:
          throw new Error('Failed to parse SymbolizerKind from qmlSymbolizer');
      }
      symbolizerMap[symbolizerKey] = symbolizers;
    });

    return symbolizerMap;
  }

  /**
   * Get the GeoStyler-Style PointSymbolizer from an QGIS Symbolizer.
   *
   * The opacity of the Symbolizer is taken from the <Graphic>.
   *
   * @param {object} qmlSymbolizer The QGIS Symbolizer
   * @return {PointSymbolizer} The GeoStyler-Style PointSymbolizer
   */
  getPointSymbolizersFromQmlSymbolizer(qmlSymbolizer: any): PointSymbolizer[] {
    return qmlSymbolizer.layer.map((symbolizerLayer: any) => {
      const markerClass = symbolizerLayer.$.class;
      switch (markerClass) {
        case 'SimpleMarker':
          return this.getPointSymbolizerFromMarkLayer(symbolizerLayer);
        case 'SvgMarker':
          return this.getPointSymbolizerFromSvgLayer(symbolizerLayer);
        default:
          throw new Error(`Failed to parse MarkerClass ${markerClass} from qmlSymbolizer`);
      }
    });
  }

  /**
   * Get the GeoStyler-Style MarkSymbolizer from an QML Symbolizer
   *
   * @param {object} symbolizerLayer The QML SymbolizerLayer
   * @return {MarkSymbolizer} The GeoStyler-Style MarkSymbolizer
   */
  getPointSymbolizerFromMarkLayer(symbolizerLayer: any): MarkSymbolizer {
    let markSymbolizer: MarkSymbolizer = {
      kind: 'Mark',
    } as MarkSymbolizer;

    const qmlMarkerProps: any = this.qmlSymbolizerLayerPropsToObject(symbolizerLayer);

    const wellKnownName: string = qmlMarkerProps.name;
    const wkn = wellKnownName.charAt(0).toUpperCase() + wellKnownName.slice(1);
    markSymbolizer.wellKnownName = wkn as WellKnownName;

    if (qmlMarkerProps.color) {
      markSymbolizer.opacity = this.qmlColorToOpacity(qmlMarkerProps.color);
      markSymbolizer.color = this.qmlColorToHex(qmlMarkerProps.color);
    }

    if (qmlMarkerProps.angle) {
      markSymbolizer.rotate = parseFloat(qmlMarkerProps.angle);
    }
    if (qmlMarkerProps.size) {
      markSymbolizer.radius = parseFloat(qmlMarkerProps.size) / 2;
    }
    // TODO Fix in style declaration
    // if (qmlMarkerProps.offset) {
    //   markSymbolizer.offset = qmlMarkerProps.offset.split(',').map(parseFloat);
    // }
    if (qmlMarkerProps.outline_color) {
      markSymbolizer.strokeOpacity = this.qmlColorToOpacity(qmlMarkerProps.outline_color);
      markSymbolizer.strokeColor = this.qmlColorToHex(qmlMarkerProps.outline_color);
    }
    if (qmlMarkerProps.outline_width) {
      markSymbolizer.strokeWidth = parseFloat(qmlMarkerProps.outline_width);
    }

    return markSymbolizer;
  }

  /**
   * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
   *
   * @param {object} qmlSymbolizer The QML Symbolizer
   * @return {LineSymbolizer} The GeoStyler-Style LineSymbolizer
   */
  getLineSymbolizersFromQmlSymbolizer(qmlSymbolizer: any): LineSymbolizer[] {
    const {
      qmlSymbolizerLayerPropsToObject
    } = this;
    return qmlSymbolizer.layer.map((symbolizerLayer: any) => {
      let lineSymbolizer: LineSymbolizer = {
        kind: 'Line',
      } as LineSymbolizer;

      const qmlMarkerProps: any = qmlSymbolizerLayerPropsToObject(symbolizerLayer);

      if (qmlMarkerProps.line_color) {
        lineSymbolizer.opacity = this.qmlColorToOpacity(qmlMarkerProps.line_color);
        lineSymbolizer.color = this.qmlColorToHex(qmlMarkerProps.line_color);
      }
      if (qmlMarkerProps.capstyle) {
        lineSymbolizer.cap = qmlMarkerProps.capstyle;
      }
      if (qmlMarkerProps.joinstyle) {
        lineSymbolizer.join = qmlMarkerProps.joinstyle;
      }
      if (qmlMarkerProps.customdash) {
        lineSymbolizer.dasharray = qmlMarkerProps.customdash.split(';').map(parseFloat);
      }
      if (qmlMarkerProps.offset) {
        lineSymbolizer.perpendicularOffset = parseFloat(qmlMarkerProps.offset);
      }
      if (qmlMarkerProps.line_width) {
        lineSymbolizer.width = parseFloat(qmlMarkerProps.line_width);
      }

      return lineSymbolizer;
    });
  }

  /**
   * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
   *
   * @param {object} qmlSymbolizer The QML Symbolizer
   * @return {FillSymbolizer} The GeoStyler-Style FillSymbolizer
   */
  getFillSymbolizerFromQmlSymbolizer(qmlSymbolizer: any): FillSymbolizer[] {
    const {
      qmlSymbolizerLayerPropsToObject
    } = this;
    return qmlSymbolizer.layer.map((symbolizerLayer: any) => {
      let fillSymbolizer: FillSymbolizer = {
        kind: 'Fill',
      } as FillSymbolizer;

      const qmlMarkerProps: any = qmlSymbolizerLayerPropsToObject(symbolizerLayer);

      if (qmlMarkerProps.outline_color) {
        fillSymbolizer.outlineColor = this.qmlColorToHex(qmlMarkerProps.outline_color);
      }
      if (qmlMarkerProps.color) {
        fillSymbolizer.opacity = this.qmlColorToOpacity(qmlMarkerProps.color);
        fillSymbolizer.color = this.qmlColorToHex(qmlMarkerProps.color);
      }
      if (qmlMarkerProps.outline_style) {
        switch (qmlMarkerProps.outline_style) {
          case 'dot':
            fillSymbolizer.outlineDasharray = outlineStyleDashArrays.dot;
            break;
          case 'dash':
            fillSymbolizer.outlineDasharray = outlineStyleDashArrays.dash;
            break;
          case 'dash dot':
            fillSymbolizer.outlineDasharray = [
              ...outlineStyleDashArrays.dash,
              ...outlineStyleDashArrays.dot
            ];
            break;
          case 'dash dot dot':
            fillSymbolizer.outlineDasharray = [
              ...outlineStyleDashArrays.dash,
              ...outlineStyleDashArrays.dot,
              ...outlineStyleDashArrays.dot
            ];
            break;
          default:
            break;
        }
      }
      if (qmlMarkerProps.outline_width) {
        fillSymbolizer.outlineWidth = parseFloat(qmlMarkerProps.outline_width);
      }

      return fillSymbolizer;
    });
  }

  /**
   * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
   *
   * @param {object} symbolizerLayer The QML Symbolizer Layer
   * @return {IconSymbolizer} The GeoStyler-Style IconSymbolizer
   */
  getPointSymbolizerFromSvgLayer(symbolizerLayer: any): IconSymbolizer {
    let iconSymbolizer: IconSymbolizer = {
      kind: 'Icon',
    } as IconSymbolizer;

    const qmlMarkerProps: any = this.qmlSymbolizerLayerPropsToObject(symbolizerLayer);

    if (qmlMarkerProps.color) {
      const colorArray = qmlMarkerProps.color.split(',');
      iconSymbolizer.opacity = parseFloat(colorArray[3]) / 255;
      const color = Color(`rgb(${colorArray[0]},${colorArray[1]},${colorArray[2]})`);
      iconSymbolizer.color = color.hex();
    }

    if (qmlMarkerProps.angle) {
      iconSymbolizer.rotate = parseFloat(qmlMarkerProps.angle);
    }
    if (qmlMarkerProps.size) {
      iconSymbolizer.size = parseFloat(qmlMarkerProps.size);
    }
    if (qmlMarkerProps.offset) {
      const offsetArray = qmlMarkerProps.offset.split(',').map(parseFloat);
      if (offsetArray[0] > 0 || offsetArray[1] > 0) {
        iconSymbolizer.offset = qmlMarkerProps.offset.split(',').map(parseFloat);
      }
    }
    if (qmlMarkerProps.name) {
      iconSymbolizer.image = qmlMarkerProps.name;
    }

    return iconSymbolizer;
  }

  /**
   * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a GeoStyler-Style Style and returns a Promise.
   * The Promise itself resolves with a QML string.
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {Promise} The Promise resolving with the QML as a string.
   */
  writeStyle(geoStylerStyle: Style): Promise<string> {
    return new Promise<any>((resolve, reject) => {
      try {
        const builder = new Builder();
        const qmlObject = this.geoStylerStyleToQmlObject(geoStylerStyle);
        this.convertTextSymbolizers(qmlObject, geoStylerStyle);
        const qmlString = builder
          .buildObject(qmlObject)
          .replace(
            `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`,
            `<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>`
          );
        resolve(qmlString);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   *
   * @param filter
   */
  getQmlFilterFromFilter(filter: Filter): string | undefined {
    return this.cqlParser.write(filter);
  }

  /**
   *
   */
  getQmlRuleFromRule(rule: Rule, index: number) {
    const filter = rule.filter;
    const qmlRule: any = {
      $: {
        key: `renderer_rule_${index}`,
        symbol: `${index}`,
        label: rule.name
      }
    };
    if (rule.scaleDenominator) {
      if (rule.scaleDenominator.min) {
        qmlRule.$.scalemindenom = rule.scaleDenominator.min;
      }
      if (rule.scaleDenominator.max) {
        qmlRule.$.scalemaxdenom = rule.scaleDenominator.max;
      }
    }
    if (filter) {
      const cqlFilter = this.getQmlFilterFromFilter(filter);
      if (cqlFilter) {
        qmlRule.$.filter = this.getQmlFilterFromFilter(filter);
      }
    }
    return qmlRule;
  }

  /**
   *
   * @param geostylerStyle
   */
  getQmlSymbolsFromStyle(geostylerStyle: Style, rules: any[]): any[] {
    return geostylerStyle.rules.map((rule, index) => {
      const symbol = this.getQmlSymbolFromRule(rule, index);
      if (symbol) {
        rules.push(this.getQmlRuleFromRule(rule, index));
      }
      return symbol;
    }).filter(s => s);
  }

  /**
   *
   * @param rule
   */
  getQmlSymbolFromRule(rule: Rule, index: number): any {
    const layer = this.getQmlLayersFromRule(rule);
    let type;
    if (!rule.symbolizers.length) {
      return;
    }
    switch (rule.symbolizers[0].kind) {
      case 'Line':
        type = 'line';
        break;
      case 'Fill':
        type = 'fill';
        break;
      default:
        type = 'marker';
    }
    return layer && layer[0] ? {
      $: {
        type,
        name: index.toString()
      },
      layer
    } : undefined;
  }

  /**
   *
   */
  getQmlLineSymbolFromSymbolizer(symbolizer: LineSymbolizer): any {
    const qmlProps: any = {
      line_color: this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity),
      offset: symbolizer.perpendicularOffset,
      offset_map_unit_scale: '3x:0,0,0,0,0,0',
      offset_unit: 'Pixel',
      joinstyle: symbolizer.join,
      capstyle: symbolizer.cap,
      line_width: symbolizer.width
    };
    if (symbolizer.dasharray) {
      qmlProps.customdash = symbolizer.dasharray.join(';');
    }

    return {
      $: {
        class: 'SimpleLine'
      },
      prop: this.propsObjectToQmlSymbolProps(qmlProps)
    };
  }

  getQmlFillSymbolFromSymbolizer(symbolizer: FillSymbolizer): any {
    const qmlProps = {
      color: this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity),
      offset_map_unit_scale: '3x:0,0,0,0,0,0',
      offset_unit: 'Pixel',
      outline_style: symbolizer.outlineDasharray ? 'dash' : 'solid',
      outline_width: symbolizer.outlineWidth || '0',
      outline_width_map_unit_scale: '3x:0,0,0,0,0,0',
      outline_width_unit: 'Pixel',
      customdash: symbolizer.outlineDasharray ? symbolizer.outlineDasharray.join(';') : undefined,
      outline_color: this.qmlColorFromHexAndOpacity(symbolizer.outlineColor, 1)
    };

    return {
      $: {
        class: 'SimpleFill'
      },
      prop: this.propsObjectToQmlSymbolProps(qmlProps)
    };
  }

  /**
   *
   * @param rule
   */
  getQmlLayersFromRule(rule: Rule): any {
    const symbolizers = rule.symbolizers.map(this.getQmlLayerFromSymbolizer.bind(this)).filter(s => s);
    return symbolizers.length ? symbolizers : undefined;
  }

  /**
   *
   * @param symbolizer
   */
  getQmlLayerFromSymbolizer(symbolizer: Symbolizer): any {
    switch (symbolizer.kind) {
      case 'Fill':
        return this.getQmlFillSymbolFromSymbolizer(symbolizer as FillSymbolizer);
      case 'Icon':
        return this.getQmlMarkSymbolFromIconSymbolizer(symbolizer as IconSymbolizer);
      case 'Line':
        return this.getQmlLineSymbolFromSymbolizer(symbolizer as LineSymbolizer);
      case 'Mark':
        return this.getQmlMarkSymbolFromSymbolizer(symbolizer as MarkSymbolizer);
      default:
        break;
    }
  }

  getQmlMarkSymbolFromIconSymbolizer(symbolizer: IconSymbolizer): any {
    const qmlProps = {
      angle: symbolizer.rotate || 0,
      color: this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity),
      name: symbolizer.image,
      size: symbolizer.size,
      size_map_unit_scale: '3x:0,0,0,0,0,0',
      size_unit: 'Pixel'
    };

    return {
      $: {
        class: 'SvgMarker'
      },
      prop: this.propsObjectToQmlSymbolProps(qmlProps)
    };
  }

  /**
   *
   */
  getQmlMarkSymbolFromSymbolizer(symbolizer: MarkSymbolizer): any {
    const qmlProps = {
      angle: symbolizer.rotate || 0,
      color: this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity),
      name: symbolizer.wellKnownName.toLowerCase(),
      outline_color: this.qmlColorFromHexAndOpacity(symbolizer.strokeColor, symbolizer.strokeOpacity),
      outline_style: 'solid',
      outline_width: symbolizer.strokeWidth || 0,
      outline_width_map_unit_scale: '3x:0,0,0,0,0,0',
      outline_width_unit: 'Pixel',
      size: symbolizer.radius ? symbolizer.radius * 2 : undefined,
      size_map_unit_scale: '3x:0,0,0,0,0,0',
      size_unit: 'Pixel'
    };

    return {
      $: {
        class: 'SimpleMarker'
      },
      prop: this.propsObjectToQmlSymbolProps(qmlProps)
    };
  }

  /**
   *
   * @param properties
   */
  propsObjectToQmlSymbolProps(properties: any): QmlProp[] {
    return Object.keys(properties).map(k => {
      const v = properties[k];
      return {
        $: {
          k,
          v
        }
      };
    }).filter(s => s.$.v !== undefined);
  }

  /**
   * Get the QML Object (readable with xml2js) from an GeoStyler-Style Style
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {object} The object representation of a QML Style (readable with xml2js)
   */
  geoStylerStyleToQmlObject(geoStylerStyle: Style): any {
    const type: string = 'RuleRenderer';
    const rules: any[] = [];
    const symbols: any[] = this.getQmlSymbolsFromStyle(geoStylerStyle, rules);
    return {
      qgis: {
        $: {},
        'renderer-v2': [{
          $: {
            type
          },
          rules: [{
            $: {
              key: 'renderer_rules'
            },
            rule: rules
          }],
          symbols: [{
            symbol: symbols
          }]
        }]
      }
    };
  }

  convertTextSymbolizerRule(qmlRuleList: any[], rule: Rule) {
    let textSymbolizer: TextSymbolizer;
    rule.symbolizers.forEach(symbolizer => {
      if (symbolizer.kind === 'Text') {
        textSymbolizer = symbolizer as TextSymbolizer;
        const textStyleAttributes: any = {
          fontSize: textSymbolizer.size || 12,
          fontLetterSpacing: textSymbolizer.letterSpacing || 0,
          multilineHeight: textSymbolizer.lineHeight !== undefined ? textSymbolizer.lineHeight : 1,
          textColor: textSymbolizer.color ? this.qmlColorFromHexAndOpacity(textSymbolizer.color, 1) : '0,0,0,255'
        };
        if (textSymbolizer.font) {
          textStyleAttributes.fontFamily = textSymbolizer.font[0];
        }
        if (textSymbolizer.label) {
          textStyleAttributes.fieldName = textSymbolizer.label.replace('{{', '').replace('}}', '');
        }
        const textRule: any = {
          $: {
            key: `labeling_rule_${qmlRuleList.length}`
          },
          settings: [{
            'text-style': [{
              $: textStyleAttributes
            }],
            placement: [{
              $: {
                predefinedPositionOrder: textSymbolizer.anchor ? AnchorMap[textSymbolizer.anchor] :
                  'TR,TL,BR,BL,R,L,TSR,BSR',
                xOffset: textSymbolizer.offset ? `${textSymbolizer.offset[0]}` : `0`,
                yOffset: textSymbolizer.offset ? `${textSymbolizer.offset[1]}` : `0`,
                rotationAngle: textSymbolizer.rotate ? textSymbolizer.rotate : `0`
              }
            }]
          }]
        };

        if (textSymbolizer.haloColor) {
          textRule.settings['text-buffer'] = [{
            $: {
              bufferSize: textSymbolizer.haloWidth || `0`,
              bufferColor: this.qmlColorFromHexAndOpacity(textSymbolizer.haloColor, 1)
            }
          }];
        }

        if (rule.filter) {
          textRule.$.filter = this.cqlParser.write(rule.filter);
        }

        qmlRuleList.push(textRule);
      }
    });
  }

  convertTextSymbolizers(qmlObject: any, geoStylerStyle: Style): any {
    const textSymbolizerRules: Rule[] = [];
    geoStylerStyle.rules.forEach(rule => {
      rule.symbolizers.forEach(symbolizer => {
        if (symbolizer.kind === 'Text' && !textSymbolizerRules.includes(rule)) {
          textSymbolizerRules.push(rule);
        }
      });
    });
    if (textSymbolizerRules.length > 0) {
      qmlObject.qgis.labeling = [{
        $: {
          type: 'rule-based'
        },
        rules: [{
          $: {
            key: 'labeling_rules'
          },
          rule: []
        }]
      }];
      textSymbolizerRules.forEach(rule =>
        this.convertTextSymbolizerRule(qmlObject.qgis.labeling[0].rules[0].rule, rule));
    }
  }

}

export default QGISStyleParser;
