create table ipandwebsite (
	id SERIAL PRIMARY KEY,
	ip TEXT,	
	website TEXT,
	value TEXT
);

create table websiteandleakiness (
	id SERIAL PRIMARY KEY,
	website TEXT,	
	leakiness int
);