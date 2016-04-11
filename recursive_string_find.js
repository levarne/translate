/**
 * Created by levarnesobotker on 2016/04/10.
 */


"use strict";

var fs = require('fs');
var events = require('events');


var jsonFile = "locale-en.json";
//var file_location = '../testApp';
var file_location = '../../ManaltoProjects/Soshlr/SoshlrWeb/src/app';

var accessible_files = ['.txt','.html', '.html.tpl', '.tpl.html'];

var Translatable = function(){
    var appendToObj = {},
        indices = [],
        matches = [],
        fileList = [],
        match_filelocation = [];

    //public function , to be as a constructor, (projectSrc)
    this.getTranslations = function(projectSrc){
        fileList =  _getFiles(projectSrc);

        var array_matchs = _getMatchStream(fileList);

        _writeToJson(array_matchs);//this will remove duplicate keys and make array = object

        return {
            ToStringMatch : function(){
                console.log('************************');
                console.log('**    Match OUTPUT     **');
                console.log('************************');

                console.log(fileList);
            },
            ToStringJson : function(){
                console.log('************************');
                console.log('**    JSON OUTPUT     **');
                console.log('************************');

                var jsonStr = JSON.stringify(appendToObj, null, " ");

                console.log(jsonStr);
            },
            debugMatchFileLocatoin : function(){
                console.log('************************');
                console.log('**    MATCH STRING FILE LOCATION     **');
                console.log('************************');

                console.log(match_filelocation);
            },
            writeToJsonFile : function(){
                _ToFile();

                return {
                    ToStringJson : this.ToStringJson()
                }
            }
        }
    };

    var _getFiles = function(dir, files_){
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                _getFiles(name, files_);
            } else {
                if(_getRequiredFiles(files[i])){
                    files_.push(name);
                }

            }
        }

        return files_;
    }

    var _getRequiredFiles = function(file){
        var file_ext = file.substr(file.indexOf('.'));

        //if is file and of type, add to file list true
        if((accessible_files.indexOf(file_ext) >= 0) ){
            return true;
        }
    }

    var _getMatchStream = function(file_array){
        file_array.forEach(function(file){
            var data_as_str = fs.readFileSync(file).toString();

            matches = _findIndexOfStr(data_as_str, file);
        });

        return matches;
    }

    //output '"string" | translate'
    var _findIndexOfStr = function(haystack, fileName){
        var regex = new RegExp(/[^\{}]*translate/g);

        var array_str = [];

        while ((array_str = regex.exec(haystack)) != null)
        {
            if(array_str[0]){
                var clean_string = _cleanString(array_str[0]);
                indices.push(clean_string);

                //for debug, each match has its file location appended
                _debugMatchLocation(clean_string, fileName);
            }
        }

        return indices;
    }

    //output , removes single quotes, pipe and "translate"
    var _cleanString = function(dirtyStr){
        var clean_str = dirtyStr.substr(0, dirtyStr.lastIndexOf("|") - 1);

        clean_str = (clean_str.indexOf('"') >= 0) ? clean_str.substr(1, clean_str.length - 2) : clean_str;

        if(clean_str.indexOf('"') >= 0){
            clean_str = clean_str.substr(1, clean_str.length - 2)
        }else if(clean_str.indexOf("'") >= 0){
            clean_str = clean_str.substr(1, clean_str.length - 2)
        }

        return clean_str.trim();
    }

    var _writeToJson = function(matches){
        matches.forEach(function(match){
            if(appendToObj.hasOwnProperty(match)){

            }else{
                appendToObj[match] = "";
            }
        });
    }

    var _ToFile = function(){
        var jsonStr = JSON.stringify(appendToObj, null, " ");
        
        console.log('************************');
        console.log('** Write JSON TO FILE **');
        console.log('************************');

        var writeStatus = fs.writeFileSync(jsonFile, jsonStr, 'utf8');

        console.log(writeStatus);
    }

    //for debug, each match has its file location appended
    var _debugMatchLocation = function(clean_string, fileName){
        match_filelocation.push(clean_string + " : " + fileName);
    }

}

console.log('** start app **');
console.log(' ');

var transect = new Translatable();

// transect.getTranslations(file_location);

//return jsosn output of whta will be written to file
// transect.getTranslations(file_location).ToStringJson();

//returns all files that match accessible_files and its location = dir
 //transect.getTranslations(file_location).ToStringMatch();

// returns all match string and its location
 transect.getTranslations(file_location).debugMatchFileLocatoin();

//overide current json file, does not append to
// transect.getTranslations(file_location).writeToJsonFile();

console.log(' ');
console.log('** end app **');