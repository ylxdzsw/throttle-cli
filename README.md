# Throttle CLI

`throttle` is a command line interface to throttle stdin to stdout.

It can be for example used to view logs like this:

    # Shows a line every 300ms max (default)
    tail -f | throttle

    # Show 10 lines per second max
    tail -f | throttle -q 100

throttle will keep lines that come from stdin and didn't go out to stdout in a queue. By default the length of the queue
is 1000. New lines are dropped when the queue is full.

I use that option with inotifywait quite often to have a watcher that doesn't trigger duplicate events or very near events:

    inotifywait -m -r . | throttle -q 1

# Installation

    npm install -g https://github.com/ylxdzsw/throttle-cli/tarball/master
