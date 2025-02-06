import React from 'react';
import './Badge.scss';

interface BadgeProps {
	children?: React.ReactNode,
	className?: string,
	style?: object,
}

export const Badge = ({children, className, style} : BadgeProps) => {
	return (
		<div className={`badge-equip ${className ?? ''}`} style={style}>
			{children}
		</div>
	)
}