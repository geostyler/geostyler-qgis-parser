<!DOCTYPE qgis PUBLIC 'http://mrcc.com/qgis.dtd' 'SYSTEM'>
<qgis>
  <renderer-v2 type="RuleRenderer">
    <rules key="renderer_rules">
      <rule key="renderer_rule_0" symbol="0" label="Bildpositi = 1" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi = 1"/>
      <rule key="renderer_rule_1" symbol="1" label="Bildpositi > 1 AND Bildpositi &lt; 3" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi > 1 AND Bildpositi &lt; 3"/>
      <rule key="renderer_rule_2" symbol="2" label="Bildpositi = 3" scalemindenom="100" scalemaxdenom="2000" filter="Bildpositi = 3"/>
    </rules>
    <symbols>
      <symbol type="marker" name="0">
        <layer class="SimpleMarker">
          <prop k="angle" v="0"/>
          <prop k="color" v="75,255,126,255"/>
          <prop k="name" v="square"/>
          <prop k="outline_color" v="0,0,0,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="1"/>
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="outline_width_unit" v="Pixel"/>
          <prop k="size" v="24"/>
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="size_unit" v="Pixel"/>
        </layer>
      </symbol>
      <symbol type="marker" name="1">
        <layer class="SimpleMarker">
          <prop k="angle" v="0"/>
          <prop k="color" v="145,82,45,255"/>
          <prop k="name" v="circle"/>
          <prop k="outline_color" v="35,35,35,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="1"/>
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="outline_width_unit" v="Pixel"/>
          <prop k="size" v="12"/>
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="size_unit" v="Pixel"/>
        </layer>
      </symbol>
      <symbol type="marker" name="2">
        <layer class="SimpleMarker">
          <prop k="angle" v="0"/>
          <prop k="color" v="190,178,151,255"/>
          <prop k="name" v="circle"/>
          <prop k="outline_color" v="35,35,35,255"/>
          <prop k="outline_style" v="solid"/>
          <prop k="outline_width" v="1"/>
          <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="outline_width_unit" v="Pixel"/>
          <prop k="size" v="12"/>
          <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0"/>
          <prop k="size_unit" v="Pixel"/>
        </layer>
      </symbol>
    </symbols>
  </renderer-v2>
</qgis>
