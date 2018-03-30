import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import IconLink from '../components/util/icon-link';

import {connect} from 'react-redux';
import {createPost} from '../actions/index';


class PostsNew extends Component {

    renderField(field) {

        const className = `form-group ${field.meta.touched && field.meta.error ? "input-invalid" : ""}`;

        return <div className={className}>
            <label>{field.label}</label>
            <input className='form-control' type="text" {...field.input} />

            <small className='field-invalid'>
                {field.meta.touched ? field.meta.error : ""}
            </small>
        </div>
    }

    onSubmit(values) {
        this.props.createPost(values, () => {
            this.props.history.push('/');
        });
    }

    render() {

        const {handleSubmit} = this.props;

        return (
            <div className='row'>
                <div className='col-9'>
                <div className='align-right'>
                    <IconLink to='/' icon='fa-bars'>Back To Index</IconLink>
                </div>

                <h3>Add a Post</h3>

                <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                    <Field label="Title" name="title" component={this.renderField}/>
                    <Field label="Categories" name="categories" component={this.renderField}/>
                    <Field label="Content" name="content" component={this.renderField}/>
                    <div className='row'>
                        <button type="submit" className="btn btn-primary col-3">Submit</button>
                        <Link to='/' className="btn btn-secondary col-3">Cancel</Link>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}

function validate(values) {

    const errors = {};
    if (!values.title) {
        errors.title = "Enter a title";
    }
    if (!values.categories) {
        errors.categories = "Enter a category";
    }
    if (!values.content) {
        errors.content = "Enter a content";
    }
    return errors;
}

export default reduxForm({
    validate: validate,
    form: 'PostsNewForm'
})(
    connect(null, {createPost})(PostsNew)
);