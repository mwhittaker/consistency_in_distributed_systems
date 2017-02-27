////////////////////////////////////////////////////////////////////////////////
// Helper Functions
////////////////////////////////////////////////////////////////////////////////
function append_children(e, children) {
  for (var i = 0; i < children.length; ++i) {
    e.appendChild(children[i]);
  }
}

function create_with_kids(element_name, kids) {
  var e = document.createElement(element_name);
  append_children(e, kids);
  return e;
}

function text(s) {
  return document.createTextNode(s);
};

function code(s) {
  var code_span = document.createElement("code");
  code_span.innerHTML = s;
  return code_span;
}

function avg(sum, count) {
  return code("sum="+sum+", cnt="+count)
}

////////////////////////////////////////////////////////////////////////////////
// Diagrams
////////////////////////////////////////////////////////////////////////////////
function chaotic_replication() {
  var s = Snap("#chaotic_replication");

  var c = ds.node(s, 100, 70, "c", ds.Color.Red);
  var d = ds.node(s, 300, 70, "d", ds.Color.Green);
  var a = ds.node(s, 200, 20, "a", ds.Color.Blue);
  var b = ds.node(s, 200, 120, "b", ds.Color.Purple);
  var bbox = s.group(c.element, d.element, a.element, b.element).getBBox();

  var a_actions = new ds.NodeAction("c", [
    new ds.Message([1, 0, 1], "update(2)", "ok", "a"),
    new ds.Delay(1),
    new ds.Message([3, 0, 3], "query()", "2", "b"),
  ], true);
  var b_actions = new ds.NodeAction("d", [
    new ds.Delay(1),
    new ds.Message([1, 0, 1], "update(4)", "ok", "b"),
    new ds.Delay(2),
    new ds.Message([1, 0, 1], "query()", "2", "a"),
  ], true);
  var s1_actions = new ds.NodeAction("a", [
    new ds.Message([1, 0, 1], "merge", "ok", "b"),
    new ds.Delay(2),
    new ds.Message([1.5, 0, 1.5], "merge", "ok", "b"),
  ], true);
  var s2_actions = new ds.NodeAction("b", [
    new ds.Delay(1),
    new ds.Message([1, 0, 1], "merge", "ok", "a"),
    new ds.Delay(3),
    new ds.Message([1, 0, 1], "merge", "ok", "a"),
  ], true);
  var actions = [a_actions, b_actions, s1_actions, s2_actions];

  ds.animate(s, bbox, [c, d, a, b], actions, 2000);
}

function trivial_update() {
  var s = Snap("#trivial_update_svg");
  var t = document.getElementById("trivial_update_table")
  var a = "a";

  var c = {};
  var names = [a];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0),   code("{}")),
      new sr.StateInfo(1, avg(1, 1), code(1),   code("{0}")),
      new sr.StateInfo(2, avg(4, 2), code(2),   code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "update(1)", "0"),
    new sr.Edge(a, 1, a, 2, "update(3)", "1"),
  ];
  sr.render(s, t, c, names, states, edges);
}

function simple_update() {
  var s = Snap("#simple_update_svg");
  var t = document.getElementById("simple_update_table")
  var a = "a";
  var b = "b";

  var c = {timeline_height:50};
  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(1, 1), code(1), code("{0}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{1}")),
      new sr.StateInfo(2, avg(6, 2), code(3), code("{1,2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "update(1)", "0"),
    new sr.Edge(b, 0, b, 1, "update(2)", "1"),
    new sr.Edge(b, 1, b, 2, "update(4)", "2"),
  ];
  sr.render(s, t, c, names, states, edges);
}

function simple_merge() {
  var s = Snap("#simple_merge_svg");
  var t = document.getElementById("simple_merge_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{0}")),
      new sr.StateInfo(2, avg(6, 2), code(3), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "update(2)", "0"),
    new sr.Edge(b, 0, b, 1, "update(4)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "merge(b1)", ""),
  ];
  sr.render(s, t, c, names, states, edges);
}

function converge() {
  var s = Snap("#converge_svg");
  var t = document.getElementById("converge_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, text(""), text(""), text("")),
      new sr.StateInfo(1, text(""), text(""), text("")),
      new sr.StateInfo(1 + dx, text(""), text(""), text("")),
      new sr.StateInfo(1 + 3*dx, text(""), text(""), text("")),
      new sr.StateInfo(1 + 5*dx, text(""), text(""), text("")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
      new sr.StateInfo(1 + 2*dx, avg(10, 3), code(3.3), code("{0,1}")),
      new sr.StateInfo(1 + 4*dx, avg(26, 8), code(3.25), code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u", "0"),
    new sr.Edge(b, 0, b, 1, "u", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 2, b, 2, "m(a2)", ""),
    new sr.Edge(a, 2, a, 3, "", ""),
    new sr.Edge(b, 2, a, 3, "m(b2)", ""),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 3, b, 3, "m(b2)", ""),
    new sr.Edge(a, 3, a, 4, "", ""),
    new sr.Edge(b, 3, a, 4, "m(b3)", ""),
  ];
  sr.render(s, t, c, names, states, edges);
}

function diverge() {
  var s = Snap("#diverge_svg");
  var t = document.getElementById("diverge_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{0}")),
      new sr.StateInfo(1 + dx, avg(6, 2), code(3), code("{0,1}")),
      new sr.StateInfo(1 + 3*dx, avg(16, 5), code(3.2), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
      new sr.StateInfo(1 + 2*dx, avg(10, 3), code(3.3), code("{0,1}")),
      new sr.StateInfo(1 + 4*dx, avg(26, 8), code(3.25), code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(2)", "0"),
    new sr.Edge(b, 0, b, 1, "u(4)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 2, b, 2, "m(a2)", ""),
    new sr.Edge(a, 2, a, 3, "", ""),
    new sr.Edge(b, 2, a, 3, "m(b2)", ""),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 3, b, 3, "m(a3)", ""),
  ];
  node_timelines = sr.render(s, t, c, names, states, edges)[0];

  node_timelines[a].states[2].circle.addClass("node_state_converged");
  node_timelines[a].states[3].circle.addClass("node_state_converged");
  node_timelines[b].states[2].circle.addClass("node_state_converged");
  node_timelines[b].states[3].circle.addClass("node_state_converged");
}

function no_merge_average() {
  var s = Snap("#no_merge_average_svg");
  var t = document.getElementById("no_merge_average_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{0}")),
      new sr.StateInfo(1 + dx, avg(2, 1), code(2), code("{0,1}")),
      new sr.StateInfo(1 + 3*dx, avg(2, 1), code(2), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
      new sr.StateInfo(1 + 2*dx, avg(4, 1), code(4), code("{0,1}")),
      new sr.StateInfo(1 + 4*dx, avg(4, 1), code(4), code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(2)", "0"),
    new sr.Edge(b, 0, b, 1, "u(4)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 2, b, 2, "m(a2)", ""),
    new sr.Edge(a, 2, a, 3, "", ""),
    new sr.Edge(b, 2, a, 3, "m(b2)", ""),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 3, b, 3, "m(a3)", ""),
  ];
  node_timelines = sr.render(s, t, c, names, states, edges)[0];

  node_timelines[a].states[2].circle.addClass("node_state_converged");
  node_timelines[a].states[3].circle.addClass("node_state_converged");
  node_timelines[b].states[2].circle.addClass("node_state_converged");
  node_timelines[b].states[3].circle.addClass("node_state_converged");
}

function no_merge_average() {
  var s = Snap("#no_merge_average_svg");
  var t = document.getElementById("no_merge_average_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{0}")),
      new sr.StateInfo(1 + dx, avg(2, 1), code(2), code("{0,1}")),
      new sr.StateInfo(1 + 3*dx, avg(2, 1), code(2), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
      new sr.StateInfo(1 + 2*dx, avg(4, 1), code(4), code("{0,1}")),
      new sr.StateInfo(1 + 4*dx, avg(4, 1), code(4), code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(2)", "0"),
    new sr.Edge(b, 0, b, 1, "u(4)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 2, b, 2, "m(a2)", ""),
    new sr.Edge(a, 2, a, 3, "", ""),
    new sr.Edge(b, 2, a, 3, "m(b2)", ""),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 3, b, 3, "m(a3)", ""),
  ];
  node_timelines = sr.render(s, t, c, names, states, edges)[0];

  node_timelines[a].states[2].circle.addClass("node_state_converged");
  node_timelines[a].states[3].circle.addClass("node_state_converged");
  node_timelines[b].states[2].circle.addClass("node_state_converged");
  node_timelines[b].states[3].circle.addClass("node_state_converged");
}

function b_merge_average() {
  var s = Snap("#b_merge_average_svg");
  var t = document.getElementById("b_merge_average_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1 + dx, avg(0, 0), code(0), code("{0}")),
      new sr.StateInfo(1 + 3*dx, avg(0, 0), code(0), code("{0}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{0}")),
      new sr.StateInfo(1 + 2*dx, avg(0, 0), code(0), code("{0}")),
    ],
  };
  var edges = [
    new sr.Edge(b, 0, b, 1, "u(4)", "0"),
    new sr.Edge(a, 0, a, 1, "", ""),
    new sr.Edge(b, 1, a, 1, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 1, b, 2, "m(a1)", ""),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 2, a, 2, "m(b2)", ""),
  ];
  node_timelines = sr.render(s, t, c, names, states, edges)[0];

  node_timelines[a].states[1].circle.addClass("node_state_converged");
  node_timelines[a].states[2].circle.addClass("node_state_converged");
  node_timelines[b].states[1].circle.addClass("node_state_converged");
  node_timelines[b].states[2].circle.addClass("node_state_converged");
}

function max_average() {
  var s = Snap("#max_average_svg");
  var t = document.getElementById("max_average_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var dx = 0.8;
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{0}")),
      new sr.StateInfo(1 + dx, avg(4, 1), code(4), code("{0,1}")),
      new sr.StateInfo(1 + 3*dx, avg(4, 1), code(4), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{1}")),
      new sr.StateInfo(1 + 2*dx, avg(4, 1), code(4), code("{0,1}")),
      new sr.StateInfo(1 + 4*dx, avg(4, 1), code(4), code("{0,1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(2)", "0"),
    new sr.Edge(b, 0, b, 1, "u(4)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "", ""),
    new sr.Edge(a, 2, b, 2, "m(a2)", ""),
    new sr.Edge(a, 2, a, 3, "", ""),
    new sr.Edge(b, 2, a, 3, "m(b2)", ""),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 3, b, 3, "m(a3)", ""),
  ];
  node_timelines = sr.render(s, t, c, names, states, edges)[0];

  node_timelines[a].states[2].circle.addClass("node_state_converged");
  node_timelines[a].states[3].circle.addClass("node_state_converged");
  node_timelines[b].states[2].circle.addClass("node_state_converged");
  node_timelines[b].states[3].circle.addClass("node_state_converged");
}

function gcounter_state(i, n, xs) {
  return create_with_kids("span", [
      code("i:" + i + ", "),
      code("n:" + n + ", "),
      code("xs:" + xs),
  ]);
}

function gcounter() {
  var s = Snap("#gcounter_svg");
  var t = document.getElementById("gcounter_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, gcounter_state(0, 2, "[0,0]"), code(0), code("{}")),
      new sr.StateInfo(1, gcounter_state(0, 2, "[1,0]"), code(1), code("{0}")),
      new sr.StateInfo(2, gcounter_state(0, 2, "[1,2]"), code(3), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, gcounter_state(1, 2, "[0,0]"), code(0), code("{}")),
      new sr.StateInfo(1, gcounter_state(1, 2, "[0,2]"), code(2), code("{1}")),
      new sr.StateInfo(2, gcounter_state(1, 2, "[0,6]"), code(6), code("{1,2}")),
      new sr.StateInfo(3, gcounter_state(1, 2, "[1,6]"), code(7), code("{0,1,2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(1)", "0"),
    new sr.Edge(b, 0, b, 1, "u(2)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "u(4)", "2"),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 2, b, 3, "m(a2)", ""),
  ];
  sr.render(s, t, c, names, states, edges);
}

function pncounter_state(pxs, nxs) {
  return create_with_kids("span", [
      code("p.xs:" + pxs + ", "),
      code("n.xs:" + nxs),
  ]);
}

function pncounter() {
  var s = Snap("#pncounter_svg");
  var t = document.getElementById("pncounter_table")
  var a = "a";
  var b = "b";

  var c = {};
  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, pncounter_state(0,2,"[0,0]","[0,0]"), code(0), code("{}")),
      new sr.StateInfo(1, pncounter_state(0,2,"[1,0]","[0,0]"), code(1), code("{0}")),
      new sr.StateInfo(2, pncounter_state(0,2,"[1,0]","[0,2]"), code(-1), code("{0,1}")),
    ],
    b: [
      new sr.StateInfo(0, pncounter_state(1,2,"[0,0]","[0,0]"), code(0), code("{}")),
      new sr.StateInfo(1, pncounter_state(1,2,"[0,0]","[0,2]"), code(-2), code("{1}")),
      new sr.StateInfo(2, pncounter_state(1,2,"[0,4]","[0,2]"), code(2), code("{1,2}")),
      new sr.StateInfo(3, pncounter_state(1,2,"[1,4]","[0,2]"), code(3), code("{0,1,2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "add(1)", "0"),
    new sr.Edge(b, 0, b, 1, "sub(2)", "1"),
    new sr.Edge(a, 1, a, 2, "", ""),
    new sr.Edge(b, 1, a, 2, "m(b1)", ""),
    new sr.Edge(b, 1, b, 2, "add(4)", "2"),
    new sr.Edge(b, 2, b, 3, "", ""),
    new sr.Edge(a, 2, b, 3, "m(a2)", ""),
  ];
  sr.render(s, t, c, names, states, edges);
}

function main() {
  chaotic_replication();
  trivial_update();
  simple_update();
  simple_merge();
  converge();
  diverge();
  no_merge_average();
  b_merge_average();
  max_average();
  gcounter();
  pncounter();
}

window.onload = main;
