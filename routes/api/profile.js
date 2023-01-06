const express = require('express');
const { ResultWithContext } = require('express-validator/src/chain');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');



router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
            'user', 
            ['name', 'avatar']
            );

        if(!profile) {
            return res.status(400).json[{ msg: 'There is no profile for this user' }];
        };

        res.json(profile);
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/', [ auth, 
    [
        check('status', 'status is required')
            .not()
            .isEmpty(),
        check('skills', 'Skills is requires')
            .not()
            .isEmpty()
]

], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

        // destructure the request
        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
          } = req.body;

          const profileFields = {};
          profileFields.user = req.user.id;
          if (company) profileFields.company = company;
          if (website) profileFields.website = website;
          if (location) profileFields.location = location;
          if (bio) profileFields.bio = bio;
          if (githubusername) profileFields.githubusername = githubusername;
          if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
          }

          profileFields.social = {};
          if (youtube) profileFields.social.youtube = youtube;
          if (twitter) profileFields.social.twitter = twitter;
          if (facebook) profileFields.social.facebook = facebook;
          if (linkedin) profileFields.social.linkedin = linkedin;
          if (instagram) profileFields.social.instagram = instagram;

          try {
            let profile = await Profile.findOne({ user: req.user.id })

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields },
                    { new: true }
                    );

                    return res.json(profile);
            }

            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
          } catch {
            console.error(err.message);
            res.status(500).send('Server error');
          }
}
)

module.exports = router;