////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
ds = {}

// type name = string;
//
// type node = {
//   element: Snap.element,
//   name:    name,
//   color:   string,
// }
ds.Node = function(element, name, color) {
  this.element = element;
  this.name = name;
  this.color = color;
}

// type action =
//   | Delay of {
//     duration: float
//   }
//   | Message of {
//     to:       name,
//     duration: float,
//     call:     string,
//     resp:     string,
//   }
ds.ActionType = {
  Delay:   "Delay",
  Message: "Message",
}

ds.Action = function(type) {
  this.type = type;
}

ds.Delay = function(duration) {
  ds.Action.call(this, ds.ActionType.Delay);
  this.duration = duration;
}

ds.Message = function(duration, call, resp, to) {
  ds.Action.call(this, ds.ActionType.Message);
  this.to = to;
  this.duration = duration;
  this.call = call;
  this.resp = resp;
}

// type color =
//   | Red
//   | Blue
//   | Green
ds.Color = {
  Red:    "#F9DAD0",
  Blue:   "#86BBD8",
  Green:  "#C5DCA0",
  Yellow: "#F5F2B8",
  Purple: "#818AA3",
}

////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////
// TODO(mwhittaker): Comment.
function sum(xs) {
  return xs.reduce(function (x, y) { return x + y; });
}

// TODO(mwhittaker): Comment.
function max(xs) {
  return Math.max.apply(null, xs);
}

// TODO(mwhittaker): Comment.
function group(s, xs) {
  return s.group.apply(s, xs);
}

function rottext(s, x, y, text, angle, padding=0) {
  var dx = padding / Math.sqrt(2);
  var dy = padding / Math.sqrt(2);
  var t = s.text(x + dx, y - dy, text);
  t.attr({transform:"rotate(" + angle + " " + x + " " + y + ")"});
  return t;
}

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////
// TODO(mwhittaker): Comment.
ds.node = function(s, cx, cy, name, color) {
  var r = 20;
  var circle = s.circle(cx, cy, r);
  circle.attr({fill:color});
  circle.addClass("nodecircle");

  var text = s.text(cx, cy, name);
  text.attr({textAnchor:"middle", alignmentBaseline:"central"});
  text.addClass("nodetext");

  return new ds.Node(s.group(circle, text), name, color);
}

// TODO(mwhittaker): Comment.
ds.animation_config = function(s, bbox) {
  var view_box_width = s.attr("viewBox").width;
  var top_y = bbox.y2;

  var pad_top = 10;
  var pad_right = 10;
  var pad_left = 10;
  var horiz_pad = pad_right + pad_left;

  var client_pad_right = 20;
  var client_pad_left = 20;
  var client_horiz_pad = client_pad_right + client_pad_left;
  var client_width = view_box_width - horiz_pad - client_horiz_pad;
  var client_height = 50;

  var action_rotation = -30;
  var action_pad = 2;

  var reset_delay = 5000;

  return {
    view_box_width: view_box_width,
    top_y: top_y,
    pad_top: pad_top,
    pad_right: pad_right,
    pad_left: pad_left,
    horiz_pad: horiz_pad,
    client_pad_right: client_pad_right,
    client_pad_left: client_pad_left,
    client_horiz_pad: client_horiz_pad,
    client_width: client_width,
    client_height: client_height,
    action_rotation: action_rotation,
    action_pad: action_pad,
    reset_delay: reset_delay,
  };
}

// TODO(mwhittaker): Comment.
ds.max_duration = function(node_actions) {
  return max(node_actions.map(function(x) {
    return sum(x[1].map(function(x) { return x.duration; }));
  }));
}

// TODO(mwhittaker): Comment.
// TODO(mwhittaker): Messages should originate from the edge of the node, not
// the center of the node.
//
// Types:
//   - s: Snap.Paper
//   - nodes: ds.Node list
//   - actions: (name, ds.Action list) list
//   - invspeed: float
ds.animate = function(s, bbox, nodes, node_actions, invspeed) {
  // Metadata.
  var c = ds.animation_config(s, bbox);
  var max_duration = ds.max_duration(node_actions);
  console.log(max_duration);
  var node_index = {};
  for (var i = 0; i < nodes.length; ++i) {
    node_index[nodes[i].name] = nodes[i];
  }

  var client_lines = [];
  var client_texts = [];
  var msgs = [];
  for (var i = 0; i < node_actions.length; ++i) {
    var node_action = node_actions[i];
    var name = node_action[0];
    var actions = node_action[1];
    var node = node_index[name];

    // Client name.
    var x = c.pad_right;
    var y = c.top_y + c.pad_top + ((i + 1) * c.client_height);
    var client_name = s.text(x, y, name);
    client_name.addClass("clientname");

    // Client progress axis.
    var x = c.pad_left + c.client_pad_left;
    var y = client_name.getBBox().cy;
    var client_axis = s.line(x, y, x + c.client_width, y);
    client_axis.addClass("clientaxis");

    // Client lines and texts.
    var delay = 0;
    for (var j = 0; j < actions.length; ++j) {
      var action = actions[j];
      var width = (action.duration / max_duration) * c.client_width;

      if (action.type == ds.ActionType.Message) {
        // Client line.
        var client_line = s.line(x, y, x + width, y);
        client_line.addClass("clientline");
        client_line.attr({stroke:node.color});
        client_lines.push(client_line);

        // Client call.
        var client_call = rottext(s, x, y, action.call,
            c.action_rotation, c.action_pad);
        client_call.addClass("clienttext");
        client_texts.push(client_call);

        // Client response.
        var client_resp = rottext(s, x + width, y, action.resp,
            c.action_rotation, c.action_pad);
        client_resp.addClass("clienttext");
        client_texts.push(client_resp);

        // Message.
        var from_bbox = node.element.getBBox();
        var to_bbox = node_index[action.to].element.getBBox();
        var x1 = from_bbox.cx;
        var y1 = from_bbox.cy;
        var msg = s.circle(x1, y1, 0);
        msg.addClass("msg");
        msg.attr({fill: node.color});
        msg.prependTo(msg.paper);
        msgs.push({
          delay: delay,
          duration: action.duration,
          x1: x1,
          y1: y1,
          x2: to_bbox.cx,
          y2: to_bbox.cy,
          element: msg,
        });
      }

      x += width;
      delay += action.duration;
    }
  }

  // Progress mask.
  var x = c.pad_left;
  var y = c.top_y + c.pad_top;
  var mask_height = c.client_height * node_actions.length;
  var mask = s.rect(x, y, 0, mask_height);
  mask.attr({fill:"white"});
  group(s, client_lines.concat(client_texts)).attr({mask: mask});

  // Progress line.
  var x1 = c.pad_left + c.client_pad_left;
  var y1 = c.top_y + c.pad_top;
  var x2 = x1;
  var y2 = c.top_y + c.pad_top + (c.client_height * node_actions.length);
  var progress = s.line(x1, y1, x2, y2);
  progress.addClass("clientprogress");

  // Animation.
  var mask_width_start = c.client_pad_left;
  var mask_width_stop = c.client_width + c.client_horiz_pad;
  var progress_x_start = c.pad_left + c.client_pad_left;
  var progress_x_stop = c.view_box_width - c.pad_right;
  var msg_time_start = 0;
  var msg_time_stop_extra = c.client_pad_left * (max_duration / c.client_width);
  var msg_time_stop = max_duration + msg_time_stop_extra;
  var start = [mask_width_start, progress_x_start, msg_time_start];
  var stop = [mask_width_stop, progress_x_stop, msg_time_stop];

  var run = function() {
    Snap.animate(start, stop, function(xs) {
      var mask_width = xs[0];
      mask.attr({width: mask_width});

      var progress_x = xs[1];
      progress.attr({x1:progress_x, x2:progress_x});

      var msg_time = xs[2];
      for (var i = 0; i < msgs.length; ++i) {
        var msg = msgs[i];
        var start = msg.delay;
        var mid = msg.delay + (msg.duration / 2);
        var stop = msg.delay + msg.duration;

        if (start <= msg_time && msg_time <= mid) {
          var fraction = 2 * (msg_time - start) / msg.duration;
          var dx = msg.x2 - msg.x1;
          var dy = msg.y2 - msg.y1;
          var cx = msg.x1 + (dx * fraction);
          var cy = msg.y1 + (dy * fraction);
          msg.element.attr({cx:cx, cy:cy});
        } else if (mid <= msg_time && msg_time <= stop) {
          var fraction = 2 * (msg_time - mid) / msg.duration;
          var dx = msg.x1 - msg.x2;
          var dy = msg.y1 - msg.y2;
          var cx = msg.x2 + (dx * fraction);
          var cy = msg.y2 + (dy * fraction);
          msg.element.attr({cx:cx, cy:cy});
        }
      }
    }, max_duration * invspeed, function() {
      window.setTimeout(function() {
        run();
      }, c.reset_delay);
    });
  };
  run();
}
