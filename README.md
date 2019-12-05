## Gantri Coding Challenge

To install dependencies and start server on localhost:3000

```sh
npm install
npm start
```

To Run Silent Auction Program

```
node bidding.js;
```

## Copy csv into psql

```
create temporary table t (id integer,
    accession_number varchar(250),
    artist varchar(250),
    artistRole varchar(500),
    artistId integer,
    title varchar(500),
    dateText varchar(500),
    medium varchar(500),
    creditLine varchar(5000),
    year integer,
    acquisitionYear integer,
    dimensions varchar(500),
    width float,
    height float,
    depth float,
    units varchar(50),
    inscription varchar(500),
    thumbnailCopyright varchar(5000),
    thumbnailUrl varchar(500),
    url varchar(500)
);

\copy t(id,accession_number,artist,artistRole,artistId,title,dateText,medium,creditLine,year,acquisitionYear,dimensions,width,height,depth,units,inscription,thumbnailCopyright,thumbnailUrl,url) FROM 'the-tate-collection.csv' CSV HEADER DELIMITER ';';

insert into art(id,title,artist,year) SELECT id,title,artist,year FROM t;
```