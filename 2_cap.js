function simple_reg() {
  var s = Snap("#simple_reg");
  var a = ds.node(s, 125, 20, "a", ds.Color.Red);
  var s1 = ds.node(s, 275, 20, "s", ds.Color.Blue);
  var bbox = s.group(a.element, s1.element).getBBox();

  var a_actions = new ds.NodeAction("a", [
    new ds.Message([1, 0, 1], "w(7)", "ok", "s"),
    new ds.Delay(1),
    new ds.Message([1, 0, 1], "r()", "7", "s"),
  ], true);

  ds.animate(s, bbox, [a, s1], [a_actions], 2000);
}

function async_network() {
  var s = Snap("#async_network");

  var a = ds.node(s, 100, 20, "a", ds.Color.Red);
  var b = ds.node(s, 300, 20, "b", ds.Color.Green);
  var s1 = ds.node(s, 200, 20, "s", ds.Color.Blue);
  var bbox = s.group(a.element, b.element, s1.element).getBBox();

  var a_actions = new ds.NodeAction("a", [
    new ds.Message([4, 0, 1], "w(9)", "ok", "s", "9"),
  ], true);

  var b_actions = new ds.NodeAction("b", [
    new ds.Delay(1),
    new ds.Message([1, 0, 1], "w(4)", "ok", "s", "4"),
  ], true);

  ds.animate(s, bbox, [a, b, s1], [a_actions, b_actions], 2000);
}

function first_guess() {
  var s = Snap("#first_guess");
  var a = "a";
  var b = "b";
  var names = [a, b];
  var named_actions = [
    {name: a, action: new lin.Write(3)},
    {name: a, action: new lin.Ok()},
    {name: b, action: new lin.Read()},
    {name: b, action: new lin.Ret(3)},
  ];
  lin.animate(s, names, named_actions, 0);
}

function first_wrong_guess() {
  var s = Snap("#first_wrong_guess");
  var a = "a";
  var b = "b";
  var names = [a, b];
  var named_actions = [
    {name: a, action: new lin.Write(2)},
    {name: b, action: new lin.Write(8)},
    {name: a, action: new lin.Ok()},
    {name: b, action: new lin.Ok()},
    {name: a, action: new lin.Read()},
    {name: a, action: new lin.Ret(2)},
  ];
  lin.animate(s, names, named_actions, 0);
}

function challenge_one() {
  var s = Snap("#challenge_one");
  var a = "a";
  var b = "b";
  var c = "c";
  var names = [a, b, c];
  var named_actions = [
    {name: a, action: new lin.Write(0)},
    {name: b, action: new lin.Write(1)},
    {name: c, action: new lin.Write(0)},
    {name: c, action: new lin.Ok()},
    {name: c, action: new lin.Read()},
    {name: c, action: new lin.Ret(1)},
    {name: c, action: new lin.Write(1)},
    {name: c, action: new lin.Ok()},
    {name: a, action: new lin.Ok()},
    {name: b, action: new lin.Ok()},
    {name: b, action: new lin.Write(1)},
    {name: a, action: new lin.Read()},
    {name: b, action: new lin.Ok()},
    {name: a, action: new lin.Ret(0)},
  ];
  lin.animate(s, names, named_actions, "?");
}

function challenge_two() {
  var s = Snap("#challenge_two");
  var a = "a";
  var b = "b";
  var c = "c";
  var d = "d";
  var names = [a, b, c, d];
  var named_actions = [
    {name: b, action: new lin.Write(1)},
    {name: d, action: new lin.Write(0)},
    {name: a, action: new lin.Write(0)},
    {name: d, action: new lin.Ok()},
    {name: d, action: new lin.Read()},
    {name: c, action: new lin.Write(1)},
    {name: d, action: new lin.Ret(1)},
    {name: d, action: new lin.Write(1)},
    {name: d, action: new lin.Ok()},
    {name: d, action: new lin.Read()},
    {name: d, action: new lin.Ret(0)},
    {name: c, action: new lin.Ok()},
    {name: d, action: new lin.Write(0)},
    {name: d, action: new lin.Ok(0)},
    {name: d, action: new lin.Read()},
    {name: b, action: new lin.Ok()},
    {name: d, action: new lin.Ret(1)},
    {name: a, action: new lin.Ok()},
  ];
  lin.animate(s, names, named_actions, "?");
}

function no_good_guess() {
  var s = Snap("#no_good_guess");
  var a = "a";
  var b = "b";
  var c = "c";
  var names = [a, b, c];
  var named_actions = [
    {name: a, action: new lin.Write(0)},
    {name: a, action: new lin.Ok()},
    {name: b, action: new lin.Write(1)},
    {name: a, action: new lin.Read()},
    {name: a, action: new lin.Ret(1)},
    {name: c, action: new lin.Write(0)},
    {name: c, action: new lin.Ok()},
    {name: b, action: new lin.Ok()},
    {name: b, action: new lin.Read()},
    {name: b, action: new lin.Ret(1)},
  ];
  lin.animate(s, names, named_actions, "?");
}

function main() {
  simple_reg();
  async_network();
  first_guess();
  first_wrong_guess();
  challenge_one();
  challenge_two();
  no_good_guess();
}

window.onload = main;
