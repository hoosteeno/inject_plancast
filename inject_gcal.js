    google.load("gdata", "1");

    google.setOnLoadCallback(get_feed);

    var service;

    var feed_url = "http://www.google.com/calendar/feeds/dojo4.com_hee2vs2nomkifsc16j5p39g0gs%40group.calendar.google.com/public/full?alt=json-in-script&max-results=25&singleevents=false&futureevents=true&sortorder=ascending&orderby=starttime";

    function setup_service() {
      service = new google.gdata.calendar.CalendarService('exampleCo-exampleApp-1');
    }

    function get_feed() {
      setup_service();
      service.getEventsFeed(feed_url, handle_feed, handle_error);
    }

    function handle_feed(data) {
      $(data.feed.entry).each(function() {
        var entry = this;

        var timestamp = entry.gd$when[0].startTime;
        var date = new Date(timestamp);
        var zone_free_time = date.toString();
        console.log(zone_free_time);

        console.log(entry.gd$when[0].startTime);
        console.log(entry.gd$where[0].valueString);
        console.log(entry.title.$t);

        console.log(entry);
      });
    }

    function handle_error(e) {
      alert("There was an error!");
      alert(e.cause ? e.cause.statusText : e.message);
    }
