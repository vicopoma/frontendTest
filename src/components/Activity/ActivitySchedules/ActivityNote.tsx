import React, { useEffect, useState } from 'react';
import Image from '../../Shared/Image/Image';
import { Button, Input } from 'antd';
import { useActivitiesDispatch } from '../../../hook/hooks/activity';
import { ActivityState } from '../../../store/types';
import { SuccessMessage } from '../../Shared/Messages/Messages';

export const ActivityNote = ({ activity, addBodyFilter, filterName, onCancel } : { 
  activity?: ActivityState, 
  addBodyFilter: Function,
  filterName: string, 
  onCancel: Function 
}) => {

  const [note, setNote] = useState<string>(activity?.note || '');
  const [trigger, setTrigger] = useState<number>(0);
  const { updateActivity } = useActivitiesDispatch();

  useEffect(() => {
    if (trigger > 0) {
      addBodyFilter({
        trigger: trigger,
      });
    }
  }, [addBodyFilter, trigger]);

  return (
    <div>
      <div className="activity-note-container" />
      <div className="activity-note">
        <div style={{ display: 'flex' }}>
          <Image src={`/images/activity/notes.svg`} srcDefault={''} alt="notes" width="25px"/>
          <div className="note-title">Add Note</div>
        </div>
        <div>
          <Input.TextArea 
            onChange={(e) => {
              setNote(e.target.value);
            }}
            allowClear 
            className="note blue-scroll"
            maxLength={250}
            value={note}
          />
        </div>
        <div className="btn-group">
          <Button className="btn btn-gray" onClick={() => onCancel()}>CANCEL</Button>
          <Button className="btn btn-green" onClick={() => {
            if (activity) updateActivity({ ...activity, note: note }, () => {
              setTrigger(prevValue => prevValue + 1);
              SuccessMessage({ description: 'Note added successfully.' });
              onCancel()
            }, false);
          }}>
            SAVE
          </Button>
        </div>
      </div>
    </div>
  )
}