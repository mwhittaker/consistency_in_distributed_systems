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

function cap() {
  var s = Snap("#cap");

  var s1_x = 275;
  var s1_y = 20;
  var s2_x = 275;
  var s2_y = 160;

  var partition_center = "M215 95";
  var partition = s.path("M215 95 " + "l10 -10 l10 10".repeat(6));
  partition.addClass("partition");

  var s1_mask = s.path("M" + s1_x + " " + s1_y + " h-10 v65 l10 10 l10 -10 v-65 z");
  s1_mask.attr({stroke:"black", fill:"white"});

  var s2_mask = s.path("M" + s2_x + " " + s2_y + " h-10 v-75 l10 10 l10 -10 v75 z");
  s2_mask.attr({stroke:"black", fill:"white"});

  var num_messages = 3;
  var s1_messages = [];
  var s2_messages = [];
  for (var i = 0; i < num_messages; ++i) {
    var s1_msg = s.circle(s1_x, s1_y, 0);
    s1_msg.addClass("msg");
    s1_msg.attr({fill: ds.Color.Blue});
    s1_messages.push(s1_msg);

    var s2_msg = s.circle(s2_x, s2_y, 0);
    s2_msg.addClass("msg");
    s2_msg.attr({fill: ds.Color.Blue});
    s2_messages.push(s2_msg);
  }
  s.group.apply(s, s1_messages).attr({mask:s1_mask});
  s.group.apply(s, s2_messages).attr({mask:s2_mask});

  var a = ds.node(s, 125, 90, "a", ds.Color.Red);
  var s1 = ds.node(s, s1_x, s1_y, "s1", ds.Color.Blue);
  var s2 = ds.node(s, s2_x, s2_y, "s2", ds.Color.Blue);
  var bbox = s.group(a.element, s1.element, s2.element).getBBox();

  var a_actions = new ds.NodeAction("a", [
    new ds.Message([1, 3, 1], "w(9)", "ok", "s1"),
    new ds.Delay(1),
    new ds.Message([1, 3, 1], "r()", "0", "s2"),
  ], true);

  ds.animate(s, bbox, [a, s1, s2], [a_actions], 2000, function(t) {
    var cys = [s1_y, s2_y];
    var dirs = [1, -1];
    var delays = [1, 7];
    var s12_messages = [s1_messages, s2_messages];

    for (var j = 0; j < delays.length; ++j) {
      var cy = cys[j];
      var dir = dirs[j];
      var delay = delays[j];
      var messages = s12_messages[j];

      for (var i = 0; i < messages.length; ++i) {
        if (delay + i <= t && t <= delay + i + 1) {
          var dy = (t - delay - i) * 206;
          messages[i].attr({cy:cy + (dy * dir)});
        } else {
          messages[i].attr({cy:cy});
        }
      };
    }
  });
}

function main() {
  simple_reg();
  async_network();
  first_guess();
  first_wrong_guess();
  challenge_one();
  challenge_two();
  no_good_guess();
  cap();
}

window.onload = main;
