<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis simplifyAlgorithm="0" version="3.4.3-Madeira" simplifyMaxScale="1" simplifyDrawingTol="1" styleCategories="AllStyleCategories" hasScaleBasedVisibilityFlag="0" minScale="1e+8" labelsEnabled="0" simplifyDrawingHints="1" maxScale="0" simplifyLocal="1" readOnly="0">
  <flags>
    <Identifiable>1</Identifiable>
    <Removable>1</Removable>
    <Searchable>1</Searchable>
  </flags>
  <renderer-v2 symbollevels="0" forceraster="0" enableorderby="0" type="singleSymbol">
    <symbols>
      <symbol alpha="1" clip_to_extent="1" type="fill" name="0" force_rhr="0">
        <layer enabled="1" pass="0" class="SimpleFill" locked="0">
          <prop v="3x:0,0,0,0,0,0" k="border_width_map_unit_scale"/>
          <prop v="75,255,126,128" k="color"/>
          <prop v="bevel" k="joinstyle"/>
          <prop v="0,0" k="offset"/>
          <prop v="3x:0,0,0,0,0,0" k="offset_map_unit_scale"/>
          <prop v="MM" k="offset_unit"/>
          <prop v="255,7,11,255" k="outline_color"/>
          <prop v="dash" k="outline_style"/>
          <prop v="4" k="outline_width"/>
          <prop v="Pixel" k="outline_width_unit"/>
          <prop v="solid" k="style"/>
          <data_defined_properties>
            <Option type="Map">
              <Option value="" type="QString" name="name"/>
              <Option name="properties"/>
              <Option value="collection" type="QString" name="type"/>
            </Option>
          </data_defined_properties>
        </layer>
      </symbol>
    </symbols>
    <rotation/>
    <sizescale/>
  </renderer-v2>
  <customproperties>
    <property key="embeddedWidgets/count" value="0"/>
    <property key="variableNames"/>
    <property key="variableValues"/>
  </customproperties>
  <blendMode>0</blendMode>
  <featureBlendMode>0</featureBlendMode>
  <layerOpacity>1</layerOpacity>
  <SingleCategoryDiagramRenderer attributeLegend="1" diagramType="Histogram">
    <DiagramCategory backgroundColor="#ffffff" sizeType="MM" barWidth="5" minimumSize="0" width="15" penWidth="0" enabled="0" opacity="1" penAlpha="255" scaleDependency="Area" diagramOrientation="Up" penColor="#000000" backgroundAlpha="255" lineSizeType="MM" minScaleDenominator="0" height="15" rotationOffset="270" lineSizeScale="3x:0,0,0,0,0,0" labelPlacementMethod="XHeight" sizeScale="3x:0,0,0,0,0,0" maxScaleDenominator="1e+8" scaleBasedVisibility="0">
      <fontProperties style="" description="Sans Serif,9,-1,5,50,0,0,0,0,0"/>
    </DiagramCategory>
  </SingleCategoryDiagramRenderer>
  <DiagramLayerSettings dist="0" priority="0" obstacle="0" showAll="1" placement="1" linePlacementFlags="18" zIndex="0">
    <properties>
      <Option type="Map">
        <Option value="" type="QString" name="name"/>
        <Option name="properties"/>
        <Option value="collection" type="QString" name="type"/>
      </Option>
    </properties>
  </DiagramLayerSettings>
  <geometryOptions removeDuplicateNodes="0" geometryPrecision="0">
    <activeChecks/>
    <checkConfiguration/>
  </geometryOptions>
  <fieldConfiguration>
    <field name="WKT">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="ID">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
    <field name="SORTE">
      <editWidget type="TextEdit">
        <config>
          <Option/>
        </config>
      </editWidget>
    </field>
  </fieldConfiguration>
  <aliases>
    <alias index="0" field="WKT" name=""/>
    <alias index="1" field="ID" name=""/>
    <alias index="2" field="SORTE" name=""/>
  </aliases>
  <excludeAttributesWMS/>
  <excludeAttributesWFS/>
  <defaults>
    <default expression="" field="WKT" applyOnUpdate="0"/>
    <default expression="" field="ID" applyOnUpdate="0"/>
    <default expression="" field="SORTE" applyOnUpdate="0"/>
  </defaults>
  <constraints>
    <constraint notnull_strength="0" exp_strength="0" field="WKT" constraints="0" unique_strength="0"/>
    <constraint notnull_strength="0" exp_strength="0" field="ID" constraints="0" unique_strength="0"/>
    <constraint notnull_strength="0" exp_strength="0" field="SORTE" constraints="0" unique_strength="0"/>
  </constraints>
  <constraintExpressions>
    <constraint exp="" desc="" field="WKT"/>
    <constraint exp="" desc="" field="ID"/>
    <constraint exp="" desc="" field="SORTE"/>
  </constraintExpressions>
  <expressionfields/>
  <attributeactions>
    <defaultAction key="Canvas" value="{00000000-0000-0000-0000-000000000000}"/>
  </attributeactions>
  <attributetableconfig sortOrder="0" sortExpression="" actionWidgetStyle="dropDown">
    <columns>
      <column hidden="0" width="-1" type="field" name="WKT"/>
      <column hidden="0" width="-1" type="field" name="ID"/>
      <column hidden="0" width="-1" type="field" name="SORTE"/>
      <column hidden="1" width="-1" type="actions"/>
    </columns>
  </attributetableconfig>
  <conditionalstyles>
    <rowstyles/>
    <fieldstyles/>
  </conditionalstyles>
  <editform tolerant="1"></editform>
  <editforminit/>
  <editforminitcodesource>0</editforminitcodesource>
  <editforminitfilepath></editforminitfilepath>
  <editforminitcode><![CDATA[# -*- coding: utf-8 -*-
"""
QGIS forms can have a Python function that is called when the form is
opened.

Use this function to add extra logic to your forms.

Enter the name of the function in the "Python Init function"
field.
An example follows:
"""
from qgis.PyQt.QtWidgets import QWidget

def my_form_open(dialog, layer, feature):
	geom = feature.geometry()
	control = dialog.findChild(QWidget, "MyLineEdit")
]]></editforminitcode>
  <featformsuppress>0</featformsuppress>
  <editorlayout>generatedlayout</editorlayout>
  <editable>
    <field editable="1" name="ID"/>
    <field editable="1" name="SORTE"/>
    <field editable="1" name="WKT"/>
  </editable>
  <labelOnTop>
    <field labelOnTop="0" name="ID"/>
    <field labelOnTop="0" name="SORTE"/>
    <field labelOnTop="0" name="WKT"/>
  </labelOnTop>
  <widgets/>
  <previewExpression>ID</previewExpression>
  <mapTip></mapTip>
  <layerGeometryType>2</layerGeometryType>
</qgis>
