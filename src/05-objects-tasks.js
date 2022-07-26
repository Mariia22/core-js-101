/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
}

Rectangle.prototype.getArea = function a() {
  return this.width * this.height;
};


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  const values = Object.values(obj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssBuilder {
  constructor() {
    this.names = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    this.selectors = {};
    this.complex = [];
    this.combinationString = '';
    this.repeatError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.positionError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  checkValue(string) {
    if (Object.prototype.hasOwnProperty.call(this.selectors, string)) {
      throw new Error(this.repeatError);
    }
  }

  checkPosition() {
    const keys = Object.keys(this.selectors);
    const currentPosition = this.names.filter((selector) => keys.includes(selector));
    if (keys.some((selector, index) => index > currentPosition.indexOf(selector))) {
      throw new Error(this.positionError);
    }
  }

  isSelector(string) {
    if (!Object.prototype.hasOwnProperty.call(this.selectors, string)) {
      this.selectors[string] = [];
    }
  }

  element(value) {
    this.checkValue('element');
    this.selectors = { ...this.selectors, element: value };
    this.checkPosition();
    return this;
  }

  id(value) {
    this.checkValue('id');
    this.selectors = { ...this.selectors, id: `#${value}` };
    this.checkPosition();
    return this;
  }

  class(value) {
    this.isSelector('class');
    this.selectors.class.push(`.${value}`);
    this.checkPosition();
    return this;
  }

  attr(value) {
    this.isSelector('attr');
    this.selectors.attr.push(`[${value}]`);
    this.checkPosition();
    return this;
  }

  pseudoClass(value) {
    this.isSelector('pseudoClass');
    this.selectors.pseudoClass.push(`:${value}`);
    this.checkPosition();
    return this;
  }

  pseudoElement(value) {
    this.checkValue('pseudoElement');
    this.selectors = { ...this.selectors, pseudoElement: `::${value}` };
    this.checkPosition();
    return this;
  }

  combine(item1, combination, item2) {
    this.complex.push(`${item1.stringify()} ${combination} ${item2.stringify()}`);
    return this;
  }

  stringify() {
    if (this.complex.length > 0) {
      return this.complex.flat().join('');
    }
    return Object.values(this.selectors).flat().join('');
  }
}
const cssSelectorBuilder = {
  element(value) {
    return new CssBuilder().element(value);
  },
  id(value) {
    return new CssBuilder().id(value);
  },
  class(value) {
    return new CssBuilder().class(value);
  },
  attr(value) {
    return new CssBuilder().attr(value);
  },
  pseudoClass(value) {
    return new CssBuilder().pseudoClass(value);
  },
  pseudoElement(value) {
    return new CssBuilder().pseudoElement(value);
  },
  combine(item1, combination, item2) {
    return new CssBuilder().combine(item1, combination, item2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
