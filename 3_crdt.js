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
  return create_with_kids("div", [
    code("sum: " + sum),
    document.createElement("br"),
    code("cnt: " + count),
  ]);

  return avg_span;
}

function simple_update() {
  var s = Snap("#simple_update_svg");
  var t = document.getElementById("simple_update_table")

  var a = "a";
  var names = [a];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0),   code("{}")),
      new sr.StateInfo(1, avg(1, 1), code(1),   code("{0}")),
      new sr.StateInfo(2, avg(3, 2), code(1.5), code("{0, 1}")),
      new sr.StateInfo(3, avg(6, 3), code(2),   code("{0, 1, 2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(1)", "0"),
    new sr.Edge(a, 1, a, 2, "u(2)", "1"),
    new sr.Edge(a, 2, a, 3, "u(3)", "2"),
  ];
  sr.render(s, t, names, states, edges);
}

function simple_merge() {
  var s = Snap("#simple_merge_svg");
  var t = document.getElementById("simple_merge_table")
  var a = "a";
  var b = "b";

  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(4, 1), code(4), code("{0}")),
      new sr.StateInfo(2, avg(6, 2), code(3), code("{0,2}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{1}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(4)", "0"),
    new sr.Edge(b, 0, b, 1, "u(4)", "1"),
    new sr.Edge(a, 1, a, 2, "m(b1)", "2"),
    new sr.Edge(b, 1, a, 2, "m(b1)", "2"),
  ];
  sr.render(s, t, names, states, edges);
}

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

function chaotic() {
  var s = Snap("#chaotic_svg");
  var t = document.getElementById("chaotic_table")

  var a = "a";
  var b = "b";
  var names = [a, b];
  var states = {
    a: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(2, 1), code(2), code("{u0}")),
      new sr.StateInfo(2, avg(2, 1), code(2), code("{u0}")),
      new sr.StateInfo(3, avg(8, 3), code(2), code("{u0}")),
    ],
    b: [
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(0, 0), code(0), code("{u0}")),
      new sr.StateInfo(2, avg(4, 1), code(4), code("{u0, u1}")),
      new sr.StateInfo(3, avg(6, 2), code(3), code("{u0, u1, u2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u(2)"),
    new sr.Edge(a, 1, a, 2, "merge"),
    new sr.Edge(b, 1, a, 2, "merge"),

    new sr.Edge(b, 1, b, 2, "u(4)"),
    new sr.Edge(b, 1, b, 2, "u(4)"),
    new sr.Edge(a, 2, a, 3, "u2(3)"),
  ];
  sr.render(s, t, names, states, edges);
}

function main() {
  simple_update();
  simple_merge();
  chaotic_replication();
  // chaotic();
}

window.onload = main;
