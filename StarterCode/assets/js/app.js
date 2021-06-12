// D3 Animated Scatter Plot

// Section 1: Pre-Data Setup
// ===========================
// Before we code any data visualizations,
// we need to at least set up the width, height and margins of the graph.
// Note: I also added room for label text as well as text padding,
// though not all graphs will need those specifications.

// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));  
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;
var textPadBottom = 40;
var textPadLeft = 40;

// Create the actual canvas for the graph
var svg = d3.select("#scatter") // d3.select() the id "#scatter" element
            .append("svg") // .append() an "svg" tag
            .attr("width", width) // set the 'width' attribute to be your variable width
            .attr("height", height) // set the 'height' attribute to be your variable height
            .classed("chart", true); // give it a class of "chart"

// Set the radius for each dot that will appear in the graph.
// Note: Making this a function allows us to easily call
// it in the mobility section of our code.
var circleRadius;
function getCircleRadius() {
  if (width <= 530) {  // check if the width is less than or equal to 530
    circleRadius = 5; // set the circleRadius to 5
  }
  else { // else
    circleRadius = 10; // set the circleRadius to 10
  }
}
getCircleRadius();

// The Labels for our Axes

// A) Bottom Axis
// ==============

// We create a group element to nest our bottom axes labels.
var xText = svg.append("g"); // append() a "g" element to the svg

// We give xText a transform property that places it at the bottom of the chart.
// By nesting this attribute in a function, we can easily change the location of the label group
// whenever the width of the window changes.
function xTextRefresh() {
  xText.attr("transform",
              `translate(${((width - labelArea) / 2 + labelArea)},${(height - margin - textPadBottom)})`
  );
}
xTextRefresh();

// Now we use xText to append three text SVG files, with y coordinates specified to space out the values.

// 1. Poverty
xText.append("text") // append a "text" element to the xText group
      .attr("y", -26) // set the "y" attribute to -26
      .attr("data-name", "poverty") // set the 'data-name' attribute to 'poverty'
      .attr("data-axis", "x") // set the data-axis attribute to 'x'
      .classed("axisText active x", true) // give it class of axisText, active, and x
      .text("Poverty"); // set the text to be a human readable label

// 2. Age
xText.append("text") // append a "text" element to the xText group
      .attr("y", 0) // set the "y" attribute to 0
      .attr("data-name", "age") // set the 'data-name' attribute to 'age'
      .attr("data-axis", "x") // set the data-axis attribute to 'x'
      .classed("axisText inactive x", true) // give it class of axisText, inactive, and x
      .text("Age"); // set the text to be a human readable label

// 3. Income
xText.append("text") // append a "text" element to the xText group
      .attr("y", 26) // set the "y" attribute to 26
      .attr("data-name", "income") // set the 'data-name' attribute to 'income'
      .attr("data-axis", "x") // set the data-axis attribute to 'x'
      .classed("axisText inactive x", true) // give it class of axisText, inactive, and x
      .text("Income"); // set the text to be a human readable label

// B) Left Axis
// ============

// Specifying the variables like this allows us to make our transform attributes more readable.
var leftTextX = margin + textPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// We add a second label group, this time for the axis left of the chart.
var yText = svg.append("g") // append a 'g' element to the svg
                .classed("yText", true); //give it a class of yText

// Like before, we nest the group's transform attr in a function
// to make changing it on window change an easy operation.
function yTextRefresh() {
  yText.attr("transform", `translate(${leftTextX}, ${leftTextY})rotate(-90)`
  );
}
yTextRefresh();

// Now we append the text.
// 1. Obesity
yText.append("text") // append a "text" element to the yText group
      .attr("y", -26) // set the "y" attribute to -26
      .attr("data-name", "obesity") // set the 'data-name' attribute to 'obesity'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText active y", true) // give it class of axisText, active, and y
      .text("Obesity"); // set the text to be a human readable label

// 2. Smokes
yText.append("text") // append a "text" element to the yText group
      .attr("y", 0) // set the "y" attribute to 0
      .attr("data-name", "smokes") // set the 'data-name' attribute to 'smokes'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText inactive y", true) // give it class of axisText, inactive, and y
      .text("Smoking Habits"); // set the text to be a human readable label

// 3. Lacks Healthcare
yText.append("text") // append a "text" element to the yText group
      .attr("y", 26) // set the "y" attribute to 26
      .attr("data-name", "healthcare") // set the 'data-name' attribute to 'healthcare'
      .attr("data-axis", "y") // set the data-axis attribute to 'y'
      .classed("axisText inactive y", true) // give it class of axisText, inactive, and y
      .text("Lacks Healthcare Access"); // set the text to be a human readable label
      

// 2. Import our .csv file.
// ========================
// This data file includes state-by-state demographic data from the US Census
// and measurements from health risks obtained
// by the Behavioral Risk Factor Surveillance System.

// Import our CSV data with d3's .csv import method.
// d3.csv("assets/data/data.csv").then(function(data) {
//   // Visualize the data
//   // data.forEach(function(data) {
//   //   data.poverty = parseInt(data.poverty);
//   //   data.age = parseInt(data.age);
//   //   data.income = parseInt(data.income);
//   // }); // call your visualize() function on the data

//   visualize(data);
// });

// 3. Create our visualization function
// ====================================
// We called a "visualize" function on the data obtained with d3's .csv method.
// This function handles the visual manipulation of all elements dependent on the data.
function visualize(data) {
  // PART 1: Essential Local Variables and Functions
  // =================================
  // currentX and currentY will determine what data gets represented in each axis.
  // We designate our defaults here, which carry the same names
  // as the headings in their matching .csv data file.
  var currentX = "poverty";
  var currentY = "obesity";

  // We also save empty variables for our the min and max values of x and y.
  // this will allow us to alter the values in functions and remove repetitious code.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // // This function allows us to set up tooltip rules (see d3-tip.js).
  // var toolTip = d3.tip() // create a d3.tip()
  //                 .attr("class", "d3-tip") // set the class to 'd3-tip'
  //                 .offset([40, -60]) // set the offset to [40, -60]
  //                 .html(function(d) { return "Radius: " + d; });
  //                 //   // x key
  //                 //   var theX;
  //                 //   // Grab the state name.
  //                 //   var theState = `<div>${d.state}</div>`;
  //                 //   // Snatch the y value's key and value.
  //                 //   var theY = `<div>${currentY}: ${d[currentY]}%</div>`;
  //                 //   // If the x key is poverty
  //                 //   if (currentX === "poverty") {
  //                 //     // Grab the x key and a version of the value formatted to show percentage
  //                 //     theX = `<div>${currentX}: ${d[currentX]}%</div>`;
  //                 //   }
  //                 //   else {
  //                 //     // Otherwise
  //                 //     // Grab the x key and a version of the value formatted to include commas after every third digit.
  //                 //     theX = `<div>${currentX}: ${parseFloat(d[currentX]).toLocaleString("en")}</div>`;
  //                 //   }
  //                 //   // Display what we capture.
  //                 //   return theState + theX + theY;
  //                 // });
  //     // Call the toolTip function.
  // svg.call(toolTip);

  // PART 2: D.R.Y!
  // ==============
  // These functions remove some repitition from later code.
  // This will be more obvious in parts 3 and 4.

  // a. change the min and max for x
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(data, d => parseFloat(d[currentX]) * 0.90);
 
    // .max will grab the largest datum from the selected column.
    xMax = d3.max(data, d => parseFloat(d[currentX]) * 1.10);
  }

  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(data, d => parseFloat(d[currentY]) * 0.90);

    // .max will grab the largest datum from the selected column.
    yMax = d3.max(data, d => parseFloat(d[currentY]) * 1.10);
  }

  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3.selectAll(".axisText") // d3.selectAll() the elements with class .axisText
      .filter(`.${axis}`) // .filter() to only those with class `.${axis}`
      .filter(".active") // .filter() to only those with class .active
      .classed("active", false) // remove the class active from the element 
      .classed("inactive", true); // give the element class inactive

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false) // remove the class inactive from the element 
                .classed("active", true); // give the element class active
  }

  // Part 3: Instantiate the Scatter Plot
  // ====================================
  // This will add the first placement of our data and axes to the scatter plot.

  // First grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  // With the min and max values now defined, we can create our scales.
  // Notice in the range method how we include the margin and word area.
  // This tells d3 to place our circles in an area starting after the margin and word area.
  var xScale =  d3.scaleLinear() // create a d3 linear scale
                  .domain([xMin, xMax]) // set the domain to be from xMin to xMax
                  .range([margin + labelArea, width - margin]);
 
  var yScale = d3.scaleLinear() // create a d3 linear scale
                  .domain([yMin, yMax]) // set the domain to be from xMin to xMax
                  .range([height - margin - labelArea, margin]);

  // We pass the scales into the axis methods to create the axes.
  // Note: D3 4.0 made this a lot less cumbersome then before. Kudos to mbostock.
  var xAxis = d3.axisBottom(xScale); // use d3.axisBottom() to read the xScale
  var yAxis = d3.axisLeft(yScale); // use d3.axisLeft() to read the yScale

  // Determine x and y tick counts.
  // Note: Saved as a function for easy mobile updates.
  function tickCount() { // create function called tickCount() that takes no arguments
    if (width <= 500) { // if the width is less than or equal to 500
      xAxis.ticks(5); // set xAxis.ticks(5)
      yAxis.ticks(5); // set yAxis.ticks(5)
    }
    else { // else
      xAxis.ticks(10); // set xAxis.ticks(10)
      yAxis.ticks(10); // set yAxis.ticks(10)
    }
  }
  tickCount(); // call the tickCount() function

  // We append the axes in group elements. By calling them, we include
  // all of the numbers, borders and ticks.
  // The transform attribute specifies where to place the axes.
  svg.append("g") // append a 'g' element to the svg
      .call(xAxis) // .call() the xAxis
      .attr("class", "xAxis") // set the class .attr() to be 'xAxis'
      .attr("transform", `translate(0,${(height - margin - labelArea)})`);

  svg.append("g") // append a 'g' element to the svg
      .call(yAxis) // .call() the yAxis
      .attr("class", "yAxis") // set the class .attr() to be 'yAxis'
      .attr("transform", `translate(${(margin + labelArea)}, 0)`);

  // Now let's make a grouping for our dots and their labels.
  var circlesGroup = svg.selectAll("g circlesGroup") // .selectAll() 'g circlesGroup' elements in the svg
                      .data(data) // bind the data to it with .data(data)
                      .enter()// .enter() into the data

  circlesGroup.append("circle") // append a 'circle' element to the circlesGroup
            // These attr's specify location, size and class.
            .attr("cx", d => xScale(d[currentX])) // set the 'cx' .attr() to map from d => xScale() applied to d[currentX]
            .attr("cy", d => yScale(d[currentY])) // set the 'cx' .attr() to map from d => yScale() applied to d[currentY]
            .attr("r", circleRadius) // set the 'r' attr() to be the circleRadius
            .attr("class", d => `${d.abbr} stateCircle`) // set the class attr() to map from d => the d.abbr
            .on("mouseover", function(d) { // .on 'mouseover' event, fire off a function that takes argument d
              // Show the tooltip
              toolTip.show(d, this); // use toolTip.show() with d and this as the arguments
              // Highlight the state circle's border
              d3.select(this).transition().style("stroke", "orange"); // use d3.select() the this element, and modify the 'stroke' .style() to a color of your choosing
            })
            .on("mouseout", function(d) { // on 'mouseout' fire off a function that takes argument d
                // Remove the tooltip
                toolTip.hide(d, this); // use toolTip.hide() with d and this as the arguments
                // Remove highlight
                d3.select(this).transition().style("stroke", "blue"); // use d3.select() the this element, and modify the 'stroke' .style() to another color of your choosing
            });

  // With the circles on our graph, we need matching labels.
  // Let's grab the state abbreviations from our data
  // and place them in the center of our dots.
  circlesGroup.append("text") // append a 'text' element to circlesGroup
              // We return the abbreviation to .text, which makes the text the abbreviation.
              .text(d => d.abbr) // set the .text() to map from d => d.abbr
              // Now place the text using our scale.
              .attr("dx", d => xScale(d[currentX])) // set the 'dx' attr() to map from d => xScale() applied to d[currentX]
              // When the size of the text is the radius,
              // adding a third of the radius to the height
              // pushes it into the middle of the circle.
              .attr("dy", d => yScale(d[currentY]) + circleRadius / 2.5) // set the 'dy' attr() to map from d => yScale() applied to d[currentY]) + circleRadius / 2.5
              .attr("font-size", circleRadius) // set the 'font-size' .attr() to circleRadius
              .attr("class", d => `${d.abbr} stateText`) // set the 'class' attr() to be from d => d.abbr
              .on("mouseover", function(d) { // on 'mouseover' event, fire off a function that takes argument d
                // Show the tooltip
                toolTip.show(d, this); // use toolTip.show() with d and this as the arguments
                // Highlight the state text's border
                d3.select(this).transition().style("stroke", "red"); // use d3.select() the this element, and modify the 'stroke' .style() to a color of your choosing
              })
              .on("mouseout", function(d) { // on 'mouseout' fire off a function that takes argument d
                  // Remove the tooltip
                  toolTip.hide(d, this); // use toolTip.hide() with d and this as the arguments
                  // Remove highlight
                  d3.select(this).transition().style("stroke", "blue"); // use d3.select() the this element, and modify the 'stroke' .style() to another color of your choosing
              });

  // Part 4: Make the Graph Dynamic
  // ==========================
  // This section will allow the user to click on any label
  // and display the data it references.

  // Select all axis text and add this d3 click event.
  d3.selectAll(".axisText").on("click", function() {
    // Make sure we save a selection of the clicked text,
    // so we can reference it without typing out the invoker each time.
    var selectedLabel = d3.select(this); // d3.select() the this (the thing that was clicked)

    // We only want to run this on inactive labels.
    // It's a waste of the processor to execute the function
    // if the data is already displayed on the graph.
    if (selectedLabel.classed("inactive", true)) { // if the selectedLabel has the class 'inactive'
      // Grab the name and axis saved in label.
      var axis = selectedLabel.attr("data-axis"); // grab the 'data-axis' .attr() from the selectedLabel
      var name = selectedLabel.attr("data-name"); // grab the 'data-name' attr()

      // When x is the saved axis, execute this:
      if (axis === "x") { // if the axis is equal to 'x'
        // Make currentX the same as the data name.
        currentX = name;

        // Change the min and max of the x-axis
        xMinMax(); // call the xMinMax() function

        // Update the domain of x.
        xScale.domain([xMin, xMax]); // set the .domain() of xScale to be the [xMin, and xMax]

        // Now use a transition when we update the xAxis.
        d3.select(".xAxis")// select the .xAxis elements on the svg
            .transition() // set a transition()
            .duration(300) // give it a duration() of 300ms
            .call(xAxis); // call the xAxis

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() { // d3.selectAll() 'circle' elements, and then use .each to fire off an anonymous function with no arguments
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3.select(this) // use d3.select(this)
            .transition() // set a transition
            .attr("cx", d => xScale(d[currentX])) // set the 'cx' attribute to go from d => xScale applied to d[currentX]
            .duration(300); // set the duration to 300ms
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() { // d3.selectAll() '.stateText' elements, and then use .each to fire off an anonymous function with no arguments
          // We give each state text the same motion tween as the matching circle.
          d3.select(this) // use d3.select(this)
            .transition // set a transition
            .attr("dx", d => xScale(d[currentX])) // set the 'dx' attribute to go from d => xScale applied to d[currentX]
            .duration(300); // set the duration to 300ms
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, selectedLabel); // call the labelCahnge function with axis and selectedLabel as arguments
      }
      else { //else
        // do all the same steps you just did for x, but this time do them for y
        // Make currentX the same as the data name.
        currentY = name;

        // Change the min and max of the x-axis
        yMinMax(); // call the xMinMax() function

        // Update the domain of x.
        yScale.domain([yMin, yMax]); // set the .domain() of xScale to be the [xMin, and xMax]

        // Now use a transition when we update the xAxis.
        d3.select(".yAxis")// select the .xAxis elements on the svg
            .transition() // set a transition()
            .duration(300) // give it a duration() of 300ms
            .call(yAxis); // call the xAxis

        // With the axis changed, let's update the location of the state circles.
        d3.selectAll("circle").each(function() { // d3.selectAll() 'circle' elements, and then use .each to fire off an anonymous function with no arguments
          // Each state circle gets a transition for it's new attribute.
          // This will lend the circle a motion tween
          // from it's original spot to the new location.
          d3.select(this) // use d3.select(this)
            .transition() // set a transition
            .attr("cy", d => yScale(d[currentY])) // set the 'cx' attribute to go from d => xScale applied to d[currentX]
            .duration(300); // set the duration to 300ms
        });

        // We need change the location of the state texts, too.
        d3.selectAll(".stateText").each(function() { // d3.selectAll() '.stateText' elements, and then use .each to fire off an anonymous function with no arguments
          // We give each state text the same motion tween as the matching circle.
          d3.select(this) // use d3.select(this)
            .transition // set a transition
            .attr("dy", d => yScale(d[currentY])) // set the 'dx' attribute to go from d => xScale applied to d[currentX]
            .duration(300); // set the duration to 300ms
        });

        // Finally, change the classes of the last active label and the clicked label.
        labelChange(axis, selectedLabel); // call the labelCahnge function with axis and selectedLabel as arguments 
      }
    }
  });

  // Part 5: Mobile Responsive
  // =========================
  // With d3, we can call a resize function whenever the window dimensions change.
  // This makes it possible to add true mobile-responsiveness to our charts.
  d3.select(window).on("resize", resizeChart) // d3.select() the window, and on resize event call the function resizeChart
    
  // One caveat: we need to specify what specific parts of the chart need size and position changes.
  function resizeChart() { // define a function called resizeChart that takes no arguments
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas.
    svg.attr("width", width); // set the width and height attributes of the svg with the above variables
    svg.attr("height", height);
   
    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // With the scales changes, update the axes (and the height of the x-axis)
    svg.select(".xAxis") // select the .xAxis elements in the svg
        .call(xAxis) // call the xAxis function
        .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis") // select the .yAxis elements in the svg
        .call(yAxis) // call the yAxis function
        .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

    // Update the ticks on each axis.
    tickCount(); // call the tickCount() function

    // Update the labels.
    xtextRefresh(); // call xtextRefresh() 
    yTextRefresh(); // and yTextRefresh()
                    

    // Update the radius of each dot.
    getCircleRadius(); // call getCircleRadius()

    // With the axis changed, let's update the location and radius of the state circles.
    d3.selectAll(".statecircle") // d3.selectAll() 'circle' elements
      .attr("cy", d => yScale(d[currentY])) // set the 'cy' attribute to use the yScale() d[currentY]
      .attr("cx", d => xScale(d[currentX])) // set the 'cy' attribute to use the xScale() d[currentX]
      .attr("r", circleRadius); // set the 'r' attribute to be the circleRadius

    // We need change the location and size of the state texts, too.
     // do the same for the .stateText elements, but remember to use 'dx'/'dy' and scale appropriately
     d3.selectAll(".stateText") // d3.selectAll() 'circle' elements
     .attr("dy", d => yScale(d[currentY])) // set the 'cy' attribute to use the yScale() d[currentY]
     .attr("dx", d => xScale(d[currentX])) // set the 'cy' attribute to use the xScale() d[currentX]
     .attr("r", circleRadius); // set the 'r' attribute to be the circleRadius  }
}};

d3.csv("assets/data/data.csv").then(function(data) {
  // Visualize the data
  // data.forEach(function(data) {
  //   data.poverty = parseInt(data.poverty);
  //   data.age = parseInt(data.age);
  //   data.income = parseInt(data.income);
  // }); // call your visualize() function on the data

  visualize(data);
});
