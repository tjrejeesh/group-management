import React, {Component} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';
import {Link} from "react-router-dom";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Please enter minimum 2 characters")
        .max(255, "Your name is too long")
        .required("Please enter your name"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Please enter your email address"),
    password: Yup.string()
        .required("Please enter your password")
});

const handleRegister = (values) => {
    axios.post('http://localhost:5000/api/register', {values})
        .then(response => {
            console.log(response);
        })
        .catch(function (err) {
            console.log("Error", err)
        });
};

class Register extends Component{
    constructor(){
        super();
        this.state = {
            success: false
        }
    }
    render(){
        return (
            <Formik
                initialValues={{name:'', email:'', password:''}}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    setTimeout(() => {
                        handleRegister(values);
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
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter your name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.name}
                                    className={touched.name && errors.name ? 'has-error' : null}
                                />
                                <Error touched={touched.name} message={errors.name}/>
                            </div>
                            <div className={"input-row"}>
                                <label htmlFor="title">Email</label>
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
                            <Error message={this.state.success}/>
                            <div className={"input-row"}>
                                <button type="submit" disabled={isSubmitting}>
                                    Register
                                </button>
                                <Link to={'/'}>Login</Link>
                            </div>
                        </form>
                    )
                }
            </Formik>
        )
    }
}

export default Register;
