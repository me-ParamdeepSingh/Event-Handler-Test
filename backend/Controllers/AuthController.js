const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Login = async (req, res, next) => {
    try {
        const { email, name, createdAt } = req.body;
        if (!email || !name) {
            return res.json({ message: 'All fields are required' })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.json({ message: 'incorrect name' })
            }
            
            if (user.name != name) {
                return res.json({ message: 'Incorrect name' })
            }
            const token = createSecretToken(user.id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            res.status(201).json({ message: "User signed in successfully", success: true, user });
            next();
            
        }else{
            const user = await User.create({ name, email, createdAt });
            console.log(user.id)
            const token = createSecretToken(user.id);
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
            console.log(user.name)
            res.status(201).json({ message: "User created and signed in successfully", success: true, user });
            next();
        }
    } catch (error) {
        console.error(error);
    }
};

