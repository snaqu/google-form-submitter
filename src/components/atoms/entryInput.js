import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const EntryInput = ({
  name,
  value,
  onChange,
  placeholder,
  labelValue,
  fullWidth
}) => {
  return (
    <div
      className={classnames("w-full md:w-1/2 px-3 mb-2 md:mb-0", {
        "md:w-full": fullWidth
      })}
    >
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {labelValue}
      </label>
      <input
        id={name}
        value={value}
        onChange={e => onChange(e)}
        placeholder={placeholder}
        type="text"
        required
        className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      />
    </div>
  );
};

EntryInput.propTypes = {
  value: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool
};

EntryInput.defaultProps = {
  fullWidth: false
};

export default EntryInput;
