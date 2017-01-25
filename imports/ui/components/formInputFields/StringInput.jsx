import React, { Component, PropTypes} from 'react';

export default class StringInput extends Component {
    constructor(){
        super();
        this.changeValue = this.changeValue.bind(this)
    }

    componentWillMount(){
        this.state = {
            value: null,
            class: 'form-group'
        };
    }

    changeValue(event){
        $('div#' + this.props.id).removeClass('has-error');
    }

    render() {
        let props = this.props;
        let name;
        if(props.index != undefined)
            name = props.prefix + '.' + props.index + '.' + props.name;
        else
            name = props.name;
        return(
            <div className={this.state.class} id={props.id}>
                <label className="control-label" htmlFor={props.id}> { props.schema[props.name].label } </label>
                <input className="form-control" name={name} id={props.id} type="text" value={props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}