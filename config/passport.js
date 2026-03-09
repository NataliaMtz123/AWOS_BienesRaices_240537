import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import Usuario from '../models/Usuarios.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
    const user = await Usuario.findByPk(id);
    done(null, user);
});

const generarPasswordSeguro = async () => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(Math.random().toString(36), salt);
};

// GOOGLE
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {

    let usuario = await Usuario.findOne({ where:{ email: profile.emails[0].value } });

    if(!usuario){
        usuario = await Usuario.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: await generarPasswordSeguro(),
            proveedor: 'google',
            proveedorId: profile.id,
            confirmed: true
        });
    }

    return done(null, usuario);
}));

// GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope: ['user:email']
},
async (accessToken, refreshToken, profile, done) => {

    let email = profile.emails?.[0]?.value || `${profile.username}@github.user`;

    let usuario = await Usuario.findOne({ where:{ email } });

    if(!usuario){
        usuario = await Usuario.create({
            name: profile.username,
            email,
            password: await generarPasswordSeguro(),
            proveedor: 'github',
            proveedorId: profile.id,
            confirmed: true
        });
    }

    return done(null, usuario);
}));

export default passport;