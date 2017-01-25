import React, { Component, PropTypes} from 'react';

export default class SelectSubTasks extends Component{
    constructor(props){
        super(props);

        this.selectHandler = this.selectHandler.bind(this);
    }
    createOptions() {
        let options = [];
        if(this.props.tasks.length == 0)
            options.push(<option disabled key="empty" value={0}>No tasks available to join</option>);
        else {
            options.push(<option key="empty" value={0}>Select a task to join</option>);
            for(let option of this.props.tasks){
                options.push(<option key={option._id} value={option._id}>{option.name}</option>)
            }
        }
        return options;
    }

    selectHandler(event){
        let select = event.target;
        if(this.props.selectCallback && select.selectedIndex != 0){
            this.props.selectCallback(select.options[select.selectedIndex].value);
            select.selectedIndex=0;
        }
    }

    render() {
        let props = this.props;
        let name;
        if(props.index != undefined)
            name = props.prefix + '.' + props.index + '.' + props.name;
        else
            name = props.name;

        return(
            <select className="table-cell-select form-control" defaultValue={props.value} name={name} onChange={this.selectHandler}>
                {this.createOptions()}
            </select>
        )
    }
}

SelectSubTasks.propTypes = {
    tasks: React.PropTypes.array.isRequired
};
