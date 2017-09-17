const { FuseBox } = require("fuse-box");
const fuse = FuseBox.init({
    homeDir: "../src",
    output: "../bundle/$name.js",
    cache: true,
});
fuse.bundle("bundle")
    .watch('src/**')
    .instructions(`>[test/test.ts] + [**/*.ts] + [**/*.js] ]`)
    .completed(proc => proc.start());

fuse.run();