import React, {Component} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';
import {Link} from "react-router-dom";
import {Row} from 'react-bootstrap'
import {Button} from "semantic-ui-react";
import {toast} from "react-toastify";

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

const notify = (message) => {
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER
    });
};

const handleRegister = (values) => {
    axios.post('http://localhost:5000/api/register', {values})
        .then(response => {
            notify('You have been successfully registered! ' +
                'Please login to use our service');
            console.log(response);
        })
        .catch(function (err) {
            notify('Error ! Don\'t worry try again.');
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
                            <Row><label htmlFor="name">Name</label></Row>
                            <Row>
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
                            </Row>
                            <Row><label htmlFor="title">Email</label></Row>
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
                            <Error message={this.state.success}/>
                            <Row className="button-alignment">
                                <Link className="anchor-tag" to={'/'}>Already registered? Click here to login</Link>
                                <Button floated='right' primary disabled={isSubmitting}>
                                    Register
                                </Button>
                            </Row>
                        </form>
                    )
                }
            </Formik>
        )
    }
}

export default Register;
