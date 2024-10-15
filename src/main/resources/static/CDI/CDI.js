document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded")

  const container = document.getElementById('container');
  const exampleDiv = document.getElementById("example")
  document.getElementById("Submit").addEventListener("click", tabulate)
  const progress = document.getElementById("progress-bar")
  const file = 'CDI/Child/CDI Questions.txt'
  const exampleFile = 'CDI/Child/CDI Example.txt'
  generateBoxes(exampleFile, true)
  generateBoxes(file, false)

  function tabulate(){
    return
  }

  function generateBoxes(file, example){
    fetch(file)
      .then(response =>{
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text(); 
      })
      .then(data => {
        const temp = data.split(/\r?\n/).filter(line => line.trim() !== '');
        temp.forEach((line, index) => {
      
          // Create the main box element
          const box = document.createElement('div');
          box.className = 'box';
          box.id = "box" + index
          //Set the first highlighted box
          if(index == 0){
            box.setAttribute("highlighted", "true")
          }

          const heading = document.createElement('h2');
          heading.textContent = "Question " + index + 1;
          if(example){
            heading.textContent = "Example Question"
          }
          box.appendChild(heading);

          const radioGroup = document.createElement('div');
          radioGroup.className = 'radio-group' + index;
          line.split(",").forEach((option, i) => {
            const label = document.createElement('label');
            const radio = document.createElement('input'); 
            
            radio.type = "radio"
            radio.value = option;
            radio.name = "options" + index

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            radioGroup.appendChild(label);

          })
            box.appendChild(radioGroup);

          box.addEventListener('click', function(){
            const boxes = container.querySelectorAll('.box');
            boxes.forEach(box => {
              box.setAttribute("highlighted", "false")
            });
            box.setAttribute("highlighted", "true")
          });

          // Append the box to the container
          if(example){
            exampleDiv.appendChild(box)
          }
          else{
          container.appendChild(box);
          }

        })
      })
      .catch(error => {
        console.error("Error fetching file")
      })
  }
});

