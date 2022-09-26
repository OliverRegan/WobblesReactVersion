// React components
import { useEffect } from 'react'
import Feed from "react-instagram-authless-feed"




const Gallery = props => {

    useEffect(() => {
        fetch("https://graph.facebook.com/v14.0/me/accounts?access_token=IGQVJWTWwxblU1Z634hgdf83hjdj2A1lYME1neFFVZAnNHN2ZAJZAFhXX2xsTWgxcUh1VWNHeWd0UjdBcV9QSEQ3WGtSMURVclFxRHJTNFo3UVEwTHBOVnFEdmNwVm9ORW9ZAZA1l5WFhMUzFGZAXhPSWEwaVNB").then((res) => console.log(res))
    }, [])

    return (
        <div className="d-flex flex-column justify-content-center big-height">
            <div className="card text-center w-85 mx-auto">
                <div className="card-body">
                    <div className="card-title display-2">
                        <div class="powr-instagram-feed" id="eb59ab53_1661654351"></div>

                    </div>
                </div>
            </div>
        </div >
    )
}
export default Gallery