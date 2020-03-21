import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, "Must have 2 minimum characters")
        .max(100, "Must not be greater than 100 characters")
        .required("Must not be empty"),
});


export default function AddProduct() {
    const addNewProduct = (values) => {
        axios.post(`http://localhost:3000/api/addproduct`, {values})
            .then(res => {
                console.log(res);
            })
            .catch(function (err) {
                console.log("Error", err)
            });

/*        axios.post(`http://localhost:3000/api/updateproduct`, {values:{id:3}})
            .then(res => {
                console.log(res);
            })
            .catch(function (err) {
                console.log("Error", err)
            });*/

/*        axios.post(`http://localhost:3000/api/deleteproduct`, {values:{id:6}})
            .then(res => {
                console.log(res);
            })
            .catch(function (err) {
                console.log("Error", err)
            });*/
    };
    return(
        <Formik
        initialValues={{title:'', description:''}}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
            setTimeout(() => {
                addNewProduct(values);
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
                             <label htmlFor="title">Product title</label>
                             <input
                                 type="text"
                                 name="title"
                                 id="title"
                                 placeholder="Enter Product Name"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.title}
                                 className={touched.title && errors.title ? 'has-error' : null}
                             />
                             <Error touched={touched.title} message={errors.title}/>
                         </div>
                         <div className={"input-row"}>
                             <label htmlFor="description">Product description</label>
                             <input
                                 type="text"
                                 name="description"
                                 id="description"
                                 placeholder="Enter description"
                                 onChange={handleChange}
                                 onBlur={handleBlur}
                                 value={values.description}
                                 className={touched.description && errors.description ? 'has-error' : null}
                             />
                             <Error touched={touched.description} message={errors.description}/>
                         </div>
                         <div className={"input-row"}>
                             <button type="submit" disabled={isSubmitting}>
                                 Add Product
                             </button>
                         </div>
                     </form>
                )
            }
        </Formik>
    )
}
