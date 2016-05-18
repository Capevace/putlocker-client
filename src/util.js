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
    ready: function () {
        return new Promise((resolve, reject) => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }
};
