import React, { Component, PropTypes} from 'react';

export default class Select extends Component{
    constructor(props){
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
        this.state= {
            name,
        };
    }

    createOptions(){
        return null;
    }

    selectHandler(event){
        let select = event.target;
        if(this.props.callback){
            this.props.callback(this.props.name, event.target.value);
        }
        if(this.props.selectCallback && select.selectedIndex != 0){
            this.props.selectCallback(select.options[select.selectedIndex].value);
            select.selectedIndex=0;
        }
    }

    render() {
        let props = this.props;
        let className = "table-cell-select form-control";
        if(props.index != undefined)
            this.state.name = props.prefix + '.' + props.index + '.' + props.name;
        else
            this.state.name = props.name;
        if(props.className)
            className = this.props.className;
        return(
            <div name={this.state.name}>
                {props.schema ? <label className="control-label" htmlFor={props.id}> { props.schema[props.name].label } </label> : ''}
                <select className={className} id={props.id} value={props.value} name={this.state.name} onChange={this.selectHandler}>
                    {this.createOptions()}
                </select>
            </div>
        )
    }
}