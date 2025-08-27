<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.36.3-Maidenhead" styleCategories="Symbology|Labeling" labelsEnabled="1">
  <renderer-v2 type="RuleRenderer" forceraster="0" referencescale="-1" symbollevels="0"
    enableorderby="0">
    <rules key="{7249a1a7-7fbb-4070-ab0f-59e0c30c7af9}">
      <rule description="Symbolstyle_1" filter="category=2" symbol="0" label="Symbol-Rule 1"
        scalemindenom="1840000" scalemaxdenom="200000000" />
      <rule description="Symbolstyle_2" filter="category=3" symbol="1" label="Symbol-Rule 2"
        scalemindenom="1840000" scalemaxdenom="200000000" />
    </rules>
    <symbols>
      <symbol type="marker" name="0">
        <layer class="SimpleMarker">
          <Option type="Map">
            <Option name="angle" value="0" type="QString" />
            <Option name="color" value="0,255,255,255" type="QString" />
            <Option name="name" value="circle" type="QString" />
            <Option name="outline_color" value="35,35,35,255" type="QString" />
            <Option name="outline_style" value="solid" type="QString" />
            <Option name="outline_width" value="0" type="QString" />
            <Option name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString" />
            <Option name="outline_width_unit" value="Pixel" type="QString" />
            <Option name="size" value="4" type="QString" />
            <Option name="size_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString" />
            <Option name="size_unit" value="Pixel" type="QString" />
          </Option>
        </layer>
      </symbol>
      <symbol type="marker" name="1">
        <layer class="SimpleMarker">
          <Option type="Map">
            <Option name="angle" value="0" type="QString" />
            <Option name="color" value="255,0,0,255" type="QString" />
            <Option name="name" value="circle" type="QString" />
            <Option name="outline_color" value="35,35,35,255" type="QString" />
            <Option name="outline_style" value="solid" type="QString" />
            <Option name="outline_width" value="0" type="QString" />
            <Option name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString" />
            <Option name="outline_width_unit" value="Pixel" type="QString" />
            <Option name="size" value="6" type="QString" />
            <Option name="size_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString" />
            <Option name="size_unit" value="Pixel" type="QString" />
          </Option>
        </layer>
      </symbol>
    </symbols>
  </renderer-v2>
  <labeling type="simple">
    <settings calloutType="simple">
      <text-style fontLetterSpacing="0"
        fontSizeMapUnitScale="3x:0,0,0,0,0,0" fieldName="name" textOrientation="horizontal"
        fontSizeUnit="RenderMetersInMapUnits"
        fontWeight="50" fontFamily="Noto Sans" textOpacity="1"
        fontSize="2000"
        textColor="128,128,128,255,rgb:0.50196078431372548,0.50196078431372548,0.50196078431372548,1"
        namedStyle="Standard"
        previewBkgrdColor="255,255,255,255,rgb:1,1,1,1" />
      <placement predefinedPositionOrder="TR,TL,BR,BL,R,L,TSR,BSR" xOffset="13" yOffset="37"
        rotationAngle="0" />
    </settings>
  </labeling>
  <layerGeometryType>0</layerGeometryType>
</qgis>