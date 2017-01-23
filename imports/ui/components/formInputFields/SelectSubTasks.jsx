import React, { Component, PropTypes} from 'react';

export default class SelectSubTasks extends Component{

    createOptions() {
        let options = [];
        for(let option of this.props.tasks){
            options.push(<option>option.name</option>)
        }
    }

    render() {
        return(
            <select className="table-cell-select">
                {this.createOptions()}
            </select>
        )
    }
}

SelectSubTasks.propTypes = {
    tasks: React.PropTypes.array.isRequired
};
