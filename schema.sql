CREATE TABLE art (
    id integer primary key,
    title varchar(50) NOT NULL,
    artist varchar(20) NOT NULL,
    year smallint NOT NULL,
    comments json DEFAULT '[]'
);

CREATE TABLE users (
    id serial UNIQUE primary key,
    name varchar(25) NOT NULL,
    age smallint NOT NULL,
    location varchar(25) NOT NULL
);

CREATE TABLE comments (
    id serial UNIQUE primary key,
    userID integer REFERENCES users (id),
    name varchar(25),
    content varchar(140) NOT NULL,
    CONSTRAINT if_not_userID_then_name_is_not_null
        CHECK ( (userID IS NOT NULL) OR (name IS NOT NULL) )
);
