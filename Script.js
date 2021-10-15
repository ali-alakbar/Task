



const input = document.querySelector("input");
const upload = document.getElementById("upload");
const taskContainer = document.querySelector(".taskContainer");
const form = document.querySelector("form");
const form4h3=document.querySelector(".form-h3");

form.addEventListener(
  "submit",


  
  (eo) => {
    eo.preventDefault();

    if (input.value === "") { //If the text value was empty, excute the following codes.

      form4h3.style.display = "block";






    } else {

      form4h3.style.display = "none";




      //If the text value {input.value} was not empty, add a new one to "taskContainer" variable below.
      const task = `
              
                <div class="task">
                        <div class="starAndstar">
                            <a id="starThin" class="icon-star-o"></a>
                        </div>
                <p class="task_para">${input.value}</p>
                        <div class="trashdAndheart">
                            <a id="trash" class="icon-trash-o"></a>
                            <a class="icon-sad2"></a>

                        </div>
                </div>

                
    `;
      taskContainer.innerHTML += task;
    }
    
    input.value = ""; //After You Add It, make the Text Place Clean.

  }
);



// DarkMode


const darkbtn = document.querySelector(".icon-moon-o");
const body= document.querySelector("#se");


darkbtn.addEventListener("click",



  (eo) => {
    

    body.classList.toggle("dark");  // DarkMode By clicking on Moon Icon
  });


    
taskContainer.addEventListener(
  "click",

  (eo) => {
    // ==========================================
    //      SWITCH
    // ==========================================

    const task = document.querySelectorAll(".task"); //To call the tasks as an array, the tasks that will be there later. 

    switch (eo.target.className) {
      //Thin Heart Icon
      case "icon-sad2":
        eo.target.classList.add("sad");

        const sad = `<a class="icon-check"></a>`;

        eo.target.parentElement.innerHTML += sad;

        break;

      case "icon-check": // Correct Icon
        eo.target.classList.add("Check");
        const heart = `<a class="icon-sad2"></a>`;

        eo.target.parentElement.innerHTML += heart;

        break;

      case "icon-trash-o": //Trash Icon
        eo.target.parentElement.parentElement.remove();

        break;

      case "icon-star-o": // Thin Star Icon
        eo.target.classList.add("star");

        const boldStar = `<a class="icon-star"></a>`;

        taskContainer.prepend(eo.target.parentElement.parentElement);

        eo.target.parentElement.innerHTML += boldStar;

        break;

      case "icon-star": //Bold Star Icon
        eo.target.classList.add("starBold");

        const starThin = `<a id="starThin" class="icon-star-o"></a>`;

        eo.target.parentElement.innerHTML += starThin;

        break;

      case "clearbtn": //Clear All Tasks
        task.forEach((item) => {
          item.remove();
        });
        break;
    }

  }
);




// Finished
