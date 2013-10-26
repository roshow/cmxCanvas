/*var PC = require('./panelObj').PanelCounter;
var p = new PC(20);*/
function PanelCounter(lastPanel){
    var pobj = {
        last: lastPanel,
        curr: 0,
        next: 1,
        prev: null,
        isLast: false,
        isFirst: true,
        getNext: function() {
            if(!this.isLast) {
                this.prev = this.curr;
                this.curr = this.next;
                this.next = (this.curr + 1 < this.last) ? this.curr + 1 : null;
                this.isLast = this.next ? false : true;
                this.isFirst = false;
            }
            return this;
        },
        getPrev: function() {
            if(!this.isFirst) {
                this.next = this.curr;
                this.curr = this.prev;
                this.prev = (this.curr - 1 >= 0) ? this.curr - 1 : null;
                this.isFirst = this.prev ? false : true;
                this.isLast = false;
            }
            return this;
        }
    };
    return pobj;
}

exports.PanelCounter = PanelCounter;