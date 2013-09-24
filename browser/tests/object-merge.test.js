/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
describe('object-merge', function () {
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
    
    it('clones functions', function () {
        var out = objectMerge(x, y, z);
        expect(out.fun()).toEqual(z.fun());
        expect(z.fun).not.toEqual(out.fun);
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
    });
});
