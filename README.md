# apply-updates

This module lets you run initialization functions in your Node.js application. It takes in a list of functions and calls a Done callback once all supplied functions were completed successfully.

## Install

    $ npm install --save @netrabbit/apply-updates

## Example

```js
    const Updater = require('@netrabbit/apply-updates');

    const updater = new Updater('./updates');

    updater.applyUpdates(function(err) {
        if (err) {
            console.log(err);
        }

        console.log('Successfully applied updates');
    });
```

## License

MIT