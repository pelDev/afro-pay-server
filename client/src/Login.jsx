import { Formik, Form, Field } from "formik";
import Afropay from"./assets/afropay.jpeg"
import { LoginFn } from "./utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react" 

export default function Login() {
    const navigate = useNavigate();

  return (
    <section className="h-screen w-full flex items-center justify-center flex-col bg-slate-100">
        <img src={Afropay} width={200} />
        <main className="h-fit w-7/12 flex items-center">
        <Formik
            initialValues={{
            email: "",
            password: ""
            }}
            onSubmit={async (values, { resetForm }) => {
                const response = await LoginFn(values)
                console.log(response)
                resetForm()
                if (response && response.status === 200){
                    toast.success("Login Successful")
                    setTimeout(()=>{
                        navigate('/dashboard')
                    }, 1500)
                }
                else{
                    toast.error("Login Failed")
                    console.log('Not ok')
                }
            }}  
        >
            {({ isSubmitting }) => (
            <Form className="w-10/12 h-fit m-auto bg-white text-black p-10 rounded-md flex flex-col justify-center gap-5 border-2 border-gray-300">
                <h1 className="text-center text-black text-3xl">Login</h1>
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

                <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 w-8/12 mx-auto my-4 flex flex-row justify-center items-center gap-1 hover:bg-blue-400"
                >
                <span>Login</span>
                { isSubmitting && <Spinner size={"sm"} /> }
                </button>
            </Form>
            )}
        </Formik>
        </main>
    </section>
  );
}