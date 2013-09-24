/*
License gpl-3.0 http://www.gnu.org/licenses/gpl-3.0-standalone.html
*/
describe('clone-function', function () {
    it('clones non native functions', function () {
        var func = function wee (arg) {
            return 'wee';
        };
        var x = cloneFunction(func);
        expect(x).not.toEqual(func);
        expect(x()).toEqual(func());
    });
    it('references native functions', function () {
        var x = Array.prototype.slice;
        var y = cloneFunction(x);
        var z = ['a', 'b'];
        expect(x).toEqual(y);
        expect(x.call(z, 1)).toEqual(y.call(z, 1));
    });
});



