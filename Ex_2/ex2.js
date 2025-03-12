//Task 1
const expect = (val) =>{
    return {
        toBe : (newStr) => {
            if(val!==newStr){
                throw new Error('TypeAsertion Error');
            } 
            if(val!=newStr){
                throw new Error('Not Equal Error');
            } 
        },
        toHaveClass : (clasName) => {
            if(!val instanceof(HTMLElement)){
                throw new TypeError('TypeAsertion Error');
            }
            const elementClassNames = val.getAttribute('class').split(' ');
            const hasClass = elementClassNames.find(clasName);
            if(!hasClass){
                throw new RTCError('Class not available');
            }
        }
    }
};

expect('aba').toBe('aba');
//expect('aba').toBe('abaa');
//expect('5').toBe(5);