import React, { Component, PropTypes} from 'react';
import SelectInput from './SelectInput';

export default SelectFromArray = {
    label: 'Select from array',
    component: class extends SelectInput.component {
        createOptions() {
            let options = [];
            if (this.props.options.length == 0)
                options.push(<option disabled key="empty" value={0}>No tasks available to join</option>);
            else {
                options.push(<option key="empty" value={0}>Select an item</option>);
                for (let option of this.props.options) {
                    options.push(<option key={option.value} value={option.value}>{option.label}</option>)
                }
            }
            return options;
        }
    }
}

SelectFromArray.propTypes = {
    options: React.PropTypes.array.isRequired
};
