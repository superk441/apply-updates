const path = require('path');
const importer = require('@netrabbit/module-importer');

const moduleRoot = (function(_rootPath) {
    const parts = _rootPath.split(path.sep);
    parts.pop(); // get rid of node_modules at the end of the path
    return parts.join(path.sep);
})(module.parent ? module.parent.paths[0] : module.paths[0]);

const importModules = importer(moduleRoot);

class Updater {

    /**
     * 
     * @param {string} dirPath - Path to updates directory
     */
    constructor(dirPath) {
        this.jobs = importModules(dirPath);
        this.queue = this._getQueueAsArray();
    }

    /**
     * Get queue items as an array
     */
    _getQueueAsArray() {
        const queue = [];

        for (let k in this.jobs) {
            if (typeof this.jobs[k] !== 'function') {
                const err = new Error(`Update "${k}" is not a function.`);
                throw err;
            }
            const payload = {
                name: k,
                job: this.jobs[k]
            };
            queue.push(payload);
        }

        return queue;
    }

    applyUpdates(done) {
        const queue = this.queue;
        let i = 0;

        function next() {
            const current = queue[i];
            current.job.call(null, function(err) {
                if (err) {
                    throw err;
                }
                i++;
                if (i < queue.length) {
                    return next();
                } 
                else {
                    return done();
                }
            });
        }

        if (queue.length) next();
    }
}

module.exports = Updater;