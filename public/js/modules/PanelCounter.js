define([], function(){
    function CountManager(data, offset){
        var _curr = offset || 0;
        var _next = (data && data.length > _curr + 1) ? _curr + 1 : false;
        var counter = (!data || data.length === 0) ? 
            { 
                curr: false,
                isLast: true
            } : 
            {
                last: data.length,
                curr: _curr,
                next: _next,
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
    return CountManager;
})