CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS "tag" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "label" VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "profile" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "gender" VARCHAR(100) DEFAULT 'Not specified',
    "birth_date" DATE,
    "sexual_preferences" VARCHAR(100) DEFAULT 'bisexual',
    "biography" VARCHAR(510),
    "location" VARCHAR(100),
    "fame_rate" INTEGER DEFAULT 100,
    "default_picture_id" UUID,
    "user_id" UUID NOT NULL,
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
    "url" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "profile"
    ADD CONSTRAINT fk_default_picture_profile
    FOREIGN KEY ("default_picture_id") REFERENCES "picture"("id") ON DELETE SET NULL ON UPDATE CASCADE;


CREATE TABLE IF NOT EXISTS "profile_picture_asso" (
    "profile_id" UUID NOT NULL,
    "picture_id" UUID NOT NULL,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("picture_id") REFERENCES "picture"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("profile_id", "picture_id")
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
