import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';


import App from '../../ui/App.jsx';
import AdminIndex from '/imports/ui/admin/AdminIndex';
import AddTask from '/imports/ui/admin/AddTask';
import Navigation from '/imports/ui/admin/Navigation';
import Users from '/imports/ui/admin/Users';
import TaskList from '/imports/ui/admin/TaskList';
import TaskView from '/imports/ui/admin/TaskView';
import TestFileUpload from '/imports/ui/test/TestFileUpload';
import EditTask from '/imports/ui/admin/EditTask';
import Results from '/imports/ui/admin/Results';

import UserIndex from '/imports/ui/user/UserIndex';
import UserTaskList from '/imports/ui/user/UserTaskList';
import UserTaskView from '/imports/ui/user/UserTaskView';

Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route component={ App }>
                <Route path="/admin" components={{main: AdminIndex, navigation: Navigation}} >
                    <Route path='add' components={{main: AddTask }}/>
                    <Route path='users' components={{main: Users}}/>
                    <Route path='tasks' components={{main: TaskList}}/>
                    <Route path='tasks/:taskId' components={{main: TaskView}}/>
                    <Route path='tasks/:taskId/:attachId' components={{main: Results}}/>
                    <Route path='tasks/:taskId/edit' components={{main: EditTask}}/>
                    <Route path='test/file' components={{main: TestFileUpload}}/>
                </Route>
                <Route path="/" components={{main: UserIndex, navigation: UserTaskList}}>
                    <Route path={'tasks/:taskId/:adminId'} components={{main: UserTaskView}}/>
                </Route>
            </Route>
        </Router>,
        document.getElementById( 'react-root' )
    );
});