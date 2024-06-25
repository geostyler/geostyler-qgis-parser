import { Filter, StyleParser, Style, Rule, ScaleDenominator, PointSymbolizer, Symbolizer, IconSymbolizer, LineSymbolizer, MarkSymbolizer, FillSymbolizer, TextSymbolizer, WriteStyleResult, ReadStyleResult } from 'geostyler-style';
import { CqlParser } from 'geostyler-cql-parser';
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
export declare const outlineStyleDashArrays: {
    dot: number[];
    dash: number[];
};
/**
 * This parser can be used with the GeoStyler.
 * It implements the GeoStyler-Style StyleParser interface.
 *
 * @class QGISStyleParser
 * @implements StyleParser
 */
export declare class QGISStyleParser implements StyleParser {
    cqlParser: CqlParser;
    /**
     * The name of the QGIS Style Parser.
     */
    static title: string;
    title: string;
    /**
     * The readStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a QML as a string and returns a Promise containing the
     * GeoStyler-Style Style.
     *
     * @param {string} qmlString A QML as a string.
     * @return {Promise} The Promise resolving with the GeoStyler-Style Style
     */
    readStyle(qmlString: string): Promise<ReadStyleResult>;
    /**
     *
     * @param qmlLabel
     */
    parseLabelTemplates(qmlLabel: string): string;
    /**
     *
     * @param qmlSymbolizer
     */
    qmlSymbolizerLayerPropsToObject(qmlSymbolizer: any): any;
    /**
     * Get the GeoStyler-Style Style from an QML Object (created with xml2js).
     *
     * @param {object} qmlObject The QML object representation (created with xml2js)
     * @return {Style} The GeoStyler-Style Style
     */
    qmlObjectToGeoStylerStyle(qmlObject: object): Style;
    /**
     *
     * @param hex
     * @param opacity
     */
    qmlColorFromHexAndOpacity(hex?: string, opacity?: number): string | undefined;
    /**
     *
     * @param color
     */
    qmlColorToOpacity(color: string): number;
    /**
     *
     * @param color
     */
    qmlColorToHex(qmlColor: string): string;
    /**
     * Get the GeoStyler-Style Rule from an QML Object (created with xml2js).
     *
     * @param {object} qmlObject The QML object representation (created with xml2js)
     * @return {Rule} The GeoStyler-Style Rule
     */
    getRulesFromQmlObject(qmlObject: any): Rule[];
    /**
     * Get the GeoStyler-Style Filter from an QML Rule.
     *
     * Currently only supports one Filter per Rule.
     *
     * @param {object} qmlRule The QML Rule
     * @return {Filter} The GeoStyler-Style Filter
     */
    getFilterFromQmlRule(qmlRule: QmlRule): Filter | undefined;
    /**
     * Get the GeoStyler-Style ScaleDenominator from an QML Rule.
     *
     * @param {object} qmlRule The QML Rule
     * @return {ScaleDenominator} The GeoStyler-Style ScaleDenominator
     */
    getScaleDenominatorFromRule(qmlRule: QmlRule): ScaleDenominator | undefined;
    /**
     *
     * @param qmlLabels
     */
    parseQmlLabeling(qmlLabeling: any): LabelMap;
    /**
     *
     * @param settings
     */
    getTextSymbolizerFromLabelSettings(settings: any): TextSymbolizer;
    /**
     *
     */
    parseQmlSymbolizers(qmlSymbolizers: any[]): SymbolizerMap;
    /**
     * Get the GeoStyler-Style PointSymbolizer from an QGIS Symbolizer.
     *
     * The opacity of the Symbolizer is taken from the <Graphic>.
     *
     * @param {object} qmlSymbolizer The QGIS Symbolizer
     * @return {PointSymbolizer} The GeoStyler-Style PointSymbolizer
     */
    getPointSymbolizersFromQmlSymbolizer(qmlSymbolizer: any): PointSymbolizer[];
    /**
     * Get the GeoStyler-Style MarkSymbolizer from an QML Symbolizer
     *
     * @param {object} symbolizerLayer The QML SymbolizerLayer
     * @return {MarkSymbolizer} The GeoStyler-Style MarkSymbolizer
     */
    getPointSymbolizerFromMarkLayer(symbolizerLayer: any): MarkSymbolizer;
    /**
     * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
     *
     * @param {object} qmlSymbolizer The QML Symbolizer
     * @return {LineSymbolizer} The GeoStyler-Style LineSymbolizer
     */
    getLineSymbolizersFromQmlSymbolizer(qmlSymbolizer: any): LineSymbolizer[];
    /**
     * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
     *
     * @param {object} qmlSymbolizer The QML Symbolizer
     * @return {FillSymbolizer} The GeoStyler-Style FillSymbolizer
     */
    getFillSymbolizerFromQmlSymbolizer(qmlSymbolizer: any): FillSymbolizer[];
    /**
     * Get the GeoStyler-Style IconSymbolizer from an QML Symbolizer
     *
     * @param {object} symbolizerLayer The QML Symbolizer Layer
     * @return {IconSymbolizer} The GeoStyler-Style IconSymbolizer
     */
    getPointSymbolizerFromSvgLayer(symbolizerLayer: any): IconSymbolizer;
    /**
     * The writeStyle implementation of the GeoStyler-Style StyleParser interface.
     * It reads a GeoStyler-Style Style and returns a Promise containing
     * the QML string.
     *
     * @param {Style} geoStylerStyle A GeoStyler-Style Style.
     * @return {Promise} The Promise resolving with the QML.
     */
    writeStyle(geoStylerStyle: Style): Promise<WriteStyleResult<string>>;
    /**
     *
     * @param filter
     */
    getQmlFilterFromFilter(filter: Filter): string | undefined;
    /**
     *
     */
    getQmlRuleFromRule(rule: Rule, index: number): any;
    /**
     *
     * @param geostylerStyle
     */
    getQmlSymbolsFromStyle(geostylerStyle: Style, rules: any[]): any[];
    /**
     *
     * @param rule
     */
    getQmlSymbolFromRule(rule: Rule, index: number): any;
    /**
     *
     */
    getQmlLineSymbolFromSymbolizer(symbolizer: LineSymbolizer): any;
    getQmlFillSymbolFromSymbolizer(symbolizer: FillSymbolizer): any;
    /**
     *
     * @param rule
     */
    getQmlLayersFromRule(rule: Rule): any;
    /**
     *
     * @param symbolizer
     */
    getQmlLayerFromSymbolizer(symbolizer: Symbolizer): any;
    getQmlMarkSymbolFromIconSymbolizer(symbolizer: IconSymbolizer): any;
    /**
     *
     */
    getQmlMarkSymbolFromSymbolizer(symbolizer: MarkSymbolizer): any;
    /**
     *
     * @param properties
     */
    propsObjectToQmlSymbolProps(properties: any): QmlProp[];
    /**
     * Get the QML Object (readable with xml2js) from an GeoStyler-Style Style
     *
     * @param {Style} geoStylerStyle A GeoStyler-Style Style.
     * @return {object} The object representation of a QML Style (readable with xml2js)
     */
    geoStylerStyleToQmlObject(geoStylerStyle: Style): any;
    convertTextSymbolizerRule(qmlRuleList: any[], rule: Rule): void;
    convertTextSymbolizers(qmlObject: any, geoStylerStyle: Style): any;
}
export default QGISStyleParser;
