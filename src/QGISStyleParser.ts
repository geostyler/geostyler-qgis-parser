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
  FillSymbolizer,
  TextSymbolizer,
  WriteStyleResult,
  ReadStyleResult,
  isGeoStylerFunction
} from 'geostyler-style';

import { CqlParser } from 'geostyler-cql-parser';
import Color from 'color';

import {
  parseString,
  Builder
} from 'xml2js';

const get = (obj: any, path: any, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res: any, key: any) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export type ConstructorParams = {
  qgisVersion?: string;
};

type SymbolizerMap = {
  [key: string]: Symbolizer[];
};

type LabelMap = {
  [filter: string]: TextSymbolizer[];
};

type QmlProp = {
  $: {
    k: any;
    v: any;
  };
};

type QmlMapOption = {
  $: {
    type: string;
  };
  Option: QmlOption[];
};

type QmlOption = {
  $: {
    name: string;
    value: string;
    type: string;
  };
};

type QmlRule = {
  $: {
    filter?: string;
    scalemaxdenom?: number;
    scalemindenom?: number;
    symbol: string;
    key: string;
    label: string;
  };
};

type QmlCategory = {
  $: {
    label: string;
    render: string;
    symbol: string;
    value: string;
  };
};

type QmlRange = {
  $: {
    upper: string;
    lower: string;
    label: string;
    symbol: string;
    render: string;
  };
};

const dot = [2, 2];
const dash = [10, 2];

const lineStyleDashArrays: { [key: string]: number[] | undefined } = {
  solid: undefined,
  dot: dot,
  dash: dash,
  'dash dot': [...dash, ...dot],
  'dash dot dot': [...dash, ...dot, ...dot]
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

  qgisVersion: string;

  // QGIS 3.28 and later use <Option> instead of <prop> to serialize individual properties.
  writePropsAsOptions: boolean;

  constructor(opts: ConstructorParams = {}) {
    this.qgisVersion = opts.qgisVersion ?? '3.28.0-Firenze';
    this.writePropsAsOptions = this.compareVersions('3.28.0-Firenze', this.qgisVersion) >= 0;
  }

  compareVersions(version1: string, version2: string): number {
    try {
      const parseVersion = (version: string) => version.split('-')[0].split('.').map(Number);
      const [major1, minor1, patch1] = parseVersion(version1);
      const [major2, minor2, patch2] = parseVersion(version2);
      return Math.sign(major2 - major1) || Math.sign(minor2 - minor1) || Math.sign(patch2 - patch1);
    } catch (error) {
      return 0;
    }
  }

  /**
   * The readStyle implementation of the GeoStyler-Style StyleParser interface.
   * It reads a QML as a string and returns a Promise containing the
   * GeoStyler-Style Style.
   *
   * @param {string} qmlString A QML as a string.
   * @return {Promise} The Promise resolving with the GeoStyler-Style Style
   */
  readStyle = async (qmlString: string): Promise<ReadStyleResult> => {
    const options = {};
    try {
      let readResult;
      parseString(qmlString, options, (err: any, result: any) => {
        if (err) {
          readResult = {
            errors: [err]
          };
          return;
        }
        const geoStylerStyle: Style = this.qmlObjectToGeoStylerStyle(result);
        readResult = {
          output: geoStylerStyle
        };
      });
      return readResult || {
        errors: []
      };
    } catch (error) {
      return {
        errors: [error]
      };
    }
  };

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
    // Read props from QML written by QGIS<3.28.0
    if (qmlSymbolizer.prop) {
      qmlSymbolizer.prop.forEach((prop: QmlProp) => {
        const key = prop.$.k;
        const value = prop.$.v;
        qmlMarkerProps[key] = value;
      });
    }
    // Read props from QML written by QGIS>=3.28.0
    if (qmlSymbolizer.Option && qmlSymbolizer.Option[0].Option) {
      qmlSymbolizer.Option[0].Option.forEach((option: QmlOption) => {
        const key = option.$.name;
        const value = option.$.value;
        qmlMarkerProps[key] = value;
      });
    }
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
    opacity = Number.isNaN(Number(opacity)) ? 1 : opacity;
    const colorArray = Color(hex).alpha(opacity || 1).rgb().array();
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
    const qmlRenderer = get(qmlObject, 'qgis.renderer-v2.[0]');
    const qmlRules: QmlRule[] = get(qmlRenderer, 'rules[0].rule');
    const qmlCategories: QmlCategory[] = get(qmlRenderer, 'categories[0].category');
    const qmlRanges: QmlRange[] = get(qmlRenderer, 'ranges[0].range');
    const qmlSymbols = get(qmlRenderer, 'symbols[0].symbol');
    const qmlLabeling = get(qmlObject, 'qgis.labeling.[0]');
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
      const attribute = get(qmlObject, 'qgis.renderer-v2.[0].$.attr');
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
      const attribute = get(qmlObject, 'qgis.renderer-v2.[0].$.attr');
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
          rule.filter = filter as Filter;
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
    const qmlFilter = get(qmlRule, '$.filter');
    if (qmlFilter) {
      const f = this.cqlParser.read(qmlFilter) as Filter;
      return f;
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
    const maxScaleDenominator = get(qmlRule, '$.scalemaxdenom');
    const minScaleDenominator = get(qmlRule, '$.scalemindenom');
    let scaleDenominator: ScaleDenominator = <ScaleDenominator> {};
    if (minScaleDenominator) {
      scaleDenominator.min = Number(minScaleDenominator);
    }
    if (maxScaleDenominator) {
      scaleDenominator.max = Number(maxScaleDenominator);
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
      const rules = get(qmlLabeling, 'rules[0].rule');
      rules.forEach((rule: QmlRule, index: number) => {
        const settings = get(rule, 'settings[0]');
        const textSymbolizer = this.getTextSymbolizerFromLabelSettings(settings);
        labelMap[rule.$.filter || index] = [textSymbolizer];
      });
    }
    if (type === 'simple') {
      const settings = get(qmlLabeling, 'settings[0]');
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
    const styleProperties = get(settings, 'text-style[0].$');
    const placementProperties = get(settings, 'placement[0].$');

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
      const symbolizerKey = get(qmlSymbolizer, '$.name');
      const symbolizerType = get(qmlSymbolizer, '$.type');
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

    markSymbolizer.wellKnownName = qmlMarkerProps.name;

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
      if (!qmlMarkerProps.use_custom_dash || qmlMarkerProps.use_custom_dash === '0') {
        const lineStyle = qmlMarkerProps?.line_style || 'solid';
        const lineDashArray = lineStyleDashArrays[lineStyle as string];
        if (lineDashArray) {
          lineSymbolizer.dasharray = lineDashArray;
        }
      } else {
        if (qmlMarkerProps.customdash) {
          lineSymbolizer.dasharray = qmlMarkerProps.customdash.split(';').map(parseFloat);
        }
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

      if (symbolizerLayer.$.class === 'PointPatternFill') {
        fillSymbolizer.graphicFill = symbolizerLayer.symbol.map(
          (x: any) => this.getPointSymbolizersFromQmlSymbolizer(x));
      }

      const qmlMarkerProps: any = qmlSymbolizerLayerPropsToObject(symbolizerLayer);

      let outlineStyle = qmlMarkerProps?.outline_style || 'solid';
      if (qmlMarkerProps.outline_color && 'no' !== outlineStyle) {
        fillSymbolizer.outlineColor = this.qmlColorToHex(qmlMarkerProps.outline_color);
      }
      // in some cases, QGIS will use line_* instead of outline_*
      const lineStyle = qmlMarkerProps?.line_style;
      if (!fillSymbolizer.outlineColor && lineStyle && lineStyle !== 'no') {
        outlineStyle = lineStyle;
        fillSymbolizer.outlineColor = this.qmlColorToHex(qmlMarkerProps.line_color);
      }

      let fillStyle = qmlMarkerProps?.style || 'solid';
      if (qmlMarkerProps.color && 'solid' === fillStyle) {
        fillSymbolizer.opacity = this.qmlColorToOpacity(qmlMarkerProps.color);
        fillSymbolizer.color = this.qmlColorToHex(qmlMarkerProps.color);
      }

      const outlineDashArray = lineStyleDashArrays[outlineStyle];
      if (outlineDashArray) {
        fillSymbolizer.outlineDasharray = outlineDashArray;
      }

      if (qmlMarkerProps.outline_width && 'no' !== outlineStyle) {
        fillSymbolizer.outlineWidth = parseFloat(qmlMarkerProps.outline_width);
      }

      // if you supply a fill with an outline color and no fill color,
      // it will make the background black.
      if (fillSymbolizer.outlineColor && !fillSymbolizer.color && fillStyle !== 'no'){
        fillSymbolizer.color = 'transparent';
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
   * It reads a GeoStyler-Style Style and returns a Promise containing
   * the QML string.
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {Promise} The Promise resolving with the QML.
   */
  writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>> {
    return new Promise<WriteStyleResult<string>>(resolve => {
      try {
        const builder = new Builder();
        const qmlObject = this.geoStylerStyleToQmlObject(geoStylerStyle);
        this.convertTextSymbolizers(qmlObject, geoStylerStyle);
        const qmlString = builder
          .buildObject(qmlObject)
          .replace(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
            '<!DOCTYPE qgis PUBLIC \'http://mrcc.com/qgis.dtd\' \'SYSTEM\'>'
          );
        resolve({
          output: qmlString
        });
      } catch (error) {
        resolve({
          errors: [error]
        });
      }
    });
  }

  /**
   *
   * @param filter
   */
  getQmlFilterFromFilter(filter: Filter): string | undefined {
    return this.cqlParser.write(filter) as string;
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
    let lineColor;
    if (!isGeoStylerFunction(symbolizer.color) && !isGeoStylerFunction(symbolizer.opacity)) {
      lineColor = this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity);
    }

    const qmlProps: any = {
      line_color: lineColor,
      offset: symbolizer.perpendicularOffset,
      offset_map_unit_scale: '3x:0,0,0,0,0,0',
      offset_unit: 'Pixel',
      joinstyle: symbolizer.join,
      capstyle: symbolizer.cap,
      line_width: symbolizer.width,
      line_width_unit: 'Pixel'
    };
    if (symbolizer.dasharray) {
      qmlProps.customdash = symbolizer.dasharray.join(';');
      qmlProps.use_custom_dash = '1';
    }

    return {
      $: {
        class: 'SimpleLine'
      },
      ...this.propsObjectToQmlSymbolOptions(qmlProps)
    };
  }

  getQmlFillSymbolFromSymbolizer(symbolizer: FillSymbolizer): any {
    const fillOpacity = symbolizer.fillOpacity !== undefined ? symbolizer.fillOpacity : symbolizer.opacity;
    const outlineOpacity = symbolizer.outlineOpacity !== undefined ? symbolizer.outlineOpacity : symbolizer.opacity;
    let color;
    if (!isGeoStylerFunction(symbolizer.color) && !isGeoStylerFunction(fillOpacity)) {
      color = this.qmlColorFromHexAndOpacity(symbolizer.color, fillOpacity);
    }
    let outlineColor;
    if (!isGeoStylerFunction(symbolizer.outlineColor) && !isGeoStylerFunction(outlineOpacity)) {
      outlineColor = this.qmlColorFromHexAndOpacity(symbolizer.outlineColor, outlineOpacity);
    }

    const qmlProps = {
      color: color,
      offset_map_unit_scale: '3x:0,0,0,0,0,0',
      offset_unit: 'Pixel',
      outline_style: symbolizer.outlineDasharray ? 'dash' : 'solid',
      outline_width: symbolizer.outlineWidth || '0',
      outline_width_map_unit_scale: '3x:0,0,0,0,0,0',
      outline_width_unit: 'Pixel',
      customdash: symbolizer.outlineDasharray ? symbolizer.outlineDasharray.join(';') : undefined,
      outline_color: outlineColor
    };

    return {
      $: {
        class: 'SimpleFill'
      },
      ...this.propsObjectToQmlSymbolOptions(qmlProps)
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
    let color;
    if (!isGeoStylerFunction(symbolizer.color) && !isGeoStylerFunction(symbolizer.opacity)) {
      color = this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity);
    }
    const qmlProps = {
      angle: symbolizer.rotate || 0,
      color: color,
      name: symbolizer.image,
      size: symbolizer.size,
      size_map_unit_scale: '3x:0,0,0,0,0,0',
      size_unit: 'Pixel'
    };

    return {
      $: {
        class: 'SvgMarker'
      },
      ...this.propsObjectToQmlSymbolOptions(qmlProps)
    };
  }

  /**
   *
   */
  getQmlMarkSymbolFromSymbolizer(symbolizer: MarkSymbolizer): any {
    let color;
    if (!isGeoStylerFunction(symbolizer.color) && !isGeoStylerFunction(symbolizer.opacity)) {
      color = this.qmlColorFromHexAndOpacity(symbolizer.color, symbolizer.opacity);
    }
    let outlineColor;
    if (!isGeoStylerFunction(symbolizer.strokeColor) && !isGeoStylerFunction(symbolizer.strokeOpacity)) {
      outlineColor = this.qmlColorFromHexAndOpacity(symbolizer.strokeColor, symbolizer.strokeOpacity);
    }
    let size;
    if (!isGeoStylerFunction(symbolizer.radius)) {
      size = symbolizer.radius ? symbolizer.radius * 2 : undefined;
    }
    const qmlProps = {
      angle: symbolizer.rotate || 0,
      color: color,
      name: symbolizer.wellKnownName.toLowerCase(),
      outline_color: outlineColor,
      outline_style: 'solid',
      outline_width: symbolizer.strokeWidth || 0,
      outline_width_map_unit_scale: '3x:0,0,0,0,0,0',
      outline_width_unit: 'Pixel',
      size: size,
      size_map_unit_scale: '3x:0,0,0,0,0,0',
      size_unit: 'Pixel'
    };

    return {
      $: {
        class: 'SimpleMarker'
      },
      ...this.propsObjectToQmlSymbolOptions(qmlProps)
    };
  }

  /**
   * @param {object} properties Object containing key-value pairs to serialize as QML.
   * @return an XML object representing either <Option type="map"><repeated Option /></Option> or <repeated prop... />
   */
  propsObjectToQmlSymbolOptions(properties: any): {Option: QmlMapOption} | {prop: QmlProp[]} {
    return this.writePropsAsOptions
      ? this.propsObjectToQmlSymbol_NewerOptions(properties)
      : this.propsObjectToQmlSymbol_OlderProps(properties);
  }

  propsObjectToQmlSymbol_NewerOptions(properties: any): {Option: QmlMapOption} {
    const options = Object.keys(properties).map(k => {
      const v = properties[k];
      return {
        $: {
          name: k,
          value: v,
          type: 'QString'
        }
      };
    }).filter(o => o.$.value !== undefined);
    return {
      Option: {
        $: {
          type: 'Map'
        },
        Option: options
      }
    };
  }

  propsObjectToQmlSymbol_OlderProps(properties: any): {prop: QmlProp[]} {
    const props = Object.keys(properties).map(k => {
      const v = properties[k];
      return {
        $: {
          k: k,
          v: v,
        }
      };
    }).filter(p => p.$.v !== undefined);
    return {prop: props};
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
    if (rules.length > 0 || symbols.length > 0) {
      return {
        qgis: {
          $: {
            version: this.qgisVersion
          },
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
    } else {
      return {
        qgis: {
          $: {
            version: this.qgisVersion
          },
          'renderer-v2': [{
            $: {
              type: 'nullSymbol'
            }
          }]
        }
      };
    }
  }

  convertTextSymbolizerRule(qmlRuleList: any[], rule: Rule) {
    let textSymbolizer: TextSymbolizer;
    rule.symbolizers.forEach(symbolizer => {
      if (symbolizer.kind === 'Text') {
        textSymbolizer = symbolizer as TextSymbolizer;
        let textColor;
        let predefinedPositionOrder;
        if (textSymbolizer.color && !isGeoStylerFunction(textSymbolizer.color)) {
          textColor = this.qmlColorFromHexAndOpacity(textSymbolizer.color, 1);
        }
        const textStyleAttributes: any = {
          fontSize: textSymbolizer.size || 12,
          fontLetterSpacing: textSymbolizer.letterSpacing || 0,
          multilineHeight: textSymbolizer.lineHeight !== undefined ? textSymbolizer.lineHeight : 1,
          textColor: textSymbolizer.color ? textColor : '0,0,0,255'
        };
        if (textSymbolizer.font) {
          textStyleAttributes.fontFamily = textSymbolizer.font[0];
        }
        if (textSymbolizer.label && !isGeoStylerFunction(textSymbolizer.label )) {
          textStyleAttributes.fieldName = textSymbolizer.label.replace('{{', '').replace('}}', '');
        }
        if (
          textSymbolizer.anchor
          && !isGeoStylerFunction(textSymbolizer.anchor)
          && textSymbolizer.anchor !== 'center'
        ) {
          predefinedPositionOrder = AnchorMap[textSymbolizer.anchor];
        } else {
          predefinedPositionOrder = 'TR,TL,BR,BL,R,L,TSR,BSR';
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
                predefinedPositionOrder,
                xOffset: textSymbolizer.offset ? `${textSymbolizer.offset[0]}` : '0',
                yOffset: textSymbolizer.offset ? `${textSymbolizer.offset[1]}` : '0',
                rotationAngle: textSymbolizer.rotate ? textSymbolizer.rotate : '0'
              }
            }]
          }]
        };

        if (textSymbolizer.haloColor) {
          let bufferColor;
          if (!isGeoStylerFunction(textSymbolizer.haloColor) && !isGeoStylerFunction(textSymbolizer.haloOpacity)) {
            bufferColor = this.qmlColorFromHexAndOpacity(textSymbolizer.haloColor, textSymbolizer.haloOpacity);
          }
          textRule.settings[0]['text-buffer'] = [{
            $: {
              bufferSize: textSymbolizer.haloWidth || '0',
              bufferColor: bufferColor,
              bufferDraw: 1,
              bufferSizeUnits: 'Pixel',
              bufferSizeMapUnitScale: '3x:0,0,0,0,0,0'
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
