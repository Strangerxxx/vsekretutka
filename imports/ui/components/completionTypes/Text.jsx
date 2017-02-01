import React, { Component, PropTypes } from 'react';

export default CompletionTypeText = {
    label: 'Text',
    component: class Text extends Component{
        constructor(props){
            super(props);
            this.submitForm = this.submitForm.bind(this);
        }
        submitForm(event){
            event.preventDefault();
            this.props.callback($(event.target).serializeArray()[0].value);
        }

        render() {
            return(
                <form className="form-group" onSubmit={this.submitForm}>
                    <textarea className="form-control" rows="6" name="answer">

                    </textarea>
                    <button className="btn btn-primary" type="submit">Submit</button>
                </form>
            )
        }
    }
}
