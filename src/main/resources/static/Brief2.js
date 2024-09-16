document.addEventListener('DOMContentLoaded', () => {
  //console.log('DOM fully loaded and parsed');

  const container = document.getElementById('container');
  document.getElementById("Submit").addEventListener("click", tabulate)
  createBox()
  manual()

  const ASN = {
    Often: ["Often", 3],
    Sometimes: ["Sometimes",2],
    Never: ["Never",1]
  }

  var inhibit = [1,10,16,24,30,39,48,62]
  var self_monitor = [4,13,20,26]
  var shift = [2,11,17,31,40,49,58,60]
  var emotional_control = [6,14,22,27,34,43,51,56]
  var initiate = [9,38,50,55,61]
  var working_memory= [3,12,19,25,28,32,41,46]
  var plan_organize = [7,15,23,35,44,52,57,59]
  var task_monitor = [5,21,29,33,42]
  var organization_of_materials = [8,37,45,47,53,63]

  /*for(i = 1; i < 63; i++){
    if (inhibit.includes(i) || self_monitor.includes(i) || shift.includes(i) || emotional_control.includes(i) || initiate.includes(i) || working_memory.includes(i) || plan_organize.includes(i) ||task_monitor.includes(i) ||organization_of_materials.includes(i)){
      console.log("")
    }
    else{
      console.log(i)
    }
  }*/

  function handleRadioChange(event){
    const selectedValue = event.target.value;
    //console.log(`Selected value: ${selectedValue}`);

    const par = event.target.parentNode.parentNode.parentNode;
    par.setAttribute("Answered", "True");
    par.setAttribute("Unanswered", "false")
    par.setAttribute("highlighted", "false");

    const next = document.getElementById(par.getAttribute("next-box"));
    next.setAttribute("highlighted", "true")
    if(par != document.getElementById("box62"))
      next.scrollIntoView({ behavior: 'smooth' });
  }

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

  function tabulate(){
    //Check if patient info is filled out
    var info = document.getElementById("Patient Information").childNodes
    var finished = true
    Array.from(info).forEach((child, index) => {
      if(child.className == "form-group"){
        var i = child.childNodes[3]
        if(i.value.trim() == ""){
          child.setAttribute("Unanswered", true)
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
          finished = false
          return
        }
      }
    })
    if(finished == true){
      const boxes = container.querySelectorAll('.box');
      var allAnswered = true;
      boxes.forEach(box => {
        var input = document.querySelector(`input[name="${"options" + box.id.substring(3)}"]:checked`);
        if(input == null){
          allAnswered = false
          console.log("Not Answered ")
          box.setAttribute("Unanswered", "true")
        }
      });
      
      var text = "Continue?"
      if(allAnswered == false){
        text = "Not all questions answered, do you want to continue?"
      }
      
      if(window.confirm(text)){
        console.log("END")
        scoring()
      }
      else{
        console.log("Finishing")
      }
    }
  }


  function scoring(){
    const a = document.createElement('a')
    var content = ""
    const boxes = container.querySelectorAll('.box');
    const fileName = 'example.txt';
    inhibit_score = 0
    self_monitor_score = 0
    shift_score = 0
    emotional_control_score = 0
    initiate_score = 0
    working_memory_score = 0
    plan_organize_score = 0
    task_monitor_score = 0
    organization_of_materials_score = 0
    boxes.forEach((box, index) => {
      var input = document.querySelector(`input[name="${"options" + box.id.substring(3)}"]:checked`);
      if(input != null){
        const entry = Object.entries(ASN).find(([key, value]) => value[0] === input.value);
        switch(true){
          case inhibit.includes(index+1):
            inhibit_score += entry[1][1]
            break;

          case self_monitor.includes(index+1):
            self_monitor_score += entry[1][1]
            break;

          case shift.includes(index+1):
            shift_score += entry[1][1]
            break;

          case emotional_control.includes(index+1):
            emotional_control_score += entry[1][1]
            break;

          case initiate.includes(index+1):
            initiate_score += entry[1][1]
            break;

          case working_memory.includes(index+1):
            working_memory_score += entry[1][1]
            break;

          case plan_organize.includes(index+1):
            plan_organize_score += entry[1][1]
            break;

          case task_monitor.includes(index+1):
            task_monitor_score += entry[1][1]
            break;

          case organization_of_materials.includes(index+1):    
            organization_of_materials_score += entry[1][1]
            break;
        }
        content = content + index + ": " + input.value + "\n"
      }
      else{
        content = content + index + ": Did not answer\n"
      }
    });
    console.log("Inhibit: " +  inhibit_score)   
    console.log("Self-Monitor: " +  self_monitor_score)   
    console.log("Shift: " +  shift_score)   
    console.log("Emotional Control: " +  emotional_control_score)   
    console.log("Initiate: " +  initiate_score)   
    console.log("Working Memory: " +  working_memory_score)   
    console.log("Plan/Organize: " +  plan_organize_score)   
    console.log("Task-Monitor: " +  task_monitor_score)   
    console.log("Organization of Materials: " +  organization_of_materials_score)   
    var BRI = inhibit_score + self_monitor_score
    var ERI = shift_score + emotional_control_score
    var CRI = initiate_score + working_memory_score + plan_organize_score + task_monitor_score + organization_of_materials_score
    var GEC = BRI + ERI + CRI
    console.log("BRI: " + BRI)
    console.log("ERI: " + ERI)
    console.log("CRI: " + CRI)
    console.log("GEC: " + GEC)

    var list = [inhibit_score,self_monitor_score,shift_score,emotional_control_score,initiate_score,working_memory_score,plan_organize_score,task_monitor_score,organization_of_materials,BRI,ERI,CRI,GEC]
    crossReference(list)
    
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    a.download = fileName;

    // Append the anchor to the document and trigger a click
    document.body.appendChild(a);
    a.click();

    // Remove the anchor element from the document
    document.body.removeChild(a);

  }

  function manual(){
    document.addEventListener("keydown", (event) =>{
      const key = event.key;
      const formElements = ["INPUT"];
      const box = document.querySelector('[highlighted="true"]');
      if(box != null){
        if (["1", "2", "3"].includes(key) && !formElements.includes(event.target.tagName)) {
          if (box.getAttribute("highlighted") == "true"){
      
            const radio = box.childNodes[1];
            radio.childNodes[key-1].childNodes[0].checked = true
            
            if(box != document.getElementById("box62")){
              box.setAttribute("Answered", "True");
              box.setAttribute("Unanswered", "false")
              box.setAttribute("highlighted", "false");
              const next = document.getElementById(box.getAttribute("next-box"))
              next.setAttribute("highlighted", "true")
              next.scrollIntoView({ behavior: 'smooth' });
            }
            else{
              box.setAttribute("Answered", "True");
              box.setAttribute("Unanswered", "false")
              box.setAttribute("highlighted", "false");
            }
            return
          }
        }
      }
    });
  }
  
  function crossReference(list){
    var gender = document.getElementById("Patient Gender").value
    var age = document.getElementById("Patient Age").value
    var arr = []
    var final = []
    if(gender == "Male"){
      if(age >= 5 && age <= 7){
        fetch('scoring_sheets/M/Scale Raw/5-7.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text(); 
        })
        .then(data => {
          lines = data.split("\r\n")
          lines.forEach((line, index) =>{
            const regex = /,(?![^\[]*\])/g; 
            arr.push(line.split(regex))
          })
          list.slice(0,8).forEach((value, index) => {
            var tuple = finder(arr, value, index + 1)
            final.push(arr[0][index+1] + " T-score: " + tuple[0] + arr[0][index+1] + " %ile: " + tuple[1])
          });
        })
        .catch(error => {
          console.error('Error fetching the text file:', error); // Log any errors
        });
        var arr2 = []
        final2 = []
        fetch('scoring_sheets/M/Index Raw/5-7.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text(); 
        })
        .then(data => {
          lines = data.split("\r\n")
          lines.forEach((line, index) =>{
            const regex = /,(?![^\[]*\])/g; 
            arr2.push(line.split(regex))
          })
          list.slice(9,12).forEach((value, index) => {
            tuple = finder(arr2, value, index + 1)
            final.push(arr2[0][index+1] + " T-score: " + tuple[0] + arr2[0][index+1] + " %ile: " + tuple[1])
          });
          
        })
      
        .catch(error => {
          console.error('Error fetching the text file:', error); // Log any errors
        });
        var arr3 = []

        fetch('scoring_sheets/M/Total Raw/5-7.csv')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.text(); 
        })
        
        .then(data => {
          lines = data.split("\r\n")
          lines.forEach((line, index) =>{
            const regex = /,(?![^\[]*\])/g; 
            arr3.push(line.split(regex))
          })
          var tuple = arr3[1][181-parseInt(list[12])].slice(2,-2).split(",")
          final.push(arr2[0][0] + " T-score: " + tuple[0] + " " + arr2[0][0] + " %ile: " + tuple[1])
        })
      
        .catch(error => {
          console.error('Error fetching the text file:', error); // Log any errors
        });
        console.log(final)
      }
      if(age >= 8 && age <= 10){
        console.log("B")
      }
      if(age >= 11 && age <= 13){
        console.log("C")
      }
      if(age >= 14 && age <= 18){
        console.log("D")
      }
    }
    if(gender == "Female"){
      if(age >= 5 && age <= 7){
        console.log("E")
      }
      if(age >= 8 && age <= 10){
        console.log("F")
      }
      if(age >= 11 && age <= 13){
        console.log("G")
      }
      if(age >= 14 && age <= 18){
        console.log("H")
      }
    }
  }

  function finder(arr, score, col){
    for (let i = 0; i < arr.length; i++){
      if(arr[i][0] == score){
        return arr[i][col].slice(2,-2).split(",")
      }
    }
  }
});