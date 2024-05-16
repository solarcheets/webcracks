document.querySelectorAll('.button-save').forEach(button => {
    button.addEventListener('click', function () {
      var container = this.closest('.block').querySelector('.canvas-container');
  
      $(this).addClass('button-disable');
      container.style.display = 'block';
  
      html2canvas(container).then(canvas => {
  
        canvas.toBlob(function (blob) {
  
          button.disabled = true;
  
          var tabID = container.closest('.block').getAttribute('id');
          var tab = document.querySelector('.tabs a[href="#' + tabID + '"]');
          var readyIcon = document.createElement('img');
          readyIcon.className = 'icon-ready';
          readyIcon.src = 'images/icons/ready.png';
          tab.appendChild(readyIcon);
  
          if (checkTabs()) {
            document.getElementById('button-publish').classList.remove('button-disable');
          } else {
            document.getElementById('button-publish').classList.add('button-disable');
          }
        });
      });
  
      if ('#' + container.closest('.block').getAttribute('id') !== document.querySelector('.tabs a.active').getAttribute('href')) {
        container.style.display = 'none';
      }
    });
  });
  
  document.getElementById('button-publish').addEventListener('click', function () {
    const blocks = document.querySelectorAll('.block');
    let completedCanvases = 0;
    const allCanvases = [];
  
    const originalStyles = Array.from(blocks).map(block => block.style.display);
  
    blocks.forEach(block => block.style.display = 'flex');
  
    blocks.forEach((block, index) => {
      Array.from(block.querySelectorAll("img")).forEach(img => {
        img.crossOrigin = "anonymous";
      });
      Array.from(block.querySelectorAll(".clothing-template")).forEach(img => {
        img.crossOrigin = "anonymous";
      });
  
      const canvasContainer = block.querySelector('.canvas-container');
  
      $(".ui-resizable-se").css("opacity", "0");
      $(".canvas-container").css("overflow", "visible");
      $(".stroke").css("display", "none");
  
      if (block.id !== 'number-color') {
        html2canvas(canvasContainer, { useCORS: true }).then(canvas => {
  
          $(".ui-resizable-se").css("opacity", "0.6");
          $(".canvas-container").css("overflow", "hidden");
          $(".stroke").css("display", "block");
  
          if (canvas.width > 0 && canvas.height > 0) {
           // if (block.id === 't-shirt-front' || block.id === 't-shirt-back') {
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 512;
            resizedCanvas.height = 450;
            
            const resizedCtx = resizedCanvas.getContext('2d');
            resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
            
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = 512;
            croppedCanvas.height = 450;
            
            const croppedCtx = croppedCanvas.getContext('2d');
            
            if (block.id === 't-shirt-front' || block.id === 't-shirt-back') {
              croppedCtx.drawImage(
                resizedCanvas,  
                24, 42,         
                445, 350,       
                0, 0,           
                512, 450       
              );
              allCanvases[index] = croppedCanvas;
            }
  
            if (block.id === 'shorts-front' || block.id === 'shorts-back') {
  
              croppedCtx.drawImage(
                resizedCanvas,   
                24, 100,        
                445, 265,      
                0, 0,            
                512, 370       
              );
              allCanvases[index] = croppedCanvas;
            }
  
            if (block.id === 'getrs') {
              const croppedCanvas = document.createElement('canvas');
              croppedCanvas.width = 512;
              croppedCanvas.height = 280; 
              
              const croppedCtx = croppedCanvas.getContext('2d');
              
              croppedCtx.drawImage(
                resizedCanvas,        
                0, resizedCanvas.height - 320, 
                resizedCanvas.width,  310,              
                0, 0,                 
                512, 350              
              );
            
              allCanvases[index] = croppedCanvas;
            
              const mirrorCanvas = document.createElement('canvas');
              const mirrorCtx = mirrorCanvas.getContext('2d');
              mirrorCanvas.width = croppedCanvas.width;
              mirrorCanvas.height = croppedCanvas.height;
            
              mirrorCtx.scale(-1, 1);
              mirrorCtx.drawImage(croppedCanvas, -croppedCanvas.width, 0);
            
              allCanvases.splice(index + 1, 0, mirrorCanvas);
            }
          }
          completedCanvases++;
  
          if (completedCanvases === blocks.length) {
            blocks.forEach((block, index) => block.style.display = originalStyles[index]);
            combineImages();
          }
        });
      }
      else {
        completedCanvases++;
        if (completedCanvases === blocks.length) {
          blocks.forEach((block, index) => block.style.display = originalStyles[index]);
          combineImages();
        }
      }
    });
  
    const combineImages = () => {
      const combinedCanvas = document.createElement('canvas');
      const ctx = combinedCanvas.getContext('2d');
  
      let totalHeight = 1024;
      let maxWidth = 512;
  
      combinedCanvas.height = totalHeight;
      combinedCanvas.width = maxWidth * 2; 
  
      let currentHeight = 0;
      let secondColumn = false;
  
      allCanvases.forEach((canvas, index) => {
        if (canvas) {
          let xPos = secondColumn ? maxWidth : 0;
          let block = blocks[index];
      
          if (block.id === 'getrs' && !secondColumn) {
            currentHeight -= 80; 
          }
      
          ctx.drawImage(canvas, xPos, currentHeight);
      
          if (block.id === 'getrs' && secondColumn) {
            currentHeight += 80; 
          }
      
          if (index % 2 != 0) {
            currentHeight += canvas.height;
          }
      
          secondColumn = !secondColumn;
        }
      });
  
      ctx.fillStyle = "black";
      ctx.fillRect(5, combinedCanvas.height - 190, 160, 185);
      ctx.fillRect(combinedCanvas.width - 165, combinedCanvas.height - 190, 160, 185);
  
      //save
      // combinedCanvas.toBlob((blob) => {
      //   let url = URL.createObjectURL(blob);
      //   let link = document.createElement('a');
      //   link.href = url;
      //   link.download = 'screenshot.png';
      //   link.click();
      // });
  
      //send
      combinedCanvas.toBlob((blob) => {
        let reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            let base64data = reader.result;
    
            localStorage.setItem('combinedImage', base64data);
    
            let color = window.getComputedStyle(document.querySelector('#number-color .canvas-container')).backgroundColor;
            color = rgbToHex(color); 
    
            const formData = new FormData();
            formData.append('fileToUpload', blob, 'screenshot.png');
    
            fetch(`https://jerseys.vrfs.gg/get_jersey/receiver.php?textColor=${color}`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data); 
                localStorage.setItem('jerseyCode', data.code);
                window.location.href = 'access-code.html';
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
  
  
    }
  
    $(this).addClass('button-disable');
  
  });
  
  function checkTabs() {
    const tabs = document.querySelectorAll('.tabs a');
    for (let i = 0; i < tabs.length - 1; i++) {
      if (!tabs[i].querySelector('.icon-ready')) {
        return false;
      }
    }
    return true;
  }
  
  let previousTab;
  
  $(document).ready(function() {
      previousTab = $('.tabs a.active').attr('href');
  });
  
  $('.tabs a').click(function(e) {
      e.preventDefault();
  
      // Check if previous tab exists and make a screenshot
      if (previousTab) {
          var container = $(previousTab).find('.canvas-container');
  
          html2canvas(container[0]).then(canvas => {
              canvas.toBlob(blob => {
  
                  // Check if ready icon is already present, if so, remove it
                  var existingIcon = $('a[href="' + previousTab + '"] .icon-ready');
                  if (existingIcon.length) existingIcon.remove();
  
                  var readyIcon = $('<img>').addClass('icon-ready').attr('src', 'images/icons/ready.png');
                  $('a[href="' + previousTab + '"]').append(readyIcon);
  
                  if (checkTabs()) {
                      $('#button-publish').removeClass('button-disable');
                  } else {
                      $('#button-publish').addClass('button-disable');
                  }
              });
          });
      }
  
      // Save current tab as previous
      previousTab = $('.tabs a.active').attr('href');
  
      $('.tabs a').removeClass('active');
      $(this).addClass('active');
  
      var tab = $(this).attr('href');
      $('.block').css('display', 'none');
      $(tab).css('display', 'flex');
  });
  
  $(document).ready(function() {
      $('a[href="#t-shirt-front"]').trigger('click');
      if (!checkTabs()) {
          $('#button-publish').addClass('button-disable');
      }
  });
  
  function rgbToHex(rgb) {
    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r, g, b)" into [r, g, b]
    rgb = rgb.substr(4).split(")")[0].split(sep);
  
    let r = (+rgb[0]).toString(16),
      g = (+rgb[1]).toString(16),
      b = (+rgb[2]).toString(16);
  
    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
  
    return r + g + b;
  }
  
  