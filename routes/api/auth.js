const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', 
[
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password', 'Password is required'
    ).exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
    // see if user exists, if so send error saying they exist
        let user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
            .status(400)
            .json({ errors: [{ msg: 'INvalid Crednetials '}] });
        }



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