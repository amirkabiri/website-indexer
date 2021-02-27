export default function isHostNamesSame(a, b){
  try{
    if(!(a instanceof URL)){
      a = new URL(a);
    }
    if(!(b instanceof URL)){
      b = new URL(b);
    }

    return a.hostname === b.hostname;
  }catch (e){
    return false;
  }
}