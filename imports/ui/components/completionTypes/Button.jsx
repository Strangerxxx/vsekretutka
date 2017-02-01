import React, { Component, PropTypes } from 'react';

export default CompletionTypeButton = {
    label: 'Button',
    component: class Button extends Component{
        render() {
            return(
                <button className="btn btn-primary" onClick={() => this.props.callback('Completed')}>Done</button>
            )
        }
    }
}
