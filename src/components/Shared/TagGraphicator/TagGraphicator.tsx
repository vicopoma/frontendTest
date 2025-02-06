import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import * as d3 from 'd3';
import './TagGraph.scss'
import { DATE_FORMATS } from '../../../constants/constants';

import { lower_bound } from '../../../helpers/Utils';

interface TagGraphicsProps {
  data: {
    x: number,
    y: string,
  }[],
  color: string
}

interface Zoom {
  k: number,
  x: number,
  y: number
}

export const TagGraphics = ({ data, color }: TagGraphicsProps) => {

  const d3chart = useRef(null);

  const handleMouseLeaveEvent = () => {
    const container = d3.select(d3chart.current);
    const tooltip = container.select('.tools').selectAll('g')
    tooltip.style("visibility", "hidden")
  }

  useEffect(() => {
    if (d3chart.current) {
      let zoom: Zoom = {k:1, x:0, y:0};
      const pointColor = color;
      const margin = {top: 20, right: 15, bottom: 10, left: 90};
      const outerWidth = 1050;
      const outerHeight = 600;
      const width = outerWidth - margin.left - margin.right;
      const height = outerHeight - margin.top - margin.bottom;

      let scaleX:any;
  
      const draw = (t: any) => {
        if(context) {
          scaleX = t.rescaleX(x);
          gxAxis.call(xAxis.scale(scaleX));
          context.clearRect(0, 0, width, height);
          context.translate(t.x, t.y);
          context.scale(t.k, t.k);

          for (const values of data) {
            const key = createUniqueKey();
            cache[key] = [values.x, values.y];
            drawPoint(x, y, [values.x, values.y]);
          }
        }
      }
      
      
      const zoom_function = d3.zoom<any, unknown>()
      .scaleExtent([1, Infinity])
      .translateExtent([[0,0], [width, height]])
      .extent([[0,0], [width, height]])
      .on('zoom', (event) => {
        if(context) {
          const t = event.transform;
          zoom = t;
          gyAxis.attr("transform", (d3.zoomIdentity.translate(0, t.y).scale(t.k) as any));
          gyAxis.selectAll("text")
            .attr("transform", (d3.zoomIdentity.scale(1/t.k) as any));
          
          context.save()
          draw(t);
          context.restore()
        }
      });
  
      const container = d3.select(d3chart.current);
      container.selectAll('#svg-axis').remove();
      container.selectAll('#canvas-graph').remove();
      container.selectAll('svg').remove();
      container.selectAll('canvas').remove();
      
      const svgChart = container.append('svg:svg')
      .attr('id', 'svg-axis')
      .attr('width', outerWidth)
      .attr('height', outerHeight)
      .attr('class', 'svg-plot')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
      
      const canvasChart = container.append('canvas')
      .attr('id', 'canvas-graph')
      .attr('width', width)
      .attr('height', height)
      .style('margin-left', margin.left + 'px')
      .style('margin-top', margin.top + 'px')
      .attr('class', 'canvas-plot')
      .call(zoom_function);
  
      const tooltip = container.select('.tools')
      .append("g")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background", "#013369")
      .style('color', 'white')
      .style('font-size', '11px')
      .style('padding', '5px')
      .text("a simple tooltip");
      
      let nextCol = 1;
      const cache: {[key: string]: any} = {}
      const createUniqueKey = () => {
        let ret = [];
        if(nextCol < 16777215) {
          ret.push(nextCol & 0xff); //R
          ret.push((nextCol & 0xff00) >> 8); //G
          ret.push((nextCol & 0xff0000) >> 16); //B
        }
        nextCol += 1;
        return  "rgb(" + ret.join(',') + ")";
      }
  
      const context = canvasChart.node()?.getContext('2d');
  
      const test: { key: string; count: number; }[] = [];
      data.forEach(dat => {
        test.push({ key: dat.y, count: data.filter(dat2 => dat2.y === dat.y).length });
      })
  
      test.sort((a, b) => a.count - b.count);

      const mnx = d3.min(data, datum => datum.x) ?? 0;
      const mxx = d3.max(data, datum => datum.x) ?? 0;
  
      const x = d3.scaleTime()
      .domain([mnx, mxx])
      .range([0, width])
      .nice();
  
      const y = d3.scaleBand()
      .range([0, height])
      .domain(test.map(te => te.key))
      .padding(1);
  
      const xAxis = d3.axisTop(x).tickSize(height).tickFormat(domainValue => {
        return moment(new Date(domainValue as number * 1000)).format('HH:mm')
      });
  
      const yAxis = d3.axisLeft(y).tickSize(0).tickFormat((domainValue, index) => {
        return domainValue
      });
  
      const gxAxis = svgChart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
  
      const gyAxis = svgChart.append('g')
      .call(yAxis);
  
      svgChart.append('text')
      .attr('x', `-${height/2}`)
      .attr('dy', '-3.5em')
      .attr('transform', 'rotate(-90)');
      
      svgChart.append('text')
      .attr('x', `${width/2}`)
      .attr('y', `${height + 40}`);
      
      const drawPoint = (scaleX: any, scaleY: any, point: any) => {
        if(context) {
          context.beginPath();
          context.fillStyle = pointColor
          const px = scaleX(point[0]);
          const py = scaleY(point[1]);
          context.arc(px, py, 1.2, 0, 2 * Math.PI, true);
          context.fill();
        }
      }
     
      draw(d3.zoomIdentity)
  
      const extraCanvas = container.append('canvas')
      .attr('width', width)
      .attr('height', height)
      .style('margin-left', margin.left + 'px')
      .style('margin-top', margin.top + 'px')
      .style('display', 'none');
  
      canvasChart.on('mousemove', (event) => {
        const exC = extraCanvas.node();
        const curContext = exC?.getContext('2d');
        if(curContext){
          curContext.clearRect(0,0, width, height);
          const xEvent = event.offsetX;
          const yEvent = event.offsetY;
          curContext.beginPath();
          curContext.arc(xEvent, yEvent, 1.2, 0, 2 * Math.PI, true);
          curContext.fill();
          if(context) {
            const col = context?.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            const rgbColor = d3.color(color)?.formatRgb();
            const pointColor = d3.rgb(col[0], col[1], col[2]).formatRgb();
            
            if(rgbColor === pointColor) {
              const xValues = lower_bound(mnx, mxx, (target) => {
                const value = scaleX(target);
                return event.offsetX <= value;
              });

              const yValues = lower_bound(0, test.length - 1, (target) => {
                const value = y(test[target].key) || 0;
                return (event.offsetY - zoom.y) / zoom.k <= value;
              })

              const dx = event.offsetX - scaleX(xValues.low);
              const dy1 = (event.offsetY - zoom.y) / zoom.k - (y(test[yValues.low].key) || 0);
              const dy2 = (event.offsetY - zoom.y) / zoom.k - (y(test[yValues.high].key) || 0);

              const dist = (x: number, y:number) => {
                return Math.sqrt(x * x + y * y);
              }

              let yTooltip;
              if(dist(dx, dy1) <= dist(dx, dy2)) {
                yTooltip = yValues.low;
              } else {
                yTooltip = yValues.high;
              }

              const yPosToolTip = event.offsetY + (5 * (1 / zoom.k));
              
              return tooltip.text(`${test[yTooltip]?.key} - ${moment(xValues.low * 1000).format(DATE_FORMATS.monthDayYearHourMin)}`)
                .style('visibility', 'visible')
                .style('left', scaleX(xValues.low) + 'px')
                .style('top', yPosToolTip + 'px');
            } else {
              return tooltip.style('visibility', 'hidden');
            }
          }
        }
      })
    }
  }, [data, color]);
  
  return (
    <div onMouseLeave={handleMouseLeaveEvent} ref={d3chart} id="d3-test" style={{ height: '600px', width: '1050px', background: 'white' }}>
      <div className="tools">
      </div>
    </div>
  )
}
