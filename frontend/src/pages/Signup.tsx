import {  Sup } from "../components/Sup";
import { Quote } from "../components/Quote";

function Signup() {
    return (
        <>
        <div className="grid grid-cols-1 lg:grid grid-cols-2">
        <div>
            <Sup/>
        </div>

        <div className="invisible lg:visible">
        <Quote/>
        </div>
        
        </div>
        </>
    )
}
export default Signup;