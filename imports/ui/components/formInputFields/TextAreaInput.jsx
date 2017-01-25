import React, { Component, PropTypes} from 'react';

export default class TextAreaInput extends Component {
    constructor(){
        super();
        this.changeValue = this.changeValue.bind(this)
    }

    componentWillMount(){
        this.state = {
            value: null,
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
            <div className="form-group" id={props.id}>
                <label className="control-label" htmlFor={this.props.id}> {this.props.schema[props.name].label} </label>
                <textarea className="form-control" name={name} id={this.props.id} rows={this.props.schema[props.name].autoform.height} type="text" value={this.props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}
