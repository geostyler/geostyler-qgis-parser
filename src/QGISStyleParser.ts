import {
//   Filter,
  StyleParser,
  Style,
//   Rule,
//   ComparisonOperator,
//   CombinationOperator,
//   ScaleDenominator,
//   PointSymbolizer,
//   Symbolizer,
//   IconSymbolizer,
//   LineSymbolizer,
//   FillSymbolizer,
//   TextSymbolizer,
//   ComparisonFilter,
//   MarkSymbolizer,
//   WellKnownName
} from 'geostyler-style';

import {
  parseString,
  Builder
} from 'xml2js';

// const _isString = require('lodash/isString');
// const _isNumber = require('lodash/isNumber');
// const _get = require('lodash/get');
// const _set = require('lodash/set');

/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style StyleParser interface.
 *
 * @class QGISStyleParser
 * @implements StyleParser
 */
export class QGISStyleParser implements StyleParser {

  /**
   * The name Processor is passed as an option to the xml2js parser and modifies
   * the tagName. It strips all namespaces from the tags.
   *
   * @param {string} name The originial tagName
   * @return {string} The modified tagName
   */
  tagNameProcessor(name: string): string {
    const prefixMatch = new RegExp(/(?!xmlns)^.*:/);
    return name.replace(prefixMatch, '');
  }

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
      const options = {
        tagNameProcessors: [this.tagNameProcessor]
      };
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
        const qmlString = builder.buildObject(qmlObject);
        resolve(qmlString);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the GeoStyler-Style Style from an QML Object (created with xml2js).
   *
   * @param {object} qmlObject The QML object representation (created with xml2js)
   * @return {Style} The GeoStyler-Style Style
   */
  qmlObjectToGeoStylerStyle(qmlObject: object): Style {
    return {
      name,
      rules: []
    };
  }

  /**
   * Get the QML Object (readable with xml2js) from an GeoStyler-Style Style
   *
   * @param {Style} geoStylerStyle A GeoStyler-Style Style.
   * @return {object} The object representation of a QML Style (readable with xml2js)
   */
  geoStylerStyleToQmlObject(geoStylerStyle: Style): any {
    const rules: any[] = [];
    rules.forEach(rule => {return {name}; });
    return {};
  }

  /**
   * The name of the QGIS Style Parser.
   */
  public static title = 'QGIS Style Parser';

}

export default QGISStyleParser;
