<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis labelsEnabled="1" version="3.32.1-Lima" styleCategories="Symbology|Labeling">
  <renderer-v2 type="singleSymbol">
    <symbols>
      <symbol type="marker" is_animated="0" name="0" frame_rate="10" clip_to_extent="1"
        alpha="0.838" force_rhr="0">
        <layer id="{1cf185bd-d658-4ce0-baa7-0d42c3818555}" pass="0" locked="0" class="SimpleMarker"
          enabled="1">
          <Option type="Map">
            <Option type="QString" name="angle" value="0" />
            <Option type="QString" name="cap_style" value="round" />
            <Option type="QString" name="color" value="141,201,153,242" />
            <Option type="QString" name="horizontal_anchor_point" value="1" />
            <Option type="QString" name="joinstyle" value="round" />
            <Option type="QString" name="name" value="circle" />
            <Option type="QString" name="offset" value="0,0" />
            <Option type="QString" name="offset_map_unit_scale" value="3x:0,0,0,0,0,0" />
            <Option type="QString" name="offset_unit" value="MM" />
            <Option type="QString" name="outline_color" value="35,35,35,0" />
            <Option type="QString" name="outline_style" value="solid" />
            <Option type="QString" name="outline_width" value="0" />
            <Option type="QString" name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" />
            <Option type="QString" name="outline_width_unit" value="MM" />
            <Option type="QString" name="scale_method" value="diameter" />
            <Option type="QString" name="size" value="4" />
            <Option type="QString" name="size_map_unit_scale" value="3x:0,0,0,0,0,0" />
            <Option type="QString" name="size_unit" value="Point" />
          </Option>
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