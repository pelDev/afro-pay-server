import { Formik, Form, Field } from "formik";
import Afropay from"./assets/afropay.jpeg"
import { RegisterFn } from "./utils";
import {useNavigate} from 'react-router-dom';

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
            // id:""
            }}
            onSubmit={async (values, { resetForm }) => {
                const response = await RegisterFn(values)
                console.log(response)
                resetForm()
                navigate('/success')
            }}  
        >
            {() => (
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
                {/* <div className="form-item">
                    <label>
                        Upload an id document <span className="text-red-700 text-xl">*</span>
                    </label>
                    <Field
                        type="file"
                        id="id"
                        name="id"
                        className="border-2 border-gray-300 rounded-md p-2"
                    />
                </div> */}
                <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 w-8/12 mx-auto my-4"
                >
                Register
                </button>
            </Form>
            )}
        </Formik>
        </main>
    </section>
  );
}