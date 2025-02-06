import React from 'react';
import {Tabs} from 'antd';
import { Layout } from 'antd/es';
import { ScanByTeams } from './ScansByTeams/ScanByTeams';
import { ScanByVenue } from './ScanByVenue/ScanByVenue';
import { useLocation } from 'react-router-dom';
import { history } from '../../store/reducers';
import { ROUTES } from '../../settings/routes';
import { ManufacturerAndModelProvider } from '../../context/manufacturerAndModelContext';

export const ScanDistribution = () => {
  const { pathname } = useLocation();
	const path = pathname.split('/');
	const type = path[path.length - 1];
	return (
		<Layout>
			<ManufacturerAndModelProvider>
				<div className="card-container scan-dist-container" >
					<Tabs
						onChange={activeKey =>  history.push(ROUTES.SCAN_DISTRIBUTION.PAGE(activeKey))}
						type="card" defaultActiveKey={type}
						destroyInactiveTabPane={true}
					>
						<Tabs.TabPane tab="Team" key="team">
							<ScanByTeams/>
						</Tabs.TabPane>
						<Tabs.TabPane tab="Venue" key="venue">
							<ScanByVenue/>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</ManufacturerAndModelProvider>
		</Layout>
	)
}