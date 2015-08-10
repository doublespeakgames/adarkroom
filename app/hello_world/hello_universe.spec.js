// Default imports test
import greet from './hello_universe';

describe("hello universe", function () {

    it("greets better than hello world", function () {
        expect(greet()).toBe('Hello Universe!');
    });

});
