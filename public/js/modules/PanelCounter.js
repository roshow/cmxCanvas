define([], function(){
    function PanelCounter(data){
        var counter = (!data || data.length === 0) ? 
            { 
                curr: false 
            } : 
            {
                last: data.length,
                curr: 0,
                next: (function(){
                     return (data.length > 1) ? 1 : false;
                }()),
                prev: false,
                isLast: false,
                isFirst: true,
                getNext: function() {
                    if (this.isLast) return false;
                    else {
                        this.prev = this.curr;
                        this.curr = this.next;
                        this.next = (this.curr + 1 < this.last) ? this.curr + 1 : false;
                        this.isLast = this.next ? false : true;
                        this.isFirst = false;
                        return this.curr;
                    }             
                },
                getPrev: function() {
                    if (this.isFirst) return false;
                    else {
                        this.next = this.curr;
                        this.curr = this.prev;
                        this.prev = (this.curr - 1 >= 0) ? this.curr - 1 : false;
                        this.isFirst = (this.curr === 0) ? true : false;
                        this.isLast = false;
                        return this.curr;
                    }   
                },
                goTo: function(x) {
                    if(x < this.last && x >= 0) {
                        this.curr = x;
                        this.next = (this.curr + 1 < this.last) ? this.curr + 1 : false;
                        this.isLast = this.next ? false : true;
                        this.prev = (this.curr - 1 >= 0) ? this.curr - 1 : false;
                        this.isFirst = this.prev ? false : true;
                        return this.curr;
                    }
                }
            };
        return counter;
    }
    return PanelCounter;
})