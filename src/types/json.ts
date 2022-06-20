// tslint:disable-next-line:interface-name
interface Json {
  [x: string]: string | number | boolean | Date | Json | JsonArray;
}
// tslint:disable-next-line:interface-name
interface JsonArray extends Array<string | number | boolean | Date | Json | JsonArray> { }
