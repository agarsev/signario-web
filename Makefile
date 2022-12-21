CC:=gcc
#CFLAGS:=-g
CFLAGS:=-O3
CFLAGS+= `pkg-config --cflags sqlite3`
NODE_ENV:=NODE_ENV=development

all:
	echo "?"

watch:
	fd . app src | entr make app/tailwind.css

serve:
	env `cat .env` $(NODE_ENV) remix-serve build

clean:
	rm -rf public build .cache app/tailwind.css

build: app/tailwind.css snTokenizer.so
	$(NODE_ENV) remix build

app/tailwind.css: src/style.css $(shell fd jsx app)
	$(NODE_ENV) tailwindcss -i $< > $@

snTokenizer.so: src/snTokenizer.c
	$(CC) -fPIC -Wall -shared -Isqlite $(CFLAGS) $< -o $@

.PHONY: watch serve build clean deploy
