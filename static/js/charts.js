function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
      var samplesArray = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
      var sampleObject = samplesArray.filter(object => object.id == sample);
      console.log(sampleObject)

    // D3; Create a variable that filters the metadata array for the object with the desired sample number.
      var filterMetadata = data.metadata.filter(object => object.id == sample);
      console.log(filterMetadata);

    // Create a variable that holds the first sample in the array.
      var sampleResult = sampleObject[0];
      console.log(sampleResult);

    // D3; Create a variable that holds the first sample in the metadata array.
      var sampleMetadata = filterMetadata[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIDs = sampleResult.otu_ids;
      console.log(otuIDs);

      var otuLabels = sampleResult.otu_labels;
      console.log(otuLabels);

      var sampleValues = sampleResult.sample_values;
      console.log(sampleValues);
    
    // D3; Create a variable that holds the washing frequency.
      var washingFrequency = parseFloat(sampleMetadata.wfreq);
      console.log(washingFrequency);

    // Create the yticks for the bar chart.

    var yticks = otuIDs.slice(0,10).map(id =>`OTU ${id}`).reverse();
    console.log(yticks);

    // Create the trace for the bar chart. 
    var barData = [
      {
        x: sampleValues.slice(0, 10).reverse(),
        y: yticks,
        text: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    }
    ];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>"
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
var bubbleData = [
  {
    x: otuIDs,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      color: otuIDs,
      size: sampleValues,
      text: otuLabels
    }
  }
];

// Create the layout for the bubble chart.
var bubbleLayout = {
  title: "<b>Bacteria Cultures Per Sample</b>",
  hovermode: "closest",
  xaxis: {title: otuIDs}
};

// Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout);

// Gauge Meter
// Create the trace for the gauge chart.
var gaugeData = [
  {
    domain: {x: [0, 1], y: [0, 1]},
    value: washingFrequency,
    type: "indicator",
    mode: "gauge+ number",
    title: {text: "<b>Belly Bytton Washing Frequency</b><br>Scrubs per Week"},
    gauge: {
      axis: { range: [null, 10] },
      bar: {color: "black"},
      steps: [
        {range: [0, 2], color: "red"},
        {range: [2, 4], color: "orange"},
        {range: [4, 6], color: "yellow"},
        {range: [6, 8], color: "lime"},
        {range: [8, 10], color: "green"}
      ]
    }
  }
];

// Create the layout for the gauge chart.
var gaugeLayout = { 
  width: 600, 
  height: 500, 
  margin: { t: 0, b: 0 }
};

// Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });
}

