# XSS IRC Challenge

This is a very simple XSS challenge that emulates an insecure HTML IRC client
connected to an IRC network. The goal is to inject JS into the client and
change the title of the web page.

## Requirements

This challenge is built inside a Docker container so all its dependencies are already
provided. The only thing you need to download to get it running is the Docker
daemon:

- Docker 1.3 (or higher)
- Boot2docker (if you are on Windows or OSX)

## Building from source

```sh
// Change the current work dir to the git repo
cd xss-challenge

// Build the docker image (this might take a while)
docker build -t .

// Start the server
docker run -p 6667:6667 -it xss
```

## Using a custom flag

If the `FLAG` environment variable is set, the client
will use that instead of the default flag. You can set it when running the container:

```
docker run -p 6667:6667 -e "FLAG=ThisIsASampleFlag" -it xss
```

## Architecture

Inside the Docker container there are two main modules, a simple IRC server and the
vulnerable IRC client. The client by itself is not really a web browser, but when
it starts it creates an instance of a PhantomJS headless browser, this allows it
to create a sandbox-like environment. Whenever the client gets a private message
from an IRC user, it will create an HTML page and inject the message into it.
After that it checks if the page title changes after the message was injected,
if it was it sends a private message back to the user with the flag.
In order to prevent any concurrency issues the client uses an internal queue to
process each message sequentially.

## Running without Docker

It is also possible to use the client without Docker, however, you will need to
have Node.js and NPM installed and have an IRC server to which the client can connect to.
The setup process is very simple:

```sh
// Change the current work dir to the git repo
cd xss-challenge

// Install dependencies
npm install

// Start the client
node index
```

You can use the environment variables below to configure the client without modifying it

## Environment Variables

- `HOST`: Hostname of the IRC server to connect to (default: `localhost`)
- `NICK`: Nickname of the IRC client
- `FLAG`: Flag to hand out once code injection is detected

## Example CTF formulation

For an example CTF problem formulation and hints, check CTF.md

## Example solution

Check SOLUTION.md (Spoiler alert!)