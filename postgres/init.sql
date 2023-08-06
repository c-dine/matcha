CREATE TABLE IF NOT EXISTS "tag" (
    "id" SERIAL PRIMARY KEY,
    "label" VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS "profile" (
    "id" SERIAL PRIMARY KEY,
    "gender" VARCHAR(100) DEFAULT 'Not specified',
    "birth_date" DATE,
    "sexual_preferences" VARCHAR(100) DEFAULT 'bisexual',
    "biography" VARCHAR(510),
    "location" VARCHAR(100),
    "fame_rate" INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS "profile_tag" (
    "profile_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY ("profile_id", "tag_id")
);

CREATE TABLE IF NOT EXISTS "picture" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "url" VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "profile_default_picture" (
    "profile_id" INTEGER NOT NULL,
    "picture_id" INTEGER NOT NULL,
    FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("picture_id") REFERENCES "picture"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY ("profile_id", "picture_id")
);

CREATE TABLE IF NOT EXISTS "like" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "liked_profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "view" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "viewed_profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "blacklist" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "blacklisted_profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "fake_report" (
    "id" SERIAL PRIMARY KEY,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "fake_reported_profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "profile_id" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "messages" (
    "id" SERIAL PRIMARY KEY,
    "from" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "to" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "message" VARCHAR(510) NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "notification" (
    "id" SERIAL PRIMARY KEY,
    "is_viewed" BOOLEAN DEFAULT FALSE,
    "from" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "to" INTEGER REFERENCES "profile"("id") ON DELETE CASCADE,
    "type" VARCHAR(510) NOT NULL,
    "date" DATE DEFAULT CURRENT_TIMESTAMP
);
