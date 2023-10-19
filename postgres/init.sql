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
    "gender" VARCHAR(100) DEFAULT 'undefined',
    "birth_date" DATE,
    "sexual_preferences" VARCHAR(100) DEFAULT 'undefined',
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

-- Generate 20 couples of user profiles
-- Générer 20 couples de profils utilisateur
DO $$ 
DECLARE 
    genders varchar[] := ARRAY['male', 'female', 'undefined'];
    first_names varchar[] := ARRAY['Charles', 'Marie', 'Jean', 'Sophie', 'Pierre', 'Julie', 'Thomas', 'Laura', 'Nicolas', 'Emma', 'Paul', 'Alice', 'Antoine', 'Céline', 'Lucas', 'Charlotte', 'Alexandre', 'Eléonore', 'Louis', 'Amélie'];
    last_names varchar[] := ARRAY['Dupont', 'Martin', 'Lefebvre', 'Dubois', 'Moreau', 'Laurent', 'Girard', 'Roux', 'Fontaine', 'Garnier', 'Faure', 'Lemoine', 'Rousseau', 'Leroy', 'Adam', 'Bertrand', 'Garcia', 'Fournier', 'Mercier', 'Blanc'];
    fn_index integer;
    ln_index integer;
    f_name varchar;
    l_name varchar;
    u_name varchar;
    birth_date date;
    location_latitude float;
    location_longitude float;
BEGIN
    FOR i IN 1..20 LOOP
        -- Set first_name and last_name based on the loop index
        SELECT first_names[i] INTO f_name;
        SELECT last_names[i] INTO l_name;
        
        -- Create the username from the first letter of first_name and last_name
        SELECT left(f_name, 1) || l_name INTO u_name;

        -- Generate a random birth_date between 1970-01-01 and 2003-12-31
        SELECT (to_date('1970-01-01', 'YYYY-MM-DD') + trunc(random() * 12000) * '1 day'::interval) INTO birth_date;

        -- Generate random location_latitude and location_longitude
        SELECT random() * 180 - 90 INTO location_latitude;
        SELECT random() * 360 - 180 INTO location_longitude;

        -- Insérer un utilisateur
        INSERT INTO "user" ("id", "username", "last_name", "first_name", "email", "password", "verified_account")
        VALUES (uuid_generate_v4(), u_name, l_name, f_name, u_name || '@example.com', '$2b$10$NFdgmiKxlmkUdoW7sk/WI.UyedzkJRADZpLDtByV2ci1Bb33P4vAi', TRUE);

        -- Générer des valeurs aléatoires pour gender et sexual_preferences
        SELECT array_agg(x ORDER BY random()) INTO genders FROM unnest(genders) t(x);
        SELECT array_agg(x ORDER BY random()) INTO genders FROM unnest(genders) t(x);

        -- Insérer un profil correspondant à l'utilisateur
        INSERT INTO "profile" ("id", "gender", "birth_date", "sexual_preferences", "biography", "location_latitude", "location_longitude", "fame_rate", "user_id")
        VALUES (uuid_generate_v4(), genders[1], birth_date, genders[2], 'Biographie de ' || u_name, location_latitude, location_longitude, 100, (SELECT "id" FROM "user" WHERE "username" = u_name));
    END LOOP;
END $$;
