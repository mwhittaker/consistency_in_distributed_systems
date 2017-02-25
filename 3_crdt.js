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
      new sr.StateInfo(0, avg(0, 0), code(0), code("{}")),
      new sr.StateInfo(1, avg(1, 1), code(1), code("{u0}")),
      new sr.StateInfo(2, avg(3, 2), code(1.5), code("{u0, u1}")),
      new sr.StateInfo(3, avg(6, 3), code(2), code("{u0, u1, u2}")),
    ],
  };
  var edges = [
    new sr.Edge(a, 0, a, 1, "u0(1)"),
    new sr.Edge(a, 1, a, 2, "u1(2)"),
    new sr.Edge(a, 2, a, 3, "u2(3)"),
  ];
  sr.render(s, t, names, states, edges);
}

function main() {
  simple_update();
}

window.onload = main;
