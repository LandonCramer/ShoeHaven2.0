import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../Helpers/AuthProvider';

//toast
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const navigate = useNavigate();
    const { handleSetUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const validateForm = () => {
      let tempErrors = {};
      let formIsValid = true;
  
      if (!formData.username || formData.username.trim() === '') {
        formIsValid = false;
        tempErrors['username'] = 'Username is required';
      }
      // Add more validation logic here later
  
      setErrors(tempErrors);
      return formIsValid;
    };
  
 

  const submitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast('Not valid')
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast('Passwords do not match');
      return;
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    };

    fetch('/signup', requestOptions)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if (data.user) {
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        handleSetUser(data.user); // Update the global state with the logged-in user
        navigate('/'); // Navigate to the home page or dashboard
      } else if(data.message) {
        toast(data.message)
      }
    })
    .catch(err => toast(err));
};


  return (
    <div className="container">
      <div className="form">
        <h1>Sign Up Page</h1>
        <Form onSubmit={submitForm}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <small style={{ color: 'red' }}>{errors.username}</small>}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small style={{ color: 'red' }}>{errors.email}</small>}
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
            {errors.password && <small style={{ color: 'red' }}>{errors.password}</small>}
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <small style={{ color: 'red' }}>{errors.confirmPassword}</small>}
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            SignUp
          </Button>
          <Form.Group>
            <small>
              Already have an account? <Link to="/login">Login In</Link>
            </small>
          </Form.Group>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;