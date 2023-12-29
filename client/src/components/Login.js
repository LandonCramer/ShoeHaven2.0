import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../Helpers/AuthProvider'; // Adjust this import based on your context file location

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { handleSetUser } = useContext(UserContext); // Assuming handleSetUser is a method in your context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let tempErrors = {};
        let formIsValid = true;

        if (!formData.username || formData.username.trim().length > 25) {
            formIsValid = false;
            tempErrors['username'] = 'Username is required and should be less than 25 characters';
        }

        if (!formData.password || formData.password.length < 8) {
            formIsValid = false;
            tempErrors['password'] = 'Password is required and should be more than 8 characters';
        }

        setErrors(tempErrors);
        return formIsValid;
    };

    const loginUser = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        };

        fetch('/login', requestOptions)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(resObj => {
                            localStorage.setItem("accessToken", resObj.access_token);
                            localStorage.setItem("refreshToken", resObj.refresh_token);
                            // login(resObj.access_token);
                            handleSetUser(resObj.db_user); // Assuming you have this method in your context
                            navigate('/');
                        });
                } else {
                    res.json().then(errObj => alert(errObj.message));
                }
            });
    };

    return (
        <div className="container">
            <div className="form">
                <h1>Login Page</h1>
                <Form onSubmit={loginUser}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Your username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p style={{ color: 'red' }}><small>{errors.username}</small></p>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p style={{ color: 'red' }}><small>{errors.password}</small></p>}
                    </Form.Group>
                    <br />
                    <Button type="submit" variant="primary">Login</Button>
                    <Form.Group>
                        <small>Do not have an account? <Link to='/signup'>Create one</Link></small>
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;