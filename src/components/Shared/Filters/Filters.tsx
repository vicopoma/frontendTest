import React from 'react'
import { Col, Row } from 'antd';
import './Filters.scss'

interface Filter {
  display: React.ReactNode,
  show?: boolean
}

interface FiltersProps {
  leftOptions?: Array<Filter>,
  rightOptions?: Array<Filter>,
  className?: string
}

export const Filters = ({leftOptions, rightOptions}: FiltersProps) => {
	return (
		<Row align="middle" justify="space-between" gutter={[8, 0]} className="filters-layout">
		  <Col className="sections">
        { leftOptions?.map((option, index) => <Col key={index}> {option.show !== false && option.display}</Col>) }
      </Col>
      <Col className="sections">
        { rightOptions?.map((option, index) => <Col key={index}> {option.show !== false && option.display} </Col>) }
      </Col>
		</Row>
	)
}