import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';
import {Button} from "semantic-ui-react";
import {Row} from 'react-bootstrap'
import {Link} from "react-router-dom";
import {toast} from "react-toastify";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your email address"),
    password: Yup.string()
        .required("Please enter your password")
});



export default function Login() {

    const notify = (message) => {
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER
        });
    };

    const handleLogin = (values) => {
        axios.post('http://localhost:5000/api/login', {values})
            .then(response => {
                if(response.data.login_status === 'invalid'){
                    notify('Invalid email address or password! ' +
                        'Please try to login again or register.');
                }else{
                    localStorage.setItem('login', JSON.stringify({
                        login: true,
                        id: response.data.id,
                        name: response.data.name,
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
                        <Row><label htmlFor="email">Email</label></Row>
                        <Row>
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
                        </Row>
                        <Row><label htmlFor="description">Password</label></Row>
                        <Row>

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
                        </Row>
                        <Error message={errors.invalid}/>
                        <Row className="button-alignment">
                            <Link className="anchor-tag" to={'/register'}>Not registered yet? Click here to register</Link>
                            <Button primary disabled={isSubmitting}>
                                Login
                            </Button>
                        </Row>
                    </form>
                )
            }
        </Formik>
    )
}
