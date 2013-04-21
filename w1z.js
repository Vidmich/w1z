!function() {
    var namespace = 'w1z',
        propname = '_w1z_listeners';

    var slice = Array.prototype.slice;

    var reCheck = /[\\\/\|\[\]\?\+\^\$\(\)]/,
        reClass1 = /\.([^\s.])/g,
        reClass2 = /\|([^\s]+)/g,
        reAny = /(^|\s)(?:\*|)(?=\.|\(|\s|$)/g,
        reName = /(^|\s)([^\s\(\[]+)/g,
        reSpaces = /\s+/g;

    function addListener(type, f, listener, order) {
        if ("function" != typeof listener)
            throw new TypeError('Incorrect listener');

        type = String(type).trim();
        if (reCheck.test(type))
            throw new Error('Incorrect type');

        order = Number(order) || 0;

        var list = this.hasOwnProperty(propname)
            ? this[propname]
            : this[propname] = [];

        f._type = type;
        f._original = listener;
        f._order = order;
        f._done = false;

        type = type.replace(reClass1, '|$1');
        type = type.replace(reClass2, '(?:\\.(?:$1))*');
        type = type.replace(reAny, '$1[^\\s.]*');
        type = type.replace(reName, '$1(?:$2|\\*|)');

        f._re = new RegExp('(?:^|\\s+)(?:' + type.replace(reSpaces, '|') + ')(?:\\s|$)');

        var n = list.length;

        if (!n || list[n-1]._order <= order) {
            list.push(f);
        } else if (order < list[0]._order) {
            list.splice(0, 0, f);
        } else {
            var a = 0,
                b = n;

            while (a < b) {
                var c = a + b >> 1;
                if (order < list[c]._order)
                    b = c;
                else
                    a = c+1;
            }

            list.splice(a, 0, f);
        }

        return this;
    }

    var stuff = {
        fire: function(type) {
            if (!this.hasOwnProperty(propname))
                return this;

            type = String(type).trim();
            if (reCheck.test(type))
                throw new Error('Incorrect type');

            var listeners = this[propname].filter(function(f) {
                return f._re.test(type);
            });

            for (var i=0, n=listeners.length; i<n; ++i)
                listeners[i].apply(this, arguments);

            return this;
        },

        on: function(type, listener, scope, order) {
            return addListener.call(this, type, function() {
                listener.apply(scope || this, arguments);
            }, listener, order);
        },

        once: function(type, listener, scope, order) {
            function f() {
                if (f._done)
                    return;

                f._done = true;
                listener.apply(scope || this, argumens);
            }

            return addListener.call(this, type, f, listener, order);
        },

        off: function(type, listener) {
            if (!this.hasOwnProperty(propname))
                return this;

            if (void 0 === type && void 0 === listener) {
                this[propname] = [];
                return this;
            }

            var list = this[propname];

            for (var i=list.length; 0<i; ) {
                --i;

                if ((void 0 !== listener && list[i]._original !== listener) || (void 0 !== type && !list[i]._re.test(type)))
                    continue;

                splice(list, i, 1);
            }

            return this;
        }
    };

    var space = function(o) {
        for (var key in stuff)
            if (stuff.hasOwnProperty(key))
                o[key] = stuff[key];

        o[propname] = [];
        return o;
    };

    space(space);
    space.stuff = stuff;
    this[namespace] = space;
}();
