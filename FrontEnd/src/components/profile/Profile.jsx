// React components
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Profile = props => {

    const [userData, setUserData] = useState();

    // Get token
    const token = useSelector((state) => state.loggedIn.token);

    useEffect(() => {
        let headers = new Headers();
        headers.append('Accept', 'application/json')
        headers.append('Content-Type', 'application/json')
        headers.append('Authorization', token)
        // Fetch data
        fetch(("http://localhost:3001/users/profile"), {
            method: 'GET',
            headers: headers
        })
            .then((res) => {
                res.json().then((data) => {
                    if (!data.error) {
                        setUserData(data)
                    }
                    console.log(data)
                    // Split skaters into array
                })
            })
    }, [])

    return (
        <div className="d-flex flex-column justify-content-center big-height">
            <div className="card text-center w-85 mx-auto">
                <div className="card-body">
                    <p className="card-title-custom text-center">
                        <span className="font-italic">
                            Profile
                        </span>
                    </p>
                    <hr className="hr-tertiary w-80 mx-auto" />
                    {userData == null ?
                        <div>{token === '' ? 'You need to login to view this page' : 'Loading...'}</div>
                        :
                        <div className="w-80 mx-auto">
                            <div className="row">
                                <ul className="list-group col-6">
                                    <li className="list-group-item bg-main text-light">Current Skaters:</li>
                                    {userData.skaters.map((skater) => {
                                        return <li className="list-group-item">
                                            <div>
                                                Date of birth: {skater.skaterDOB}
                                            </div>
                                            <div>
                                                Name: {skater.skaterName + " " + skater.skaterLastName}
                                            </div>
                                            <div>
                                                Emergency contact number: {skater.skaterEmergencyContact}
                                            </div>

                                        </li>
                                    })}
                                    <li className="list-group-item">

                                        {/* <label htmlFor="addSkater">Add Skater:</label> */}
                                        {/* <input type="text" name="addSkater" className="form-control" /> */}
                                        <Link to="/addSkater" className="btn custom-btn w-100 my-2">Add new skater</Link>

                                    </li>
                                </ul>
                                <div className="col-6 d-flex flex-column">
                                    <div className="row justify-content-center">
                                        <p className="col-3 text-start">Username:</p>
                                        <p className="col-3 text-start">{userData.username}</p>
                                    </div>
                                    <div className="row justify-content-center">
                                        <p className="col-3 text-start">Email:</p>
                                        <p className="col-3 text-start">{userData.email}</p>
                                    </div>
                                    <div className="row justify-content-center">
                                        <p className="col-3 text-start">Contact:</p>
                                        <p className="col-3 text-start">{userData.contact}</p>
                                    </div>
                                    <button className="btn custom-btn my-2 w-50 mx-auto">Edit Profile</button>
                                </div>
                            </div>
                        </div>
                    }
                    <hr className="hr-tertiary w-80 mx-auto" />
                </div>
            </div>
        </div >
    )
}
export default Profile