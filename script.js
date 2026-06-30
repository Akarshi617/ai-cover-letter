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

  // show generating state
  generateBtn.disabled = true;
  generateBtn.innerText = "Generating...";
  outputDiv.style.display = "none";
  msg.innerText = "";

  try {
    var res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name1,
        role: role1,
        company: company1,
        skills: skills1
      })
    });

    var data = await res.json();

    if (data.error) {
      letterBox.innerText = "Error: " + data.error;
    } else {
      letterBox.innerText = data.letter;
    }

    outputDiv.style.display = "block";
  } catch (err) {
    letterBox.innerText = "Something went wrong. Try again.";
    outputDiv.style.display = "block";
  }

  generateBtn.disabled = false;
  generateBtn.innerText = "Generate";
};

copyBtn.onclick = function () {
  navigator.clipboard.writeText(letterBox.innerText);
  msg.innerText = "copied!";
  setTimeout(function () {
    msg.innerText = "";
  }, 2000);
};
