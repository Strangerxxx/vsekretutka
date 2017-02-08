import React, { Component, PropTypes} from 'react';

export default TextInput = {
    label: 'Text Input',
    component: class extends Component {
        constructor(props){
            super(props);
            this.changeValue = this.changeValue.bind(this);
            this.state= {
                value: props.value ? props.value: '',
            };
        }

        changeValue(event){
            this.state.value = event.target.value;
            if(this.props.callback)
                this.props.callback(this.props.name, event.target.value);
            this.forceUpdate();
        }

        render() {
            return(
                <div className={this.state.class}>
                    <label className="control-label"> {this.props.label} </label>
                    <input className="form-control" name={this.props.name} type="text" value={this.state.value} onChange={this.changeValue}/>
                </div>
            )
        }
    }
}