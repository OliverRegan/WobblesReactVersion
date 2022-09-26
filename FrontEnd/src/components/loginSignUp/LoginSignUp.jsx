// React components
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from '../../redux/reducers/loggedIn'

// Takes data from form and sends to back end to sign up user/handle messages
async function signUp(data) {

    // Make body of request
    let body = {
        "username": data.username,
        "contact": data.contact,
        "email": data.email,
        "password": data.password
    }

    return fetch("http://127.0.0.1:3001/users/signup", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)

    }).then(res => res.json())

}
async function logIn(data) {
    // Make body of request
    let body = {
        "username": data.username,
        "password": data.password
    }

    return fetch("http://127.0.0.1:3001/users/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => res.json())

}


const LoginSignUp = props => {
    let type = props.type;
    // Set input states
    const [userName, setUserName] = useState('');
    const [contact, setContact] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

    // Set message for sign up error/success
    const [response, setResponse] = useState({});
    const [message, setMessage] = useState('');
    const [msgGood, setMsgGood] = useState(true);

    // Navigation
    const navigate = useNavigate();

    // Redux
    const dispatch = useDispatch();

    // Validate form
    function validateForm(type) {

        // init error JSON
        let errors = {
            error: false,
            messages: []
        }

        // Check username
        if (userName === '' && type === 'signUp') {
            errors.error = true;
            errors.messages.push("A username is required");
            setMsgGood(false);
        }

        // Check contact
        if (contact === 0 && type === 'signUp') {
            errors.error = true;
            errors.messages.push("A contact number is required");
            setMsgGood(false);
        }

        if (email === '' && type === 'signUp') {
            errors.error = true;
            errors.messages.push("An email address is required");
            setMsgGood(false);
        }

        if (((password === '' && checkPassword === '') || (password === '' || checkPassword === '') || (password !== checkPassword)) && type === 'signUp') {
            errors.error = true;
            errors.messages.push("A password is required and must match");
            setMsgGood(false);
        }

        return errors;
    }


    // Handle submit event
    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = validateForm(type);

        if (isValid.error) {
            let str = '';
            for (let i = 0; i < isValid.messages.length; i++) {
                if (i === 0) {
                    str = isValid.messages[i]
                } else {
                    str = str + ', ' + isValid.messages[i];
                }
            }
            return setMessage(str);
        } else if (type === 'signUp') {
            setMsgGood(true);
            // Send request to the sign up and back end
            let data = {
                "username": userName,
                "contact": contact,
                "email": email,
                "password": password
            }
            signUp(data).then(data => {
                setResponse(data);
                console.log(data);
            });
        } else {
            setMsgGood(true);
            // Login and let backend deal with validation
            let data = {
                'username': userName,
                'password': password
            }
            logIn(data)
                .then(data => {
                    setResponse(data);
                    dispatch(login([data.token, userName]))
                }).then(navigate("/"));
            // Add page redirect here
        }

    }

    return (
        <div className="d-flex flex-column justify-content-center big-height">
            <div className="card text-center w-85 mx-auto">
                <div className="card-body">
                    <div className="card-title display-4">
                        <p className="card-title-custom text-center">
                            <span className="font-italic">
                                {(type === 'signUp' ? 'Sign Up' : 'Login')}
                            </span>
                        </p>
                    </div>
                    <div className="lead">
                        After signing up and logging in, you can add skaters to your profile in the profile tab
                    </div>
                    <hr className="hr-tertiary w-90 mx-auto" />
                    <div className="card-body">
                        <form onSubmit={handleSubmit} className="form-group row">
                            <div className='col-5 mx-auto'>
                                <div className={"mx-auto my-2 " + (msgGood ? 'text-success' : 'text-danger')}>
                                    {message}
                                </div>
                                <div className={"mx-auto my-2 " + (!response.error ? 'text-success' : 'text-danger')}>
                                    {response.message}
                                </div>
                            </div>

                            <div className="row w-75 mx-auto my-2">
                                <label htmlFor="userName" className="col-md-3">Username:</label>
                                <input type="text" name="userName" className="form-control col" onChange={(e) => { setUserName(e.target.value) }} />
                                <label className="col-md-3"></label>

                            </div>

                            <div className={"row w-75 mx-auto my-2 " + (type === 'signUp' ? '' : 'd-none')}>
                                <label htmlFor="contact" className="col-md-3">Contact Number:</label>
                                <input type="number" name="contact" className="form-control col" onChange={(e) => { setContact(e.target.value) }} />
                                <label className="col-md-3"></label>

                            </div>

                            <div className={"row w-75 mx-auto my-2 " + (type === 'signUp' ? '' : 'd-none')}>
                                <label htmlFor="email" className="col-md-3">Email Address:</label>
                                <input type="email" name="email" className="form-control col" onChange={(e) => { setEmail(e.target.value) }} />
                                <label className="col-md-3"></label>
                            </div>

                            <div className="row w-75 mx-auto my-2">
                                <label htmlFor="password" className="col-md-3">Password:</label>
                                <input type="password" name="password" className={"form-control col " + ((password.length > 0 && password.length < 8) ? 'border-danger' : '')} onChange={(e) => { setPassword(e.target.value) }} />
                                <label className="col-md-3"></label>
                                <label htmlFor="password" className={'text-danger  ' + ((password.length > 0 && password.length < 8) ? 'd-block' : 'd-none')} >Password needs to be at least 8 characters.</label>

                            </div>
                            <div className={"row w-75 mx-auto my-2 " + (type === 'signUp' ? '' : 'd-none')}>
                                <label htmlFor="checkPassword" className="col-md-3">Check Password:</label>
                                <input type="password" name="checkPassword" className={"form-control col " + ((checkPassword !== password && password.length >= 8) ? 'border-danger' : '')} onChange={(e) => { setCheckPassword(e.target.value) }} />
                                <label className="col-md-3"></label>
                                <label htmlFor="password" className={'text-danger  ' + ((checkPassword !== password && password.length >= 8) ? 'd-block' : 'd-none')} >Passwords need to match</label>

                            </div>
                            <div className="row w-75 mx-auto my-2">
                                <button className="btn custom-btn w-50 mx-auto" type="submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}
export default LoginSignUp