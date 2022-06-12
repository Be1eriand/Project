//VIEW PDF
$(document).ready(function($) 
{ 

    $(document).on('click', '.btn-view', function(event) 
    {


        event.preventDefault();

        //credit : https://ekoopmans.github.io/html2pdf.js
        
        var element = document.getElementById('report'); 

        //custom settings
        var opt = 
        {
          margin:       [0.1, 10, 0.3, 10],
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
            window.open(pdf.output('bloburl'), '_blank');
        });

         
    });



});


//DOWNLOAD PDF
$(document).ready(function($) 
{ 

    $(document).on('click', '.btn-download', function(event) 
    {
        event.preventDefault();

        var date = new Date()
        var todaysDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()

        //credit : https://ekoopmans.github.io/html2pdf.js
        
        var element = document.getElementById('report'); 

        // custom settings
        var opt = 
        {
          margin:       [0.1, 10, 0.3, 10],
          filename:      todaysDate + ' Report.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // New Promise-based usage:
        html2pdf().set(opt).from(element).save();

         
    });



});