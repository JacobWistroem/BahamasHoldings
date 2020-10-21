import decode from 'jwt-decode';
import cookie from 'react-cookies';

export default class AuthService{
    login(email, password) {
        //Static header information
        let standardheader = {
            "Accept": "application/json",
            "Content-Type": "application/json", 
        }
        //Adds token to header if we got any
        if (this.loggedIn()) {
            standardheader['Authorization'] = `Bearer ${this.getToken()}`
        }
        return fetch('http://localhost:5000/api/authenticate', {
            method: "POST",
            mode: 'cors',
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Headers': '*',
            headers: standardheader,
            credentials: 'include',
            body: JSON.stringify({ email: email, password: password }),
        })
            .then(this._checkStatus)
            .then((response) => response.json())
            .then((response) => {
                    //Cookie is automaticly set with fetch API: on credentials include
                    //verifiy cookie is set
                    if(response.state === true){
                        let token = this.getToken();
                        if(token){
                            return Promise.resolve(response);
                        } else {
                            return Promise.reject(response);
                        }                
                    } return Promise.reject(response);
            });
    }


    //Gets the token from the LocalStorage
    getToken() {
        return cookie.load('token')
        }
    
    //Makes sure that the user is logged in
    //!! makes a value to true/false dependent on the value
    //First verifiy we have a token and then check the date
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token)
    }

    //Removes our token from LocalStorage
    logout(props = null) {
        cookie.remove('token', {path: '/'});
        if(cookie.load('token') === undefined){
            if(props){
                return props.history.push('/login');
            }
            return true
        } else {
            return false
        }
    }

    //Makes sure the token we find in the users browser isnt expired
    //If the current date now in minuts is above the expiration date in the cookie, the cookie is too old
    isTokenExpired(token) {
        //try error for if we are missing the token.
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true
            } else {
                return false
            }
        }
        catch (e) {
            return false;
        }
    }

    //Decodes the token for information
    getProfile() {
        return decode(this.getToken())
    }

    //If the response if within the 200 range, its a success
    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            let error = new Error(response.statusText)
            error.reponse = response;
            throw error
        }
    }
}