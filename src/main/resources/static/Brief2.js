document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  const container = document.getElementById('container');
  
  function createBox(index) {
    fetch('Brief2 Questions (Parent).txt')
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
          radioGroup.className = 'radio-group';

          ['Always', 'Sometimes', 'Never'].forEach((option, i) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.value = `option${i + 1}`;
            radio.name = "options"
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            radioGroup.appendChild(label);
            radioGroup.querySelectorAll('input[type="radio"][name="options"]').forEach(radio => {
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
        });
      })
      .catch(error => {
        console.error('Error fetching the text file:', error); // Log any errors
      });
    }
  createBox();
  function handleRadioChange(event){
    const selectedValue = event.target.value;
    console.log(`Selected value: ${selectedValue}`);
  }


});