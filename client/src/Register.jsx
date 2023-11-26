import { Formik, Form, Field } from "formik";
import Afropay from"./assets/afropay.jpeg"
import { RegisterFn } from "./utils";
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react" 

export default function Register() {
    const navigate = useNavigate();

  return (
    <section className="h-screen w-full flex items-center justify-center flex-col bg-slate-100">
        <img src={Afropay} width={200} />
        <main className="h-fit w-7/12 flex items-center">
        <Formik
            initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            }}
            onSubmit={async (values, { resetForm }) => {
                const response = await RegisterFn(values)
                console.log(response)
                resetForm()
                if (response && response.status === 200){
                    toast.success("Registration Successful")
                    setTimeout(()=>{
                        navigate('/success')
                    }, 1500)
                }
                else{
                    toast.error("Registration Failed")
                }
            }}  
        >
            {( {isSubmitting} ) => (
            <Form className="w-10/12 h-fit m-auto bg-white text-black p-10 rounded-md flex flex-col justify-center gap-5 border-2 border-gray-300">
                <h1 className="text-center text-black text-3xl">Register</h1>
                <div className="form-item">
                <label>
                    First Name{" "}
                    <span className="text-red-700 text-xl">*</span>
                </label>
                <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Potato"
                    className="border-2 border-gray-300 rounded-md p-2"
                    required
                />
                </div>
                <div className="form-item">
                <label>
                    Last Name{" "}
                    <span className="text-red-700 text-xl">*</span>
                </label>
                <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Doe"
                    className="border-2 border-gray-300 rounded-md p-2"
                    required
                />
                </div>
                <div className="form-item">
                <label>
                    Email <span className="text-red-700 text-xl">*</span>
                </label>
                <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Potato@email.com"
                    className="border-2 border-gray-300 rounded-md p-2"
                    required
                />
                </div>

                <div className="form-item">
                <label>
                    Password <span className="text-red-700 text-xl">*</span>
                </label>
                <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="*******"
                    className="border-2 border-gray-300 rounded-md p-2"
                    required
                />
                </div>
                <div className="form-item">
                    <label>
                        Verify your Identity <span className="text-red-700 text-xl">*</span>
                    </label>
                    <p className="text-gray-500 text-sm mx-3">To verify your identity, please share an identity document in your digiLocker account with the afropay organization <span className="font-bold text-sm">arjentsicko@gmail.com</span>.</p>
                    <p className="text-gray-500 text-sm mx-3">Note, transactions would be activated once identity has been successfully verified.</p>
                    <div className="flex flex-row gap-2 items-center">
                        <Field
                            type="checkbox"
                            id="id"
                            name="id"
                            className="border-2 border-gray-300 rounded-md p-2 cursor-pointer"
                            required
                        />
                        <p className="text-sm">I have shared my id <span className="text-red-700 text-xl">*</span></p>
                    </div>
                </div>
                <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 w-8/12 mx-auto my-4 flex flex-row justify-center items-center gap-1 hover:bg-blue-400"
                >
                <span>Register</span>
                { isSubmitting && <Spinner size={"sm"} /> }
                </button>
            </Form>
            )}
        </Formik>
        </main>
    </section>
  );
}