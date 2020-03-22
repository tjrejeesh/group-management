import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your email address"),
    password: Yup.string()
        .required("Please enter your password")
});


export default function Login() {
    const handleLogin = (values) => {
        axios.post('http://localhost:5000/api/login', {values})
            .then(response => {
                console.log(response);
                if(response.data.login_status === 'invalid'){

                }else{
                    localStorage.setItem('login', JSON.stringify({
                        login: true,
                        id: response.data.id,
                        email: response.data.email
                    }));
                    localStorage.setItem('token', JSON.stringify({
                        token: response.data.token,
                    }));
                    window.location = '/home';
                }
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    };
    return(
        <Formik
            initialValues={{email:'', password:''}}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                setTimeout(() => {
                    handleLogin(values);
                    actions.setSubmitting(false);
                }, 1000);
            }}
        >
            {
                ({
                     values,
                     errors,
                     touched,
                     handleChange,
                     handleBlur,
                     handleSubmit,
                     isSubmitting
                 }) => (
                    <form onSubmit={handleSubmit}>
                        <div className={"input-row"}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Enter your email address"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className={touched.email && errors.email ? 'has-error' : null}
                            />
                            <Error touched={touched.email} message={errors.email}/>
                        </div>
                        <div className={"input-row"}>
                            <label htmlFor="description">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className={touched.password && errors.password ? 'has-error' : null}
                            />
                            <Error touched={touched.password} message={errors.password}/>
                        </div>
                        <Error message={errors.invalid}/>
                        <div className={"input-row"}>
                            <button type="submit" disabled={isSubmitting}>
                                Login
                            </button>
                        </div>
                    </form>
                )
            }
        </Formik>
    )
}
