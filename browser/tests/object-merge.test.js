/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
describe('object-merge', function () {
    var w = {
        a : [
            {b : 'b'},
            {c : 'c'}
        ]
    };
    var x = {
        a : 'a',
        b : 'b',
        c : {
            d : 'd',
            e : 'e',
            f : {
                g : 'g'
            }
        }
    };
    var y = {
        a : '`a',
        b : '`b',
        c : {
            d : '`d'
        }
    };
    var z = {
        a : {
            b : '``b'
        },
        fun : function foo () {
            return 'foo';
        },
        aps : Array.prototype.slice
    };
    
    it('clones non native functions', function () {
        var out = objectMerge(x, y, z);
        expect(out.fun()).toEqual(z.fun());
        expect(z.fun).not.toEqual(out.fun);
    });
    it('references native functions', function () {
        var out = objectMerge(x, y, z);
        expect(out.aps(['a'],0)).toEqual(z.aps(['a'],0))
        expect(out.aps).toEqual(z.aps);
    });
    it('clones array contents', function () {
        var out = objectMerge(x, w);
        expect(out.a instanceof Array).toEqual(true);
        expect(out.a === w.a).toEqual(false);
        expect(out.a[0] === w.a[0]).toEqual(false);
        expect(out.a[1] === w.a[1]).toEqual(false);
        expect(out.a[0].b === w.a[0].b).toEqual(true);
        expect(out.a[0].c === w.a[0].c).toEqual(true);
        expect(out.a[1].b === w.a[1].b).toEqual(true);
        expect(out.a[1].c === w.a[1].c).toEqual(true);
    });
    it('merges all objects recursively', function () {
        var out = objectMerge(x, y, z);
        expect(out.a === z.a).toEqual(false);
        expect(out.a).toEqual({'b' : '``b'});
        expect(out.b).toEqual('`b');
        expect(out.c).toEqual({
            'd' : '`d',
            'e' : 'e',
            'f' : {
                'g' : 'g'
            }
        });
        expect(out.fun).not.toEqual(z.fun);
        expect(out.fun()).toEqual(z.fun());
        expect(out.aps).toEqual(z.aps);
        out.c = {a:'wee'};
        expect(out.c.a == 'wee').toEqual(true);
        expect(x.c.a == 'wee').toEqual(false);
        expect(y.c.a == 'wee').toEqual(false);
    });
});
