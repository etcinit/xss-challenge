"use strict";

var InsecureClient,

    irc = require('irc'),
    developerexcuses = require('developerexcuses'),
    phantom = require('phantom'),

    Client = irc.Client;

/**
 * Emulated Insecure IRC web client
 *
 * @param host {string} - IRC server hostname or IP
 * @param nick {string} - IRC nick for the bot
 * @param flag {string} - CTF Flag string
 * @constructor
 */
InsecureClient = function (host, nick, flag) {
    var self = this;

    // Keep a reference to the flag
    this.flag = flag;

    // Lock and queue object for processing attempts sequentially
    this.processingAttemp = false;
    this.attempts = [];

    // Initialize the IRC client
    this.client = new Client(host, nick, {
        channels: ['#general']
    });

    // General chat handler
    this.client.addListener('message', function (from, to, message) {
        console.log(from + ' => ' + to + ': ' + message);
    });

    // Define an event handler for PMs
    this.client.addListener('pm', function (from, message) {
        console.log(from + ' => ME: ' + message);

        // Push the job to the internal queue
        self.attempts.push({
            message: message,
            from: from
        });

        // Attempt to process the job/attempt
        self.process();
    });

    // Initialize the headless web browser
    phantom.create(function (ph) {
        self.ph = ph;

        ph.createPage(function (page) {
            self.page = page;
        });
    });

    // Enter the message loop
    this.messageLoop();
};

/**
 * Send random funny messages to the general channel
 */
InsecureClient.prototype.messageLoop = function () {
    developerexcuses(function (err, excuses) {
        if (err) {
            console.log(err);
            return;
        }

        this.client.send('PRIVMSG', '#general', excuses);
    }.bind(this));

    setTimeout(this.messageLoop.bind(this), 10000);
};

/**
 * Attempt to process only one attempt (using the attempt queue)
 *
 * If the engine is busy, the job should execute later
 */
InsecureClient.prototype.process = function () {
    var currentAttempt,
        self = this;

    if (this.processingAttemp === false && this.attempts.length > 0) {
        console.log('Queue is free. Processing job');

        // Block other attempts from executing
        this.processingAttemp = true;

        // Pop the attempt off the queue
        currentAttempt = this.attempts.shift();

        // Process the attempt
        this.attempt(
            currentAttempt.message,
            currentAttempt.from,
            function () {
                // Let other attempts execute
                self.processingAttemp = false;

                // Try to process next attempt (if any)
                self.process();
            }
        )
    } else if (this.processingAttemp) {
        console.log('Queue is busy. Delaying job');
    } else {
        console.log('Queue is empty. Nothing to do');
    }
};

/**
 * Process a message (and check if it managed to change the page title)
 *
 * @param message
 * @param from
 * @param done
 */
InsecureClient.prototype.attempt = function (message, from, done) {
    var injectedHtml = '',
        self = this;

    // Prepare the injected HTML
    injectedHtml = ['<div class="chat"><p>', message, '</p></div>'];

    // Inject the HTML and see what happens
    self.page.set('content', injectedHtml, function () {
        self.page.evaluate(function () { return document.title; }, function (result) {
            console.log('Page title is ' + result);

            if (result !== null && result !== '') {
                self.client.send('PRIVMSG', from, 'I was pwned. The flag is "' + self.flag + '"');
            }

            if (done) {
                done();
            }
        });
    });
};

module.exports = InsecureClient;