<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis version="3.28.0-Firenze">
  <renderer-v2 type="RuleRenderer">
    <rules key="renderer_rules">
      <rule key="renderer_rule_0" symbol="0" label="Bildpositi = 1" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi = 1"/>
      <rule key="renderer_rule_1" symbol="1" label="Bildpositi > 1 AND Bildpositi &lt; 3" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi > 1 AND Bildpositi &lt; 3"/>
      <rule key="renderer_rule_2" symbol="2" label="Bildpositi = 3" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi = 3"/>
    </rules>
    <symbols>
      <symbol type="marker" name="0">
        <layer class="SimpleMarker">
          <Option type="Map">
            <Option name="angle" value="0" type="QString"/>
            <Option name="color" value="75,255,126,255" type="QString"/>
            <Option name="name" value="square" type="QString"/>
            <Option name="outline_color" value="0,0,0,255" type="QString"/>
            <Option name="outline_style" value="solid" type="QString"/>
            <Option name="outline_width" value="1" type="QString"/>
            <Option name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="outline_width_unit" value="Pixel" type="QString"/>
            <Option name="size" value="24" type="QString"/>
            <Option name="size_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="size_unit" value="Pixel" type="QString"/>
          </Option>
        </layer>
      </symbol>
      <symbol type="marker" name="1">
        <layer class="SimpleMarker">
          <Option type="Map">
            <Option name="angle" value="0" type="QString"/>
            <Option name="color" value="145,82,45,255" type="QString"/>
            <Option name="name" value="circle" type="QString"/>
            <Option name="outline_color" value="35,35,35,255" type="QString"/>
            <Option name="outline_style" value="solid" type="QString"/>
            <Option name="outline_width" value="1" type="QString"/>
            <Option name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="outline_width_unit" value="Pixel" type="QString"/>
            <Option name="size" value="12" type="QString"/>
            <Option name="size_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="size_unit" value="Pixel" type="QString"/>
          </Option>
        </layer>
      </symbol>
      <symbol type="marker" name="2">
        <layer class="SimpleMarker">
          <Option type="Map">
            <Option name="angle" value="0" type="QString"/>
            <Option name="color" value="190,178,151,255" type="QString"/>
            <Option name="name" value="circle" type="QString"/>
            <Option name="outline_color" value="35,35,35,255" type="QString"/>
            <Option name="outline_style" value="solid" type="QString"/>
            <Option name="outline_width" value="1" type="QString"/>
            <Option name="outline_width_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="outline_width_unit" value="Pixel" type="QString"/>
            <Option name="size" value="12" type="QString"/>
            <Option name="size_map_unit_scale" value="3x:0,0,0,0,0,0" type="QString"/>
            <Option name="size_unit" value="Pixel" type="QString"/>
          </Option>
        </layer>
      </symbol>
    </symbols>
  </renderer-v2>
</qgis>
