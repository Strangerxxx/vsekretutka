import React, { Component, PropTypes} from 'react';
import Select from './Select';

export default class SelectFromArray extends Select{

    createOptions(){
        let options = [];
        if(this.props.array.length == 0)
            options.push(<option disabled key="empty" value={0}>No tasks available to join</option>);
        else {
            options.push(<option key="empty" value={0}>Select an item</option>);
            for(let option of this.props.array){
                options.push(<option key={option} value={option}>{option}</option>)
            }
        }
        return options;
    }
}

SelectFromArray.propTypes = {
    array: React.PropTypes.array.isRequired
};
