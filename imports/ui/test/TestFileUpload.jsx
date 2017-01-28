import React, { Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import Files from '/imports/api/files/files';
import { createContainer } from 'meteor/react-meteor-data';


class TestFileUpload extends Component{
    upload(event){
        event.preventDefault();
        let files = event.target.files;
        for (let file of files) {
            Files.insert(file, function (err, fileObj) {
                console.log(err, fileObj)// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
            });
        }
    }
    render() {
        let images = [];
        for(let image of this.props.files)
        {
            console.log(image.url())
            images.push(<a key={image._id} href={image.url()}><img src={image.url()}/></a>)
        }
        return(
            <div>
                <input type="file" onChange={this.upload}/>
                {images}
            </div>
        )
    }
}
export default createContainer(() => {
    Meteor.subscribe('files');
    return {
        files: Files.find().fetch()
    };
}, TestFileUpload)