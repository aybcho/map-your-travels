/**
  Utilizing code from http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f
**/

// Load world data and append geomap of the world using D3
function geomapWorld(){
  // Load world data
  let promisesGeomapWorld = [
    d3.json("./data/d3_map_data/world_countries.json"),
    d3.csv("./data/geomap_data.csv")
  ];

  Promise.all(promisesGeomapWorld).then(function(data){
    buildGeomapWorld(data[0], data[1]);
  });
}

// Append geomap of the world using D3
function buildGeomapWorld(data, visitedCountries) {
  // Generate an array of country names
  let visitedCountryNames = visitedCountries.map(function(d,i){ return d.name; });

  // Initialize image tooltip to be shown on the map, positioned appropriately
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
                  x = -370;
                }else{
                  x = 100;
                }
                if(northernCountries.indexOf(d.properties.name)>=0){
                  y = 50;
                }else{
                  y = -100;
                }
                return [y,x];
              })
              .html(function(d) {
                let imageDir = visitedCountries[visitedCountryNames.indexOf(d.properties.name)].dir;
                return "<span class='details geomapText'><strong>  " + d.properties.name + "  </strong></span>" +
                '<img class="geomapImage" src="'+imageDir+'">' +"</img>";
              });
  // Call initialized tooltip in D3
  d3.select('.geomap').call(tipGeomapWorld);

  // geoEquirectangular projection in D3, scaled to fit SVG
  let projectionGeomapWorld = d3.geoEquirectangular().fitSize([$('.geomap').width()*0.95, $('.geomap').height()*0.7], data)
  // D3 geoPath
  let pathGeomapWorld = d3.geoPath().projection(projectionGeomapWorld);
  // Append geomap path in D3
  d3.select('.geomap').append("g")
      .attr("class", "countries geomapWorld")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("class", function(d){
        if(visitedCountryNames.indexOf(d.properties.name)>=0){
          return "land visited";
        }else{
          return "land";
        }
      })
      .attr("d", pathGeomapWorld)
      // tooltips
      .on('mouseover',function(d){
        if(visitedCountryNames.indexOf(d.properties.name)>=0){
          tipGeomapWorld.show(d);
        }
      })
      .on('mouseout', function(d){
        tipGeomapWorld.hide(d);
      })
}
