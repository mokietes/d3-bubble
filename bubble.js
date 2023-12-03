const file = 'newData.json';
const width = window.innerWidth;
const height = window.innerHeight;
const colors = {
    "Unintentional injuries": '#FF5733', // Bright orange
    "All causes": '#FFC300', // Bright yellow
    "Alzheimer's disease": '#2A84D2', // Bright orange
    "Diabetes": '#FFE4B5', // Bright yellow
    "CLRD": '#F08080', // Bright orange
    "Stroke": '#2E9785', // Bright yellow
    "Suicide": '#7274C6', // Bright orange
    "Influenza and pneumonia": '#FFC300', // Bright yellow
    "Cancer": '#FFC300', // Bright yellow
    "Kidney disease": "#FF7F50",
    "Heart disease": "#E759A6"
};

const generateChart = data => {
    const bubble = data => d3.pack()
        .size([width, height])
        .padding(2)(d3.hierarchy({ children: data }).sum(d => d.Age_adjusted_Death_Rate));

    const svg = d3.select('#bubble-chart')
        .style('width', width)
        .style('height', height);
    
    const root = bubble(data);
    const tooltip = d3.select('.tooltip');

    const node = svg.selectAll()
        .data(root.children)
        .enter().append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    const circle = node.append('circle')
        .style('fill', d => colors[d.data.Cause_Name])
        .on('mouseover', function (e, d) {
            //tooltip.select('a').attr('src', d.data.Deaths);
            tooltip.select('a').text(d.data.Cause_Name);
            tooltip.select('span').attr('class', d.data.Cause_Name).text(d.data.Cause_Name);
            tooltip.style('visibility', 'visible');

            d3.select(this).style('stroke', '#222');
        })
        .on('mousemove', e => tooltip.style('top', `${e.pageY}px`)
                                     .style('left', `${e.pageX + 10}px`))
        .on('mouseout', function () {
            d3.select(this).style('stroke', 'none');
            return tooltip.style('visibility', 'hidden');
        })
        // .on('click', (e, d) => window.open(d.data.link));
    
    const label = node.append('text')
        .attr('dy', 2)
        .text(d => d.data.Cause_Name);

    node.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    circle.transition()
        .ease(d3.easeExpInOut)
        .duration(1000)
        .attr('r', d => d.r);
    
    label.transition()
        .delay(700)
        .ease(d3.easeExpInOut)
        .duration(1000)
        .style('opacity', 1)
};


// Filter the data based on the selected year
// const filterDataByYear = (data, selectedYear) => {
//     return data.filter(d => d.Year === selectedYear );
// };

(async () => {
    const data = await d3.json(file).then(data => data.filter(d => d.Year === 2000 && d.State === "United States" && d.Cause_Name !== "All causes" ));
    // const selectedYear = '2016'; // Replace with the desired year
    // const filteredData = filterDataByYear(data, selectedYear);
    generateChart(data);
})();
