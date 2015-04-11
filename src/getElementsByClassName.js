// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

//helper function that recursively traverses the entire document searching for element nodes that contain className in their classList
//element nodes containing a matching className are pushed into the array
var getElementsByClassNameRecursiveHelper = function(node, HTMLCollectionArray, className) {

  //ensure that the node is not undefined or null, but this should not normally occur
  if(node === undefined || node === null)
    return;

  //if the node has a classList, then search the classList for a string matching className and push the node into the array if there is a match
  if(node.classList !== undefined && node.classList !== null && node.classList.length >= 1)
  {
    for(var i = 0; i < node.classList.length; ++i)
    {
      if(node.classList[i] === className)
      {
	      HTMLCollectionArray.push(node);
	      break; //can break once the className has been found
      }
    }
  }

  //primary base case
  //stop the recursive branch once a leaf node/node with no children is reached
  if(node.childNodes === undefined || node.childNodes === null)
    return;

  //recursively call the function on all children of the current node
  for(var i = 0; i < node.childNodes.length; ++i)
  {
    getElementsByClassNameRecursiveHelper(node.childNodes[i], HTMLCollectionArray, className);
  }
};

//function that searches the entire document for elements that have a class matching className and returns those elements in an array
//this function will only use document as the root element instead of allowing the function to be called on an element like the built-in function does
//this function will return an array instead of an array-like object like the built-in function does 
var getElementsByClassName = function(className
){
  // your code here
  var HTMLCollectionArray = []; //use array instead of array-like HTMLCollection object

  //call recursive helper function and pass in document as the root element node
  getElementsByClassNameRecursiveHelper(document, HTMLCollectionArray, className);

  return HTMLCollectionArray;
};
