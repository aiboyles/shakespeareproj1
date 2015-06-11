/**
 * @author Ann Boyles
 */

//global variables
var url = "";
var $html;

// helper function to sort speaker array from greatest to smallest value
function sortMapByValue(map) {
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) {
        return a[1] - b[1]
    });
    return tupleArray;
}

// takes existing array of speakers and corresponding number of lines and 
// outputs it to HTML page
function appendHtmlToPage(speakers) {
    speakers = sortMapByValue(speakers).reverse();

    var myAppend = "<table class='table table-bordered table-striped'><thead><tr><th style='width:75%'>Speaker</th> <th>Lines</th></tr></thead><tbody>";

    for (x in speakers) {
        myAppend += "<tr><td>" + (speakers[x][0]).toLowerCase() + "</td><td>" + speakers[x][1] + "</td></tr>";
    }
    
    myAppend += "</tbody></table>";
    $("div.list-area").html(myAppend);
}

// loops through the num of total lines, creating a new key/value
// pair each time a new speaker is encountered, and adding to
// the value each time an existing speaker is encountered
function howManyLines(respText) {
    
    $html.append(respText);
    var lines = $html[0].querySelectorAll('a[name]');
    var speakers = new Array();

    for (i = 0; i < lines.length; i++) {
        if ($(lines[i]).attr('name').indexOf('speech') >= 0) {
            var person = lines[i].text.replace(/:$/, "");
            if (!speakers[person]) {
                speakers[person] = 0;
            }
            i++;
            while ((i < lines.length) && ($(lines[i]).attr('name').indexOf('speech') < 0)) {
                speakers[person] ++;
                i++;
            }
            i--;
        }
    }
    
    appendHtmlToPage(speakers);
}

// processFile sets up the doc fragment to be read through
function processFile(respText) {
    $html.append(respText);
    howManyLines($html);
}

// play is loaded in from url
function backgroundReadFile(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        if (req.status < 400)
            howManyLines(req.responseText);
    });
    req.send(null);
}

// play is selected when button is clicked
$(document).ready(function () {
    $("button").click(function () {
        $html = $(document.createDocumentFragment());
        url = "playtext/" + $(this).attr("name") + ".html";
        backgroundReadFile(url);
    });
});