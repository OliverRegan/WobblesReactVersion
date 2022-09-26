// React components
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


async function createSkater(data, token) {

    // Make body of request
    let body = {
        "firstName": data.firstName,
        "contact": data.contact,
        "lastName": data.lastName,
        "dob": data.dob
    }

    return fetch("http://127.0.0.1:3001/users/addSkater", {
        method: "POST",
        headers: {
            'Authorization': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)

    }).then(res => res.json())

}


const AddSkater = props => {
    // Set input states
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState();
    const [contact, setContact] = useState(0);
    const [msgGood, setMsgGood] = useState(true);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState({});


    const nav = useNavigate();
    // Get token
    const token = useSelector((state) => state.loggedIn);
    console.log(token.value)


    function validateForm() {

        // init error JSON
        let errors = {
            error: false,
            messages: []
        }

        // Check username
        if (firstName === '') {
            errors.error = true;
            errors.messages.push("A username is required");
            setMsgGood(false);

        }

        // Check contact
        if (contact === 0) {
            errors.error = true;
            errors.messages.push("A contact number is required");
            setMsgGood(false);

        }

        if (lastName === '') {
            errors.error = true;
            errors.messages.push("A last name is required");
            setMsgGood(false);

        }

        if (dob === undefined) {
            errors.error = true;
            errors.messages.push("A date of birth is required");
            setMsgGood(false);

        }

        return errors;
    }
    function handleSubmit(event) {
        event.preventDefault();

        console.log(token.value)
        if (token.value) {
            // Validate the form
            const isValid = validateForm();

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
            } else {
                // No errors, proceed
                let data = {
                    'firstName': firstName,
                    'lastName': lastName,
                    'contact': contact,
                    'dob': dob
                }


                createSkater(data, token.token).then(data => {
                    setResponse(data);
                    console.log(data);
                    document.getElementById('mainForm').reset();
                });

            }

        } else {
            // Navigate to login page if somehow manage to submit and unauthorized
            nav("/login")
        }
    }

    return (
        <div className="d-flex flex-column justify-content-center big-height">
            <div className="card text-center w-85 mx-auto">
                <div className="card-body">
                    <p className="card-title-custom text-center">
                        <span className="font-italic">
                            Add a new skater
                        </span>
                    </p>
                    <hr className="hr-tertiary w-80 mx-auto" />
                    <div>{token === '' ? 'You need to login to view this page'
                        :
                        <div className="w-80 mx-auto">
                            <div className="row">
                                <form onSubmit={handleSubmit} className="col-6 mx-auto" id={'mainForm'}>
                                    <div className='col-5 mx-auto'>
                                        <div className={"mx-auto my-2 " + (msgGood ? 'text-success' : 'text-danger')}>
                                            {message}
                                        </div>
                                        <div className={"mx-auto my-2 " + (!response.error ? 'text-success' : 'text-danger')}>
                                            {response.message}
                                        </div>
                                    </div>
                                    <div className='d-flex my-4'>
                                        <label htmlFor="firstName" className='col-3'>
                                            First Name:
                                        </label>
                                        <input type="text" name="firstName" className='form-control' onChange={event => setFirstName(event.target.value)} />
                                    </div>
                                    <div className='d-flex my-4'>
                                        <label htmlFor="firstName" className='col-3'>
                                            Last Name:
                                        </label>
                                        <input type="text" name="lastName" className='form-control' onChange={event => setLastName(event.target.value)} />
                                    </div>
                                    <div className='d-flex my-4'>
                                        <label htmlFor="firstName" className='col-3'>
                                            Date of Birth:
                                        </label>
                                        <input type="date" name="DOB" className='form-control' onChange={event => setDob(event.target.value)} />
                                    </div>
                                    <div className='d-flex my-4'>
                                        <label htmlFor="firstName" className='col-3'>
                                            Emergency Contact Number:
                                        </label>
                                        <input type="number" name="contact" className='form-control' onChange={event => setContact(event.target.value)} />
                                    </div>
                                    <div className='d-flex my-4'>
                                        <button className='custom-btn btn col-12 mx-auto'>Submit</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    }</div>

                    <hr className="hr-tertiary w-80 mx-auto" />
                </div>
            </div>
        </div >
    )
}
export default AddSkater