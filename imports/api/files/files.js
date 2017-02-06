import { Meteor } from 'meteor/meteor';

export default Files = new FS.Collection("files", {
    stores: [new FS.Store.FileSystem("files", {path: "~/uploads"})]
});

if(Meteor.isServer){
    Files.allow({
        'insert': (userId) => !!userId,
        download: (userId) => {
            if(Roles.userIsInRole(userId, 'admin'))
                return !!userId;
        },
        update: (userId) => !!userId,
    });
    Meteor.publish('files', () => {
        return Files.find();
    })
}