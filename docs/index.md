## About
Filing Saucer is a file sharing server accessed through a web GUI.

----
## Automatic Installation (macOS/Linux)
Use the installation script:
```
bash <(curl -s https://al.enbyte.dev/dist/install.sh) -cb 1
```

----
## Manual Installation (macOS/Linux/Windows)

### Clone Codebase

Clone the main branch
```
git clone https://github.com/enbytedev/Filing-Saucer
```

Change into the cloned directory and run the following command:[^1]
```
npm i
```


### Configure
Run the following command from within the project directory to configure Filing Saucer:
```
node main.js -c
```


### Run
The entry point for Aerial Laptop codebases is `main.js`

```
node main.js
```

It is highly recommended that you install [PM2 by Keymetrics], a node process manager.[^2]
```
pm2 start main.js
``` 

----
[^1]: Changing directories is done via `cd` on most systems.
[^2]: It is recommended to use the argument *name* when starting a process with PM2. This is done by appending it to the command to create `pm2 start main.js --name Filing-Saucer`.
