import React, { useEffect, useState} from 'react';
import { Tabs } from 'antd';

import { PlayerProfile } from './PlayerDrawer/PlayerProfile';
import { Drawer } from '../Shared/Drawer/Drawer';
import { usePlayersDispatch, usePlayersState } from '../../hook/hooks/players';
import { playerValidators } from '../../constants/validators';
import { useFormik } from 'formik';
import { DEFAULT_PLAYER, PlayerState } from '../../store/types/players';
import { useAccountDispatch, useAccountState } from '../../hook/hooks/account';
import { useBodyFilterParams } from '../../hook/customHooks/customHooks';
import { PLAYERS_FILTER } from '../../constants/constants';


export const PlayerProfileDrawer = ({openDrawer, closeDrawer}: { openDrawer: boolean, closeDrawer: Function }) => {
  
  const {TabPane} = Tabs;
  const {loadPlayerById} = usePlayersDispatch();
  const {postPlayer, putPlayer, replacePlayer} = usePlayersDispatch();
  const {player} = usePlayersState();
  const {teamSelected, account} = useAccountState();
  const {teamList} = account;
  const {replaceAccountSelectedTeam} = useAccountDispatch();

  const { addBodyFilter } = useBodyFilterParams(PLAYERS_FILTER);
  const [, setTrigger] = useState<number>(0);
  
  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    validateForm,
    handleBlur,
    touched
  } = useFormik<PlayerState>({
    initialValues: player,
    validationSchema: playerValidators,
    enableReinitialize: true,
    onSubmit() {
    }
  });
  
  useEffect(() => {
    replacePlayer({
      ...DEFAULT_PLAYER,
      currentTeamId: teamSelected?.teamId
    });
    return () => {
      loadPlayerById('');
    };
  }, [loadPlayerById, replacePlayer, teamSelected?.teamId]);
  
  useEffect(() => {
    setFieldValue('currentTeamId', teamSelected?.teamId);
  }, [setFieldValue, teamSelected]);
  
  return <>
    <Drawer
      visible={openDrawer}
      title={
        <div className="header_drawer_title_equip">
          <span> <b style={{color: '#013369'}}>PLAYER INFORMATION</b></span>
        </div>
      }
      closable={openDrawer}
      width={'50%'}
      onClose={() => {
        closeDrawer();
        const cleanPlayer: PlayerState = {...DEFAULT_PLAYER};
        cleanPlayer.currentTeamId = teamSelected?.teamId;
        setFieldValue('currentTeamId', teamSelected?.teamId);
        replacePlayer(cleanPlayer);
      }}
      canModify={true}
      onChange={(setResponse) => {
        validateForm(values).then(result => {
          if (Object.keys(result).length === 0) {
            values.displayName = values.firstName + ' ' + values.lastName;
            values.status = 'ACT';
            if (player.id) {
              putPlayer(values, () => {
                setTrigger(trigger => {
                  addBodyFilter({
                    trigger: trigger
                  });
                  return trigger + 1;
                });
              });
            } else {
              postPlayer(values, () => {
                setTrigger(trigger => {
                  addBodyFilter({
                    trigger: trigger
                  });
                  return trigger + 1;
                });
              });
            }
            const teamSelectedByUser = teamList.filter(team => team.teamId === values.currentTeamId);
            if (teamSelectedByUser.length) {
              replaceAccountSelectedTeam(teamSelectedByUser[0]);
            }
          }
        });
        handleSubmit();
      }}
    >
      <div>
        <Tabs destroyInactiveTabPane className="tag-history" defaultActiveKey="1" type="card">
          <TabPane tab="Information" key="1">
            <PlayerProfile
              values={values}
              handleChange={handleChange}
              errors={errors}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              touched={touched}
            />
          </TabPane>
        </Tabs>
      </div>
    </Drawer>
  </>;
};
