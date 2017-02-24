function main() {
  var s = Snap("#test");
  var a = "a";
  var b = "b";
  var c = "c";
  var names = [a, b, c];
  var states = {
    a: [0, 1, 6],
    b: [0, 2, 3, 5],
    c: [4],
  };
  var edges = [
    new sr.Edge(a, 1, b, 1, "foo"),
    new sr.Edge(b, 2, c, 0, "foo"),
    new sr.Edge(b, 3, a, 2, "foo"),
  ];
  sr.render(s, names, states, edges);
}

window.onload = main;
