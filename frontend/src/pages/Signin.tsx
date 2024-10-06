import { Quote } from "../components/Quote";
import { Sin } from "../components/Sin";

function Signin() {
    return (
        <>
        <div className="grid grid-cols-1 lg:grid grid-cols-2">
        <div>
           <Sin/>
        </div>

        <div className="invisible lg:visible">
        <Quote/>
        </div>
        
        </div>
        </>
    )
}
export default Signin;