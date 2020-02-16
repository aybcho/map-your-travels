//Uilizing code from http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f

//Toggle between world and us geomaps
$('#geomapWorldToggle').on('click', function(d){
  $('.geomapStates').remove();
  $('.geomapWorld').remove();
  buildGeomapWorld();

});

let margin = {top: 0, right: 0, bottom: 0, left: 0},
            geomapWidth = screen.width*0.9 - margin.left - margin.right,
            geomapHeight = screen.width*0.4 - margin.top - margin.bottom;

//Responsive layout for mobile devices
$(window).on('resize', function(){
  if(screen.width < 576){
    return geomapResize();
  }
});

function geomapResize() {
  if($('.geomapStates').hasClass('active')){
    console.log('world')
    geomapWidth = window.width * .97;
    geomapHeight = width/1.85;


   d3.select(".geomap").attr("width",geomapWidth).attr("height",geomapHeight);
   d3.selectAll(".geomapStatesBorder").attr('d', pathGeomapWorld);
  }else if($('.geomapWorld').hasClass('active')){
    console.log('states')
    geomapWidth = window.width * .97;
    geomapHeight = width/1.85;

   projectionGeomapWorld
      .scale([30])
      .translate([geomapWidth/1,geomapHeight*1.4]);

   d3.select(".geomap").attr("width",geomapWidth).attr("height",geomapHeight);
   d3.selectAll(".geomapWorldBorder").attr('d', pathGeomapWorld);
  }
}

let color = d3.scaleThreshold()
    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);


let svgGeomap = d3.select("#aboutGeomapContainer")
            .append("svg")
            .attr('class', 'world geomap')
            .attr("width", geomapWidth)
            .attr("height", geomapHeight)
            .append('g')
            .attr('class', 'map');


let projectionGeomapWorld = d3.geoMercator()
                   .scale(160)
                  .translate( [geomapWidth / 2.5, geomapHeight / 1.4]);

let pathGeomapWorld = d3.geoPath().projection(projectionGeomapWorld);


let promisesGeomapWorld = [
  d3.json("./js/world_countries.json"),
  d3.csv("./js/aboutGeomap.csv")
];

function buildGeomapWorld(){
  Promise.all(promisesGeomapWorld).then(function(data){
    readyGeomapWorld(data[0], data[1]);
  });
}

Promise.all(promisesGeomapWorld).then(function(data){
  readyGeomapWorld(data[0], data[1]);
});

function readyGeomapWorld(data, visitedCountries) {
  let populationById = {};
  let visitedCountryNames = visitedCountries.map(function(d,i){ return d.name; });

  // Set tooltips
  let northernCountries = ['USA', 'Canada', 'Greenland', 'Norway', 'Russia', 'Finland', 'Sweden'];
  let tipGeomapWorld = d3.tip()
              .attr('class', 'd3-tip')
              .style('position', 'absolute')
              .offset(function(d){
                let selectedCountry = visitedCountries.filter(function(de,ie){
                  if(de.name==d.properties.name){
                    return d;
                  }
                })[0];
                let x,y;
                if(selectedCountry.continent=='Asia'){
                  x = -450;
                }else{
                  x = 100;
                }
                if(northernCountries.indexOf(d.properties.name)>=0){
                  y = 50;
                }else{
                  y = -200;
                }
                return [y,x];
              })
              .html(function(d) {
                let imageDir = visitedCountries[visitedCountryNames.indexOf(d.properties.name)].dir;
                return "<span class='details geomapText'><strong>  " + d.properties.name + "  </strong></span>" +
                '<img class="geomapImage" src="'+imageDir+'">' +"</img>";
              });

  svgGeomap.call(tipGeomapWorld);

  svgGeomap.append("g")
      .attr("class", "countries geomapWorld")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("class", "land")
      .attr("d", pathGeomapWorld)
      .style("fill", '#8fbcbc')
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          if(visitedCountryNames.indexOf(d.properties.name)>=0){

          tipGeomapWorld.show(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width",1)
            .style('cursor', 'pointer');
          }
        })
        .on('mouseout', function(d){
          tipGeomapWorld.hide(d);
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke-width",0.3);
        })
        .transition()
          .style("fill", function(d) {
            if(visitedCountryNames.indexOf(d.properties.name)>=0){
              return '#ea6506';
            }else{
              return '#8fbcbc';//color(populationById[d.id]);
            }
          });

  svgGeomap.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "geomapWorldBorder geomapWorld countryNames")
      .attr("d", pathGeomapWorld);




}
