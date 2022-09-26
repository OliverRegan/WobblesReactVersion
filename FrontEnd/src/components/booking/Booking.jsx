// React components
import { useEffect, useState, useRef } from 'react'
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router'

// Image
import lessonImg from "../../assets/img/lessons/Beginner-Court-Lesson.jpg"

const Booking = props => {

    let headers = new Headers();
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')

    const { id } = useParams();

    // form data
    const [data, setData] = useState();
    const bookingNum = useRef();
    const bookingDay = useRef();
    const bookingDate = useRef();
    const bookingTime = useRef();
    const bookingSkaters = useRef();


    // lesson data
    const [lessonLoading, setLessonLoading] = useState(true)
    const [lesson, setLesson] = useState([])
    // user data
    const [userLoading, setUserLoading] = useState(true)
    const [userSkaters, setUserSkaters] = useState()
    const [selectedSkaters, setSelectedSkaters] = useState([])

    let user;
    const selector = useSelector()
    const navigate = useNavigate()
    // Fetch ID data for user
    useEffect(() => {

        // Check if user is logged in, otherwise reroute to login
        const loggedIn = selector((state) => state.loggedIn.value);

        if (!loggedIn) {
            navigate('/login');
        }


        function getData() {
            fetch(("http://localhost:3001/lessons/" + id), {
                method: 'GET',
                headers: headers
            })
                .then((res) => {
                    res.json().then((data) => ({
                        data: data,
                        status: res.status
                    })).then(response => {
                        setLesson(response.data)
                    }).finally(() => {
                        setLessonLoading(false)
                    })
                })
            // fetch(("http://localhost:3001/users/" + props.loggedIn), {
            //     method: 'GET',
            //     headers: headers
            // })
            //     .then((res) => {
            //         res.json().then((data) => ({
            //             data: data,
            //             status: res.status
            //         })).then(response => {
            //             setUser(response.data[0])
            //         }).finally(() => {
            //             setUserLoading(false)

            //         })
            //     })
        }

        getData();

    }, [useSelector, useNavigate])

    if (!userLoading && userSkaters == undefined) {
        setUserSkaters(user.userSkaters)
    }

    const removeSkaters = (event) => {
        event.preventDefault();
        setSelectedSkaters([]);
        bookingSkaters.current.value = 'Select Skater...';
    }

    // on Submit
    const handleSubmit = async (event) => {

        event.preventDefault();
        console.log(bookingDate.current.value)
        // Test picked date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',]

        let date = new Date(bookingDate.current.value)

        // Prevent booking if wrong day input
        if (days[date.getDay()] != bookingDay.current.value) {
            return alert("Must pick a date that is the same Day as your chosen lesson")
        }


        // Get form data for submission
        const bookingNum = selectedSkaters.length;

        let body = {
            "skaters": JSON.stringify(selectedSkaters),
            "number": bookingNum,
            "user": props.loggedIn,
            "time": bookingTime.current.value,
            "day": bookingDay.current.value,
            "date": bookingDate.current.value
        }

        fetch("http://localhost:3001/booking", {
            method: 'POST',
            headers: headers
        })
            .then((res) => {
                res.json().then((data) => ({
                    data: data,
                    status: res.status
                })).then(response => {
                    setData(response.data)
                }).catch(
                    // Catch error response from back end

                )
            })
    }

    return (
        <div className="my-4 big-height">
            <div className="card text-center w-85 mx-auto">
                <div className="card-body">
                    <div className="w-65 rounded mx-auto  justify-content-around">
                        <p className="card-title-custom text-center">
                            <span className="font-italic">
                                Booking
                            </span>
                        </p>
                    </div>
                    <hr className="hr-tertiary w-80 mx-auto" />
                    <ul className="list-group list-group-flush w-60 mx-auto">
                        <li className="row">
                            <div className="col-md-4">
                                <img src={lessonImg} alt="" className="img-fluid rounded" />
                            </div>
                            <div className="col-md-8">
                                {lessonLoading ?
                                    (<div className='display-1'>Loading</div>)
                                    :
                                    (<form onSubmit={(event) => handleSubmit(event)} className="row h-100 justify-content-center">
                                        <h1 className="col-12 h3">{lesson[0].lessonName}</h1>
                                        <div className="col-5 my-3">${lesson[0].lessonPrice}</div>
                                        <div className="col-5 my-3">Spaces remaining: {lesson[0].lessonCapacity - lesson[0].lessonBookedNum + "/" + lesson[0].lessonCapacity}</div>
                                        <div className="col-5 my-3">
                                            <select className='form-control' name="day" ref={bookingDay}>
                                                <option value={lesson[0].lessonDay}>{lesson[0].lessonDay}</option>
                                            </select>
                                        </div>
                                        <div className="col-5 my-3">
                                            <select className='form-control' name="time" ref={bookingTime}>
                                                <option value={lesson[0].lessonTime}>{lesson[0].lessonTime}</option>
                                            </select>
                                        </div>
                                        <div className="col-10 text-start">
                                            <p><span className='lead'>Current Skaters: </span><span>{JSON.stringify(selectedSkaters) === JSON.stringify([]) ? "No skaters selected yet..." : selectedSkaters.map((skater) => {
                                                return <span key={userSkaters.indexOf(skater)}>{skater + " "}</span>
                                            })}</span></p>
                                            {JSON.stringify(selectedSkaters) === JSON.stringify([]) ? "" : <a href="#" onClick={(event) => {
                                                removeSkaters(event);
                                            }} className='text-light text-decoration-none btn btn-danger mx-auto w-100'>Clear Skaters</a>}
                                        </div>

                                        <div className="col-5 my-3">
                                            {userSkaters == undefined ?
                                                <input type="text" className='form-control' disabled placeholder="No skaters on Your profile " />
                                                :
                                                <select className='form-control' name="skaters" ref={bookingSkaters} onChange={() => {
                                                    let tmp = [];
                                                    selectedSkaters.forEach((skater) => {
                                                        tmp.push(skater);
                                                    })
                                                    if (!selectedSkaters.includes(bookingSkaters.current.value) && bookingSkaters.current.value != "Select Skater...") {
                                                        tmp.push(bookingSkaters.current.value)
                                                        setSelectedSkaters(tmp)
                                                    }
                                                }}>
                                                    <option>Select Skater...</option>
                                                    {userSkaters.split(", ").map((skater) => { { return <option value={skater} key={userSkaters.split(", ").indexOf(skater)} className={selectedSkaters.includes(skater) ? "d-none" : "d-block"} >{skater}</option> } })}
                                                </select>
                                            }
                                        </div>
                                        <div className="col-5 my-3">
                                            <input type="date" className='form-control' name="bookingDate" ref={bookingDate} />
                                        </div>
                                        <div className="col-5 my-3">Total Cost: ${selectedSkaters.length * lesson[0].lessonPrice}</div>
                                        <div className="col-8 d-flex flex-column justify-content-center my-3">
                                            <button className="btn custom-btn ">Book</button>
                                        </div>

                                    </form>)}
                            </div>
                            <hr className="mx-auto mt-3" />
                        </li>
                    </ul>
                </div>
            </div>
        </div >
    )
}
export default Booking