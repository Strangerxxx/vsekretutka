import { Meteor } from 'meteor/meteor';

import '/imports/api/notifications/notifications.js';
import '/imports/api/users/users.js';
import '/imports/api/invites/invites';
import '/imports/api/tasks/tasks';

Meteor.startup(() => {
  // code to run on server at startup
});
