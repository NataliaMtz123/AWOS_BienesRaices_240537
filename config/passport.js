import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import Usuario from "../models/Usuarios.js";


// ===============================
// GOOGLE LOGIN
// ===============================

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {

            try {

                const email = profile.emails[0].value;
                const name = profile.displayName;

                let usuario = await Usuario.findOne({
                    where: { email }
                });

                if (!usuario) {

                    usuario = await Usuario.create({
                        name: name,
                        email: email,
                        password: "OAUTH_USER",
                        confirmed: 1,
                        token: null,
                        token_expiration: null,
                        reg_status: 1,
                        last_login: new Date()
                    });

                } else {

                    usuario.last_login = new Date();
                    await usuario.save();

                }

                return done(null, usuario);

            } catch (error) {
                console.log(error);
                return done(error, null);
            }
        }
    )
);


// ===============================
// FACEBOOK LOGIN
// ===============================

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "emails"]
        },
        async (accessToken, refreshToken, profile, done) => {

            try {

                const name = profile.displayName;

                let email = null;

                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0].value;
                } else {
                    email = profile.id + "@facebook.com";
                }

                let usuario = await Usuario.findOne({
                    where: { email }
                });

                if (!usuario) {

                    usuario = await Usuario.create({
                        name: name,
                        email: email,
                        password: "OAUTH_USER",
                        confirmed: 1,
                        token: null,
                        token_expiration: null,
                        reg_status: 1,
                        last_login: new Date()
                    });

                } else {

                    usuario.last_login = new Date();
                    await usuario.save();

                }

                return done(null, usuario);

            } catch (error) {
                console.log(error);
                return done(error, null);
            }
        }
    )
);


// ===============================
// SESSION
// ===============================

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {

    try {

        const usuario = await Usuario.findByPk(id);
        done(null, usuario);

    } catch (error) {

        done(error, null);

    }

});

export default passport;