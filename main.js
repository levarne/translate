console.log('*************');
console.log(__dirname);
console.log('*************');
/*
* read from stream
* */
var fs = require("fs");
var data = '';

// Create a readable stream
var readerStream = fs.createReadStream("input.txt");

// Set the encoding to be utf8.
readerStream.setEncoding('UTF8');

// Handle stream events --> data, end, and error
readerStream.on("data", function(chunk){
    console.log(chunk + 'r');
    data += chunk;
});

readerStream.on('end',function(){
    console.log(data);
    writeTFile(data);
});

readerStream.on('error', function(err){
    console.log(err.stack);
});

console.log("Program Read Ended");
// console.log(fs);


function writeTFile(data){
    /*
     * write from strea,m
     */
    var writeStream = fs.createWriteStream("output.txt");
    
// Write the data to stream with encoding to be utf8
    writeStream.write(data, 'UTF8');

// Mark the end of file
    writeStream.end();

// Handle stream events --> finish, and error
    writeStream.on("finish", function(){
        console.log('done writing to file');
    });

    writeStream.on("error", function(err){
        console.log(err.stack);
    });

    console.log("Program Write Ended");
}



// http://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm
//search for stringify