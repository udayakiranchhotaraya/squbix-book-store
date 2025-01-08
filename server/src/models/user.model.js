const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: object
 *           required:
 *             - firstName
 *           properties:
 *             firstName:
 *               type: string
 *               description: The first name of the user
 *               example: John
 *             lastName:
 *               type: string
 *               description: The last name of the user
 *               example: Doe
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           description: The user's password
 *           example: P@ssw0rd
 *         role:
 *           type: string
 *           description: The user's role
 *           enum:
 *             - Admin
 *             - User
 *           example: User
 *       example:
 *         name:
 *           firstName: Jane
 *           lastName: Doe
 *         email: janedoe@example.com
 *         password: MySecurePassword123
 *         role: Admin
 */
const UserSchema = new mongoose.Schema({
    name : {
        firstName : {
            type: String,
            required: true
        },
        lastName : {
            type: String
        } 
    },
    email : {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email`
        },
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ["Admin", "User"],
        default: "User"
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!(user.isModified('password'))) {
        next();
    }

    try {
        const salt = await bcrypt.genSalt(12);

        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = String(hashedPassword);
        next();
    } catch (error) {
        return next(error);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        console.error(error);
    }
}

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;