# XSS Challenge (over IRC)

This is an XSS challenge over IRC, because why not?

```
host: somehost.com
port: 6667
channel: #general
```

There is a user connected to this network that is
using an insecure client to chat with people.

The client is HTML/JS based

The goal: Change the title of the page of the client (`document.title`)

## Hint 1:

The client only seems to be purifying some kinds of messages, not all

## Hint 2:

The client renders messages in the following way:

```
<div class="chat">
    <p>Message 1</p>
    <p>Message 2</p>
    <p>Message 3</p>
</div>
```

Note: Usernames are not rendered