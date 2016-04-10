/**
 * Created by levarnesobotker on 2016/04/08.
 */

"use strict";

var fs = require('fs');
var events = require('events');


var jsonFile = "locale-en.json";
var file_location = '../testApp/';
// var file_location = 'campaigns/';
//var file_location = 'dashboard.tpl.html';
//var file_location = '../../ManaltoProjects/Soshlr/SoshlrWeb/src/app/account/groups/';


var searchStr = 'translate';

var eventEmitter = new events.EventEmitter();


var Translatable = function(){
    var appendToObj = {};
    var indices = [];
    var matches = null;
    var onComplete = false;
    var accessible_files = ['.txt','.html', '.html.tpl', '.tpl.html'];

    //public function , to be as a constructor, (projectSrc)
    this.getTranslations = function(projectSrc){
        eventEmitter.emit('findFileLocations', projectSrc);

        return {
            ToString : function(callback){
                    setTimeout(function(){
                        // var jsonStr = JSON.stringify(appendToObj, null, " ");
                        //
                        //
                        // console.log('************************');
                        // console.log('**    JSON OUTPUT     **');
                        // console.log('************************');
                        //
                        // console.log(jsonStr);
                        // fs.writeFileSync(jsonFile, jsonStr, 'utf8', function(err, succ){
                        //     if(err) return console.log(err.stack);
                        //
                        //     console.log('success', success);
                        // })
                    }, 1000)
            }
        }
    };

    var _ToFile = function(){
        var jsonStr = JSON.stringify(appendToObj, null, " ");


        console.log('************************');
        console.log('**    JSON OUTPUT     **');
        console.log('************************');

        console.log(jsonStr);
        fs.writeFileSync(jsonFile, jsonStr, 'utf8', function(err, succ){
            if(err) return console.log(err.stack);

            console.log('success', success);
        });
    }

    var _findFileLocations = function(projectSrc){

        var file_folder = fs.readdirSync(projectSrc);

        if(file_folder){
            file_folder.forEach(function(file){
                var stats = fs.statSync(file);

                if(stats.isDirectory()){
                    console.log("is dir: " + file );
                }

                if(stats.isFile()){
                    console.log("is file: " + file);
                };
            });

        }




        /*
        fs.stat(projectSrc, function(err, stats){
            if(err) return console.error(err.stack);

            if(stats.isDirectory()){
                console.log('is dir, searching for files...');

                fs.readdir(projectSrc, function(err, files){
                    if(err) return console.error(err.stack);

                    files.forEach(function(file){
                       eventEmitter.emit('readToStream', file);
                    });
                });

            }else if(stats.isFile()){
                console.log('is file, reading to stream...');
                var file = projectSrc;

                eventEmitter.emit('readToStream', file);
            }

            // console.log(matches);
             return;
            // eventEmitter.emit('writeToJson', matches);

        });
*/
    }

    var _readToStream = function(file){
        var file_ext = file.substr(file.indexOf('.'));

        //if is file and of type, get file translation tags
        if((accessible_files.indexOf(file_ext) >= 0) ){
            console.log("file: " + file);

            var data = fs.readFileSync(file_location + file).toString();

            var data_as_str = data.toString();

            matches =  _findIndexOfStr(data_as_str, 'translation');

            eventEmitter.emit('writeToJson', matches);
        }
    }

    var _writeToJson = function(matches){
        matches.forEach(function(match){
            if(appendToObj.hasOwnProperty(match)){

            }else{
                appendToObj[match] = " ";
            }
        });

        console.log('write to ');
        _ToFile();
       // eventEmitter.emit('ToString', appendToObj);
    }

    var _findIndexOfStr = function(str, toSearch){
       // console.log('indices' + indices);

        //var string = "<FLD>dsfgsdfgdsfg;NEW-7db5-32a8-c907-82cd82206788</FLD><FLD>dsfgsdfgsd;NEW-480e-e87c-75dc-d70cd731c664</FLD><FLD>dfsgsdfgdfsgfd;NEW-0aad-440a-629c-3e8f7eda4632</FLD>";
        // var regex = new RegExp(/<FLD>\w+;(NEW[-|\d|\w]+)<\/FLD>/g);
        // var regex = new RegExp(/{{(translation\w)}}/g);
        // var regex = new RegExp(/{{[\w]translation}}/g);

        // var regex = new RegExp(/{{[\W]\w+[\W]\w+\W+\stranslation}}/g); working
        var regex = new RegExp(/[^\{}]*translate/g);
        // var regex = new RegExp(/[^\{}]*translation/g);


        var array_str = [];

        while ((array_str = regex.exec(str)) != null)
        {
            if(array_str[0]){
                var clean_string = _cleanString(array_str[0]);
                indices.push(clean_string);
            }
        }

        return indices;
    }

    var _cleanString = function(dirtyStr){
        var clean_str = dirtyStr.substr(0, dirtyStr.lastIndexOf("|") - 1);
        clean_str = (clean_str.indexOf("'") >= 0) ? clean_str.substr(1, clean_str.length - 2) : clean_str;

        return clean_str.trim();
    }

    eventEmitter.on("findFileLocations", _findFileLocations);
    eventEmitter.on("writeToJson", _writeToJson);
    eventEmitter.on("readToStream", _readToStream);
};

var transect = new Translatable();

console.log('** start app **');
console.log(' ');


transect.getTranslations(file_location).ToString();


console.log(' ');
console.log('** end app **');

