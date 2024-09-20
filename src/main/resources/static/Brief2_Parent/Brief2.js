document.addEventListener('DOMContentLoaded', () => {
  //console.log('DOM fully loaded and parsed');

  const container = document.getElementById('container');
  document.getElementById("Submit").addEventListener("click", tabulate)
  const progress = document.getElementById("progress-bar")
  let output = new Array(12).fill(null);
  createBox()
  manual()

  const ASO = {
    Often: ["Often", 3],
    Sometimes: ["Sometimes",2],
    Never: ["Never",1]
  }

  /*Descriptor 
    59 and lower typical 
    60 - 64 slightly elevated 
    65 - 69 elevated
    70 and above highly elevated 
  */  

  var inhibit = [1,10,16,24,30,39,48,62]
  var self_monitor = [4,13,20,26]
  var shift = [2,11,17,31,40,49,58,60]
  var emotional_control = [6,14,22,27,34,43,51,56]
  var initiate = [9,38,50,55,61]
  var working_memory= [3,12,19,25,28,32,41,46]
  var plan_organize = [7,15,23,35,44,52,57,59]
  var task_monitor = [5,21,29,33,42]
  var organization_of_materials = [8,37,45,47,53,63]

  var infrequency_scale = [18,36,54]
  var negativity_scale = [14,28,30,34,39,41,58,60]
  var inconsistency_scale = [[5,21], [9,55], [10,48], [17,40], [20,26], [22,56], [25,50], [37,63]]

  var answered = 0

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
    answered += 1
    const clampedPercent = Math.max(0, Math.min(100, 100 * answered/62));
    progress.style.width = clampedPercent + '%';
    if(par != document.getElementById("box62"))
      next.scrollIntoView({ behavior: 'smooth' });
  }

  function createBox(index) {
    fetch('Brief2_Parent/Brief2 Questions (Parent).txt')
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
          box.setAttribute("Unanswered", "true")
        }
      });
      
      var text = "Continue?"
      if(allAnswered == false){
        text = "Not all questions answered, do you want to continue?"
      }
      
      if(window.confirm(text)){
        var info = "Patient Name: " + document.getElementById("Patient Name").value + "\n"
        info += "Patient Gender: " + document.getElementById("Patient Gender").value + "\n"
        info += "Patient Age: " + document.getElementById("Patient Age").value + "\n"
        info += "Patient Grade: " + document.getElementById("Patient Grade").value + "\n"
        info += "Patient DOB: " + document.getElementById("Date of Birth").value + "\n"
        info += "Rater Name: " + document.getElementById("Rater's Name").value + "\n"
        info += "Relationship to Child: " + document.getElementById("Relationship to Child").value + "\n"
        info += "Today's Date: " + document.getElementById("Today's Date").value + "\n"
        pname = document.getElementById("Patient Name").value
        rtc = document.getElementById("Relationship to Child").value
        scoring(info, pname, rtc)
      }
      else{
      }
    }
  }


  async function scoring(info, name){
    const a = document.createElement('a')
    var content = info
    const boxes = container.querySelectorAll('.box');
    const fileName = "Brief2 Parent " + rtc + " " + name + ".txt";

    inhibit_score = 0
    self_monitor_score = 0
    shift_score = 0
    emotional_control_score = 0
    initiate_score = 0
    working_memory_score = 0
    plan_organize_score = 0
    task_monitor_score = 0
    organization_of_materials_score = 0

    negativity_score = 0
    infrequency_score = 0
    inconsistency_score = 0 

    inconsistency_dict = {}

    boxes.forEach((box, index) => {
      var input = document.querySelector(`input[name="${"options" + box.id.substring(3)}"]:checked`);
      if(input != null){
        const entry = Object.entries(ASO).find(([key, value]) => value[0] === input.value);
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
        switch(true){
          case negativity_scale.includes(index+1):
            negativity_score += 1
            break
          case infrequency_scale.includes(index+1):
            if(entry[1][1] == 2 || entry[1][1] == 3){
              infrequency_score += 1
            }
            break
          case inconsistency_scale.some(pair => pair[0] === index+1 || pair[1] === index+1):
            inconsistency_dict[index+1] = entry[1][1]
            break
        }
        content = content + index + ": " + input.value + "\n"
      }
      else{
        content = content + index + ": Did not answer\n"
      }
    });
   
    var BRI = inhibit_score + self_monitor_score
    var ERI = shift_score + emotional_control_score
    var CRI = initiate_score + working_memory_score + plan_organize_score + task_monitor_score + organization_of_materials_score
    var GEC = BRI + ERI + CRI
    var negativity_percentile = np_calc(negativity_score)
    var infrequency_percentile = if_calc(infrequency_score)
    inconsistency_score = calcInconsistency(inconsistency_dict)
    var inconsistency_percentile = ic_calc(inconsistency_score)


    var crv = await crossReference( [inhibit_score,self_monitor_score,shift_score,emotional_control_score,initiate_score,working_memory_score,plan_organize_score,task_monitor_score,organization_of_materials,BRI,ERI,CRI,GEC]);
    content += crv 
    content += "Negativity Score: " +  negativity_score + " %ile: " + negativity_percentile + "\n"
    content += "Infrequency Score: " + infrequency_score+ " %ile: " + infrequency_percentile + "\n"
    content += "Inconsistency Score: " + inconsistency_score+ " %ile: " + inconsistency_percentile+ "\n"
    a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    a.download = fileName;

    // Append the anchor to the document and trigger a click
    document.body.appendChild(a);
    a.click();

    // Remove the anchor element from the document
    document.body.removeChild(a);

  }
  function np_calc(score){
    if(score <= 6){
      return "<= 98"
    }
    else if (score == 7){
      return "99"
    }
    else{
      return ">99"
    }
  }

  function if_calc(score){
    if(score == 0){
      return "99"
    }
    else{
      return ">99"
    }
  }

  function ic_calc(score){
    if(score <= 6){
      return "<= 98"
    }
    else if (score >= 7 && score <= 10){
      return "99"
    }
    else{
      return ">99"
    }
  }

  function calcInconsistency(dict){
    var is = 0
    is += Math.abs(dict[5] - dict[21])
    is += Math.abs(dict[9] - dict[55])
    is += Math.abs(dict[10] - dict[48])
    is += Math.abs(dict[17] - dict[40])
    is += Math.abs(dict[20] - dict[26])
    is += Math.abs(dict[22] - dict[56])
    is += Math.abs(dict[25] - dict[50])
    is += Math.abs(dict[37] - dict[63])

    return is
  }

  function manual(){
    document.addEventListener("keydown", (event) =>{
      const key = event.key;
      const formElements = ["INPUT"];
      const box = document.querySelector('[highlighted="true"]');
      if(box != null){
        if (["1", "2", "3"].includes(key) && !formElements.includes(event.target.tagName)) {
          if (box.getAttribute("highlighted") == "true"){
            answered += 1
            const clampedPercent = Math.max(0, Math.min(100, 100 * answered/62));
            progress.style.width = clampedPercent + '%';
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
  
  async function crossReference(list) {
    var gender = document.getElementById("Patient Gender").value;
    var age = parseInt(document.getElementById("Patient Age").value);
    var file1 = 'Brief2_Parent/scoring_sheets/'
    var file2 = 'Brief2_Parent/scoring_sheets/'
    var file3 = 'Brief2_Parent/scoring_sheets/'
  try {
    if (gender === "Male") {
        file1 += "M/Scale Raw/"
        file2 += "M/Index Raw/"
        file3 += "M/Total Raw/"
      if (age >= 5 && age <= 7) {
        file1 += "5-7.csv"
        file2 += "5-7.csv"
        file3 += "5-7.csv" 
      } else if (age >= 8 && age <= 10) {
        file1 += "8-10.csv"
        file2 += "8-10.csv"
        file3 += "8-10.csv"
      } else if (age >= 11 && age <= 13) {
        file1 += "11-13.csv"
        file2 += "11-13.csv"
        file3 += "11-13.csv"
      } else if (age >= 14 && age <= 18) {
        file1 += "14-18.csv"
        file2 += "14-18.csv"
        file3 += "14-18.csv"
      }
    } else if (gender === "Female") {
        file1 += "F/Scale Raw/"
        file2 += "F/Index Raw/"
        file3 += "F/Total Raw/"
      if (age >= 5 && age <= 7) {
        file1 += "5-7.csv"
        file2 += "5-7.csv"
        file3 += "5-7.csv" 
      } else if (age >= 8 && age <= 10) {
        file1 += "8-10.csv"
        file2 += "8-10.csv"
        file3 += "8-10.csv"
      } else if (age >= 11 && age <= 13) {
        file1 += "11-13.csv"
        file2 += "11-13.csv"
        file3 += "11-13.csv"
      } else if (age >= 14 && age <= 18) {
        file1 += "14-18.csv"
        file2 += "14-18.csv"
        file3 += "14-18.csv"
      }
    }
    let [final, final2, final3] = await Promise.all([
      score(file1, list, 0, 8),
      score(file2, list, 9, 12),
      score(file3, list, 12, 13)
    ]);
  
    output = final[0] + "\n" + final[1] + "\n" + final2[0]+ "\n"+ final[2]+ "\n" + final[3] + "\n"+ final2[1]+ "\n" + final[4] + "\n" + final[5]+ "\n" + final[6]+ "\n"+ final[7] + "\n" +final2[2] + "\n"+ final3

    return output
  } catch (error) {
      console.error('Error in crossReference function:', error);
  }
}

  async function score(file1, list, a, b) {
    try {
      let response = await fetch(file1);
      if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
      }
      let data = await response.text();
      let arr = [];
      let final = [];
      let lines = data.split("\r\n");
      lines.forEach((line) => {
        const regex = /,(?![^\[]*\])/g;
        arr.push(line.split(regex));
      });
      list.slice(a, b).forEach((value, index) => {
            var tuple = finder(arr, value, index + 1);
            var clinicalCategory= ""
            if(tuple[1] <=59){
              clinicalCategory = "typical"
            }
            else if(tuple[1] >= 60 && tuple[1] <= 64){
              clinicalCategory =  "slightly elevated"
            }
            else if(tuple[1] >= 65 && tuple[1] <= 69)
              clinicalCategory =  "elevated"
            else{
              clinicalCategory =  "highly elevated"
            } 
            final.push(arr[0][index + 1] + " [Value: "+ value + " T-score: " + tuple[0] + " %ile: " + tuple[1] + " Category: " + clinicalCategory + "]");
        });
        return final;
    } catch (error) {
        console.error('Error fetching the Scale file:', error);
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

