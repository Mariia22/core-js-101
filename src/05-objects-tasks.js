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

Rectangle.prototype.getArea = function () {
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
    this.selectors = new Map();
    this.combines = [];
  }

  element(value) {
    this.validSelector('element');
    this.selectors.set('element', value);
    this.validPosition();
    return this;
  }

  id(value) {
    this.validSelector('id');
    this.selectors.set('id', `#${value}`);
    this.validPosition();
    return this;
  }

  class(value) {
    this.isSelector('class');
    this.selectors.get('class').push(`.${value}`);
    this.validPosition();
    return this;
  }

  attr(value) {
    this.isSelector('attr');
    this.selectors.get('attr').push(`[${value}]`);
    this.validPosition();
    return this;
  }

  pseudoClass(value) {
    this.isSelector('pseudoClass');
    this.selectors.get('pseudoClass').push(`:${value}`);
    this.validPosition();
    return this;
  }

  pseudoElement(value) {
    this.validSelector('pseudoElement');
    this.selectors.set('pseudoElement', `::${value}`);
    this.validPosition();
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.combines.push(
      ...selector1.selectors.values(),
      ` ${combinator} `,
      ...selector2.selectors.values(),
      ...selector2.combines.values(),
    );
    return this;
  }

  stringify() {
    if (this.combines.length > 0) return this.combines.flat().join('');
    return [...this.selectors.values()].flat().join('');
  }

  isSelector(selector) {
    if (!this.selectors.has(selector)) this.selectors.set(selector, []);
  }

  validSelector(selector) {
    if (this.selectors.has(selector)) { throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector'); }
  }

  validPosition() {
    const selecKeys = [...this.selectors.keys()];
    const currentPos = this.names.filter((selec) => selecKeys.includes(selec));
    const correctPos = selecKeys.some((selec, i) => i > currentPos.indexOf(selec));
    if (correctPos) { throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'); }
  }
}

const cssSelectorBuilder = {
  element: (value) => new CssBuilder().element(value),
  id: (value) => new CssBuilder().id(value),
  class: (value) => new CssBuilder().class(value),
  attr: (value) => new CssBuilder().attr(value),
  pseudoClass: (value) => new CssBuilder().pseudoClass(value),
  pseudoElement: (value) => new CssBuilder().pseudoElement(value),
  combine: (sel1, combinator, sel2) => new CssBuilder().combine(sel1, combinator, sel2),
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
