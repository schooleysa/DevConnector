const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator');

// get user model
const User = require('../../models/User')

router.post('/', 
[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password', 'Please enter a password with 6 or more characters'
    ).isLength({ min: 6})
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
    // see if user exists, if so send error saying they exist
        let user = await User.findOneAndDelete({ email });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }

    // get user gravatar
    const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
    })

    user = new User({
        name,
        email,
        avatar,
        password
    });
    // encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrpy.hash(password, salt);

    await user.save();

    // return json webtoken
    const payload = {
        user: {
            id: user.id
        }
    }

    jwt.sign(
        payload, 
        config.get('jwtSecret'),
        { expiresIn: 360000},
        (err, token) => {
            if (err) throw err;
            res.json({ token })
        }
        );

    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    
}
);

module.exports = router;