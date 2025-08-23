import React, { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';

const MultiSelectChips = ({ options, preSelectvalList, placeholder, onSelectChange, disabled, selectionLimit }) => {
    function onRemove(s) {
        onChange(s)
    }
    function onSelectt(s) {
        onChange(s)
    }
    const [dropDownList, setDropDownList] = useState([])
    const [preSelectValues, setPreSelectValues] = useState([])
    useEffect(() => {
        if (options != null) {
            let newList = []
            for (let i = 0; i < options?.length; i++) {
                newList.push({ key: options[i] })
            }
            setDropDownList(newList)
        }

    }, [options])
    useEffect(() => {
        if (preSelectvalList != null) {
            let newList = []
            for (let i = 0; i < preSelectvalList?.length; i++) {
                newList.push({ key: preSelectvalList[i] })
            }
            setPreSelectValues(newList)
        }

    }, [preSelectvalList])
    function onChange(updatedVal) {
        let currSelectedList = []

        if (updatedVal?.length) {
            for (let i = 0; i < updatedVal?.length; i++) {
                currSelectedList.push(updatedVal[i]?.key)
            }

        }
        onSelectChange(currSelectedList)

    }
    return (
        <div>
            {dropDownList.length > 0 && <Multiselect
                selectionLimit={selectionLimit ? selectionLimit : null}
                disable={disabled}
                displayValue="key"
                onKeyPressFn={function noRefCheck() { }}
                onRemove={onRemove}
                onSearch={function noRefCheck() { }}
                onSelect={onSelectt}
                options={dropDownList}
                selectedValues={preSelectValues}
                placeholder={placeholder}
                style={{
                    chips: {
                        background: 'var(--base-palette-black-800)',
                    },
                    multiselectContainer: {
                        color: 'var(--base-palette-black-725)'
                    },
                    inputField: {
                        color: 'var(--base-palette-black-40)',
                        padding: "10px"
                    },
                    searchBox: {
                        border: '1px solid var(--base-palette-black-600)',
                        borderRadius: '8px'
                    },
                    optionContainer: {
                        border: '1px solid var(--base-palette-black-600)',
                    },
                    option: {
                        backgroundColor: 'var(--base-palette-black-725)',
                        color: 'var(--base-palette-black-40)',
                        padding: '10px',
                        border: '1px solid var(--base-palette-black-600)',

                    },
                }}
            />}
        </div>
    );
};

export default MultiSelectChips;
