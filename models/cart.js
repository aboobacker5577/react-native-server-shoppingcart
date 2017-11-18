module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, prices: 0}
        }
        storedItem.qty++;
        storedItem.prices = storedItem.item.prices * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.prices;
    };
    this.reduceByOne = function (id) {
        this.items[id].qty--;
        this.items[id].prices -= this.items[id].item.prices;
        //console.log('test:'+this.items[id].prices);
        this.totalQty--;
        this.totalPrice -= this.items[id].item.prices;
        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }

    };
    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].prices;
        delete this.items[id];
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};