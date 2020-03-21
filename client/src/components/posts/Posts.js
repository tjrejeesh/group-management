import React, {Component} from 'react';
import axios from "axios";

class Posts extends Component{
    constructor(){
        super();
        this.state = {
            posts : []
        }
    }
    componentDidMount(){
        axios.get(`http://localhost:3000/api/posts`)
            .then(res => {
                const posts = res.data;
                this.setState({ posts });
            })
            .catch(function (err) {
                console.log("Error", err)
            });
    }
    render(){
        return (
            <div>
                {
                    this.state.posts.map(post =>
                        <li key={post.id}>{post.title}</li>
                    )
                }
            </div>
        )
    }
}

export default Posts;
