import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { useHealthDeviceFunctions } from '../../../hook/customHooks/backdoor';
import moment from 'moment';
import { DATE_FORMATS, DAY_IN_HOURS } from '../../../constants/constants';

export const HealthDeviceGraph = (
  { startDate, endDate, siteName, showLoader } : 
  { startDate: string, endDate: string, siteName: string, showLoader: Function }) => {
  const { healthDeviceStatus, loadHealthDeviceStatus } = useHealthDeviceFunctions();
  
  const dayDiff = moment(endDate).diff(moment(startDate), 'days');
  const normalizedStartDate = dayDiff < 22 ? moment(startDate) : moment(endDate).subtract(22, 'days');
  const paramBlocks = Math.max(
    Math.ceil(moment(endDate).diff(moment(normalizedStartDate), 'days') * DAY_IN_HOURS / 100),
    1,
  );

  useEffect(() => {
    showLoader(true);
    loadHealthDeviceStatus(
      moment(normalizedStartDate).format(DATE_FORMATS.yearMonthDayHourMin), 
      moment(endDate).format(DATE_FORMATS.yearMonthDayHourMin), 
      siteName, 
      paramBlocks,
      () => showLoader(false),
      () => showLoader(false),
    );
  }, [startDate, endDate, paramBlocks, showLoader])

  useEffect(() => {
    d3.selectAll('#graph').select('svg').remove();
    if (Object.keys(healthDeviceStatus).length > 0) {
    
    const width = 680;
    const height = 260;
    const margin = { top: 50, right: 30, bottom: 40, left: 120 };
    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .attr('class', 'container-graph')
      .append("g");

    svg.append("text")
      .text('Antennas')
      .attr('x', 54)
      .attr('y', 45)
      .style('font-weight', 600)
      .style('font-size', 15)
      .attr('class', 'graph-title')
      .attr('transform', 'translate(-15, 0)');

    const yAxisItems = Object.keys(healthDeviceStatus);

    const y = d3
      .scaleBand()
      .domain([...yAxisItems])
      .range([height + margin.top, margin.top]);

    const yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .attr('color', '#707070')
      .attr('class', 'statistics-text');

    yAxis.selectAll('.tick text')
      .attr('font-weight', '500')
      .attr('font-size', '13')
      .attr('color', '#707070')
      .attr('font-family', 'Roboto Condensed, sans-serif')
      .attr('transform', 'translate(-15, 0)');
    
    const xx = d3.scaleTime()
      .domain([moment(normalizedStartDate).valueOf(), moment(endDate).valueOf()])    
      .range([margin.left, width + margin.left]);
    
    const xAxis = svg.append('g')
      .attr('transform', `translate(0, ${height + margin.top})`)
      .attr('color', '#707070')
      .call(d3.axisBottom(xx))

    xAxis.selectAll('.tick text')
      .attr('font-weight', '400')
      .attr('font-size', '13')
      .attr('color', '#656565')
      .attr('font-family', 'Roboto Condensed, sans-serif')
      .attr('transform', 'translate(0, 12)');

    const Tooltip = d3.select("#graph")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style('width', '240px')
      // .style("background-color", "white")
      //.style("border", "solid")
      //.style("border-width", "2px")
      //.style("border-radius", "5px")
      //.style("padding", "5px")

    const mouseOver = (d: any) => {
      Tooltip
        .style("opacity", 1)
        
      /*d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)*/
    }
    const mouseMove = (d: any) => {
      Tooltip
        .html(() => {
          return `<div class="ant-popover ant-popover-placement-right tooltip-health">
          <div class="ant-popover-arrow arrow" style="position: absolute; left: 5px; top: 47%;">
          </div>
          <div class="ant-popover-content content">
          <div class="ant-popover-inner inner" role="tooltip">
            <div class="ant-popover-title">
            ${moment(d.startTime).format(DATE_FORMATS.yearMonthDayHourMin)} - ${moment(d.endTime).format(DATE_FORMATS.hourMin)}
            </div>
            <div class="ant-popover-inner-content">
            ${d.warnings > 0 ? `<div>
              <img src="/images/device-status/warning.svg" alt="" />
              Warnings: ${d.warnings}
            </div>` : ''}
            ${d.errors > 0 ? `<div>
              <img src="/images/device-status/error.svg" alt="" />
              Errors: ${d.errors}
            </div>` : ''}
            ${d.stoppeds > 0 ? `<div>
              <img src="/images/device-status/stop.svg" alt="" />
              Stoppeds: ${d.stoppeds}
            </div>` : ''}
            ${d.rebootings > 0 ? `<div>
              <img src="/images/device-status/rebbot.svg" alt="" />  
              Rebootings: ${d.rebootings}
            </div>` : ''}
            </div>
          </div>
          </div>
          <div>`
        })
        .style('z-index', '0')
        .style('position', 'absolute')
        .style('left', `${xx(moment(d.startTime).valueOf()) - margin.left + 158}px`)
        .style('top', `${Math.ceil(Number(y(d.ipAddress)) + y.bandwidth() / 8 + margin.top)}px`)

      /*Tooltip
        .style("stroke", "black")
        .style("opacity", 1)*/
    }
    const mouseLeave = (d: any) => {
      Tooltip
        .style("opacity", 0)
        .style('left', '0px')
        .style('top', '0px')
        .style('z-index', '-2')
      /*d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)*/
    }

    const blockHeight = 50;

    svg.append('g')
      .selectAll('g')
      .data(xx.ticks())
      .enter()
      .append('line')
      .attr('x1', d => xx(d))
      .attr('y1', margin.top)
      .attr('x2', d => xx(d))
      .attr('y2', height + margin.top)
      .style("stroke", "gray")
      .style("stroke-dasharray", ("3, 3"))
      .style("stroke-width", 1)

    svg.append('g')
      .selectAll('g')
      .data(y.domain().slice(0, y.domain().length - 1))
      .enter()
      .append('line')
      .attr('x1', margin.left)
      .attr('y1', (a) => Number(y(a)))
      .attr('x2', width + margin.left)
      .attr('y2', (a) => Number(y(a)))
      .style("stroke", "gray")
      .style("stroke-dasharray", ("3, 3"))
      .style("stroke-width", 1);

    const dataRender = svg.append('g')
    yAxisItems.forEach((antenna: string) => {
      healthDeviceStatus[antenna].forEach((dataTime: any) => {
        const { total } = dataTime;
        if (total > 0 && !!antenna) {
          const blockWidth = xx(moment(dataTime.endTime).valueOf()) - xx(moment(dataTime.startTime).valueOf());
          const warnings = dataTime.warnings;
          const errors = dataTime.errors;
          const stoppeds = dataTime.stoppeds;
          const rebootings = dataTime.rebootings;
          const itemRender = dataRender.append('g');
          itemRender
            .on('mouseover', mouseOver)
            .on('mouseleave', mouseLeave)
            .on('mousemove', () => mouseMove(dataTime))
          if (warnings > 0) {
            itemRender
              .append('rect')
              .attr('x', xx(moment(dataTime.startTime).valueOf()))
              .attr('y', Number(y(antenna)) + y.bandwidth() / 2 - blockHeight / 2)
              .attr('width', blockWidth - 1)
              .attr('height', blockHeight / 4)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', '#FCB81A');  
          }
          if (errors > 0) {
            itemRender
              .append('rect')
              .attr('x', xx(moment(dataTime.startTime).valueOf()))
              .attr('y', Number(y(antenna)) + y.bandwidth() / 2 - blockHeight / 4)
              .attr('width', blockWidth - 1)
              .attr('height', blockHeight / 4)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', '#FF3D00');  
          }
          if (stoppeds > 0) {
            itemRender
              .append('rect')
              .attr('x', xx(moment(dataTime.startTime).valueOf()))
              .attr('y', Number(y(antenna)) + y.bandwidth() / 2)
              .attr('width', blockWidth - 1)
              .attr('height', blockHeight / 4)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', '#40454A');  
          }
          if (rebootings > 0) {
            itemRender
              .append('rect')
              .attr('x', xx(moment(dataTime.startTime).valueOf()))
              .attr('y', Number(y(antenna)) + y.bandwidth() / 2 + blockHeight / 4)
              .attr('width', blockWidth - 1)
              .attr('height', blockHeight / 4)
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', '#046BDA');  
          }
        }
      })
    })
    }
  }, [endDate, healthDeviceStatus, normalizedStartDate])

  return (
    <div>
      <div id="graph" className='scroll-dashboard' style={{ overflowY: 'auto', backgroundColor: '#FFFFFF', marginTop: '20px' }} />
    </div>
  )
}