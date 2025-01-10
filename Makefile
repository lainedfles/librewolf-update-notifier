# -*- Mode: Makefile -*-
#
# Makefile for Update Notifier
#

FILES = manifest.json \
        versionchecker.js \
        background.js \
        notification/message.html \
        notification/main.js \
        notification/main.css \
        notification/images/error.svg \
        notification/images/ok.svg \
        notification/images/warning.svg \
        $(wildcard _locales/*/messages.json)

ADDON = librewolf-update-notifier

VERSION = $(shell sed -n  's/^  "version": "\([^"]\+\).*/\1/p' manifest.json)

trunk: $(ADDON)-trunk.xpi

release: $(ADDON)-$(VERSION).xpi

%.xpi: $(FILES)
	@zip -r9 - $^ > $@

clean:
	rm -f $(ADDON)-*.xpi

# Starts local debug session
run:
	web-ext run --bc
