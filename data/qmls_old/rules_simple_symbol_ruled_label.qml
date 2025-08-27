<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.22.16-Białowieża">
  <renderer-v2 type="SingleSymbol">
    <symbols>
      <symbol type="marker" name="0">
        <layer class="SimpleMarker">
          <prop k="angle" v="0" />
          <prop k="color" v="190,178,151,255" />
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
  <labeling type="rule-based">
    <rules key="text_rules">
      <rule filter="&quot;category&quot; =5" key="rule_1" description="Text-Rule 1">
        <settings calloutType="simple">
          <text-style fontLetterSpacing="0"
            fontSizeMapUnitScale="3x:0,0,0,0,0,0" fieldName="name" textOrientation="horizontal"
            fontSizeUnit="RenderMetersInMapUnits"
            fontWeight="50" fontFamily="Noto Sans" textOpacity="1"
            fontSize="1500"
            textColor="128,128,128,255,rgb:0.50196078431372548,0.50196078431372548,0.50196078431372548,1"
            namedStyle="Standard"
            previewBkgrdColor="255,255,255,255,rgb:1,1,1,1" />
          <placement predefinedPositionOrder="TR,TL,BR,BL,R,L,TSR,BSR" xOffset="13" yOffset="37"
            rotationAngle="0" />
        </settings>
      </rule>
      <rule filter="&quot;category&quot; = 6" key="rule_2" description="Text-Rule 2">
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
      </rule>
    </rules>
  </labeling>
  <layerGeometryType>0</layerGeometryType>
</qgis>