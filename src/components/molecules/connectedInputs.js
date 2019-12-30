import React from "react";
import PropTypes from "prop-types";

import EntryInput from "../atoms/entryInput";

const connectedInputs = ({
  item,
  number,
  onChangeEntry,
  onChangeValue,
  onRemove,
  isDisabled
}) => (
  <>
    <EntryInput
      name={`entry${item.id}`}
      value={item.entryValue}
      onChange={onChangeEntry}
      labelValue={`Entry key ${number + 1}`}
      placeholder="entry.xxxx"
    />
    <EntryInput
      name={`value${item.id}`}
      value={item.value}
      onChange={onChangeValue}
      labelValue={`Value ${number + 1}`}
      placeholder="value"
    />
    <div className="w-full px-3 mb-5 justify-end flex">
      <button
        className="btn shadow bg-red-600 hover:bg-red-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        type="button"
        disabled={isDisabled}
        onClick={onRemove}
      >
        Remove
      </button>
    </div>
  </>
);

connectedInputs.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    entryValue: PropTypes.string,
    value: PropTypes.string
  }).isRequired,
  number: PropTypes.number.isRequired,
  onChangeEntry: PropTypes.func.isRequired,
  onChangeValue: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

connectedInputs.defaultProps = {
  isDisabled: false
};

export default connectedInputs;
