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
// }
sr.Edge = function(src_name, src_state, dst_name, dst_state, msg) {
  this.src_name = src_name;
  this.src_state = src_state;
  this.dst_name = dst_name;
  this.dst_state = dst_state;
  this.msg = msg;
}

////////////////////////////////////////////////////////////////////////////////
// Internal Types
////////////////////////////////////////////////////////////////////////////////
// type State = {
//   name:   Name
//   n:      int,
//   index:  int,
//   text:   Snap.text
//   circle: Snap.circle
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
// }
sr.DrawnEdge = function(edge, line, text) {
  this.edge = edge;
  this.line = line;
  this.text = text;
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
// - c: Config
// - i: int
// - name: Name
// - state_indexes: [int]
sr.render_node_timeline = function(s, c, i, name, state_indexes) {
  var label_x = c.left_to_label;
  var label_y = (i + 1) * c.timeline_height;
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

    var state_circle = s.circle(state_x, state_y, 0);
    state_circle.addClass("node_state_circle");
    var state_text = s.text(state_x, state_y, name + j);
    state_text.addClass("node_state_text");
    states.push(new sr.State(name, j, state_index, state_text, state_circle));
  }

  return new sr.NodeTimeline(name, label, axis, states);
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
  text.attr({textpath: path});

  return new sr.DrawnEdge(edge, line, text);
}

// - s:      Snap.paper
// - names:  [Name]
// - states: {Name -> [int]}
// - edges:  [Edge]
sr.render = function(s, names, states, edges) {
  var c = {
    svg_width: s.attr("viewBox").width,
    timeline_height: 50,
    left_to_label: 10,
    label_to_axis: 10,
    axis_to_first_node: 20,
    last_node_to_axis: 20,
    axis_to_right: 20,
    max_state_index: sr.max_state_index(names, states)
  };

  var node_timelines = {}
  for (var i = 0; i < names.length; ++i) {
    var name = names[i];
    node_timelines[name] = sr.render_node_timeline(s, c, i, name, states[name]);
  }

  var drawn_edges = [];
  for (var i = 0; i < edges.length; ++i) {
    drawn_edges.push(sr.render_edge(s, c, node_timelines, edges[i]));
  }
}
