import React, { Component, PropTypes} from 'react';

export default class Select extends Component{
    constructor(props){
        super(props);
        this.selectHandler = this.selectHandler.bind(this);
    }

    createOptions(){
        return null;
    }

    selectHandler(event){
        $('div#' + this.props.id).removeClass('has-error');
        let select = event.target;
        if(this.props.selectCallback && select.selectedIndex != 0){
            this.props.selectCallback(select.options[select.selectedIndex].value);
            select.selectedIndex=0;
        }
    }

    render() {
        let props = this.props;
        let name;
        let className = "table-cell-select form-control";

        if(props.index != undefined)
            name = props.prefix + '.' + props.index + '.' + props.name;
        else
            name = props.name;

        if(this.props.className)
            className = this.props.className;

        return(

                <select className={className} id={this.props.id} defaultValue={props.value} name={name} onChange={this.selectHandler}>
                    {this.createOptions()}
                </select>
        )
    }
}