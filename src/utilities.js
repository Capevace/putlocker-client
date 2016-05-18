export default {
	addClass: function (newClass, el) {
		let classes = el.className.split(' ');

		if (!classes.includes(newClass))
			classes.push(newClass);

		el.className = classes.join(' ');
	},
	removeClass: function (oldClass, el) {
		return el.className
			.split(' ')
			.filter(className => className === oldClass)
			.join(' ');
	},
	toggleClass: function (className, el) {
		if (el.className.split(' ').includes(className))
			this.removeClass(className);
		else
			this.addClass(className);
	},
    ready: function (callback) {
        document.addEventListener('DOMContentLoaded', callback);
    },
    polyfills: function () {
        String.prototype.dashToSpace = function () {
        	return this.replace(/-/g, ' ');
        };

        String.prototype.spaceToDash = function () {
        	return this.replace(/\s/g, '-');
        };

        String.prototype.toHtmlObject = function () {
        	let element = document.createElement('html');
        	element.innerHTML = this;

        	return element;
        };

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || this;

                for (var i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, undefined);
                }
            }
        }

        if (!Array.prototype.includes) {
            Array.prototype.includes = function (value) {
                var found = false;

                this.forEach(function (value) {
                    if (value === value) {
                        found = true;
                        return false;
                    }
                });

                return found;
            };
        }
    }
};
