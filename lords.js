//source http://en.wikipedia.org/wiki/Wikipedia:Index_of_United_Kingdom_political_parties_meta_attributes
var party_colours = {
    'Labour': {
        'fill': "#DC241F",
        'outline': "#DC241F",
        'text': "white",
        'text_fill': '#DC241F',
        'toggle': 'lord_map_labour'
    },
    'Conservative': {
        'fill': "#0087DC",
        'outline': "#0087DC",
        'text': "white",
        'text_fill': "#0087DC",
        'toggle': 'lord_map_conservative'
    },
    'Liberal Democrat': {
        'fill': "#FDBB30",
        'outline': "#FDBB30",
        'text': "black",
        'text_fill': "#FDBB30",
        'toggle': 'lord_map_libdem'
    },
    'Green': {
        'fill': '#6AB023',
        'outline': "#6AB023",
        'text': "white",
        'text_fill': "#6AB023",
        'toggle': 'lord_map_green'
    },
    'Scottish National Party': {
        'fill': "#FFFF00",
        'outline': "#FFFF00",
        'text': "black",
        'text_fill': "#FFFF00",
    },
    'Plaid Cymru': {
        'fill': "#008142",
        'outline': "#008142",
        'text': "white",
        'text_fill': "#008142",
        'toggle': 'lord_map_plaid'
    },
    'UKIP': {
        'fill': "#70147A",
        'outline': "yellow",
        'text': "yellow",
        'text_fill': "#70147A",
        'toggle': 'lord_map_ukip'
    },
    '-': { //speaker
        'fill': "#CCCCCC",
        'outline': "#CCCCCC",
        'text': "black",
        'text_fill': "#CCCCCC"
    },
    'Independent': {
        'fill': "#DDDDDD",
        'outline': '#000000',
        'text': "black",
        'text_fill': "#DDDDDD"
    },
    'Respect': {
        'fill': "#FF3300",
        'outline': "#FF3300",
        'text': "white",
        'text_fill': "#FF3300"
    },
    'Alliance': {
        'fill': "#F6CB2F",
        'outline': "#F6CB2F",
        'text': "black",
        'text_fill': "#F6CB2F",
    },
    'Sinn Fein': {
        'fill': "#008800",
        'outline': "#008800",
        'text': "white",
        'text_fill': "#008800"
    },
    'DUP': {
        'fill': "#D46A4C",
        'outline': "#D46A4C",
        'text': "white",
        'text_fill': "#D46A4C",
        'toggle': 'lord_map_dup'
    },
    'Social Democratic and Labour Party': {
        'fill': "#99FF66",
        'outline': "#99FF66",
        'text': 'white',
        'text_fill': "#99FF66"
    },
    'Bishop': {
        'fill': "#663399",
        'outline': "#663399",
        'text': "white",
        'text_fill': "#663399",
        'toggle': 'lord_map_bishop'
    },
    'Crossbench': {
        'fill': "#FFFFFF",
        'outline': "#000000",
        'text': "black",
        'text_fill': "white",
        'toggle': 'lord_map_crossbench'
    },
    'Independent Labour': {
        'fill': "#B22222",
        'outline': "#B22222",
        'text': "white",
        'text_fill': "#B22222",
        'toggle': 'lord_map_indlab'
    },
    'Judge': {
        'fill': "#777777",
        'outline': "#000000",
        'text': "white",
        'text_fill': "#777777",
        'toggle': 'lord_map_judge'
    },
    'Non-affiliated': {
        'fill': "#DDDDDD",
        'outline': "#000000",
        'text': "black",
        'text_fill': "#DDDDDD",
        'toggle': 'lord_map_nonaff'
    },
    'Other': {
        'fill': "#AAAAAA",
        'outline': "#000000",
        'text': "black",
        'text_fill': "#AAAAAA",
        'toggle': 'lord_map_other'
    },
    'UUP': {
        'fill': "#9999FF",
        'outline': "#9999FF",
        'text': "white",
        'text_fill': "#9999FF",
        'toggle': 'lord_map_uup'
    }
};

//functions to move us around
function zoom_in() {
    if (zoomFactor < 8) {
        //this keeps us centred on the same spot
        var map_width = Math.round((chart.getAttribute('width') - (2 * border)) / (radius * zoomFactor));
        var map_height = Math.round((chart.getAttribute('height') - (2 * border)) / (radius * zoomFactor));
        x_offset += Math.round(0.25 * map_width);
        y_offset += Math.round(0.25 * map_height);
        zoomFactor *= 2;
        layoutMap();
    }
}

function zoom_out() {
    if (zoomFactor > 1) {
        //keep centred on same spot
        var map_width = Math.round((chart.getAttribute('width') - (2 * border)) / (radius * zoomFactor));
        var map_height = Math.round((chart.getAttribute('height') - (2 * border)) / (radius * zoomFactor));
        x_offset -= Math.round(0.5 * map_width);
        y_offset -= Math.round(0.5 * map_width);
        zoomFactor /= 2;
        layoutMap();
    }
}

function move_map(x, y) {
    x_offset += Math.round(x * (step_size / zoomFactor));
    y_offset += Math.round(y * (step_size / zoomFactor));
    layoutMap();
}

//capitalise all words except "of", "in", "and" and "the", unless they are the first word
String.prototype.capitalise = function() {
    var do_not_capitalise = ["of", "in", "and", "the", "under", "upon", "le"]

    var word_list = this.split(" ");
    for (word_num in word_list) {
        word = word_list[word_num];
        word_parts = word.split("-");

        //do the same for hyphenated sub parts of words
        for (part_num in word_parts) {
            part = word_parts[part_num]
            if (do_not_capitalise.indexOf(part) == -1) {
                word_parts[part_num] = part.charAt(0).toUpperCase() + part.slice(1);
            }
        }

        //update original list
        word = word_parts.join("-")
        word_list[word_num] = word

        //word not found in exclusion list
        if ((word_num == 0) || (do_not_capitalise.indexOf(word) == -1)) {
            word_list[word_num] = word.charAt(0).toUpperCase() + word.slice(1);
        }
    }

    return word_list.join(" ");
}

//lower the first letter of each phrase
String.prototype.uncapitalise = function() {
    var do_not_uncapitalise = []

    var word_list = this.split(" ");
    for (word_num in word_list) {
        word = word_list[word_num];

        //first word not found in exclusion list
        if ((word_num == 0) && (do_not_uncapitalise.indexOf(word) == -1)) {
            word_list[word_num] = word.charAt(0).toLowerCase() + word.slice(1);
        }
    }

    return word_list.join(" ");
}

//set up our chart area
var width = 745;
var height = 780;
var radius = 5;
var border = 10;
var button_size = 20;
var button_gap = 5;

//set up the chart object we're drawing into
var chart = document.getElementById("lords_chart");
chart.setAttribute("width", width);
chart.setAttribute("height", height);

//use to highlight who's been clicked on
var selected_lord = null;

//create a circle for each lord based on the centre of their territorial designation (locations pre-parsed)
function layoutMap() {
    //remove all existing circles
    while (chart.firstChild) {
        chart.removeChild(chart.firstChild);
    }

    //then add new ones
    for (lord_number in lords) {
        lord = lords[lord_number];

        var lord_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        lord_circle.setAttribute("id", "lord-" + lord_number);
        lord_circle.setAttribute("r", (Math.floor(radius / 2) * zoomFactor));
        lord_circle.setAttribute("cx", border + ((lord['x'] - x_offset) * zoomFactor * radius));
        lord_circle.setAttribute("cy", border + ((lord['y'] - y_offset) * zoomFactor * radius));
        lord_circle.setAttribute("lord", lord_number);
        lord_circle.style.fill = party_colours[lord['party']]['fill'];
        lord_circle.style.stroke = party_colours[lord['party']]['outline'];
        lord_circle.style.strokeWidth = zoomFactor;
        lord_circle.class = "lord_circle";

        //decide whether to show or not depending on party toggle (to cope with zooms)
        party_toggle_string = party_colours[lord['party']]['toggle']
        party_toggle = document.getElementById(party_toggle_string).checked
        if (party_toggle) {
            lord_circle.style.visibility = "visible";
        }
        else {
            lord_circle.style.visibility = "hidden";
        }

        //deal with clicking on a lord
        lord_circle.addEventListener("mousedown", function() {
            lord = lords[this.getAttribute("lord")];
            selected_lord = lord;

            //move the highlight circle
            selected_square.style.visibility = "visible";
            selected_square.setAttribute("cx", this.getAttribute("cx"));
            selected_square.setAttribute("cy", this.getAttribute("cy"));

            //make details box visible
            document.getElementById("selected_lord").style.display = "block";

            //update info box with lord's title
            var lord_title = document.getElementById("lord_title");
            lord_title.innerHTML = lord['full_title']
            
            //colour in headers for the lord's party
            lord_title.style.color = party_colours[lord['party']]['text'];
            lord_title.style.backgroundColor = party_colours[lord['party']]['text_fill'];
            lord_title.style.borderColor = party_colours[lord['party']]['outline'];
            lord_title.style.borderWidth = "1px";
            lord_title.style.borderStyle = "solid";

            var lord_profile_h3 = document.getElementById("lord_profile_h3");

            //get the lord's name
            var lord_name = "";
            if (lord['first_name'].trim().length > 0) {
                lord_name = lord['first_name'].trim();
            }
            if (lord['last_name'].trim().length > 0) {
                lord_name += " " + lord['last_name'].trim();
            }
            if (lord['party'].length > 0) {
                lord_name += ", " + lord['party'];
            }
            document.getElementById("lord_name").innerHTML = lord_name.trim();

            //update lord's profile (if we have it)
            var regex = /\[\d+\]/g;
            document.getElementById("lord_profile").innerHTML = lord['profile'].replace(regex, "")

            //lord's likes and dislikes
            var likes_list = lord['likes']
            var lord_likes = document.getElementById('lord_likes')
            
            //hide this paragraph if nothing to say
            if (likes_list.length == 0) {
                lord_likes.style.visibility = "hidden";
                lord_likes.innerHTML = "";
            }
            //if have something to say then let's start adding it up.
            else {
                var likes_string = "";
                //add intro and first like
                likes_string += "This Peer has voted in favour of ";
                likes_string += '<span class="lord_like">' + likes_list[0]['issue'].uncapitalise() + "</span>";

                if (likes_list.length > 1) {
                    //work out how to join the second and third likes
                    if (likes_list.length == 3) {
                        var likes_join = ", ";
                    }
                    else {
                        var likes_join = " and ";
                    }
                    likes_string += likes_join + '<span class="lord_like">' + likes_list[1]['issue'].uncapitalise() + "</span>";

                    if (likes_list.length == 3) {
                        likes_string += ' and <span class="lord_like">' + likes_list[2]['issue'].uncapitalise() + "</span>";
                    }
                }

                //full stop for finality
                likes_string += ".";
                lord_likes.innerHTML = likes_string;
                lord_likes.style.visibility = "visible";
            }

            //lord's likes and dislikes
            var dislikes_list = lord['dislikes']
            var lord_dislikes = document.getElementById('lord_dislikes')
            
            //hide this paragraph if nothing to say
            if (dislikes_list.length == 0) {
                lord_dislikes.style.visibility = "hidden";
                lord_dislikes.innerHTML = "";
            }
            //if have something to say then let's start adding it up.
            else {
                var dislikes_string = "";
                //add intro and first like
                dislikes_string += "This Peer has voted against ";
                dislikes_string += '<span class="lord_dislike">' + dislikes_list[0]['issue'].uncapitalise() + "</span>";

                if (dislikes_list.length > 1) {
                    //work out how to join the second and third likes
                    if (dislikes_list.length == 3) {
                        var dislikes_join = ", ";
                    }
                    else {
                        var dislikes_join = " and ";
                    }
                    dislikes_string += dislikes_join + '<span class="lord_dislike">' + dislikes_list[1]['issue'].uncapitalise() + "</span>";

                    if (dislikes_list.length == 3) {
                        dislikes_string += ' and <span class="lord_dislike">' + dislikes_list[2]['issue'].uncapitalise() + "</span>";
                    }
                }

                //full stop for finality
                dislikes_string += ".";
                lord_dislikes.innerHTML = dislikes_string;
                lord_dislikes.style.visibility = "visible";
            }

            //also check the header to see if it needs to disappear
            var lord_voting_h3 = document.getElementById("lord_voting_h3");
            if ((likes_list.length == 0) && (dislikes_list.length == 0)) {
                lord_voting_h3.style.visibility == "hidden";
            }
            else {
                lord_voting_h3.style.visibility == "visible";
            }

            //lord's wikipedia link + they workd for you link
            document.getElementById("lord_wiki").href = lord['wiki_url'];
            document.getElementById("lord_wiki").innerHTML = "Read more about this Peer on Wikipedia";

            //they work for you link
            document.getElementById("lord_twfy").href = "http://theyworkforyou.com/peer/" + lord['person_id'];
        });

        //add it to the map
        chart.appendChild(lord_circle);
    }

    //add highlight circle to map
    var selected_square = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    selected_square.style.fill = "none";
    selected_square.style.stroke = "black";
    selected_square.style.strokeWidth = 2 * zoomFactor;
    selected_square.style.visibility = "hidden";
    selected_square.setAttribute("r", (zoomFactor * radius));
    chart.appendChild(selected_square);

    //highlight circle in right place if a lord is selected
    if (selected_lord) {
        var lord_num = lords.indexOf(selected_lord)
        var lord_circle = document.getElementById('lord-' + lord_num);
        selected_square.style.visibility = "visible";
        selected_square.setAttribute("cx", lord_circle.getAttribute("cx"));
        selected_square.setAttribute("cy", lord_circle.getAttribute("cy"));
    }

    //add buttons to the chart - at the top-right starting with + for zoom in
    var zoom_in_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    zoom_in_button.style.fill = "white";
    zoom_in_button.style.stroke = "black";
    zoom_in_button.style.strokeWidth = 2;
    zoom_in_button.setAttribute("width", button_size);
    zoom_in_button.setAttribute("height", button_size);
    zoom_in_button.setAttribute("x", border);
    zoom_in_button.setAttribute("y", border);
    zoom_in_button.addEventListener("mousedown", function() {
        zoom_in();
    });
    chart.appendChild(zoom_in_button);
    var zoom_in_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    zoom_in_label.textContent = "+";
    zoom_in_label.setAttribute("x", border + 2);
    zoom_in_label.setAttribute("y", border + button_size - 4);
    zoom_in_label.style.fontSize = "20px";
    zoom_in_label.style.fill = "black";
    zoom_in_label.style.fontFamily = "Zapf Dingbats";
    zoom_in_label.addEventListener("mousedown", function() {
        zoom_in();
    });
    zoom_in_label.style.cursor = "default";
    chart.appendChild(zoom_in_label);

    //zoom out
    var zoom_out_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    zoom_out_button.style.fill = "white";
    zoom_out_button.style.stroke = "black";
    zoom_out_button.style.strokeWidth = 2;
    zoom_out_button.setAttribute("width", button_size);
    zoom_out_button.setAttribute("height", button_size);
    zoom_out_button.setAttribute("x", border);
    zoom_out_button.setAttribute("y", border + button_size + button_gap);
    zoom_out_button.addEventListener("mousedown", function() {
        zoom_out();
    });
    chart.appendChild(zoom_out_button);
    var zoom_out_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    zoom_out_label.textContent = "-";
    zoom_out_label.setAttribute("x", border + 4);
    zoom_out_label.setAttribute("y", border + (2 * button_size) + 2);
    zoom_out_label.style.fontSize = "20px";
    zoom_out_label.style.fill = "black";
    zoom_out_label.style.fontFamily = "Zapf Dingbats";
    zoom_out_label.addEventListener("mousedown", function() {
        zoom_out();
    });
    zoom_out_label.style.cursor = "default";
    chart.appendChild(zoom_out_label);

    //move left
    var move_left_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    move_left_button.style.fill = "white";
    move_left_button.style.stroke = "black";
    move_left_button.style.strokeWidth = 2;
    move_left_button.setAttribute("width", button_size);
    move_left_button.setAttribute("height", button_size);
    move_left_button.setAttribute("x", border + button_size + (2 * button_gap));
    move_left_button.setAttribute("y", border + (0.5 * button_size + button_gap));
    move_left_button.addEventListener("mousedown", function() {
        move_map(-1, 0);
    });
    chart.appendChild(move_left_button);
    var move_left_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    move_left_label.textContent = "←";
    move_left_label.setAttribute("x", border + button_size + border + 3);
    move_left_label.setAttribute("y", border + button_size + button_gap + 6);
    move_left_label.style.fontSize = "16px";
    move_left_label.style.fontWeight = "bold";
    move_left_label.style.fill = "black";
    move_left_label.style.fontFamily = "Zapf Dingbats";
    move_left_label.addEventListener("mousedown", function() {
        move_map(-1, 0);
    });
    move_left_label.style.cursor = "default";
    chart.appendChild(move_left_label);

    //move right
    var move_right_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    move_right_button.style.fill = "white";
    move_right_button.style.stroke = "black";
    move_right_button.style.strokeWidth = 2;
    move_right_button.setAttribute("width", button_size);
    move_right_button.setAttribute("height", button_size);
    move_right_button.setAttribute("x", border + (3 * button_size) + (4 * button_gap));
    move_right_button.setAttribute("y", border + (0.5 * button_size + button_gap));
    move_right_button.addEventListener("mousedown", function() {
        move_map(1, 0);
    });
    chart.appendChild(move_right_button);
    var move_right_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    move_right_label.textContent = "→";
    move_right_label.setAttribute("x", border + (3 * button_size) + (4 * button_gap) + 3);
    move_right_label.setAttribute("y", border + button_size + button_gap + 6);
    move_right_label.style.fontSize = "16px";
    move_right_label.style.fontWeight = "bold";
    move_right_label.style.fill = "black";
    move_right_label.style.fontFamily = "Zapf Dingbats";
    move_right_label.addEventListener("mousedown", function() {
        move_map(1, 0);
    });
    move_right_label.style.cursor = "default";
    chart.appendChild(move_right_label);

    //move up
    var move_up_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    move_up_button.style.fill = "white";
    move_up_button.style.stroke = "black";
    move_up_button.style.strokeWidth = 2;
    move_up_button.setAttribute("width", button_size);
    move_up_button.setAttribute("height", button_size);
    move_up_button.setAttribute("x", border + (2 * button_size) + (3 * button_gap));
    move_up_button.setAttribute("y", border);
    move_up_button.addEventListener("mousedown", function() {
        move_map(0, -1);
    });
    chart.appendChild(move_up_button);
    var move_up_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    move_up_label.textContent = "↑";
    move_up_label.setAttribute("x", border + (2 * button_size) + (3 * button_gap) + 4);
    move_up_label.setAttribute("y", border + button_size - 4);
    move_up_label.style.fontSize = "16px";
    move_up_label.style.fontWeight = "bold";
    move_up_label.style.fill = "black";
    move_up_label.style.fontFamily = "Zapf Dingbats";
    move_up_label.addEventListener("mousedown", function() {
        move_map(0, -1);
    });
    move_up_label.style.cursor = "default";
    chart.appendChild(move_up_label);

    //move down
    var move_down_button = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    move_down_button.style.fill = "white";
    move_down_button.style.stroke = "black";
    move_down_button.style.strokeWidth = 2;
    move_down_button.setAttribute("width", button_size);
    move_down_button.setAttribute("height", button_size);
    move_down_button.setAttribute("x", border + (2 * button_size) + (3 * button_gap));
    move_down_button.setAttribute("y", border + button_size + button_gap);
    move_down_button.addEventListener("mousedown", function() {
        move_map(0, 1);
    });
    chart.appendChild(move_down_button);
    var move_down_label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    move_down_label.textContent = "↓";
    move_down_label.setAttribute("x", border + (2 * button_size) + (3 * button_gap) + 4);
    move_down_label.setAttribute("y", border + (2 * button_size) + 2);
    move_down_label.style.fontSize = "16px";
    move_down_label.style.fontWeight = "bold";
    move_down_label.style.fill = "black";
    move_down_label.style.fontFamily = "Zapf Dingbats";
    move_down_label.addEventListener("mousedown", function() {
        move_map(0, 1);
    });
    move_down_label.style.cursor = "default";
    chart.appendChild(move_down_label);
}



//then lay it out on the first go for the whole map
var zoomFactor = 1;
var x_offset = 0;
var y_offset = 0;
var step_size = 10;
layoutMap();

//toggle showing a party on or off
function toggleMap(party, newState) {
    //check if we're toggling on or off
    if (newState) {
        var visibility = "visible";
    }
    else {
        var visibility = "hidden";
    }

    //go through and toggle
    for (var lord_num in lords) {
        var lord = lords[lord_num];
        if ((lord['party'] == party) || (party == 'all')) {
            var lord_circle = document.getElementById('lord-' + lord_num);
            lord_circle.style.visibility = visibility;
        }
    }

    //if doing the lot then need to toggle others too!
    if (party == 'all') {
        document.getElementById("lord_map_labour").checked = newState;
        document.getElementById("lord_map_conservative").checked = newState;
        document.getElementById("lord_map_libdem").checked = newState;
        document.getElementById("lord_map_crossbench").checked = newState;
        document.getElementById("lord_map_plaid").checked = newState;
        document.getElementById("lord_map_green").checked = newState;
        document.getElementById("lord_map_dup").checked = newState;
        document.getElementById("lord_map_uup").checked = newState;
        document.getElementById("lord_map_ukip").checked = newState;
        document.getElementById("lord_map_bishop").checked = newState;
        document.getElementById("lord_map_judge").checked = newState;
        document.getElementById("lord_map_indlab").checked = newState;
        document.getElementById("lord_map_nonaff").checked = newState;
        document.getElementById("lord_map_other").checked = newState;
    }
}