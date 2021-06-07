class Node{
  constructor(value, payload) {
    this.value = value;
    this.children = {};
    this.isEnd = false;

    if(payload) this.payload = payload;
  }
}

export default class TrieStructure{
  constructor() {
    this.tree = new Node('');
  }

  /**
   * @param key {string}
   * @param payload {*}
   */
  insert(key, payload){
    let cum = '';
    let node = this.tree;

    for(let i = 0; i < key.length; i ++){
      const char = key[i];
      cum += char;

      if(!(char in node.children)) {
        node.children[char] = new Node(cum);
      }

      node = node.children[char];
    }

    node.isEnd = true;
    node.payload = payload;

    return this;
  }

  /**
   * @param key {string}
   * @returns {Node}
   */
  findNode(key){
    let node = this.tree;
    const length = key.length;

    for(let i = 0; i < length; i ++){
      if(!(key[i] in node.children)){
        return node;
      }

      node = node.children[key[i]];
    }

    return node;
  }

  /**
   * @param key {string}
   * @return {*|null}
   */
  find(key){
    const node = this.findNode(key);

    return node.value === key && node.isEnd ? node.payload : null;
  }

  /**
   * @param key {string}
   * @return {TrieStructure}
   */
  remove(key){
    let node = this.tree;
    const length = key.length;
    const sequence = [node];

    for(let i = 0; i < length; i ++){
      if(!(key[i] in node.children)){
        return this;
      }

      node = node.children[key[i]];
      sequence.push(node);
    }

    // if key not found
    if(!node.isEnd) return this;

    // if node has children, don't remove it, just make isEnd false and clear payload
    if(Object.keys(node.children).length){
      node.isEnd = false;
      delete node.payload;
      return this;
    }

    let j = length - 1;
    for(let i = sequence.length - 2; i >= 0; i --, j --){
      const node = sequence[i];

      delete node.children[key[j]];

      if(node.isEnd) break;
    }

    return this;
  }

  *traverse(startNode = this.tree){
    const stack = [startNode];

    while(stack.length){
      const node = stack.pop();
      yield node;

      for(let chr in node.children){
        stack.push(node.children[chr]);
      }
    }
  }
}