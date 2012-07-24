(function(jq){

  jq.fn.inject_gcal = function(options) {

    var required = [
      'key',
      'gcal_id'
    ]
    for (i=0; i<required.length; i++) {
      if (options[required[i]] == null && options.data[required[i]] == null) {
        throw new Error('inject_gcal: ' + required[i] + ' is required');
      }
    }


    options = jq.extend(true, {}, jq.fn.inject_gcal.default_options, options);


    var error = false;

    var enforce_timeout = window.setTimeout(function (){
      generate_error(options.down_template);
    }, options.timeout);

    function get_cal_events() {
      jq.ajax({
        url: "https://www.googleapis.com/calendar/v3/calendars/"+options.gcal_id+"/events",
        dataType: 'json',
        success: function(data) {
          handle_response(data);
        },
        data: options.data
      });
    }

    function enhance_cal_event(cal_event) {
/*
        get its start time
        get its timezone
          if no timezone, then its in the calendar's default timezone
        convert the start/end times to the timezone specified
*/

      utc_start = cal_event.start.dateTime;
      event_timezone = cal_event.start.timeZone || default_timezone;

console.log(timezone);
console.log(utc_start);

      return cal_event;
    }

    function generate_error(template) {
      if (! error) {

        if (options.loading_msg != null) {
          jq(options.loading_msg).remove();
        }

        error = true;
        element.append(Mustache.render(template, ""));
      }
    }

    var element = this;
    var cal_events = [];
    var default_timezone;

    get_cal_events();

    function handle_response(result) {

      if (! error) {

        if (result.items.length == 0) {
          generate_error(options.no_cal_events_template);
        }

        else {

          window.clearTimeout(enforce_timeout);

          if (options.loading_msg != null) {
            jq(options.loading_msg).remove();
          }

          default_timezone = result.timeZone;
          cal_events = result.items;

          jq(cal_events).map(function() { 
            var cal_event = this;

            cal_event = enhance_cal_event(cal_event);

            if (options.templatize == true) {
              cal_event = Mustache.render(options.cal_event_template, cal_event);
            }

            element.append(cal_event);

            return cal_event;
          });
        }
      }
    };

    return element;

  }

  jq.fn.inject_gcal.cal_event_template = '<article><figure><a href="{{cal_event_url}}"><img src="{{first_picture}}"></a></figure><div><h3><a href="{{cal_event_url}}">{{title}}</a></h3><time datetime="{{iso_date}}">{{human_date}}</time>{{{blurb}}}<a href="{{cal_event_url}}">More &raquo;</a></div></article>';
  jq.fn.inject_gcal.down_template = '<article><h3>Uh oh..</h3><div>It looks like gcal is down right now. Please refresh your browser window in a little while.</div></article>';
  jq.fn.inject_gcal.no_cal_events_template = '<article><h3>No cal_events yet!</h3><div>This blog is empty right now. Please check again soon!</div></article>';

  jq.fn.inject_gcal.today = function() {
    // get a string for today
    var d = new Date;
    var month = '0'+(parseInt(d.getMonth())+1);
    month = month.substring(month.length-2, month.length);
    return d.getFullYear()+'-'+month+'-'+d.getDate()+'T00:00:00.000Z';
  }

  jq.fn.inject_gcal.default_options = {

    timeout: 5000,
    templatize: true,
    loading_msg: '',
    cal_event_template: jq.fn.inject_gcal.cal_event_template,
    down_template: jq.fn.inject_gcal.down_template,
    no_cal_events_template: jq.fn.inject_gcal.no_cal_events_template,
    gcal_id: '',

    data: {
      orderBy: 'startTime',
      singleEvents: 'true',
      timeMin: jq.fn.inject_gcal.today(),
      timeZone: 'GMT',
      key: '',
      max_results: '25'
    }
  }


})(jQuery);
