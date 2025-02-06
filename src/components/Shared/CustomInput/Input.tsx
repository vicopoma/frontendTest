import React, { CSSProperties, useEffect, useState } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { 
	AutoComplete, 
	Button, 
	Popover, 
	Select, 
	Input as AntdInput, 
	Dropdown, 
	Menu, 
	Tag 
} from 'antd';
import './Input.scss';

import { SelectOptions, SelectProps } from '../Select/Select';
import { useSearchFunctions } from '../../../hook/customHooks/search';
import { useBodyFilterParams } from '../../../hook/customHooks/customHooks';
import { ConfirmationModal } from '../Modals/Modals';

export interface InputSearchAndTagsProps extends SelectProps {
  selectClassName?: string,
  tagsClassName?: string,
  onChange: (tags: Array<SelectOptions>) => void,
	onOperatorChange?: (operator: string) => void,
	operator?: string,
  tagValues: Array<SelectOptions>,
  inputKey?: string,
  tagMode?: "row" | "column",
	nameView?: string,
	bodyFilterName?: string,
}

const SearchAndTag: React.FC<InputSearchAndTagsProps> = props => {
  
  const [selectedOptions, setSelectedOptions] = useState<Array<SelectOptions>>(props.tagValues);
  const [ inputValue, setInputValue] = useState<string | undefined> ('')
  const [ keyTrigger, setKeyTrigger] = useState<number> (0);
	const [searchName, setSearchName] = useState<string>('');
	const [id, setId] = useState<string>('');
	const [trigger, setTrigger] = useState<number>(0); 
	const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
  
  const rowTagModeStyle: CSSProperties = props.tagMode === 'column' ? {
    display: 'flex',
    alignItems: 'center'
  } : {};
  
  const columnTagModeStyle: CSSProperties = props.tagMode === 'row' ? {
    position: 'fixed',
    marginTop: '5px',
    zIndex: '5',
    width: '93%'
  } : {};

	const { 
    savedFilterList: { savedFilterList, loadSavedFilterList },
    filterItem: { saveFilter, updateFilter, deleteFilter}
  } = useSearchFunctions({view: props.nameView ?? '', id: '' });

	const { bodyFilter: inputBodyFilter, addBodyFilter } = useBodyFilterParams(props.bodyFilterName ?? '');

	useEffect(() => {
		loadSavedFilterList(props.nameView);
	}, [trigger, loadSavedFilterList, props.nameView]);

	useEffect(() => {
		setSelectedOptions(() => inputBodyFilter.keys?.map((key: string) => ({display: key, value: key})) || []);
		if(inputBodyFilter.keys?.length === 0) {
			setId('');
			setSearchName('');
		}
	}, [inputBodyFilter.keys])

	const menu = (
		<Menu onClick={() => {}}>
			<Menu.ItemGroup title={<span> Saved</span>}>
				{savedFilterList.map((item: any, index) => {
					return <Menu.Item style={{display: 'flex', justifyContent: 'space-between'}} key={index} onClick={() => {
						addBodyFilter({
							keys: item.filter.split(','),
							operator: item.operator,
						});
						setId(item.id);
						setSearchName(item.name)
					}}>
						<div>
							{item.name}
						</div>
						<div>
							<CloseOutlined style={{color: 'red', paddingLeft: '10px'}} onClick={() => {
								ConfirmationModal('Delete search', 'Are you sure to delete this criteria search?', () => {
									deleteFilter(item.id, () => {
										setTrigger(prevState => prevState + 1);
										setId('');
										setSearchName('');
									});
								})
							}}/>
						</div>	
					</Menu.Item>
				})}
			</Menu.ItemGroup>
		</Menu>
	);
	return (
		<div
			className={`${props.className ?? ''} tag-input-search`}
			style={{height: 'auto', ...rowTagModeStyle}}>
			<div className="search-section">
				<Dropdown overlay={menu}>
					<Button
						className="search-button"
						id="saved-filters"
						icon={<SearchOutlined style={{marginRight: '4px'}}/>}
					/>
				</Dropdown>
				<span className="search-selector">
          <Select
	          className="filters-selector"
						id="operator"
	          style={{minWidth: '80px'}}
						value={props.operator}
						onChange={(e) => {
							if(props.onOperatorChange) {
								props.onOperatorChange(e + '');
							}
						}}
	          options={[
		          {
			          title: 'And',
			          value: 'AND',
		          },
		          {
			          title: 'Or',
			          value: 'OR',
		          }
	          ]}
          />
        </span>
				<AutoComplete
					key={keyTrigger}
					searchValue={inputValue}
					onKeyDown={(event) => {
						if(event.key === 'Enter') {
							const obj = {
								display: inputValue + '',
								value: inputValue + ''
							}
							if(inputValue && inputValue.trim().length > 0 && !selectedOptions.some(e => e.value.toLowerCase() === obj.value.toLowerCase())) {
								props.onChange?.([...selectedOptions, obj]);
								setSelectedOptions([...selectedOptions, obj]);
								setInputValue(undefined);
								setKeyTrigger(trigger => trigger + 1);
							}
						}
					}}
					onChange={(e) => {
						setInputValue(e);
					}}
					showSearch
					className={props.selectClassName}
					size={props.size}
					id={props.id ?? ''}
					placeholder={(props.placeholder === 'Search...' && searchName !== '') ? searchName : props.placeholder}
					style={{...props.style, marginRight: '10px', borderRadius: '5px'}}
					onSearch={props.onSearch}
					onSelect={(value: string, value2) => {
						const obj = {
							display: value2?.display,
							value: value2?.value,
							className: value2?.className
						}
						if(!selectedOptions.some(e => e.value === obj.value)) {
							props.onChange?.([...selectedOptions, obj]);
							setSelectedOptions([...selectedOptions, obj]);
							setKeyTrigger(trigger => trigger + 1);
							setInputValue(undefined);
						}
					}}
					notFoundContent={props.notFoundContent}
					disabled={props.disabled}
					options={props.options}
				/>
			</div>
			<div
				style={{
					...columnTagModeStyle, 
					paddingTop: '4px', 
					paddingBottom: '0px', 
					marginLeft: '124px'
				}}
				className={props.tagsClassName}>
				{
					inputBodyFilter?.keys?.map( (options: any) => (
						<span className="edit-tag" key={options}>
              <Tag key={options} closable onClose={() => {
	              setSelectedOptions(prevState => {
		              const copy = [...prevState];
		              const newState = copy.filter(data => data.value !== options);
		              props.onChange?.(newState);
		              return newState;
	              });
              }}>
                { options }
              </Tag>
            </span>
					))
				}
				{
					inputBodyFilter?.keys?.length > 0 && (
						<>
							<Button
								danger
								style={{marginRight: '8px'}}
								size="small"
								onClick={() => {
									setSelectedOptions([]);
									props.onChange?.([]);
									setId('');
									setSearchName('');
								}
								}>
								Clear
							</Button>
							
							<Popover
								placement="bottom"
								trigger="click"
								onVisibleChange={(visible) => setPopoverVisible(visible)}
								visible={popoverVisible}
								content={(
									<>
										<AntdInput size="small" value={searchName} placeholder="Type here" onChange={(e) => {
											setSearchName(e.target.value);
										}}/>
										<div className="save-section">
											<Button className="button-cancel" size="small" onClick={() => setPopoverVisible(false)}>
												Cancel
											</Button>
											<Button className="button-save" size="small" onClick={() => {
												if(id === '') {
												ConfirmationModal('Save Search', `Are you sure to save the '${searchName}' criteria search?`, () => {
													saveFilter({
														id: '',
														view: `${props.nameView ?? ''}_view`,
														filter: props.tagValues.map(option => option.display).toString(),
														name: searchName,
														operator: props.operator,
													}, (res) => {
														setTrigger(prevState => prevState + 1);
														setId(res.id);
													});
												})
											 } else {
												ConfirmationModal('Update Search', `Are you sure to update the '${searchName}' criteria search?`, () => {
													updateFilter({
														id,
														view: `${props.nameView ?? ''}_view`,
														filter: inputBodyFilter.keys.toString(),
														name: searchName,
														operator: props.operator,
													}, () => setTrigger(prevState => prevState + 1));
												})
											 }
											}}>
												Save
											</Button>
										</div>
									</>
								)}
							>
								<Button className="button-main"  size="small">
									Save
								</Button>
							</Popover>
						</>
					)
				}
			</div>
		</div>
	)
};

interface InputSubComponents {
	SearchAndTag: React.FC<InputSearchAndTagsProps>
}

const Input: React.FC<{}> & InputSubComponents = props => (
	<div {...props}>{props.children}</div>
);

Input.SearchAndTag = SearchAndTag;

export default Input;