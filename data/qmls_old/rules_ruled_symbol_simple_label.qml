<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.22.16-Białowieża">
  <renderer-v2 type="RuleRenderer">
    <rules key="renderer_rules">
      <rule key="renderer_rule_0" symbol="0" label="Symbol-Rule 1" filter="category = 1"/>
      <rule key="renderer_rule_1" symbol="1" label="Symbol-Rule 2" filter="category = 2"/>
    </rules>
    <symbols>
      <symbol type="marker" name="0">
        <layer class="SimpleMarker">
          <prop k="angle" v="0" />
          <prop k="color" v="75,255,126,255" />
          <prop k="name" v="square" />
          <prop k="outline_color" v="0,0,0,255" />
          <prop k="outline_style" v="solid" />
          <prop k="outline_width" v="1" />
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0" />
          <prop k="outline_width_unit" v="Pixel" />
          <prop k="size" v="24" />
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0" />
          <prop k="size_unit" v="Pixel" />
        </layer>
      </symbol>
      <symbol type="marker" name="1">
        <layer class="SimpleMarker">
          <prop k="angle" v="0" />
          <prop k="color" v="255,0,0,255" />
          <prop k="name" v="circle" />
          <prop k="outline_color" v="35,35,35,255" />
          <prop k="outline_style" v="solid" />
          <prop k="outline_width" v="0" />
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0" />
          <prop k="outline_width_unit" v="Pixel" />
          <prop k="size" v="4" />
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0" />
          <prop k="size_unit" v="Pixel" />
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