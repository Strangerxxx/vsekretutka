import React, { Component, PropTypes} from 'react';

export default TextAreaInput = {
    label: 'TextArea Input',
    component: class  extends Component {
        constructor(props){
            super(props);
            this.state= {
                value: props.value ? props.value : '',
            };
            this.changeValue = this.changeValue.bind(this);
        }

        changeValue(event){
            if(this.props.callback)
                this.props.callback(this.props.name, event.target.value);
            this.setState(() => this.state.value = event.target.value)
        }

        render() {
            return(
                <div className="form-group">
                    <label className="control-label"> {this.props.label} </label>
                    <textarea className="form-control" name={this.props.name} rows="10" type="text" value={this.state.value} onChange={this.changeValue}/>
                </div>
            )
        }
    }
}