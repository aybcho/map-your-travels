//Utilizing code from https://bl.ocks.org/mbostock/4090848

//Toggle between world and us geomaps
$('#geomapStatesToggle').on('click', function(d){
  $('.geomapStates').remove();
  $('.geomapWorld').remove();
  buildGeomapStates();
});


let pathGeomapUS = d3.geoPath();

let promisesGeomapStates = [
  d3.json("./js/us-10m.v1.json"),
  d3.tsv("./js/us-state-names.tsv"),
  d3.csv("./js/aboutGeomap.csv")
];

function buildGeomapStates(){
  Promise.all(promisesGeomapStates).then(function(data){
    readyGeomapStates(data[0], data[1], data[2]);
  });
}


function readyGeomapStates(us, stateNames, visitedStates) {

  us.objects.states.geometries.forEach(function(d,i){
    stateNames.forEach(function(de,ie){
      if(+de.id == +d.id){
        us.objects.states.geometries[i].name = de.name;
      }
    })
  });
  let visitedStateNames = visitedStates.map(function(d,i){ return d.name; });
  let tipGeomapUS = d3.tip()
              .attr('class', 'd3-tip')
              .style('position', 'absolute')
              .offset(function(d){
                let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
                let selectedState = visitedStates.filter(function(dea){ if(dea.name == stateName){ return dea; }})[0];
                let x,y;
                console.log(selectedState.continent);
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

  svgGeomap.call(tipGeomapUS);

  svgGeomap.append("g")
      .attr("class", "geomapStates")
      .style('transform', function(){
        console.log(screen.width);
        if(screen.width<1600){
          return 'translate(8%, 2%)';
        }else{
          return 'translate(15%, 5%)';
        }
      })
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", pathGeomapUS)
      .style("fill", '#8fbcbc')
      .style("opacity", 0.8)
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
          if(visitedStateNames.indexOf(stateName)>=0){
          tipGeomapUS.show(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width",1)
            .style('cursor', 'pointer');
          }
        })
        .on('mouseout', function(d){
          tipGeomapUS.hide(d);
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke-width",0.3);
        })
        .transition()
          // .attr('delay', 1000)
          // .attr('duration', 10000)
          .style("fill", function(d) {
            let stateName = stateNames.filter(function(de){ if(de.id == +d.id){return de;}})[0].name;
            if(visitedStateNames.indexOf(stateName)>=0){
              return '#ea6506';
            }else{
              return '#8fbcbc';
            }
          });

  svgGeomap.append("path")
            .style('transform', function(){
              console.log(screen.width);
              if(screen.width<1600){
                return 'translate(8%, 2%)';
              }else{
                return 'translate(15%, 5%)';
              }
            })
            .attr("class", "geomapStatesBorder geomapStates")
            .attr("d", pathGeomapUS(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
};
