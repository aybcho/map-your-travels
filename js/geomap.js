// ************************************
// Execute functions
// ************************************

// Render interactive travel map
geomap();

// ************************************
// Function definitions
// ************************************

// Render interactive travel map
function geomap(){
  // Margins and SVG dimensions
  let margin = {top: 0, right: 0, bottom: 0, left: 0},
              geomapWidth = $('#geomapContainer').width() - margin.left - margin.right,
              geomapHeight = $('#geomapContainer').height() - margin.top - margin.bottom;

  // Append SVG to geomapBody div
  let svgGeomap = d3.select("#geomapBody")
              .append("svg")
              .attr('class', 'world geomap')
              .attr("width", geomapWidth)
              .attr("height", geomapHeight)
              .append('g')
              .attr('class', 'map');

  // Append appropriate event listenrs to toggle between world map and US map
  geomapEvents();

  // Display World map first
  $('[geomap="world"]').click();
  geomapWorld();

  // // Display US map first
  // $('[geomap="states"]').click();
  // geomapStates();

}

function geomapEvents(){
  //Toggle between world and US geomaps
  $('.geomapToggleButtonLabel').on('click', function(d){
    $('.geomapStates').remove();
    $('.geomapWorld').remove();
    $('.geomapToggleButtonLabel').removeClass('selected');
    $(this).addClass('selected');
    if($(this).attr('geomap')==="world"){
      geomapWorld();
    }else if($(this).attr('geomap')==="states"){
      geomapStates();
    }
  });
}
