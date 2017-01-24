import React, { Component, PropTypes} from 'react';

export default class SelectSubTasks extends Component{

    createOptions() {
        let options = [];
        if(this.props.tasks.length == 0)
            options.push(<option disabled key="empty" value={0}>No tasks available to join</option>);
        else {
            options.push(<option key="empty" value={0}>Select a task to join</option>);
            for(let option of this.props.tasks){
                options.push(<option key={option._id} value={option._id}>option.name</option>)
            }
        }
        return options;
    }

    render() {
        return(
            <select className="table-cell-select form-control" defaultValue={this.props.value} name="subTaskSelect" onChange={this.props.selectCallback}>
                {this.createOptions()}
            </select>
        )
    }
}

SelectSubTasks.propTypes = {
    tasks: React.PropTypes.array.isRequired
};
