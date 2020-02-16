/** 
  Utilizing code from https://bl.ocks.org/mbostock/4090848
**/

// Load states data and append geomap of the US using D3
function geomapStates(){
  // Load states data
  let promisesGeomapStates = [
    d3.json("./data/d3_map_data/us-10m.json"),
    d3.csv("./data/d3_map_data/us_states.csv"),
    d3.csv("./data/geomap_data.csv")
  ];

  Promise.all(promisesGeomapStates).then(function(data){
    buildGeomapStates(data[0], data[1], data[2]);
  });
}

// Append geomap of the US using D3
function buildGeomapStates(us, stateNames, visitedStates) {
  // Generate an array of state names
  let visitedStateNames = visitedStates.map(function(d,i){ return d.name; });
  // Append state names from stateNames array into us
  us.objects.states.geometries.forEach(function(d,i){
    stateNames.forEach(function(de,ie){
      if(+de.id == +d.id){
        us.objects.states.geometries[i].name = de.name;
      }
    })
  });
  // Initialize image tooltip to be shown on the map, positioned appropriately
  let tipGeomapUS = d3.tip()
              .attr('class', 'd3-tip')
              .style('position', 'absolute')
              .offset(function(d){
                let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
                let selectedState = visitedStates.filter(function(dea){ if(dea.name == stateName){ return dea; }})[0];
                let x,y;
                if(selectedState.continent=='East'){
                  x = -450;
                }else{
                  x = 150;
                }
                if(selectedState.name=='Hawaii' || selectedState.name=='Alaska' || selectedState.name=='Florida'){
                  y = -300;
                }else{
                  y = -80;
                }
                return [y,x];
              })
              .html(function(d) {
                let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
                let imageDir = visitedStates[visitedStateNames.indexOf(stateName)].dir;
                return "<span class='details geomapText'><strong>  " + stateName + "  </strong></span>" +
                '<img class="geomapImage" src="'+imageDir+'">' +"</img>";
              });
  // Call initialized tooltip in D3
  d3.select('.geomap').call(tipGeomapUS);

  // D3 geoPath
  let pathGeomapUS = d3.geoPath();
  // Append geomap path in D3
  d3.select('.geomap').append("g")
      .attr("class", "geomapStates")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", pathGeomapUS)
      .attr("class", function(d){
        let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
        if(visitedStateNames.indexOf(stateName)>=0){
          return "land visited";
        }else{
          return "land";
        }
      })
      .on('mouseover',function(d){
        let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
        if(visitedStateNames.indexOf(stateName)>=0){
          tipGeomapUS.show(d);
        }
      })
      .on('mouseout', function(d){
        tipGeomapUS.hide(d);
      })
};
