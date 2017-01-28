import React, { Component, PropTypes } from 'react';

export default CompletionTypeText = {
    label: 'Text',
    component: class Text extends Component{
        render() {
            return(
                <textarea rows="6">

                </textarea>
            )
        }
    }
}
