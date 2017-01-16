////////////////////////////////////////////////////////////////////////////////
// Types
////////////////////////////////////////////////////////////////////////////////
lin = {}

// type color =
//   | Red
//   | Blue
//   | Green
//   | Yellow
//   | Purple
lin.Color = {
  Red:    "#F9DAD0",
  Blue:   "#86BBD8",
  Green:  "#C5DCA0",
  Yellow: "#F5F2B8",
  Purple: "#818AA3",
  Right:  "green",
  Wrong:  "red",
}

lin.colors = [
  lin.Color.Red,
  lin.Color.Blue,
  lin.Color.Green,
  lin.Color.Yellow,
  lin.Color.Purple,
];

// type ActionType =
//   | Write
//   | Read
//   | Ret
//   | Ok
//
// type Action =
//   | Write of { type: ActionType, x: int }
//   | Read  of { type: ActionType         }
//   | Ret   of { type: ActionType, x: int }
//   | Ok    of { type: ActionType         }
lin.ActionType = {
  Write: "Write",
  Read: "Read",
  Ret: "Ret",
  Ok: "Ok",
}

lin.Action = function(type) {
  this.type = type;
}

lin.Write = function(x) {
  lin.Action.call(this, lin.ActionType.Write);
  this.x = x;
}

lin.Read = function() {
  lin.Action.call(this, lin.ActionType.Read);
}

lin.Ret = function(x) {
  lin.Action.call(this, lin.ActionType.Ret);
  this.x = x;
}

lin.Ok = function() {
  lin.Action.call(this, lin.ActionType.Ok);
}

lin.action_to_string = function(action) {
  if (action.type === lin.ActionType.Write) {
    return "W(" + action.x + ")";
  } else if (action.type === lin.ActionType.Read) {
    return "R()";
  } else if (action.type === lin.ActionType.Ret) {
    return action.x;
  } else if (action.type === lin.ActionType.Ok) {
    return "ok";
  } else {
    console.log("Unknown action type: " + action.type);
  }
}

lin.is_call = function(action) {
  return action.type === lin.ActionType.Write ||
         action.type === lin.ActionType.Read;
}

lin.is_resp = function(action) {
  return action.type === lin.ActionType.Ret ||
         action.type === lin.ActionType.Ok;
}

// type NamedAction = {
//   name:   string,
//   action: Action,
// }
lin.NamedAction = function(name, action) {
  this.name = name;
  this.action = action;
}

// type Event = {
//   name:      string,
//   color:     string,
//   call:      lin.Action,
//   resp:      lin.Action,
//   call_x:    int,
//   resp_x:    int,
//   clicked:   bool,
//   bar:       Snap.Element,
//   call_text: Snap.Element,
//   resp_text: Snap.Element,
//   line:      Snap.Element,
//   reg_box:   Snap.Element,
//   reg_text:  Snap.Element,
// }
lin.move_event = function(s, e, x) {
  var old_x = e.reg_text.attr("x");
  var new_x = lin.clamp(x, e.bar.attr("x1"), e.bar.attr("x2"));
  var dx = new_x - old_x;
  e.line.attr({x1: new_x, x2: new_x});
  e.reg_text.attr({x: new_x});
  e.reg_box.attr({x: Number(e.reg_box.attr("x")) + Number(dx)});
}

////////////////////////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/a/15313435/3187068
lin.assert = function(condition, message) {
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

lin.clamp = function(x, low, high) {
  return Math.max(Math.min(x, high), low);
}

////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////
lin.get_config = function(s) {
  return {
    width: s.attr("viewBox").width,
    pad_top: 0,
    pad_left: 0,
    pad_right: 10,
    marg_left: 25,
    line_height: 32,
    reg_text_pad: 10,
    reg_box_pad: 0,
    call_text_pad: 14,
    resp_text_pad: 14,
    node_height: 50,
  }
}

lin.collect_events = function(s, names, named_actions) {
  var pending_actions = {};
  var pending_indexes = {};

  var events = {};
  for (var i = 0; i < names.length; ++i) {
    events[names[i]] = [];
  }

  for (var i = 0; i < named_actions.length; ++i) {
    var na = named_actions[i];
    var name = na.name;
    var action = na.action;

    if (pending_actions[name] === undefined) {
      lin.assert(lin.is_call(action));
      pending_actions[name] = action;
      pending_indexes[name] = i;
    } else {
      lin.assert(lin.is_resp(action));
      events[name].push({
        name: name,
        color: lin.colors[names.indexOf(name) % lin.colors.length],
        call: pending_actions[name],
        resp: action,
        call_x: pending_indexes[name],
        resp_x: i,
        clicked: false,
      });
      delete pending_actions[name];
      delete pending_indexes[name];
    }
  }

  var flattened_events = [];
  for (var i = 0; i < names.length; ++i) {
    flattened_events = flattened_events.concat(events[names[i]]);
  }
  return flattened_events;
}

lin.render_names = function(s, names) {
  var c = lin.get_config(s);
  var name_index = {};

  for (var i = 0; i < names.length; ++i) {
    var x = c.pad_left;
    var y = c.pad_top + ((i + 1) * c.node_height);
    var name = s.text(x, y, names[i]);
    name.addClass("clientname");
    name.addClass("noselect");
    name_index[names[i]] = name;
  }

  return name_index;
}

lin.render_axes = function(s, names, drawn_names) {
  var c = lin.get_config(s);
  for (var i = 0; i < names.length; ++i) {
    var drawn_name = drawn_names[names[i]];
    var x1 = c.pad_left + c.marg_left;
    var x2 = c.width - c.pad_right;
    var y = drawn_name.getBBox().cy;
    var axis = s.line(x1, y, x2, y);
    axis.addClass("clientaxis");
  }
}

lin.render_event = function(s, dx, names, e) {
  var c = lin.get_config(s);

  // Bar
  var y = names[e.name].getBBox().cy;
  var x0 = c.pad_left + c.marg_left;
  var x1 = x0 + (e.call_x * dx);
  var x2 = x0 + (e.resp_x * dx);
  e.bar = s.line(x1, y, x2, y);
  e.bar.addClass("linbar");
  e.bar.attr({stroke: e.color});

  // Call text.
  e.call_text = s.text(x1, y - c.call_text_pad, lin.action_to_string(e.call));
  e.call_text.addClass("lincalltext");
  e.call_text.addClass("noselect");

  // Resp text.
  e.resp_text = s.text(x2, y - c.resp_text_pad, lin.action_to_string(e.resp));
  e.resp_text.addClass("lincalltext");
  e.resp_text.addClass("noselect");

  // Line.
  var line_x = x1 + (dx / 2);
  var line_y1 = y - (c.line_height / 2);
  var line_y2 = y + (c.line_height / 2);
  e.line = s.line(line_x, line_y1, line_x, line_y2);
  e.line.addClass("linline");

  // Reg text.
  e.reg_text = s.text(line_x, line_y1 - c.reg_text_pad, "0");
  e.reg_text.addClass("linregtext");
  e.reg_text.addClass("noselect");

  // Reg box.
  var bbox = e.reg_text.getBBox();
  var wh = Math.max(bbox.w, bbox.h) + (2 * c.reg_box_pad);
  e.reg_box = s.rect(bbox.cx - (wh / 2), bbox.cy - (wh / 2), wh, wh);
  e.reg_box.addClass("linregbox");
  e.reg_text.before(e.reg_box);
}

lin.render_events = function(s, names, named_actions) {
  // Collect the named actions into a list of events.
  var events = lin.collect_events(s, names, named_actions);

  // Draw the client names.
  var drawn_names = lin.render_names(s, names);

  // Draw the client axes.
  lin.render_axes(s, names, drawn_names);

  // Render the events.
  var c = lin.get_config(s);
  var width = c.width - c.pad_left - c.marg_left - c.pad_right;
  var dx = width / (named_actions.length - 1);
  for (i = 0; i < events.length; ++i) {
    lin.render_event(s, dx, drawn_names, events[i]);
  }

  return events;
}

lin.register_event_handlers = function(s, events, callback) {
  var svg = s.node;
  var p = svg.createSVGPoint();
  function cursor_point(e){
    p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  for (var i = 0; i < events.length; ++i) {
    var evt = events[i];

    evt.line.node.onmousedown = function(evt) {
        return function() {
          evt.clicked = true;
        };
    }(evt);

    evt.bar.node.onmousedown = function(evt) {
      return function(e) {
        var loc = cursor_point(e);
        lin.move_event(s, evt, loc.x);
        evt.clicked = true;
        callback();
      };
    }(evt);
  }

  svg.onmouseup = function() {
    for (var i = 0; i < events.length; ++i) {
      events[i].clicked = false;
    }
  };

  svg.onmousemove = function(e) {
    for (var i = 0; i < events.length; ++i) {
      var evt = events[i];
      if (e.which === 1 && evt.clicked) {
        var loc = cursor_point(e);
        lin.move_event(s, evt, loc.x);
        callback();
      }
    }
  };
}

lin.make_callback = function(s, events, init) {
  var lines = [];
  return function() {
    for (var i = 0; i < lines.length; ++i) {
      lines[i].remove();
    }
    lines = [];

    events.sort(function(a, b) {
      return a.reg_text.attr("x") - b.reg_text.attr("x");
    });

    var linearizable = true;
    for (var i = 0; i < events.length; ++i) {
      var e = events[i];

      // Update reg text.
      if (e.call.type === lin.ActionType.Write) {
        x = e.call.x;
      }
      e.reg_text.attr({text: x});

      // Draw line.
      if (i !== 0) {
        var x1 = events[i-1].line.attr("x1");
        var y1 = events[i-1].bar.attr("y2");
        var x2 = e.line.attr("x1");
        var y2 = e.bar.attr("y2");
        var line = s.line(x1, y1, x2, y2);
        line.addClass("lintimeline");
        lines.push(line);
      }

      // Check for correctness.
      if (e.resp.type === lin.ActionType.Ret && e.resp.x !== x) {
        linearizable = false;
        e.reg_box.attr({fill: lin.Color.Wrong});
      } else {
        e.reg_box.attr({fill: lin.Color.Right});
      }
    }
  };
}

// TODO(mwhittaker): Comment.
//
// Types:
//   - s: Snap.paper
//   - names: string list
//   - events: lin.Event list
//   - init: int
lin.animate = function(s, names, named_actions, init) {
  var events = lin.render_events(s, names, named_actions);
  var callback = lin.make_callback(s, events, init);
  callback();
  lin.register_event_handlers(s, events, callback);
}
