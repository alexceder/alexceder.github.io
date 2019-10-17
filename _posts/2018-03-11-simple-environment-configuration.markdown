---
layout: post
location: Stockholm
title: Simple Environment Configuration
date: 2018-03-11 17:06
---
Following the twelve-factor methodology's third factor, configuration should
come from the environment. When developing, it is common to have development,
testing, staging, and production environments. These may be fewer och more, and
the environments can have multiple auxiliary configuration producing a matrix of
different environments. There are countless different solutions to writing
software that runs in different environments. I will show you a way of
organizing environment variables and running software with a short shell script.

When developing on might find oneself wanting to run software with debug
information, specific databases, etc. and also run automated tests with a
different configuration. For example you may run a web application that needs to
speak to two different databases depending on if it is running tests or running
a development server.

| foo | bar |
|-----|-----|
| baz | qux |
| two houndred | five "thousand" |

It is common to store this configuration in files checked in to source control.
Let us name these files `.env.test` for the test environment, and
`.env.development` for the development environment. E.g.:

```conf
# .env.test
APP_ENV=test
```

```conf
# .env.development
APP_ENV=development
```

Now that we have the configuration files in order, let me show you the shell
script that was promised[^1].

```sh
#!/usr/bin/env sh

set -e

if [ $# -lt 2 ];
then
  >&2 echo "Usage: `basename $0` <env> <utility [argument ...]>"
  exit 1
fi

if [ -f "$1" ];
then
  envfile="$1"
elif [ -f ".env.$1" ];
then
  envfile=".env.$1"
else
  >&2 echo "$1 does not exist."
  exit 2
fi

shift

# shellcheck disable=SC2046
env `grep '^[^#]' "$envfile" | xargs` "$@"
```

Just as the usage says, it is now possible to run your software with different
configurations based on environment from the command-line.

```sh
withenv development rails server
```

The command will expand the file specifying the environment variables (in this
case `.env.development`) and run `rails server` with the specified environment.
There is no need for another dependency of unread code.

Would you have asked my a few years ago to explain what the shell script does, I
am not sure I would have been able to sufficiently explain everything. So for
those curious still here, allow me to go through the script.

## Script Breakdown

```sh
#!/usr/bin/env sh
```

This is the *shebang*. I prefer to use the `env` utility when invoking scripts.
This ensures the specified executable will respect the `PATH` variable.


```sh
set -e
```

This basically ensures the script will exit immediately if a command in the
script return a non-zero status. Consult the set builtin manual for more
information.

```sh
if [ $# -lt 2 ];
then
  >&2 echo "Usage: `basename $0` <env> <utility [argument ...]>"
  exit 1
fi
```

If the script is not invoked by both `env`, and `utility` arguments, print the
usage and exit with non-zero status.

```sh
if [ -f "$1" ];
then
  envfile="$1"
elif [ -f ".env.$1" ];
then
  envfile=".env.$1"
else
  >&2 echo "$1 does not exist."
  exit 2
fi
```

This conditional allows the user to either provide the path to an environment
variable file, or the name of the environment of with which to invoke a utility.

```sh
shift
```

This command will shift the positional arguments passed to the script. In this
instance it will pop the *env* argument from the special variable `$@` which
holds the argument list passed to the script. What is left in the argument list
is the utility to be run along with its own arguments, if any.

```sh
# shellcheck disable=SC2046
env `grep '^[^#]' "$envfile" | xargs` "$@"
```

Those who know me might tell you that I am a big fan of linting. And the one I
use for shell scripts is called ShellCheck. I will leave it as an exercise to
find out why this particular disable is needed here.

Moving along, the second line is the most important line in the script. It
invokes the specified utility with its own arguments. `env` is a utility to set,
execute, and print environment.

The goal is to turn:

```conf
# This is a comment
ENV_VAR=value
```

Into this (where `utility` is the utility to execute with environment):

```sh
env ENV_VAR=value utility
```

This command will `grep` all non-comment lines from the file and construct a
argument list with the help of `xargs`.

```sh
grep '^[^#]' "$envfile" | xargs
```

Expanding the environment variables and replacing the command with the standard
output of said command, the utility can be executed with environment.

## Examples

If you are confused about the general explanation of the script; here be
examples, where things to the right of `$` is command line input:

```
$ FIRST_NAME="Alexander" sh -c 'echo "Hello, $FIRST_NAME!"'
Hello, Alexander!
```

Would be the same as:

```
$ withenv local sh -c 'echo "Hello $FIRST_NAME!"'
Hello, Alexander!
```

As long there is a file `.env.local` with content:

```
FIRST_NAME="Alexander"
```

Note that the `echo` command is executed with the `-c` flag of `sh` (or `bash`
in reality). If that confuses you, I do challenge you, and leave it as an
exercise to figure out why that is needed to be able to use the environment
variable. Please tweet at me so that we can start a discussion!

That is it! Did you find this useful? Discuss on Twitter or amongst yourself.

## Footnotes

[^1]: And here is the definition.
