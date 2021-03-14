'use strict'
let printForm = (function () {
    const isNodeWebkit = (typeof process === "object");
    if (isNodeWebkit) {
        let fs = require('fs');
        let spawn = require('child_process');


        return function (data, name) {
            let buffer = new Buffer(data, 'base64');
            if (!fs.existsSync('temp')) {
                fs.mkdirSync('temp');
            }
            fs.writeFileSync('temp/temp.pdf', buffer);
            spawn.spawn('print/Foxit.exe', ['/p', 'temp/temp.pdf']);
        };

    } else {
        return function (data, name) {
            const link = document.createElement('a');
            link.href = "data:application/pdf;base64, " + data;
            link.target = "_blank";
            link.download = "temp.pdf";

            if(name !== undefined){
                link.download = name;
            }
            link.click();
        };
    }
}());