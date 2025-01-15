

    $('[id^="linkNote"]').on('click', function(event) {
        
          const index = this.id.replace('linkNote', '');
          
          $('#openNote' + index).submit();
        
      });
      
