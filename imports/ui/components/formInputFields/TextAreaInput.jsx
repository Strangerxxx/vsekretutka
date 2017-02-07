import React, { Component, PropTypes} from 'react';

export default class TextAreaInput extends Component {
    constructor(props){
        super(props);
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(event){
        if(this.props.callback)
            this.props.callback(this.props.name, event.target.value);
    }

    render() {
        let props = this.props;
        return(
            <div className="form-group">
                <label className="control-label"> {schema.label} </label>
                <textarea className="form-control" name={this.props.name} rows="10" type="text" value={this.props.value} onChange={this.changeValue}/>
            </div>
        )
    }
}
