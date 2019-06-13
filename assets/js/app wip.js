
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
//function makeResponsive() {

var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(AllData, chosenXAxis) {
    console.log("into function xScale xAxis" + chosenXAxis ); 
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(AllData, d => d[chosenXAxis]) * 0.8,
      d3.max(AllData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  console.log("into function xScale xAxis  1 :" + xLinearScale );
  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(AllData, chosenYAxis) {
 console.log("into function yScale xAxis" + chosenYAxis ); 
    // create scales
  var yLinearScale = d3.scaleLinear()
  
   // var yLinearScale = d3.scaleLinear()
 //  .domain([0, d3.max(AllData, chosenYAxis)])
  // .range([height, 0]);
    .domain([d3.min(AllData, d => d[chosenYAxis]) * 0.8,
      d3.max(AllData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);
  console.log("into function yScale yAxis  1 scale " + yLinearScale ); 
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//function renderCirclesY(circlesGroupY, newYScale, chosenYaxis) {
//
//  circlesGroup.transition()
//    .duration(1000)
//    .attr("cy", d => newYScale(d[chosenYAxis]));
//
//  return circlesGroupY;
//}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis,chosenXAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty (%)";
  }
  else if (chosenXAxis === "obesity"){
    var xlabel = "Obese (%) ";
  }
  else {
    var xlabel = "Age (Median) ";
  }
    
  if (chosenYAxis === "healthcare") {
    var ylabel = "Lack of HealthCare (%)";
  }
  else if (chosenYAxis === "smokes"){
    var ylabel = "Smokes (%) ";
  }
  else {
    var ylabel = "House Hold Income (Median) ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    //.style('z-index','999999999')
  //  .offset([-10, 0])
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", toolTip.show)
                .on("mouseout", toolTip.hide);
//  circlesGroup.on("mouseover", function(data) {
//    toolTip.show(data);
//  })
//    // onmouseout event
//    .on("mouseout", function(data, index) {
//      toolTip.hide(data);
//    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
// d3.csv("data.csv", function(err, AllData) {

d3.csv("data.csv").then(function (AllData) {
  console.log("read add data from csv file...1 ");
//  if (err){ 
//    console.log("read data failed Err = " + err);   
//    throw err ;}
//   
//   parse data
    console.log("read add data successful " + AllData);
  AllData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.income = +data.income;   
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(AllData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(AllData, chosenYAxis);
 // var yLinearScale = d3.scaleLinear()
 //   .domain([0, d3.max(AllData, chosenYAxis)])
 //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
//    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);
    
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(AllData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
//    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5")
//    .append("text")
  //  .text(node => node.label)
//    .attr("dx", d => xLinearScale(d[chosenXAxis]))
//    .attr("dy", d => yLinearScale(d.healthcare))
//    .text(d.abbr)

  // Create group for   x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("xvalue", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var obesityLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("xvalue", "obesity") // value to grab for evenobest listener
    .classed("inactive", true)
    .text("Obesity Index # ");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("xvalue", "age") // value to grab for evenobest listener
    .classed("inactive", true)
    .text("Age Median ");

  // append y axis
var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width}, ${height})`);
    
var healthcareLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", height/2 )
    .attr("y", 0 - width - 30 )
    .attr("yvalue", "healthcare")
    .classed("active", true)
    .text("Lack of Healthcare (%)");
    
var smokesLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", height/2 )
    .attr("y", 0 - width - 50 )
    .attr("yvalue", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

var incomeLabel = labelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", height/2 )
    .attr("y", 0 - width - 70 )
    .attr("yvalue", "income")
    .classed("inactive", true)
    .text("House Hold Income (Median)");

    // updateToolTip function above csv import

    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
       //action when XAxix value is selected
      var xvalue = d3.select(this).attr("xvalue");
      var yvalue = d3.select(this).attr("yvalue");
      console.log("after click xvalue : "+ xvalue);
      console.log("after click chosenXAxis : "+ chosenYAxis);
      console.log("after click yvalue : "+ xvalue);
      console.log("after click chosenyAxis : "+ chosenYAxis);
      
      if (xvalue !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = xvalue;

         console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(AllData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesX(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age"){
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
            }   
        else if (chosenXAxis === "poverty"){
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
      
      //action when YAxix value is selected
      
      if (yvalue !== chosenYAxis) {

        // replaces chosenYaxis with value
        chosenYAxis = yvalue;

         console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(AllData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "healthcare") {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            }   
        else if (chosenYAxis === "income"){
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
    
    

// // y axis labels event listener
//  chartGroup.selectAll("text")
//    .on("click", function() {
//      // get value of selection
//      var yvalue = d3.select(this).attr("yvalue");
//      if (yvalue !== chosenYAxis) {
//
//        // replaces chosenYaxis with value
//        chosenYAxis = yvalue;
//
//         console.log(chosenYAxis)
//
//        // functions here found above csv import
//        // updates Y scale for new data
//        yLinearScale = yScale(AllData, chosenYAxis);
//
//        // updates Y axis with transition
//        yAxis = renderAxesY(yLinearScale, yAxis);
//
//        // updates circles with new Y values
//        circlesGroup = renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis);
//
//        // updates tooltips with new info
//        chartGroup = updateToolTip(chosenYAxis, circlesGroup);
//
//        // changes classes to change bold text
//        if (chosenYAxis === "healthcare") {
//          healthcareLabel
//            .classed("active", true)
//            .classed("inactive", false);
//          smokesLabel
//            .classed("active", false)
//            .classed("inactive", true);
//          incomeLabel
//            .classed("active", false)
//            .classed("inactive", true);
//        }
//        else if (chosenXAxis === "smokes"){
//          healthcareLabel
//            .classed("active", true)
//            .classed("inactive", false);
//          smokesLabel
//            .classed("active", false)
//            .classed("inactive", true);
//          incomeLabel
//            .classed("active", true)
//            .classed("inactive", false);
//            }
//        else if (chosenXAxis === "poverty"){
//          healthcareLabel
//            .classed("active", false)
//            .classed("inactive", true);
//          smokesLabel
//            .classed("active", true)
//            .classed("inactive", false);
//          incomeLabel
//            .classed("active", false)
//            .classed("inactive", true);
//        }
//      }
//    });
//    
    
    
    
});

//}

// When the browser loads, makeResponsive() is called.
//makeResponsive();

// When the browser window is resized, makeResponsive() is called.
//d3.select(window).on("resize", makeResponsive);
