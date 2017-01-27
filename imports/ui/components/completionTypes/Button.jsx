import React, { Component, PropTypes } from 'react';

export default CompletionTypeButton = {
    label: 'Button',
    component: class Button extends Component{
        render() {
            return(
                <button>Press ME</button>
            )
        }
    }
}
