CC:=gcc
#CFLAGS:=-g
CFLAGS:=-O3
CFLAGS+= `pkg-config --cflags sqlite3`
ENV?=development
NODE_ENV=NODE_ENV=$(ENV)

all:
	echo "?"

watch:
	fd . app src | entr make app/tailwind.css

serve: ENV:=production
serve:
	env `cat .env` $(NODE_ENV) npx remix-serve build

clean:
	rm -rf public build .cache app/tailwind.css

build: ENV:=production
build: app/tailwind.css snTokenizer.so
	$(NODE_ENV) npx remix build

app/tailwind.css: src/style.css tailwind.config.js postcss.config.js $(shell fd jsx app)
	$(NODE_ENV) npx postcss $< -o $@

snTokenizer.so: src/snTokenizer.c
	$(CC) -fPIC -Wall -shared -Isqlite $(CFLAGS) $< -o $@

.PHONY: watch serve build clean
