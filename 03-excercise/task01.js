
let ATM = (initialBalance => {
    let balance = initialBalance;

    function change(amount) {
        balance += amount;
    }

    return {
        deposit(amount) {
            change(amount);
            return "Deposit successful";
        }, withdraw(amount) {
            if (amount > balance) {
                return "Insufficient funds";
            }
            change(-amount);
            return "Withdrawal successful";
        },
        print() {
            console.log("Balance: " + balance);
        }
    }
})(100);

let atm = ATM;
console.log(atm.deposit(50)); // Deposit successful
atm.print(); // Balance: 150
console.log(atm.withdraw(70)); // Withdrawal successful
atm.print(); // Balance: 80