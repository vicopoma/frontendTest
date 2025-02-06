import React, { useEffect, useRef, useState } from 'react';
import { Col, Progress, Row } from 'antd';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3 from 'd3';
import { useDashboardFunction } from '../../../hook/customHooks/dashboard';
import { useAccountState } from '../../../hook/hooks/account';
import Image from '../../Shared/Image/Image';
import { DASHBOARD_IDS, EQUIPMENT_DASBOARD_IDS } from '../../../constants/constants';
import { EquipmentType } from '../../../store/types/equipmentType';
import { EquipmentElement } from '../../../store/types/dashboard';

export const Dashboard = () => {
  const [trigger, setTrigger] = useState<number>(0);
  const [resizeTrigger, setResizeTrigger] = useState<number>(0);
  const imgRef = useRef(null);
  const { account } = useAccountState();
  const { equipmentTypeDTOList } = account;
  const { values, getDashboardInformation } = useDashboardFunction();
  const [equipmentTypeId, setEquipmentTypeId] = useState<string>('');

  useEffect(() => {
    window.addEventListener('resize', () => setResizeTrigger(prevState => prevState + 1));
    return window.removeEventListener('resize', () => {});
  }, []);

  useEffect(() => {
    if (equipmentTypeId) {
      getDashboardInformation(equipmentTypeId)
    }
  }, [getDashboardInformation, equipmentTypeId]);

  useEffect(() => {
    if (!!account?.equipmentTypeDTOList && account?.equipmentTypeDTOList.length) {
      setEquipmentTypeId(account?.equipmentTypeDTOList?.[0]?.id);
    }
  }, [account?.equipmentTypeDTOList]);

  const formatTitle = (title: string) => {
    return title.replace('<', '');
  }

  useEffect(() => {
    const box: any = d3.select('#graph-container').node();
    const _width = box?.getBoundingClientRect().width - 70;
    const _height = box?.getBoundingClientRect().height - 85;
    d3.selectAll('#graph').select('svg').remove();
    d3.selectAll('.statistics-tooltip').remove();
    const data2 = values?.equipmentModelYearList?.slice(Math.max(values?.equipmentModelYearList?.length - 6, 0)); 
    const data1 = values?.equipmentModelYearList.length > 6 ? values?.equipmentModelYearList?.slice(0, values?.equipmentModelYearList.length - 6) : [];
    const year = data1?.[data1?.length - 1]?.title;
    let total = 0;
    data1.forEach(item => total = total + item.total);
    let data: EquipmentElement[] = [];
    if(data1.length > 0) {
      data = [{ key: '', title: `<${year}`, total: total}, ...data2];
    } else {
      data = data2;
    }
    const margin = { top: 20, right: 0, bottom: 30, left: 40 },
      height = _height - margin.top - margin.bottom;
    const width2 = _width;
    
    const y = d3Scale.scaleLinear().rangeRound([height, 0]);
    const x = d3Scale.scaleBand().rangeRound([0, width2 - margin.left - margin.right]).padding(0.4);
    x.domain(data.map((d) => (d.title)));
    const value = d3Array.max(data, (d) => (d.total));
    const maxValue = d3.max([2, value ? value : 2])|| 2;
    y.domain([0, maxValue + (maxValue * 0.2)]);

    const svg = d3.select("#graph")
      .append("svg")
      .attr("width", width2)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const mouseover = (event: any, d: any) => {
      const text = d3.select('#text-bar-' + formatTitle(d.title));
      text.style('visibility', 'visible');
      const bar = d3.select('#statistics-bar-' + formatTitle(d.title));
      bar.style('fill', 'var(--blue-antd)');
      const triangule = d3.select('#triangule-' + formatTitle(d.title));
      triangule.style('visibility', 'visible');
    };

    const mouseleave = (event: any, d: any) => {
      const text = d3.select('#text-bar-' + formatTitle(d.title))
      text.style('visibility', 'hidden');
      const bar = d3.select('#statistics-bar-' + formatTitle(d.title));
      bar.style('fill', '#479ebe');
      const triangule = d3.select('#triangule-' + formatTitle(d.title))
      triangule.style('visibility', 'hidden');
    };


    svg.selectAll('.bar-transparent')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar-style-transparent')
      .attr('x', (d) => (Number)(x(d.title)))
      .attr('y', y(maxValue * 0.3))
      .attr('width', x.bandwidth())
      .attr('height', (d) => Math.max(0, height - y(maxValue * 0.3)))
      .attr('fill', 'transparent')
      .on('mouseover', mouseover)
      .on('mouseout', mouseleave);

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar-style')
      .attr('x', (d) => (Number)(x(d.title)))
      .attr('y', (d) => y(d.total))
      .attr('width', x.bandwidth())
      .attr('height', (d) => Math.max(0, height - y(d.total)))
      .attr('class', 'statistics-bar')
      .attr('id', (d) => 'statistics-bar-' + formatTitle(d.title))
      .on('mouseover', mouseover)
      .on('mouseout', mouseleave)
      .exit()
      .data(data)
      .enter().append('g')
      .attr('x', (d) => (Number)(x(d.title)))
      .attr('y', (d) => y(d.total) - 20)
      .attr('width', x.bandwidth())
      .attr('height', 10)
      .append('text')
      .attr('x', (d) => (Number)(x(d.title)) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.total) - 13.5)
      .style('text-anchor', 'middle')
      .style('dominant-baseline', 'middle')
      .style('font-size', '0.7rem')
      .style('font-weight', '600')
      .style('fill', 'var(--blue-antd)')
      .text((d) => d.total)
      .attr('id', (d) => 'text-bar-' + formatTitle(d.title))
      .style('visibility', 'hidden')
      .attr('class', 'text-rect')
      .exit()
      .data(data)
      .enter().append('path')
      .attr('d', (d) => {
        return `M ${(Number)(x(d.title)) + x.bandwidth() / 2} ${y(d.total) - 2} l -5 -5 l 10 0 z`
      })
      .style('stroke', 'var(--blue-antd)')
      .style('fill', 'var(--blue-antd)')
      .attr('id', (d) => 'triangule-' + formatTitle(d.title))
      .style('visibility', 'hidden');

    const xAxis = svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'statistics-number')
      .call(d3Axis.axisBottom(x));

    xAxis.selectAll('.tick text')
      .attr('font-weight', '800')
      .attr('font-size', '10')
      .attr('color', '#000');

    const yAxis = svg.append('g')
      .call(d3Axis.axisLeft(y).ticks(3).tickFormat(d3.format('.1s')))
      .attr('class', 'statistics-text');

    yAxis.selectAll('.tick text')
      .attr('font-weight', '800')
      .attr('font-size', '10')
      .attr('color', '#000');

  }, [resizeTrigger, values.equipmentModelYearList]);

  const draw = () => {
    if (imgRef.current) {
      d3.select(imgRef.current).selectAll('svg').remove();
      d3.xml('/images/player-dash.svg')
        .then(data => {
          const container: any = d3.select(imgRef.current).node();
          container.append(data.documentElement);
        }).finally(() => {
          setTrigger(prevState => prevState + 1);
        })
    }
  }

  useEffect(() => {
    draw();
  }, [imgRef]);

  useEffect(() => {
    const onClick = (id: string) => {
      const cleanPlayerImage = EQUIPMENT_DASBOARD_IDS.filter(element => element !== id);
      cleanPlayerImage.forEach(element => {
        const equipmentType = d3.selectAll(element);
        equipmentType.style('opacity', 0);
        const equipmentTypeLine = d3.selectAll(element + '_description');
        equipmentTypeLine.style('visibility', 'hidden');
      })
      const equipmentType = d3.selectAll(id);
      equipmentType
        .style('stroke', '#029261')
        .style("stroke-dasharray", ("7, 9"))
        .style('stroke-linecap', 'round')
        .style('stroke-opacity', 1)
        .style('stroke-width', '2px')
        .style('fill', 'var(--blue-antd)')
        .style('fill-opacity', 0.2)
        .style('opacity', 1);
      const equipmentTypeLine = d3.selectAll(id + '_description');
      equipmentTypeLine
        .style('visibility', 'visible');

      // the nflId cannot be modified, so it is always 1 for helmet, 2 for shoulder pad and 3 for cleat
      let equipmentTypeSelect: EquipmentType[] = [];
      switch (id) {
        case DASHBOARD_IDS.HELMET:
          equipmentTypeSelect = equipmentTypeDTOList.filter(equipmentType => equipmentType.nflId === '1');
          break;
        case DASHBOARD_IDS.SHOULDER_PAD:
          equipmentTypeSelect = equipmentTypeDTOList.filter(equipmentType => equipmentType.nflId === '2');
          break;
        case DASHBOARD_IDS.CLEAT:
          equipmentTypeSelect = equipmentTypeDTOList.filter(equipmentType => equipmentType.nflId === '3');
          break;
        default:
          break;
      }
      if (equipmentTypeSelect.length) {
        setEquipmentTypeId(equipmentTypeSelect[0].id);
      }
    }

    if (imgRef.current) {
      const svg = d3.select(imgRef.current).select('svg');
      if (svg) {
        let sw = true;
        const hasHelmet = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '1');
        const hasShoulderPad = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '2');
        const hasCleat = equipmentTypeDTOList.some(equipmentTypeElement => equipmentTypeElement.nflId === '3');
        
        if(!hasHelmet) {
          svg.select(DASHBOARD_IDS.HELMET).remove();
        }
        if(!hasShoulderPad) {
          svg.select(DASHBOARD_IDS.SHOULDER_PAD).remove();
        }
        if(!hasCleat) {
          svg.selectAll(DASHBOARD_IDS.CLEAT).remove();
        }

        equipmentTypeDTOList.forEach(equipmentTypeElement => {
          // the nflId cannot be modified, so it is always 1 for helmet, 2 for shoulder pad and 3 for cleat
          let equipmentType;
          let equipmentTypeLine;
          switch (equipmentTypeElement.nflId) {
            case '1':
              equipmentType = svg.select(DASHBOARD_IDS.HELMET);
              equipmentType.on('click', () => onClick(DASHBOARD_IDS.HELMET))
              equipmentTypeLine = d3.selectAll(DASHBOARD_IDS.HELMET + '_description');
              equipmentTypeLine
                .style('visibility', 'hidden');
              break;
            case '2':
              equipmentType = svg.select(DASHBOARD_IDS.SHOULDER_PAD);
              equipmentType.on('click', () => onClick(DASHBOARD_IDS.SHOULDER_PAD))
              equipmentTypeLine = d3.selectAll(DASHBOARD_IDS.SHOULDER_PAD + '_description');
              equipmentTypeLine
                .style('visibility', 'hidden');
              break;
            case '3':
              equipmentType = svg.selectAll(DASHBOARD_IDS.CLEAT);
              equipmentType.on('click', () => onClick(DASHBOARD_IDS.CLEAT))
              equipmentTypeLine = d3.selectAll(DASHBOARD_IDS.CLEAT + '_description');
              equipmentTypeLine
                .style('visibility', 'hidden');
              break;

            default:
              break;
          }
          if (!!equipmentType && !!equipmentTypeLine) {
            if (sw) {
              equipmentType
                .style('stroke', '#029261')
                .style("stroke-dasharray", ("7, 9"))
                .style('stroke-linecap', 'round')
                .style('stroke-opacity', 1)
                .style('stroke-width', '2px')
                .style('fill', 'var(--blue-antd)')
                .style('fill-opacity', 0.2)
                .style('opacity', 1)
                .style('cursor', 'pointer');
              equipmentTypeLine
                .style('visibility', 'visible');
              sw = false;
            } else {
              equipmentType
                .style('opacity', 0)
                .style('cursor', 'pointer');
            }
          }
        })
      }
    }
  }, [equipmentTypeDTOList, trigger]);


  return <div className='dashboard back_login-dash'>
    <img className="back_login_img" src="images/nfl-logoback-login.svg" alt="wallpaper login" />
    <div className='dashboard-card'>
      <Row className='height-ds'>
        <Col xs={24} sm={24} md={12} lg={10} xl={8} className='height-ds'>
          <div className='dash-player'>
            <div id="graphic" ref={imgRef} style={{ width: '70%' }} />
            <div className='dash-player-head'>
              <img className='bg-player-head' src="images/oem-head-dash.svg" alt="" />
              <Image
                className={'oems-logo'}
                key={account.nameManufacturer}
                src={`/images/manufacturers/logos/${account.nameManufacturer?.toLowerCase().replaceAll(' ', '-')}.svg`}
                srcDefault={'/images/manufacturers/logos/oem-default.svg'} alt="logo" />
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={12} lg={14} xl={16} className='height-ds'>
          <div className='dash-data'>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <div className='dash-head-tyequip'>
                  <div className='equiptype-icon-dash'>
                    <img
                      src={values.equipmentTypeName ? `images/equipmentType/${values.equipmentTypeName?.toLowerCase()}.svg` : "images/equipmentType/shoulder pads.svg"}
                      alt="" />
                    <h2>{values.equipmentTypeName}</h2></div>
                  <span style={{ color: '#1DAB35' }}>{values.totalEquipment}</span>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <div className='dash-head-tyequip'>
                  <h3>Equipment Not Assigned</h3>
                  <span style={{ color: '#FF9200' }}>{values.totalEquipmentUnassigned}</span>
                </div>
              </Col>
            </Row>
            <Row gutter={[0, 16]} style={{ height: 'inherit' }}>
              <Col xs={24} sm={24} md={24} lg={24} xl={12} className='height-ds'>
                <div className='dash-data-model model-list' style={{ overflowY: 'hidden' }}>
                  <div className='data-head-dash'><img src="images/model-icon-dash.svg" alt="" /><h3>By Model</h3></div>
                  <Row className='scroll-dashboard' style={{ overflowY: 'auto', maxHeight: '85%' }}>
                    {values.equipmentModelList.map(model => {
                      return <>
                        <Col span={24} className="text-model">{model.title}</Col>
                        <Col span={23}>
                          <Progress
                            percent={model.total / values.totalEquipment * 100}
                            size="small"
                            strokeColor={"#1DAB35"}
                            format={() => `${model.total}`}
                            className='progress-bar-text'
                          />
                        </Col>
                      </>
                    })}
                  </Row>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={12} className='height-ds'>
                <div className='dash-data-model height-ds' style={{ overflowY: 'hidden'}}>
                  <div className='data-head-dash'><img src="images/team-icon-02.svg" alt="" /><h3>By Team</h3></div>
                  <div className='scroll-dashboard' style={{ maxHeight: '67%', overflowY: 'auto' }}>
                    {values.equipmentTeamList.map(team => {
                      return <Row className="team-bar">
                        <Col style={{ paddingLeft: '20px' }} span={6}><img src={`/images/teams/logos/${team.title}.svg`} width="30px" alt="" /></Col>
                        <Col span={14}>{team.title}</Col>
                        <Col span={4} className="color-text">{team.total}</Col>
                      </Row>
                    })}
                  </div>

                </div>
                <div className='dash-data-model' id="graph-container" >
                  <div className='data-head-dash'><img src="images/model-year-icon.svg" alt="" /><h3>Model Year</h3>(Last 7 years)</div>
                  <div id="graph" className='scroll-dashboard' style={{ overflowY: 'auto' }}></div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  </div>
}