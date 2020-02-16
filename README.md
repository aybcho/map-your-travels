# Map Your Travels: Interactive map visualization using D3.js

### Background
This is an interactive map visualization that was created to visualize the places visited by the user around the world, which could be useful in keeping track of the various places that have been traveled or sharing photos and memories that were captured during those travels with others. This was inspired by the [the Scrach Off Map of the World](https://www.amazon.com/s?k=scratch+off+map+of+the+world&pldnSite=1&ref=nb_sb_noss_2 "https://www.amazon.com/s?k=scratch+off+map+of+the+world&pldnSite=1&ref=nb_sb_noss_2") available on Amazon. 

This implementation was built based on
[world map example in D3](http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f "http://bl.ocks.org/micahstubbs/8e15870eb432a21f0bc4d3d527b2d14f") by Micah Stubbs
and
[US map example in D3](https://bl.ocks.org/mbostock/4090848 "https://bl.ocks.org/mbostock/4090848") by Mike Bostock. With some basic knowledge of HTML and CSS, the users of this visualization can customize the styling of the maps (color, font-style, etc.), and visualize their own set of countries and states that they have visited by editing the csv file included in the repo.

Please feel free to use at will with attribution of source.

### Demo

For a working demo of this repo, check out https://aybcho.github.io/map-your-travels/.
[![alt text](https://github.com/aybcho/interactive-image-treemap/blob/master/images/treemap.png "main image")](https://aybcho.github.io/interactive-image-treemap/) 

### How to use
After cloning this repo, the index.html file will need to be run on a server due to the map data files (csv, json) that are used for the visualization. There's a csv file called **geomap_data.csv** inside **/data** that can be used to list the countries and states that have been visited. The file can be edited using any spreadsheet program such as Microsoft Excel or Google Sheets. [![alt text](https://github.com/aybcho/interactive-image-treemap/blob/master/images/treemap.png "sample data")](https://aybcho.github.io/interactive-image-treemap/) 
The **category** column can hold two values (country or state) which determines whether this entry of data is placed in the visualization of the world or the visualization of the US. 

The **continent** column must indicate the continent that the country that was visited belongs to, or the region (East or West) that the state within the US belongs to.

The **name** column should include the name of the place that was visited, and the name **must** match the name of the location provided either in **us_states.csv** or **world_countries.json** included in **/data/d3_map_data**.

The **dir** column should list the path where the images of each of the places that were visited. The images are displayed as a tooltip when the countries or states are hovered using a mouse. 



