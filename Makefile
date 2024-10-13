# -*- Mode: Makefile -*-
#
# Makefile for Update Notifier
#

FILES = manifest.json \
        background.js \
        notification/message.html \
        notification/main.js \
        notification/main.css \
        $(wildcard _locales/*/messages.json)

ADDON = update-notifier

VERSION = $(shell sed -n  's/^  "version": "\([^"]\+\).*/\1/p' manifest.json)

WEBEXT_UTILS_REPO = git@github.com:M-Reimer/webext-utils.git

trunk: $(ADDON)-trunk.xpi

release: $(ADDON)-$(VERSION).xpi

%.xpi: $(FILES)
	@zip -r9 - $^ > $@

clean:
	rm -f $(ADDON)-*.xpi

# Starts local debug session
run:
	web-ext run --bc

# Subtree stuff for webext-utils
# Note to myself. Initial setup of subtree:
# git subtree add --prefix utils git@github.com:M-Reimer/webext-utils.git master

subtree-pull:
	git subtree pull --prefix utils "$(WEBEXT_UTILS_REPO)" master

subtree-push:
	git subtree push --prefix utils "$(WEBEXT_UTILS_REPO)" master
