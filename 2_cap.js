function linear() {
  var s = Snap("#test");
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
  lin.animate(s, names, named_actions, 0);
}

function main() {
  linear();
}

window.onload = main;
