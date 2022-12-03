CC:=gcc
#CFLAGS:=-g
CFLAGS:=-O3
CFLAGS+= `pkg-config --cflags sqlite3`

all: dev

build:
	remix build

dev: snTokenizer.so
	remix dev

snTokenizer.so: src/snTokenizer.c
	$(CC) -fPIC -Wall -shared -Isqlite $(CFLAGS) $< -o $@
