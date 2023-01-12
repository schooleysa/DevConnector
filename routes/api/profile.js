const express = require('express');
const request = require('request');
const config = require('config');
const { ResultWithContext } = require('express-validator/src/chain');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const nodemon = require('nodemon');



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

router.get('/', async (req, res) => {
    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])        
        res.json(profiles);
    } catch (err) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


router.get('/user/:user_id', async (req, res) => {
    try{
        const profile = await Profile.findOne( {user: req.params.user_id} ).populate('user', ['name', 'avatar'])
        if(!profile) return res.status(400).json({ msg: 'There is no profile for this user' });

        
        res.json(profiles);
    } catch (err) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

router.delete('/', auth, async (req, res) => {
    try{
        await Profile.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id })        
  
        res.json({ msg: 'user removed' });
    } catch (err) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.put('/experience', [auth, [
    check('title', 'Title is required')
      .not()
      .isEmpty(),
      check('company', 'Company is required')
      .not()
      .isEmpty(),
      check('from', 'From Date is required')
      .not()
      .isEmpty()
    ]]
    , 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

    const {
        title,
        comnpany,
        location,
        from,
        to,
        current,
        descrition
    } = req.body;

    const newExp = {
        title,
        comnpany,
        location,
        from,
        to,
        current,
        descrition
    }

    try {
        const profile = await Profile.fineOne({ user: req.user.id});

        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.fineOne({ user: req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(
            req.params.exp_id
        );

        profile.experience.splice(removeIndex, 1);

        await profile.save;

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/education', [auth, [
    check('school', 'School is required')
      .not()
      .isEmpty(),
      check('degree', 'Degree is required')
      .not()
      .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
      .not()
      .isEmpty(),
      check('from', 'From Date is required')
      .not()
      .isEmpty()
    ]]
    , 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        descrition
    } = req.body;

    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        descrition
    }

    try {
        const profile = await Profile.fineOne({ user: req.user.id});

        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.fineOne({ user: req.user.id});

        const removeIndex = profile.education.map(item => item.id).indexOf(
            req.params.edu_id
        );

        profile.education.splice(removeIndex, 1);

        await profile.save;

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/github:username', (req, res) => {
    try{ 
        const options = {
            uri: `https;//api.github.com/users/${req.params.username}/repos?per_page5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.fet('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'}
        };
    
    request(option, (error, response, body) => {
        if(error) console.error(error);

        if(response.statusCise !== 200) {
            res.status(404).json({ msg: 'No GitHub user found'})
        }
        res.json(JSON.parse(body));
    })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;