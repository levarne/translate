/**
 * Created by levarnesobotker on 2016/04/08.
 */

console.log("*****");

console.log('Start')
console.log(" ");
var fs = require('fs');

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log(" ");
console.log('Program Ended');
console.log("*****");


console.log("*****");
console.log('Start')
console.log(" ");

fs.readFile("input.txt", function(err, data){
    if(err)
        return console.error(err);

    console.log(data.toString());
})

console.log(" ");
console.log('Program Ended');
console.log("*****");