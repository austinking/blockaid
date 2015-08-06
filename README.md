# BlockAid
Assists software development teams to keep contributors unblocked

See the [lightning talk](http://austinking.github.io/blockaid/slides/lightning_talk.html) for the product vision.

## Hacking

  1) [Fork this Repo](https://github.com/austinking/blockaid#fork-destination-box)

  2) Clone to your local machine

  3) [Install](https://www.meteor.com/install) the latest meteor

  4) In a terminal (assuming you cloned into `src/blockaid`), do


    $ cd src/blockaid
    $ npm install
    $ cd meteor
    $ cp settings.json-dist settings.json
    # EDIT settings.json - as another dev if you need Hipchat or other secrets
    $ meteor --settings settings.json
    [[[[[ ~/src/blockaid/meteor ]]]]]

	=> Started proxy.
	=> Started MongoDB.
	=> Started your app.

	=> App running at: http://localhost:3000/

  5) Once you've made changes, make a pull request against from your fork.

## Tips

You can get an interactive REPL on your live server with

    $ meteor shell
    >

Use the `tab` key to explore objects and functions available in the app.

## Settings

Various notes about `settings.json`.

### hipchat_bot_token

We created a HipChat user called BlockAid and then used their HipChat token.

### hipchat_annouce_channel

* During development and testing, set this to `1594354` which is the Blockaid dev channel
* In production, set this to `338079` which is the ***Engineering*** channel.

Having trouble discovering HipChat room ids? Use the web client and look at the urls.