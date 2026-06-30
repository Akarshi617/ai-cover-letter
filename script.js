var formEl = document.getElementById("myForm");
var outputDiv = document.getElementById("output");
var letterBox = document.getElementById("letter");
var copyBtn = document.getElementById("copyBtn");
var msg = document.getElementById("msg");
var generateBtn = document.getElementById("generateBtn");

formEl.onsubmit = async function (e) {
  e.preventDefault();

  var name1 = document.getElementById("name").value;
  var role1 = document.getElementById("role").value;
  var company1 = document.getElementById("company").value;
  var skills1 = document.getElementById("skills").value;
  var resumeFile = document.getElementById("resume").files[0];

  // show generating state
  generateBtn.disabled = true;
  generateBtn.innerText = "Generating...";
  outputDiv.style.display = "none";
  msg.innerText = "";

  var resumeBase64 = null;
  if (resumeFile) {
    resumeBase64 = await fileToBase64(resumeFile);
  }

  try {
    var res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name1,
        role: role1,
        company: company1,
        skills: skills1,
        resume: resumeBase64
      })
    });

    var data = await res.json();

    if (data.error) {
      letterBox.innerText = "Error: " + data.error;
    } else {
      letterBox.innerHTML = data.letter;
    }

    outputDiv.style.display = "block";
  } catch (err) {
    letterBox.innerText = "Something went wrong. Try again.";
    outputDiv.style.display = "block";
  }

  generateBtn.disabled = false;
  generateBtn.innerText = "Generate";
};

function fileToBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      resolve(reader.result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

copyBtn.onclick = function () {
  navigator.clipboard.writeText(letterBox.innerText);
  msg.innerText = "copied!";
  setTimeout(function () {
    msg.innerText = "";
  }, 2000);
};
