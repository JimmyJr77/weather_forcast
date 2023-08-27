document.getElementById("shake-button").addEventListener("click", function() {
    var shakingDiv = document.getElementById("shaking-div");
    shakingDiv.classList.add("shake-animation");
    setTimeout(function() {
      shakingDiv.classList.remove("shake-animation");
    }, 500); // Duration of animation in milliseconds
  });

  