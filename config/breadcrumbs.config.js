get_breadcrumbs = url => {
  const rtn = [{name: "Home", url: "/"}];
  let acc = "";
  const arr = url.substring(1).split("/");

  for (i=0; i<arr.length; i++) {
      acc = i != arr.length-1 ? acc+"/"+arr[i] : null;
      rtn[i+1] = {name: arr[i].toUpperCase(), url: acc};
  }
  return rtn;
};