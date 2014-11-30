"use strict";

var InsecureClient = require('./src/InsecureClient'),

    client;

client = new InsecureClient(
    process.env.HOST || 'localhost',
    process.env.NICK || 'PwnBot',
    process.env.FLAG || '/!blah_defaultflag_blah!/'
);