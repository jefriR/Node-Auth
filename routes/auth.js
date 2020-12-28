const router = require("express").Router();
const brcypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
    registerValidation,
    loginValidation
} = require("../validation");

router.post("/register", async (req, res) => {
    // Validate Data
    const {
        error
    } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email already in DB
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if (emailExist) return res.status(400).send("Email alrady exists !!");

    // Hash password
    const salt = await brcypt.genSalt(10);
    const hashPassword = await brcypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({
            user: user._id
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    // Menit 57.36
    // Validate Data
    const {
        error
    } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email already in DB
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) return res.status(400).send("Email doesn't exists !!");

    // Checking password
    const validPassword = await brcypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password !!");

    // Create new token
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);

    res.send('login')

});

module.exports = router;