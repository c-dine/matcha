CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "tag" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "label" VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "verified_account" BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS "profile" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "gender" VARCHAR(100) DEFAULT 'Not specified',
    "birth_date" DATE,
    "sexual_preferences" VARCHAR(100) DEFAULT 'bisexual',
    "biography" VARCHAR(510),
    "location_latitude" FLOAT NULL,
	"location_longitude" FLOAT NULL,
    "fame_rate" INTEGER DEFAULT 100,
    "user_id" UUID NOT NULL UNIQUE,
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "profile_tag_asso" (
    "profile_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("profile_id", "tag_id")
);

CREATE TABLE IF NOT EXISTS "picture" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID NOT NULL,
	"is_profile_picture" BOOLEAN DEFAULT(FALSE),
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "like" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID NOT NULL,
    "liked_profile_id" UUID NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("liked_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "view" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID NOT NULL,
    "viewed_profile_id" UUID NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("viewed_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "blacklist" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID NOT NULL,
    "blacklisted_profile_id" UUID NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("blacklisted_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "fake_report" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "profile_id" UUID NOT NULL,
    "fake_reported_profile_id" UUID NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("fake_reported_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "messages" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "from_profile_id" UUID NOT NULL,
    "to_profile_id" UUID NOT NULL,
    "message" VARCHAR(510) NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("from_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("to_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "notification" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "is_viewed" BOOLEAN DEFAULT FALSE,
    "from_profile_id" UUID NOT NULL,
    "to_profile_id" UUID NOT NULL,
    "type" VARCHAR(510) NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("from_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("to_profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float, units varchar)
RETURNS float AS $dist$
    DECLARE
        dist float = 0;
        radlat1 float;
        radlat2 float;
        theta float;
        radtheta float;
    BEGIN
        IF lat1 = lat2 AND lon1 = lon2
            THEN RETURN dist;
        ELSE
            radlat1 = pi() * lat1 / 180;
            radlat2 = pi() * lat2 / 180;
            theta = lon1 - lon2;
            radtheta = pi() * theta / 180;
            dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

            IF dist > 1 THEN dist = 1; END IF;

            dist = acos(dist);
            dist = dist * 180 / pi();
            dist = dist * 60 * 1.1515;

            IF units = 'K' THEN dist = dist * 1.609344; END IF;
            IF units = 'N' THEN dist = dist * 0.8684; END IF;

            RETURN dist;
        END IF;
    END;
$dist$ LANGUAGE plpgsql;

-- Data Initialisation --

INSERT INTO public.tag (label) VALUES ('Vegan');
INSERT INTO public.tag (label) VALUES ('Queer');
INSERT INTO public.tag (label) VALUES ('Food');
INSERT INTO public.tag (label) VALUES ('Technology');
INSERT INTO public.tag (label) VALUES ('Travel');
INSERT INTO public.tag (label) VALUES ('Sport');
INSERT INTO public.tag (label) VALUES ('Nerd');
INSERT INTO public.tag (label) VALUES ('Drink');
INSERT INTO public.tag (label) VALUES ('Party');

