import React, { Component, PropTypes} from 'react';
import SelectInput from './SelectInput';

export default class SelectFromUsers extends SelectInput.component{
    constructor(props) {
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
    }
    selectHandler(event){
        let select = event.target;
        if(this.props.selectCallback){
            this.props.selectCallback(select.options[select.selectedIndex].value);
        }
    }

    createOptions() {
        let options = [];
        if(this.props.users.length == 0)
            options.push(<option disabled key="empty" value={0}>No options available</option>);
        else {
            options.push(<option key="empty" value={0}>Select an item</option>);
            for(let option of this.props.users){
                options.push(<option key={option._id} value={option._id}>{option.profile.firstName + ' ' + option.profile.lastName}</option>)
            }
        }
        return options;
    }
}

SelectFromUsers.propTypes = {
    users: React.PropTypes.array.isRequired
};

