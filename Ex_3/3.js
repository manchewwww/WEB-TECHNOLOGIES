function ATM(money) {
    return new (class {
        constructor(money) {
            this.money = money;
        }

        deposit(amount) {
            this.money += amount;
        }

        withdraw(amount) {
            if(this.money - amount < 0 )
                console.log("Not enough money in the account!");
            else
                this.money -= amount;
        }

        print() {
            console.log(this.money);
        }
    })(money);
}

let atm = ATM(100);
atm.deposit(50);
atm.print();
atm.withdraw(70);
atm.print();
