import { Meteor } from 'meteor/meteor';

export default Files = new FS.Collection("files", {
    stores: [new FS.Store.FileSystem("files", {path: "~/uploads"})]
});

if(Meteor.isServer){
    Files.allow({
        'insert': function (userId) {
            return !!userId;
        },
        download: function(userId, fileObj) {
            return true
        }
    });
    Meteor.publish('files', () => {
        return Files.find();
    })
}