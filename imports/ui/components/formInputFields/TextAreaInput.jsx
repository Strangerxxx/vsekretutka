import React, { Component, PropTypes} from 'react';

export default class TextAreaInput extends Component {
    constructor(props){
        super(props);
        this.changeValue = this.changeValue.bind(this);
        this.state= {
            name,
        };

    }

    changeValue(event){
        if(this.props.callback)
            this.props.callback(this.props.name, event.target.value);
    }

    render() {
        let props = this.props;
        if(props.index != undefined)
            this.state.name = props.prefix + '.' + props.index + '.' + props.name;
        else
            this.state.name = props.name;
        return(
            <div className="form-group" id={props.id} name={this.state.name}>
                <label className="control-label" htmlFor={this.props.id}> {this.props.schema[props.name].label} </label>
                <textarea className="form-control" name={this.state.name} id={this.props.id} rows="10" type="text" value={this.props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}
