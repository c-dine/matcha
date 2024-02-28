import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env, passportConfig } from "../config/config.js"
import { AuthService } from "../modules/auth/auth.service.js";
import { Request } from "express";

export interface GoogleOAuthUser {
    id: string;
    displayName: string;
    name: {
      givenName: string;
      familyName: string;
    };
    emails: {
        value: string,
        verified: boolean
    }[];
    photos: { value: string }[]
}

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

passport.use(new GoogleStrategy({
	callbackURL: env.url + '/api/auth/google/callback',
	clientID: passportConfig.googleClientId,
	clientSecret: passportConfig.googleClientSecret,
    passReqToCallback: true
}, async (req: Request, accessToken: string, refreshToken: string, profile: GoogleOAuthUser, done) => {
    try {
        const authService = new AuthService(req.dbClient);
        const userId = await authService.upsertPassportUser({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName
        });
        return done(null, { ...profile, id: userId });
    } catch (e) {
        done(e, false);
    }
}));