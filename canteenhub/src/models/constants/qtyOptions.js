
// ** Qty Select dropdown settings
export const cartQtyOptions = [{ value: 0, label: 'Remove' }];
for (let i = 1; i <= 99; i += 1) {
  cartQtyOptions.push({ value: i, label: i });
}

// ** Qty Select dropdown settings
export const cartQtyOptionsAdd = [];
for (let i = 1; i <= 99; i += 1) {
  cartQtyOptionsAdd.push({ value: i, label: i });
}

export const qtySelectStyles = {
  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0px 5px 0px 0px',
  }),
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    borderColor: '#f5f5f5',
    fontSize: '14px',
    padding: '0px',
    minHeight: '30px',
    height: '30px',
  }),
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    color: state.selectProps.menuColor,
    backgroundColor: '#f5f5f5',
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#181e4b' : '#f5f5f5',
    padding: '10px 15px',
    cursor: 'pointer',
  }),
};

export const qtySelectStylesLg = {
  valueContainer: (provided, state) => ({
    ...provided,
    height: '50px',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: '0px 10px 0px 4px',
  }),
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',
    backgroundColor: '#f5f5f5',
    borderColor: '#f5f5f5',
    fontSize: '16px',
    padding: '0px',
    minHeight: '50px',
    height: '50px',
  }),
  menu: (provided, state) => ({
    ...provided,
    width: state.selectProps.width,
    color: state.selectProps.menuColor,
    backgroundColor: '#f5f5f5',
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'black',
    backgroundColor: state.isSelected ? '#181e4b' : '#f5f5f5',
    padding: '10px 15px',
    cursor: 'pointer',
  }),
};
