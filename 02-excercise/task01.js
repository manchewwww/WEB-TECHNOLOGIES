// function expect(value) {
// }

const expect = (value) => {
    return { // create new Object and return it
        toBe: (expected) => { // add property to object
            if (value !== expected) {
                throw new Error("Not the expected value");
            } else if (typeof value !== typeof expected) {
                throw new typeAssertionError("Not the expected type");
            }
        },
        toHaveClass: (className) => {
            if (value instanceof HTMLElement) {
                throw new typeAssertionError("Not an HTMLElement");
            }
            const elementClassNames = value.getAttribute("class").split(" ");
            const hasClass = elementClassNames.includes(className);
            if (!hasClass) {
                throw new Error("Class not available");
            }
        }
    }
}

console.log(expect("asd").toBe(5));