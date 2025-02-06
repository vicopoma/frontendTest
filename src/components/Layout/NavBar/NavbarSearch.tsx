import React, { useCallback, useEffect, useState } from 'react';
import { Popover, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEquipmentRedirect } from '../../../hook/customHooks/redirect';
import { asciiToHex, hexToAscii } from '../../../helpers/ConvertUtils';
import './Navbar.scss';
import { ROUTES } from '../../../settings/routes';
import { history } from '../../../store/reducers';
import { isOemRole, tagValidator, verifyScannerInput } from '../../../helpers/Utils';
import { useSocketDSProvider } from '../../../context/socketDS';
import { useAccountDispatch, useAccountState } from '../../../hook/hooks/account';
import { DEFAULT_TEAM, TeamState } from '../../../store/types';
import { useLocation } from 'react-router';

export const NavbarSearch = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { tagInfo, getTagInfo } = useEquipmentRedirect();
  const { account } = useAccountState();
  const { teamList } = account;
  const isOEM = isOemRole(account.role?.name);
  const [teamSelected, setTeamSelected] = useState<TeamState>(DEFAULT_TEAM);
  const path = useLocation().pathname;
  const { replaceAccountSelectedTeam } = useAccountDispatch();


  const suscribeFunction = useCallback((message: string) => {
    setTimeout(() => {
      const value = verifyScannerInput(message);
      if (value !== "" && tagValidator(value)) {
        setSearchText(hexToAscii(value));
      }
    }, 0);
  }, [setSearchText]);

  
  const { setEnableOptionalSuscribe, setOptionalHandleSuscribe } = useSocketDSProvider();
  useEffect(() => {
    if (isVisible) {
      setOptionalHandleSuscribe(() => suscribeFunction);
    }   
  }, [setOptionalHandleSuscribe, suscribeFunction, isVisible]);

  useEffect(() => {
    if (searchText !== '') getTagInfo(asciiToHex(searchText).toUpperCase(), (tagInfo: any) => {
      setTeamSelected(() => {
        return teamList.filter(team => team.teamId === tagInfo?.teamId)?.[0] || DEFAULT_TEAM;
      });
    });
  }, [getTagInfo, searchText]);

  return (
    <>
      <Popover
        overlayClassName="search-navbar"
        placement="bottomRight"
        onVisibleChange={(visible: boolean) => {
          setIsVisible(visible);
          setEnableOptionalSuscribe(visible);
        }}
        visible={isVisible}
        content={() => {
          return (
            <div className="search-items">
              <Input 
                maxLength={30}
                className="item search-text"
                placeholder="Search by Tag"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
              />
              {tagInfo?.equipmentId && searchText !== '' && <Button
                className="item clickable"
                onClick={async () => {
                  setSearchText('');
                  setIsVisible(false);
                  if (isOEM) {
                    if (path !== ROUTES.EQUIPMENT.DETAIL_OEM(tagInfo.equipmentTypeId, tagInfo.teamId, tagInfo.equipmentId)) {
                      history.push(ROUTES.EQUIPMENT.PAGE(tagInfo.equipmentTypeId));
                      history.push(ROUTES.EQUIPMENT.DETAIL_OEM(tagInfo.equipmentTypeId, tagInfo.teamId, tagInfo.equipmentId));
                    }
                  } else {
                    if (path !== ROUTES.EQUIPMENT.DETAIL(tagInfo.equipmentTypeId, tagInfo.equipmentId)) {
                      history.push(ROUTES.EQUIPMENT.PAGE(tagInfo.equipmentTypeId));
                      await replaceAccountSelectedTeam(teamSelected);
                      history.push(ROUTES.EQUIPMENT.DETAIL(tagInfo.equipmentTypeId, tagInfo.equipmentId));                     
                    }
                  }
                }}
              >
                1 equipment related: <span className="tag">{searchText}</span>
              </Button>
              }
            </div>
          )
        }}
      >
        <SearchOutlined 
          style={{ 
            fontSize: '38px',
            marginRight: '12px',
            marginTop: '3px',
            fontWeight: 'bolder',
          }}
        />
      </Popover>
    </>
  )
}