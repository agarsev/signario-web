CC:=gcc
#CFLAGS:=-g
CFLAGS:=-O3
CFLAGS+= `pkg-config --cflags sqlite3`

all: snTokenizer.so

snTokenizer.so: src/snTokenizer.c
	$(CC) -fPIC -Wall -shared -Isqlite $(CFLAGS) $< -o $@
