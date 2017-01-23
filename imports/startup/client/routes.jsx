import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';


import App from '../../ui/App.jsx';
import AdminIndex from '/imports/ui/admin/AdminIndex';
import UserIndex from '/imports/ui/user/UserIndex';
import AddTask from '/imports/ui/admin/AddTask';
import Navigation from '/imports/ui/admin/Navigation';
import Users from '/imports/ui/admin/Users';


Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route component={ App }>
                <Route path="/admin" components={{main: AdminIndex, navigation: Navigation}} >
                    <Route path='add' components={{main: AddTask }}/>
                    <Route path='users' components={{main: Users}}/>
                </Route>
                <Route path="/" components={{main: UserIndex}}>

                </Route>
            </Route>
        </Router>,
        document.getElementById( 'react-root' )
    );
});