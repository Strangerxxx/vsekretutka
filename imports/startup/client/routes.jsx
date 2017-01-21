import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';


import App from '../../ui/App.jsx';
import AdminIndex from '/imports/ui/admin/AdminIndex';
import UserIndex from '/imports/ui/user/UserIndex';
import AddTask from '/imports/ui/admin/AddTask';
import Navigation from '/imports/ui/admin/Navigation';


Meteor.startup( () => {
    render(
        <Router history={ browserHistory }>
            <Route component={ App }>
                <Route path="/admin" component={AdminIndex} >
                    <Route path='add' components={{main: AddTask, navigation: Navigation}}/>
                </Route>
                <Route path="/" component={UserIndex}/>
            </Route>
        </Router>,
        document.getElementById( 'react-root' )
    );
});