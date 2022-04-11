var fs = require("fs");
// function ParseDriverFile(file: string[]) {}
async;
function StartProgram() {
    var args = process.argv;
    console.log(args);
    if (!args[2]) {
        throw new Error("No input file detected");
    }
    var inputFile = args[2];
    try {
        var data = fs.readFileSync(inputFile, "utf8");
        console.log(data);
    }
    catch (err) {
        console.error(err);
    }
}
StartProgram();
