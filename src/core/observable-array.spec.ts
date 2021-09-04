describe("The observableArray function", () => {
  it("stores an array of values", () => {
    const list = observableArray([1, 2]);

    expect(list.read()).toEqual([1, 2]);
  });

  it("triggers the addCallback when an element is added");

  it("triggers the changeCallback when an element is changed");

  it("triggers the deleteCallback when an element is deleted");

  it("does something", () => {
    // const list = observableArray([]);
    // const item = {};
    // // change
    // list.patch(item, { text: 1 });
    // // add
    // list.push(item);
    // // remove
    // list.delete(item);
    // list.pop();
    // list.subcribe(addCallback, changeCallback, removeCallback);
  });
});
