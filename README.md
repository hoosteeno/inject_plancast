# inject_plancast

## A jQuery plugin for putting some Plancast events on your site

### Instructions and Caveats

1. Get [mustache.js](https://github.com/janl/mustache.js) and inject_plancast.js and put in your web directory.
1. Include both in a script tag:

        <script src="/javascripts/mustache.js" type="text/javascript"></script>
        <script src="/javascripts/inject_plancast.js" type="text/javascript"></script>

1. Call inject_plancast on a set of jQuery elements:

        <script>
          jq('#plancast').inject_plancast({
            data: {
              username: 'hoosteeno',
            }
          });
        </script>

1. Optional and recommended! Provide your own mustache templates for rendering the output:

        <script>
          jq('#plancast').inject_plancast({
            down_template: jq('script.template[name="plancast-down-template"]').first().html(),
            cal_event_template: jq('script.template[name="plancast-cal_event-template"]').first().html(),
            data: {
              username: 'hoosteeno',
            }
          });
        </script>

1. Optional! Make a cool pinwheel graphic or prancing unicorn that will display while the plugin gets cal_events from Plancast, and then vanish like magic when it has loaded:

        <script>
          jq('#plancast').inject_plancast({
            loading_msg: jq('#plancast .loading'),
            data: {
              username: 'hoosteeno',
            }
          });
        </script>

1. A fairly complete set of configurable parameters is below, with their defaults:

        jq.fn.inject_plancast.default_options = {
          timeout: 5000,
          templatize: true,
          loading_msg: '',
          cal_event_template: jq.fn.inject_plancast.cal_event_template,
          down_template: jq.fn.inject_plancast.down_template,
          no_cal_events_template: jq.fn.inject_plancast.no_cal_events_template,
          data: {
            username: 'hoosteeno',
            extensions: 'place',
            view_type: 'upcoming',
            count: '25'
          }
        }

1. There are certainly bugs. What a great opportunity for us to learn from one another!
