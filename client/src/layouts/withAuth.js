import React from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    return class AuthWrapped extends React.Component {
        constructor() {
            super();
            //Whatever state we set here, we can reference in our dashboard as a prop
            //Call example: {this.props.user.username}
            this.state = {
                user:null
            }
        }
        componentWillMount() {
            //Redirect our user to login page if not logged in
            if (!Auth.loggedIn())
                this.props.history.replace('/login')
            else {
                try {
                    const profile = Auth.getProfile();
                    this.setState({ user: profile })
                }
                //If we cant decode the token, remove token from LocalStorage and redirect to login page
                catch (err) {
                    Auth.logout();
                    this.props.history.replace('/login')
                }
            }
        }
        render() {
            if (this.state.user) {
                return (
                    //Passes the state to our other components
                    <AuthComponent history={this.props.history} user={this.state.user} />
                )
            } else {
                return null;
            }
        }
    }
}