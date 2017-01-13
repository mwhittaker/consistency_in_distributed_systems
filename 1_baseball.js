function one_client_one_kvs() {
  var s = Snap("#one_client_one_kvs");

  var a = ds.node(s, 125, 20, "a", ds.Color.Red);
  var s1 = ds.node(s, 275, 20, "s", ds.Color.Blue);
  var bbox = s.group(a.element, s1.element).getBBox();

  var a_actions = ["a", [
    new ds.Message(2, "set(x,42)", "ok", "s"),
    new ds.Delay(1),
    new ds.Message(2, "get(x)", "42", "s"),
  ]];

  ds.animate(s, bbox, [a, s1], [a_actions], 2000);
}

function two_clients_one_kvs() {
  var s = Snap("#two_clients_one_kvs");

  var a = ds.node(s, 100, 20, "a", ds.Color.Red);
  var b = ds.node(s, 300, 20, "b", ds.Color.Green);
  var s1 = ds.node(s, 200, 20, "s", ds.Color.Blue);
  var bbox = s.group(a.element, b.element, s1.element).getBBox();

  var a_actions = ["a", [
    new ds.Message(2, "set(x,42)", "ok", "s"),
    new ds.Delay(1),
    new ds.Message(2, "get(y)", "19", "s"),
  ]];
  var b_actions = ["b", [
    new ds.Delay(0.5),
    new ds.Message(2, "set(y,19)", "ok", "s"),
    new ds.Delay(1),
    new ds.Message(2, "get(x)", "42", "s"),
  ]];

  ds.animate(s, bbox, [a, b, s1], [a_actions, b_actions], 2000);
}

function anomaly1() {
  var s = Snap("#anomaly1");

  var a = ds.node(s, 125, 60, "a", ds.Color.Red);
  var s1 = ds.node(s, 275, 20, "s1", ds.Color.Blue);
  var s2 = ds.node(s, 275, 100, "s2", ds.Color.Blue);
  var bbox = s.group(a.element, s1.element, s2.element).getBBox();

  var a_actions = ["a", [
    new ds.Message(2, "set(x,42)", "ok", "s1"),
    new ds.Delay(1),
    new ds.Message(2, "get(x)", "19", "s2"),
  ]];
  ds.animate(s, bbox, [a, s1, s2], [a_actions], 2000);
}

function main() {
  one_client_one_kvs();
  two_clients_one_kvs();
  anomaly1();
}

window.onload = main;
