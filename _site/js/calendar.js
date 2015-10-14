var clientId = '185959989156-46u30kbon0g01vn360jm23fka6bn8hrg.apps.googleusercontent.com'; //choose web app client Id, redirect URI and Javascript origin set to http://localhost
var apiKey = 'AIzaSyA4ZnNiq6_XjCEsYypbLrA4l0jKGsgR6Uw'; //choose public apiKey, any IP allowed (leave blank the allowed IP boxes in Google Dev Console)
var calendarId = "m4v7paaqm53s67pdri2og474so@group.calendar.google.com"; //your calendar Id
var userTimeZone = "America/New_York"; //example "Rome" "Los_Angeles" ecc...
var maxRows = 10; //events to shown
var calName = "Upcoming Events"; //name of calendar (write what you want, doesn't matter)
    
var scopes = 'https://www.googleapis.com/auth/calendar';
    
//--------------------- Add a 0 to numbers
function padNum(num) {
    if (num <= 9) {
        return "0" + num;
    }
    return num;
}
//--------------------- end    
    
//--------------------- From 24h to Am/Pm
function AmPm(num) {
    if (num <= 12) { return "am " + num; }
    return "pm " + padNum(num - 12);
}
//--------------------- end    

//--------------------- num Month to String
function monthString(num) {
         if (num === "01") { return "JAN"; } 
    else if (num === "02") { return "FEB"; } 
    else if (num === "03") { return "MAR"; } 
    else if (num === "04") { return "APR"; } 
    else if (num === "05") { return "MAJ"; } 
    else if (num === "06") { return "JUN"; } 
    else if (num === "07") { return "JUL"; } 
    else if (num === "08") { return "AUG"; } 
    else if (num === "09") { return "SEP"; } 
    else if (num === "10") { return "OCT"; } 
    else if (num === "11") { return "NOV"; } 
    else if (num === "12") { return "DEC"; }
}
//--------------------- end

//--------------------- from num to day of week
function dayString(num){
         if (num == "1") { return "Mon" }
    else if (num == "2") { return "Tue" }
    else if (num == "3") { return "Wed" }
    else if (num == "4") { return "Thu" }
    else if (num == "5") { return "Fri" }
    else if (num == "6") { return "Sat" }
    else if (num == "0") { return "Sun" }
}
//--------------------- end

//--------------------- client CALL
function handleClientLoad() {
    gapi.client.setApiKey(apiKey);
    checkAuth();
}
//--------------------- end

//--------------------- check Auth
function checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}
//--------------------- end

//--------------------- handle result and make CALL
function handleAuthResult(authResult) {
    if (authResult) {
        makeApiCall();
    }
}
//--------------------- end

//--------------------- API CALL itself
function makeApiCall() {
    var today = new Date(); //today date
    gapi.client.load('calendar', 'v3', function () {
        var request = gapi.client.calendar.events.list({
            'calendarId' : calendarId,
            'timeZone' : userTimeZone, 
            'singleEvents': true, 
            'timeMin': today.toISOString(), //gathers only events not happened yet
            'maxResults': maxRows, 
            'orderBy': 'startTime'});
    request.execute(function (resp) {
            for (var i = 0; i < resp.items.length; i++) {
                var li = document.createElement('li');
                var item = resp.items[i];
                var classes = [];
                var allDay = item.start.date? true : false;
                var startDT = allDay ? item.start.date : item.start.dateTime;
                var dateTime = startDT.split("T"); //split date from time
                var date = dateTime[0].split("-"); //split yyyy mm dd
                var startYear = date[0];
                var startMonth = monthString(date[1]);
                var startDay = date[2];
                var startDateISO = new Date(startMonth + " " + startDay + ", " + startYear + " 00:00:00");
                var startDayWeek = dayString(startDateISO.getDay());
                if( allDay == true){ //change this to match your needs
                    var str = [
                    '<font size="4">',
                    startDayWeek, ' ',
                    startMonth, ' ',
                    startDay, ' ',
                    startYear, '</font><font size="5"> @ ', item.summary , '</font><br><br>'
                    ];
                }
                else{
                    var time = dateTime[1].split(":"); //split hh ss etc...
                    var startHour = AmPm(time[0]);
                    var startMin = time[1];
                    var str = [ //change this to match your needs
                        '<font size="4">',
                        startDayWeek, ' ',
                        startMonth, ' ',
                        startDay, ' ',
                        startYear, ' - ',
                        startHour, ':', startMin, '</font><font size="5"> ',
                        '<a href="', item.htmlLink, '">', item.summary , '</a><br>',
                        item.description, '<br>',
                        '<a href="https://www.google.com/maps/search/', item.location, '">', 'Location', '</a><br>',
                        '</font><br><br>'
                        ];
                }
                li.innerHTML = str.join('');
                li.setAttribute('class', classes.join(' '));
                document.getElementById('events').appendChild(li);
            }
        document.getElementById('updated').innerHTML = "updated " + today;
        document.getElementById('calendar').innerHTML = calName;
        });
    });
}
//--------------------- end