define([], function(){
    function CountManager(data, offset){
        var _curr = offset || 0,
            _length = (data && data.length) ? data.length : 0,
            _next = (_length > _curr + 1) ? _curr + 1 : false;

        var counter = (!_length) ? 
            { 
                curr: false,
                isLast: true
            } : 
            {
                data: data,
                last: _length,
                curr: _curr,
                next: _next,
                prev: false,
                isLast: false,
                isFirst: true,
                loadNext: function() {
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
                loadPrev: function() {
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
                },
                getData: function(x){
                    switch(x) {
                        case -1:
                           return this.data[this.prev] || null;
                        case 1:
                            return this.data[this.next] || null;
                        case 0:
                        default:
                            return this.data[this.curr] || null;
                    }
                }
            };
        return counter;
    }
    return CountManager;
})