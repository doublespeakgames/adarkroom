// Named imports test
import { greet, bye } from './hello_world';

describe("hello world", function () {

    it("greets", function () {
        expect(greet()).toBe('Hello World!');
    });

    it("says goodbye", function () {
        expect(bye()).toBe('See ya!');
    });

});
