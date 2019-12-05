CREATE TABLE art (
    id integer primary key,
    title varchar(500),
    artist varchar(200),
    year smallint,
    status varchar(100) NOT NULL DEFAULT 'unsold',
    comments json DEFAULT '[]',
    bids json DEFAULT '[]'
);

CREATE TABLE users (
    id serial UNIQUE primary key,
    name varchar(25) NOT NULL,
    age smallint NOT NULL,
    maxBid smallint,
    location varchar(25) NOT NULL
);

CREATE TABLE comments (
    id serial UNIQUE primary key,
    artID integer REFERENCES art(id),
    userID integer REFERENCES users (id),
    name varchar(25),
    content varchar(140) NOT NULL,
    CONSTRAINT if_not_userID_then_name_is_not_null
        CHECK ( (userID IS NOT NULL) OR (name IS NOT NULL) )
);