(function(jq){

  jq.fn.inject_plancast = function(options) {

    var required = [
      'username'
    ]
    for (i=0; i<required.length; i++) {
      if (options[required[i]] == null && options.data[required[i]] == null) {
        throw new Error('inject_plancast: ' + required[i] + ' is required');
      }
    }

    options = jq.extend(true, {}, jq.fn.inject_plancast.default_options, options);

    var error = false;

    var enforce_timeout = window.setTimeout(function (){
      generate_error(options.down_template);
    }, options.timeout);

    function get_cal_events() {
      jq.ajax({
        url: "http://api.plancast.com/02/plans/user.json",
        dataType: 'jsonp',
        jsonp: 'jsonp',
        success: function(data) {
          handle_response(data);
        },
        data: options.data
      });
    }

    function enhance_cal_event(cal_event) {
      cal_event.date = new Date(parseInt(cal_event.start*1000));
      cal_event.iso_date = cal_event.date.toISOString();
      cal_event.human_date = cal_event.date.toDateString();
      if (cal_event.place != null) {
        cal_event.maps_url = "http://maps.google.com/maps?q=" + escape(cal_event.place.address);
      }
      console.log(cal_event);
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

        if (result.plans.length == 0) {
          generate_error(options.no_cal_events_template);
        }

        else {

          window.clearTimeout(enforce_timeout);

          if (options.loading_msg != null) {
            jq(options.loading_msg).remove();
          }

          cal_events = result.plans;

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

  jq.fn.inject_plancast.cal_event_template = '<article><div><h3><a href="{{attendance_url}}">{{what}}</a></h3><time datetime="{{iso_date}}">{{human_date}}</time><span class="location">{{where}}</span>{{description}} {{#external_url}}(More information <a href="{{external_url}}">here</a>.){{/external_url}}{{#maps_url}}(<a href="{{maps_url}}">Map</a>){{/maps_url}}</div></article>';
  jq.fn.inject_plancast.down_template = '<article><h3>Uh oh..</h3><div>It looks like the event calendar is down right now. Please refresh your browser window in a little while.</div></article>';
  jq.fn.inject_plancast.no_cal_events_template = '<article><h3>No events!</h3><div>There are no upcoming events. Please check again soon!</div></article>';

  jq.fn.inject_plancast.default_options = {
    timeout: 5000,
    templatize: true,
    loading_msg: '',
    cal_event_template: jq.fn.inject_plancast.cal_event_template,
    down_template: jq.fn.inject_plancast.down_template,
    no_cal_events_template: jq.fn.inject_plancast.no_cal_events_template,

    data: {
      username: '',
      extensions: 'place',
      view_type: 'upcoming',
      count: '25'
    }
  }


})(jQuery);
