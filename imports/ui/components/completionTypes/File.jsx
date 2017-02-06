import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

export default CompletionTypeFile = {
    label: 'File',
    component: class File extends Component{
        constructor(props){
            super(props);
            this.uploadFinished = this.uploadFinished.bind(this);
            this.upload = this.upload.bind(this);
        }
        upload(event){
            event.preventDefault();
            let files = event.target.files;
            for (let file of files) {
                Files.insert(file, this.uploadFinished);
            }
        }

        uploadFinished(err, fileObj){
            console.log('up')
            !err ? this.props.callback({type: 'File', value: fileObj._id}) : console.log(err);
        }

        render() {
            return(
                <div>
                    <input type="file" onChange={this.upload}/>
                </div>
            )
        }
    }
}
