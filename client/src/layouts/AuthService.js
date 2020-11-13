import { json } from 'body-parser';
import decode from 'jwt-decode';
import cookie from 'react-cookies';


var debug = true;


if(debug){
    var url = 'http://localhost:5000'
} else {
    var url = 'http://157.245.47.65';
}


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
        return fetch(url + '/api/authenticate', {
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
                        let token = this.getToken()
                            console.log(token);
                            if(token){
                                return Promise.resolve(response);
                            } else {
                                return Promise.reject(response);
                            }
                                   
                    } return Promise.reject(response);
                
            });
    }


    verifySignature () {

        let standardheader = {
            "Accept": "application/json",
            "Content-Type": "application/json", 
            'Authorization': cookie.load('token')
        }

        return fetch(url + '/api/signature', {
                method: "POST",
                mode: 'cors',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Headers': '*',
                credentials: 'include',
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json", 
                'Authorization': cookie.load('token')
                },
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                return response;
            });
    }

    //Gets the token from the LocalStorage
    getToken() {
        //validate signature from backend
        if(cookie.load('token') !== undefined){
            /*
            const token = await this.verifySignature().then(success  => {
                console.log(success);
                return success;
            }).catch(err => {
                return undefined;
            });
            

            */
            /*
            let standardheader = {
                "Accept": "application/json",
                "Content-Type": "application/json", 
                'Authorization': cookie.load('token')
            }

            await fetch('http://localhost:5000' + '/api/signature', {
                method: "POST",
                mode: 'cors',
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Headers': '*',
                credentials: 'include',
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json", 
                'Authorization': cookie.load('token')
                },
            })
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                return response
            });
            */
            /*
            .then((response) => response.json())
            .then((response) => {
                console.log(response);

                if(response.status === true){
                        return Promise.resolve(cookie.load('token'));
                            
                } else {
                    return Promise.reject(undefined);
                }


            }).catch((err) => {
                return Promise.reject(undefined);
            });
            */

            return cookie.load('token');
            
        } else {
            return undefined;
        }
    }
    
    //Makes sure that the user is logged in
    //!! makes a value to true/false dependent on the value
    //First verifiy we have a token and then check the date
    loggedIn() {
        const token = this.getToken()
            console.log(token);
            return token;
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