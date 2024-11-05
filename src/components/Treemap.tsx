import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';
import TreemapBar from './TreemapBar';

interface DataItem {
  name: string;
  value: number;
  subvalues: number[];
  category: string;
  year: string;
}

const data: DataItem[] = [
  {
    name: 'A1',
    value: 500,
    subvalues: [200, 150, 100, 50],
    category: 'Group A',
    year: '2023',
  },
  {
    name: 'A2',
    value: 400,
    subvalues: [150, 150, 100],
    category: 'Group A',
    year: '2023',
  },
  {
    name: 'A3',
    value: 300,
    subvalues: [150, 150],
    category: 'Group A',
    year: '2023',
  },
  {
    name: 'B1',
    value: 400,
    subvalues: [200, 120, 80],
    category: 'Group B',
    year: '2022',
  },
  {
    name: 'B2',
    value: 300,
    subvalues: [150, 150],
    category: 'Group B',
    year: '2022',
  },
  {
    name: 'C1',
    value: 300,
    subvalues: [150, 100, 50],
    category: 'Group C',
    year: '2021',
  },
  {
    name: 'C2',
    value: 200,
    subvalues: [100, 100],
    category: 'Group C',
    year: '2021',
  },
];

const Treemap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 20, bottom: 20, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Group data by year
    const groupedData = d3.group(data, (d) => d.year);

    // Calculate total value for each year
    const maxTotal = Math.max(
      ...Array.from(groupedData.values(), (group) =>
        d3.sum(group, (d) => d.value)
      )
    );

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, maxTotal])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(Array.from(groupedData.keys()))
      .range([0, innerHeight])
      .padding(0.4);

    // Vibrant color scales for each category
    const colorScales = {
      'Group A': d3
        .scaleSequential()
        .domain([0, 4])
        .interpolator((t) => d3.interpolateRgb('#FF4D4D', '#FF9999')(t)),
      'Group B': d3
        .scaleSequential()
        .domain([0, 4])
        .interpolator((t) => d3.interpolateRgb('#4D7FFF', '#99B8FF')(t)),
      'Group C': d3
        .scaleSequential()
        .domain([0, 4])
        .interpolator((t) => d3.interpolateRgb('#50C878', '#90EE90')(t)),
    };

    // Create container
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    // Create treemap bars for each year
    Array.from(groupedData.entries()).forEach(([year, yearData]) => {
      const yearGroup = g
        .append('g')
        .attr('transform', `translate(0,${yScale(year)})`);

      let xOffset = 0;

      // Sort data by value in descending order
      const sortedData = [...yearData].sort((a, b) => b.value - a.value);

      sortedData.forEach((d) => {
        const barWidth = xScale(d.value);
        const barHeight = yScale.bandwidth();

        const foreignObject = yearGroup
          .append('foreignObject')
          .attr('x', xOffset)
          .attr('y', 0)
          .attr('width', barWidth)
          .attr('height', barHeight);

        const div = document.createElement('div');
        foreignObject.node()?.appendChild(div);
        
        const root = createRoot(div);
        root.render(
          <TreemapBar
            key={d.name}
            data={d}
            width={barWidth}
            height={barHeight}
            colorScale={colorScales[d.category as keyof typeof colorScales]}
            xOffset={xOffset}
          />
        );

        xOffset += barWidth;
      });
    });

    // Add x-axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat((d) => d.toString())
      )
      .attr('font-size', '12px');
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="mx-auto"></svg>
    </div>
  );
};

export default Treemap;