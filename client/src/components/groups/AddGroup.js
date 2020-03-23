import React, {Component} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Error from "../common/Error";
import axios from 'axios';
import {Link} from "react-router-dom";
import { Button } from 'semantic-ui-react'

const validationSchema = Yup.object().shape({
    gname: Yup.string()
        .min(2, "Please enter minimum 2 characters")
        .max(255, "Your group name is too long")
        .required("Please enter your group name"),
    description: Yup.string()
        .max(255, "Your description is too long")
});

const handleAddGroup = (values) => {
    let store = JSON.parse(localStorage.getItem('token'));
    let loggedInUser = JSON.parse(localStorage.getItem('login'));
    let token = "Bearer " + store.token;
    axios.post('http://localhost:5000/api/group/add',
        {
            headers: {
                'authorization': token
            },
            values: {
                ...values,
                userId: loggedInUser.id,
                createdAt: new Date().getTime() + (new Date().getTimezoneOffset() * 60000)
            }
        })
        .then(response => {
            window.location = '/mygroups';
            console.log(response);
        })
        .catch(function (err) {
            console.log("Error", err)
        });
};

const handleUpdateGroup = (groupId, values) => {
    let store = JSON.parse(localStorage.getItem('token'));
    let token = "Bearer " + store.token;
    axios.post('http://localhost:5000/api/group/update',
        {
            headers: {
                'authorization': token
            },
            values: {
                ...values,
                groupId: groupId
            }
        })
        .then(response => {
            window.location = '/mygroups';
            console.log(response);
        })
        .catch(function (err) {
            console.log("Error", err)
        });
};

class AddGroup extends Component{
    constructor(props){
        super(props);
        this.state = {
            success: false,
            gname:null,
            description: null
        }
    }

    componentDidMount() {
        const {groupId} = this.props;
        if(groupId) {
            let store = JSON.parse(localStorage.getItem('token'));
            let token = "Bearer " + store.token;
            axios.post('http://localhost:5000/api/group/edit',
                {
                    headers: {
                        'authorization': token
                    },
                    values: {
                        group_id: groupId,
                    }
                })
                .then(res => {
                    console.log(res.data.results[0].gname);
                    this.setState({
                        groupId: res.data.results[0].id,
                        gname: res.data.results[0].gname,
                        description: res.data.results[0].description
                    });
                })
                .catch(function (err) {
                    console.log("Error", err)
                });
        }
    }

    render(){
        const {gname, description} = this.state;
        const {groupId} = this.props;
        return (
            <Formik
                initialValues={{
                    gname: gname ? gname : '',
                    description: description ? description : ''
                }}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values={
                    created_by:1,
                    created_time: 'time'
                }, actions) => {
                    setTimeout(() => {
                        if(!groupId){handleAddGroup(values)}
                        else{
                            handleUpdateGroup(groupId, values)
                        }
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
                                <label htmlFor="gname">Group Name</label>
                                <input
                                    type="text"
                                    name="gname"
                                    id="gname"
                                    placeholder="Enter your group name"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.gname}
                                    className={touched.gname && errors.gname ? 'has-error' : null}
                                />
                                <Error touched={touched.gname} message={errors.gname}/>
                            </div>
                            <div className={"input-row"}>
                                <label htmlFor="description">description</label>
                                <input
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Enter your description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    className={touched.description && errors.description ? 'has-error' : null}
                                />
                                <Error touched={touched.description} message={errors.description}/>
                            </div>
                            <Error message={this.state.success}/>
                            <div className={"input-row"}>
                                <Button className="add-group" floated='right' primary disabled={isSubmitting}>
                                    {!groupId ? 'Add Group' : 'Update'}
                                </Button>
                                {!groupId ? <Link to={'/home'}>Home</Link> : ''}
                            </div>
                        </form>
                    )
                }
            </Formik>
        )
    }
}

export default AddGroup;
