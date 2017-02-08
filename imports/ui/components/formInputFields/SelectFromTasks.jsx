import React, { Component, PropTypes} from 'react';
import SelectInput from './SelectInput';

export default class SelectFromTasks extends SelectInput.component{
    createOptions() {
        let options = [];
        if(this.props.tasks.length == 0)
            options.push(<option disabled key="empty" value={0}>No options available</option>);
        else {
            options.push(<option key="empty" value={0}>Select an item</option>);
            for(let option of this.props.tasks){
                options.push(<option key={option._id} value={option._id}>{option.name}</option>)
            }
        }
        return options;
    }
}

SelectFromTasks.propTypes = {
    tasks: React.PropTypes.array.isRequired
};
