// The state-based replication, abbreviated sr, namespace.
sr = {}

////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////
sr.max = function(xs) {
  return Math.max.apply(null, xs)
}

sr.distance = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.sqrt(dx*dx + dy*dy);
}

sr.angle = function(x1, y1, x2, y2) {
  var dx = x2 - x1;
  var dy = y2 - y1;
  return Math.atan(dy/dx);
}

sr.line_path = function(x1, y1, x2, y2) {
  return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
}

sr.text_path_along_line = function(text, x1, y1, x2, y2) {
  var line_width = sr.distance(x1, y1, x2, y2);
  var text_width = text.getBBox().w;
  var angle = sr.angle(x1, y1, x2, y2);

  var w = (line_width - text_width) / 2;
  var dx = w * Math.cos(angle);
  var dy = w * Math.sin(angle);

  return sr.line_path(x1 + dx, y1 + dy, x2, y2);
}

sr.element_with_class = function(element_name, class_name, text) {
  var span = document.createElement(element_name);
  span.className = class_name;
  span.innerHTML = text;
  return span;
}

sr.code_with_class = function(class_name, text) {
  return sr.element_with_class("code", class_name, text);
}

sr.span_with_class = function(class_name, text) {
  return sr.element_with_class("span", class_name, text);
}

sr.add_header = function(t, xs) {
  var row = t.insertRow();
  for (var i = 0; i < xs.length; ++i) {
    var th = document.createElement("th");
    th.appendChild(xs[i]);
    row.appendChild(th);
  }
}

sr.add_row = function(t, id, xs, mouse_enter, mouse_leave) {
  var row = t.insertRow();
  row.id = id;
  row.addEventListener("mouseenter", mouse_enter(row));
  row.addEventListener("mouseleave", mouse_leave(row));

  for (var i = 0; i < xs.length; ++i) {
    var td = document.createElement("td");
    td.appendChild(xs[i]);
    if (i != 0) {
      td.className = "sr_td";
    }
    row.appendChild(td);
  }
}

////////////////////////////////////////////////////////////////////////////////
// External Types
////////////////////////////////////////////////////////////////////////////////
// type Name = string
//
// type Edge = {
//   src_name:  Name,
//   src_state: int,
//   dst_name:  Name,
//   dst_state: int,
//   msg:       string,
//   id:        string,
// }
sr.Edge = function(src_name, src_state, dst_name, dst_state, msg, id) {
  this.src_name = src_name;
  this.src_state = src_state;
  this.dst_name = dst_name;
  this.dst_state = dst_state;
  this.msg = msg;
  this.id = id;
}

// type StateInfo = {
//   index:   int,
//   state:   string,
//   query:   string,
//   history: string,
// }
sr.StateInfo = function(index, state, query, history) {
  this.index = index;
  this.state = state;
  this.query = query;
  this.history = history;
}

////////////////////////////////////////////////////////////////////////////////
// Internal Types
////////////////////////////////////////////////////////////////////////////////
// type State = {
//   name:    Name
//   n:       int,
//   index:   int,
//   text:    Snap.text
//   circle:  Snap.circle
// }
sr.State = function(name, n, index, text, circle) {
  this.name = name;
  this.n = n;
  this.index = index;
  this.text = text;
  this.circle = circle;
}

// type NodeTimeline = {
//   name: Name,
//   label: Snap.text,
//   axis: Snap.line,
//   states: [State],
// }
sr.NodeTimeline = function(name, label, axis, states) {
  this.name = name;
  this.label = label;
  this.axis = axis;
  this.states = states;
}

// type DrawnEdge = {
//   edge: sr.Edge,
//   line: Snap.line,
//   text: Snap.text,
//   id:   Snap.text,
// }
sr.DrawnEdge = function(edge, line, text, id) {
  this.edge = edge;
  this.line = line;
  this.text = text;
  this.id = id;
}

////////////////////////////////////////////////////////////////////////////////
// Render
////////////////////////////////////////////////////////////////////////////////
// Returns `max(max(states[name]) for name in names)`
// - names:  [Name]
// - states: {Name -> [int]}
sr.max_state_index = function(names, states) {
  var max_state_indexes = [];
  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    max_state_indexes.push(sr.max(states[name]));
  }
  return sr.max(max_state_indexes);
}

// - s: Snap.paper
// - t: table Element
// - c: Config
// - i: int
// - name: Name
// - state_indexes: [int]
sr.render_node_timeline = function(s, t, c, i, name, state_indexes) {
  var label_x = c.left_to_label;
  var label_y = c.top_margin + (i * c.timeline_height);
  var label = s.text(label_x, label_y, name);
  label.addClass("node_label");

  var axis_x1 = label_x + label.getBBox().w + c.label_to_axis;
  var axis_x2 = c.svg_width - c.axis_to_right;
  var axis_y = label.getBBox().cy;
  var axis = s.line(axis_x1, axis_y, axis_x2, axis_y);
  axis.addClass("node_axis");

  var axis_border_width = c.axis_to_first_node + c.last_node_to_axis;
  var axis_width = axis_x2 - axis_x1;
  var no_border_axis_width = axis_width - axis_border_width;

  var states = [];
  for (var j = 0; j < state_indexes.length; ++j) {
    var state_index = state_indexes[j];
    var state_dx = (state_index / c.max_state_index) * no_border_axis_width;
    var state_x = axis_x1 + c.axis_to_first_node + state_dx;
    var state_y = axis_y;
    var state_name = name + j;

    var state_circle = s.circle(state_x, state_y, 0);
    state_circle.addClass("node_state_circle");
    var state_text = s.text(state_x, state_y, state_name);
    state_text.addClass("node_state_text");

    var hover_in = function(row_id, circle) {
      return function() {
        t.querySelector(row_id).classList.add("srtable_hover_table");
        circle.removeClass("node_state_circle");
        circle.addClass("node_state_circle_hovered");
      }
    }("#" + state_name, state_circle);
    var hover_out = function(row_id, circle) {
      return function() {
        t.querySelector(row_id).classList.remove("srtable_hover_table");
        circle.removeClass("node_state_circle_hovered");
        circle.addClass("node_state_circle");
      };
    }("#" + state_name, state_circle);

    state_circle.hover(hover_in, hover_out);
    state_text.hover(hover_in, hover_out);
    states.push(new sr.State(name, j, state_index, state_text, state_circle));
  }

  return new sr.NodeTimeline(name, label, axis, states);
}

sr.render_table = function(t, names, node_timelines, state_infos) {
  sr.add_header(t, [
    document.createTextNode(""),
    sr.span_with_class("state_header", "state"),
    sr.code_with_class("query_header", "query()"),
    sr.span_with_class("history_header", "history"),
  ]);

  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    var timeline = node_timelines[name];
    var infos = state_infos[name]

    for (var j = 0; j < timeline.states.length; ++j) {
      var state = timeline.states[j];
      var info = infos[state.n];
      var mouse_enter = function(circle) {
        return function(row) {
          return function() {
            row.classList.add("srtable_hover_table");
            circle.removeClass("node_state_circle");
            circle.addClass("node_state_circle_hovered");
          };
        };
      }(state.circle);
      var mouse_leave = function(circle) {
        return function(row) {
          return function() {
            row.classList.remove("srtable_hover_table");
            circle.addClass("node_state_circle");
            circle.removeClass("node_state_circle_hovered");
          };
        };
      }(state.circle);
      sr.add_row(t, name + state.n, [
        sr.code_with_class("name_td", name + state.n),
        info.state,
        info.query,
        info.history
      ], mouse_enter, mouse_leave);
    }
  }
}

// - s: Snap.paper
// - c: Config
// - node_timelines: {Name -> NodeTimeline}
// - edge: Edge
sr.render_edge = function(s, c, node_timelines, edge) {
  var src_circle = node_timelines[edge.src_name].states[edge.src_state].circle;
  var dst_circle = node_timelines[edge.dst_name].states[edge.dst_state].circle;

  var line_x1 = src_circle.getBBox().cx;
  var line_y1 = src_circle.getBBox().cy;
  var line_x2 = dst_circle.getBBox().cx;
  var line_y2 = dst_circle.getBBox().cy;
  var line = s.line(line_x1, line_y1, line_x2, line_y2);
  line.addClass("edge_line");
  if (line_y1 <= line_y2) {
    line.insertBefore(src_circle);
  } else {
    line.insertBefore(dst_circle);
  }

  var text = s.text(0, 0, edge.msg);
  text.addClass("edge_text");
  var path = sr.text_path_along_line(text, line_x1, line_y1, line_x2, line_y2);
  text.attr({textpath: path, dy:-c.edge_margin_top});

  var id = s.text(0, 0, edge.id);
  id.addClass("edge_id");
  var path = sr.text_path_along_line(id, line_x1, line_y1, line_x2, line_y2);
  id.attr({textpath: path, dy:id.getBBox().h + c.edge_margin_bottom});

  return new sr.DrawnEdge(edge, line, text);
}

// - s:      Snap.paper
// - names:  [Name]
// - state_infos: {Name -> [StateInfo]}
// - edges:  [Edge]
sr.render = function(s, t, names, state_infos, edges) {
  var state_indexes = {};
  for (var i = 0; i < names.length; ++i) {
    var infos = state_infos[names[i]];
    var indexes = [];
    for (var j = 0; j < infos.length; ++j) {
      indexes.push(infos[j].index);
    }
    state_indexes[names[i]] = indexes;
  }

  var c = {
    svg_width: s.attr("viewBox").width,
    top_margin: 25,
    timeline_height: 100,
    left_to_label: 10,
    label_to_axis: 10,
    axis_to_first_node: 20,
    last_node_to_axis: 20,
    axis_to_right: 20,
    edge_margin_top: 4,
    edge_margin_bottom: 0,
    max_state_index: sr.max_state_index(names, state_indexes)
  };

  var node_timelines = {}
  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    var tl = sr.render_node_timeline(s, t, c, i, name, state_indexes[name]);
    node_timelines[name] = tl;
  }

  sr.render_table(t, names, node_timelines, state_infos);

  var drawn_edges = [];
  for (var i = 0; i < edges.length; ++i) {
    drawn_edges.push(sr.render_edge(s, c, node_timelines, edges[i]));
  }
}
