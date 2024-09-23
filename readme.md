# 🌀each-package-run

run command at each package.

## Usage

🌀 `[-x skip-dir ...]` `<from-dir>` `<command>` `[...args]`

e.g. each-package-run -x dir1 -x dir2 ./packages pnpm install

* `-x` - to skip the directory
  * can be used multiple times
  * `[node_modules, .output, dist]` skipped by default
* `<from-dir>` - the directory to start from
* `<command>` - the command to run
* `[...args]` - the arguments of the command

## Options

* `--script` - the script to run at each package, default is `build`
* `--parallel` - run the script in parallel, default is `false`
* `--ignore` - ignore packages that match the pattern, default is `[]`
* `--only` - only run packages that match the pattern, default is `[]`
* `--cwd` - the working directory to run the script, default is `./packages`

## Example

```bash
## global install
npm -g install each-package-run
## run `pnpm install` at each package
each-package-run ./packages pnpm install

## non pnpm workspace, just mulirepo in one dir
pnpm fori
cat package.json
# "scripts": {
#   "fori": "each-package-run ./packages pnpm install"
# }
```
