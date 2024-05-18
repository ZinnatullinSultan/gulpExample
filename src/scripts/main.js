class A{
  constructor(name) {
    this.name=name;
  }
  hide(){
    alert(`${this.name} прячется`)
  }
}
let ob = new A('qwerty');
// ob.hide();