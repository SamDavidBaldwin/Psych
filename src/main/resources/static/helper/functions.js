export function createBoxes(version){
  if(version == "P"){
    file = 'Parent/Brief2 Questions (Parent).txt'
  }
  else{
    file = 'Teacher/Brief2 Questions (Teacher).txt'
  }
  fetch(file)
    .then(response => {
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
        
        // Create and append the heading
        const heading = document.createElement('h2');
        heading.textContent = line;
        box.appendChild(heading);

        // Create and append the radio buttons
        const radioGroup = document.createElement('div');
        radioGroup.className = 'radio-group' + index;
        ['Never', 'Sometimes', 'Often'].forEach((option, i) => {
          const label = document.createElement('label');
          const radio = document.createElement('input'); 

          radio.type = 'radio';
          radio.value = option;
          radio.name = "options" + index
          label.appendChild(radio);
          label.appendChild(document.createTextNode(option));
          radioGroup.appendChild(label);
          radioGroup.querySelectorAll('input[type="radio"][name="options' + index + '"]').forEach(radio => {
            radio.addEventListener('change', handleRadioChange);
        });
          
        });
        box.appendChild(radioGroup);

        box.addEventListener('click', function(){
          const boxes = container.querySelectorAll('.box');
          boxes.forEach(box => {
            box.setAttribute("highlighted", "false")
          });
          box.setAttribute("highlighted", "true")
        });

        // Append the box to the container
        container.appendChild(box);

        //Setup link structure
        if(index == 62){
          const boxes = container.querySelectorAll('.box');
          boxes.forEach(box => {
            var next = parseInt(box.id.substring(3), 10)
            next = next + 1
            box.setAttribute("next-box", "box" + next)
          });
        }
      });
    })
    .catch(error => {
      console.error('Error fetching the text file:', error); // Log any errors
    });
}