import React, { Component, PropTypes} from 'react';

export default class StringInput extends Component {
    constructor(){
        super();
        this.changeValue = this.changeValue.bind(this)
    }

    componentWillMount(){
        this.state = {
            value: null,
        };
    }

    returnValue(){
        return this.state.value;
    }

    changeValue(event){
        this.state.value = event.target.value;
    }

    render() {
        return(
            <div className="form-group">
                <label className="control-label" htmlFor={this.props.id}>{this.props.schema.label}</label>
                <input className="form-control" id={this.props.id} type="text" value={this.props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}