

    $('[id^="linkNote"]').on('click', function(event) {
        
          const index = this.id.replace('linkNote', '');
          
          $('#openNote' + index).submit();
        
      });
      

      $('#about').on('click', function(event) {
        
        window.location.href = "/about";
      
    });