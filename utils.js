// function getTextFromSiblingsOfFirstEnhDiv() {
//   const divElements = Array.from(document.querySelectorAll('.Enh')); // Select all elements with class 'Enh'

//   if (divElements.length === 0) {
//     return []; // No elements with class 'Enh' found
//   }

//   const firstEnhDiv = divElements[0]; // Get the first div with class 'Enh'
//   const siblingParagraphs = []; // To store text from sibling <p> elements

//   let nextSibling = firstEnhDiv.nextElementSibling; // Get the next sibling

//   // Loop through siblings until the next <div> with class 'Enh' is encountered or there are no more siblings
//   while (nextSibling && !nextSibling.classList.contains('Enh')) {
//     if (nextSibling.tagName === 'P') {
//       // If the sibling is a <p> element, add its text content to the array
//       siblingParagraphs.push(nextSibling.textContent.trim());
//     }
//     nextSibling = nextSibling.nextElementSibling; // Move to the next sibling
//   }

//   return siblingParagraphs;
// }

// // Call the function to get the text from siblings of the first div with class 'Enh'
// const textFromSiblings = getTextFromSiblingsOfFirstEnhDiv();

// console.log(textFromSiblings); // Output the result

// module.exports = { getTextFromSiblingsOfFirstEnhDiv };
