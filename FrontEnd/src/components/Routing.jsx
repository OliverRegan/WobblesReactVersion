// React & React components
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as outlineStar } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'

// Components
import Layout from "./layout/Layout"
import Home from "./home/Home"
import CoachesAndLessons from './coachesAndLessons/CoachesAndLessons'
import About from './about/About'
import Merch from './merch/Merch'
import Reviews from './reviews/Reviews'
import Booking from './booking/Booking'
import Gallery from './gallery/Gallery'
import Profile from './profile/Profile'
import AddSkater from './profile/addSkater/AddSkater'
import LoginSignUp from './loginSignUp/LoginSignUp'

const Routing = () => {

    const [reviewStars, setReviewStars] = useState([{ 'index': 0, 'icon': solidStar }, { 'index': 1, 'icon': solidStar }, { 'index': 2, 'icon': solidStar }, { 'index': 3, 'icon': solidStar }, { 'index': 4, 'icon': solidStar }])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path='/coachesAndLessons' element={<CoachesAndLessons />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/merch" element={<Merch />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reviews" element={<Reviews reviewStars={reviewStars} setReviewStars={setReviewStars} />} />
                    <Route path="/lessons/:id" element={<Booking />} />
                    <Route path="/login" element={<LoginSignUp type={"login"} />} />
                    <Route path="/signUp" element={<LoginSignUp type={"signUp"} />} />
                    <Route path="/addSkater" element={<AddSkater />} />
                </Route>
            </ Routes>
        </BrowserRouter >
    )
}
export default Routing