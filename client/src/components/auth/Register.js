import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types'


const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value})
  const onSubmit = async e => {
    e.preventDefault();
    if(password !== password2){
      setAlert('Passwords so not match', 'danger')
    } else {
      console.log("SUCCESS")
      // const newUser = {
      //   name,
      //   email,
      //   password
      // }

      // try {
      //   const config = {
      //     headers: {
      //       "Content-Type": 'application/json'
      //     }
      //   }

      //   const body = JSON.stringify(newUser);

      //   const res = await axios.post('/api/user', body, config);
      //   console.log(res.data)
      //   } catch(err) {
      //     console.log(err.response.data);
      //   }
    }
  }

  return (
    <Fragment >
       <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={ e => onSubmit(e)} >
        <div className="form-group">
          <input type="text" placeholder="Name" name="name" required value={name} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)}/>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2} onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link >
      </p>
    </Fragment >
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Register);