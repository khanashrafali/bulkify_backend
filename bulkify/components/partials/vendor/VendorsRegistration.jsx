import React, {useState} from 'react';
import Form1 from '~/pages/registration/form1'
import Form2 from '~/pages/registration/form2'

// function Forming() {
//     const [step, setPage] = useState(0);


// const FormTitles = [""];

// const PageDisplay = () =>{
//     if(step === 0){
//         return <Form1 />;
//     }else if(step === 1){
//         return <Form2 />;
//     }
// };


const VendorsRegistration = () => (
    <div
        className="ps-vendor-banner bg--cover"
        style={{ backgroundImage: "url('/static/img/bg/vendor.jpg')" }}
    >
                <div className="ps-my-account">
                <div className="container">
                    {/* {PageDisplay()} */}
                    <Form1 />
                </div>
                
            </div>
        </div>
);

export default VendorsRegistration;
