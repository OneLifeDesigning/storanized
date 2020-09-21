get_breadcrumbs = url => {
  const rtn = [{name: "Dashboard", url: "/dashboard"}];
  let acc = "";
  const arr = url.substring(1).split("/");

  const capitalizator = str => str ? str.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') : ''
  for (i=0; i<arr.length; i++) {
    acc = i != arr.length-1 ? acc+"/"+arr[i] : null;
    if (rtn[0].name !== capitalizator(arr[i])) {
      if (arr[i] === 'junglesales') {
        arr[i] = 'Jungle Sales'
      }
      rtn[i+1] = {name: capitalizator(arr[i]), url: acc};
    }
  }
  return rtn;
};