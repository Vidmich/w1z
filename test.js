test('simple test', function() {
    var o = {};
    w1z(o);

    var f = {};

    o.on('a', function() {
        f['a'] = true;
    });

    o.on('b', function() {
        f['b'] = true;
    });

    o.on('a b', function() {
        f['a b'] = true;
    });

    o.fire('a');

    ok(f['a'], '"a" should be fired');
    ok(!f['b'], '"b" should not be fired');
    ok(f['a b'], '"a b" should be fired');
});

test('namespace test', function() {
    var o = {};
    w1z(o);

    var f = {};

    o.on('a', function() {
        f['a'] = true;
    });

    o.on('b', function() {
        f['b'] = true;
    });

    o.on('a.test', function() {
        f['a.test'] = true;
    });

    o.on('a.foo', function() {
        f['a.foo'] = true;
    });

    o.on('a.foo.bar', function() {
        f['a.foo.bar'] = true;
    });

    o.fire('a');

    ok(f['a'], '"a" should be fired');
    ok(!f['b'], '"b" should not be fired');
    ok(f['a.test'], '"a.test" should be fired');
    ok(f['a.foo'], '"a.foo" should be fired');
    ok(f['a.foo.bar'], '"a.foo.bar" should be fired');


    f = {};
    o.fire('a.foo');

    ok(!f['a'], '"a" should not be fired');
    ok(!f['a.test'], '"a.test" should not be fired');
    ok(f['a.foo'], '"a.foo" should be fired');
    ok(f['a.foo.bar'], '"a.foo.bar" should be fired');


    f = {};
    o.fire('a.foo.bar');

    ok(!f['a'], '"a" should not be fired');
    ok(!f['a.foo'], '"a.foo" should not be fired');
    ok(f['a.foo.bar'], '"a.foo.bar" should be fired');


    f = {};
    o.fire('a.bar.foo');

    ok(f['a.foo.bar'], '"a.foo.bar" should be fired');


    f = {};
    o.fire('a.foo.bar.test');

    ok(!f['a.test'], '"a.test" should not be fired');
    ok(!f['a.foo.bar'], '"a.foo.bar" should not be fired');
});

test('order test', function() {
    var o = {};
    w1z(o);

    var f = {},
        c = 0;

    o.on('a', function() {
        f['a'] = ++c;
    }, void 0, 2);

    o.on('b', function() {
        f['b'] = ++c;
    }, void 0, -2);

    // default order is 0
    o.on('c', function() {
        f['c'] = ++c;
    });

    o.on('d', function() {
        f['d'] = ++c;
    });

    o.on('e', function() {
        f['e'] = ++c;
    }, void 0, -1);

    o.fire('*');

    equal(1, f['b'], '"b" should go first');
    equal(2, f['e'], '"e" should go second');
    equal(3, f['c'], '"c" should go third');
    equal(4, f['d'], '"d" should go forth');
    equal(5, f['a'], '"a" should go fifth');
});

test('scope test', function() {
    var o = {};
    w1z(o);

    var f = {},
        t = {};

    o.on('a', function() {
        f['a'] = this;
    });

    o.on('b', function() {
        f['b'] = this;
    }, t);

    o.fire('*');

    equal(o, f['a'], '"a" should work on event object');
    equal(t, f['b'], '"b" should work on our scope');
});

test('multiple types test', function() {
    var o = {};
    w1z(o);

    var f = {};

    o.on('a', function() {
        f['a'] = true;
    });

    o.on('b', function() {
        f['b'] = true;
    });

    o.on('c', function() {
        f['c'] = true;
    });

    o.on('b c', function() {
        f['b c'] = true;
    });

    o.fire('a b');

    ok(f['a'], '"a" should be fired');
    ok(f['b'], '"b" should be fired');
    ok(!f['c'], '"c" should not be fired');
    ok(f['b c'], '"b c" should be fired');
});

test('number of calls test', function() {
    var o = {};
    w1z(o);

    var a = 0,
        b = 0,
        c = 0;

    o.on('a', function() {
        ++a;
    });

    o.on('a.test', function() {
        ++b;
    });

    o.on('a b.test', function() {
        ++c;
    });

    // a and all with .test namespace
    o.fire('a .test');

    equal(1, a, '"a" should be 1');
    equal(1, b, '"a" should be 1');
    equal(1, c, '"a" should be 1');
});
