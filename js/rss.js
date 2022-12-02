$(document).ready(() => {
  var sliderInit = () => {
    $('.itemGroup').slick({
      autoplay: true,
      autoplaySpeed: 3000,
      accessibility: true,
      draggable: true,
      // pauseOnDotsHover:true,
      swipe: true,
      zIndex: 1000,
      mobileFirst: true,
      slidesToShow: 1,
      responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          infinite: true
        }
      }, {
        breakpoint: 713,
        settings: { slidesToShow: 2, }
        // settings: "unslick" ,
      }]
    })
  }
  var request = new XMLHttpRequest();
  request.open("GET", "https://localhost:8000/rss/open-positions", true);
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  request.onprogress = () => {
    $("<div class='lds-hourglass'></div>").appendTo(".itemGroup:first-of-type")
  }

  request.onload = function () {
    if (request.readyState === request.DONE) {
      if (request.status === 200) {
        $(".itemGroup:first-of-type").html('')
        var xml = request.responseXML;
        console.log(xml)
        var itemGroup = xml.getElementsByTagName("item")
        //promoted jobs carousel with slick plugin*****************************************************************************************************************
        $.each(itemGroup, (i) => {
          if (i === itemGroup.length - 1) {
            return;
          }
          var important = itemGroup[i].getElementsByTagName('position')[0].getAttribute('hot-job')
          if (important === "published") {
            return
          }
          var position = itemGroup[i].getElementsByTagName('position')[0].innerHTML
          var reference = itemGroup[i].getElementsByTagName('reference')[0].innerHTML

          var exists = itemGroup[i].getElementsByTagName('languages').length
          var languages = exists ? itemGroup[i].getElementsByTagName('languages')[0].innerHTML : "/"

          exists = itemGroup[i].getElementsByTagName('location').length
          var location = exists ? itemGroup[i].getElementsByTagName('location')[0].innerHTML : "/"

          exists = itemGroup[i].getElementsByTagName('deadline').length
          var deadline = exists ? itemGroup[i].getElementsByTagName('deadline')[0].innerHTML : "/"

          const emailAddress = "cv@braytonglobal.com"
          const mailBody = `Dear Brayton Global,
       %0D%0A
       %0D%0AI want to submit a candidacy for the position ${position}. 
       %0D%0A
       %0D%0APlease find my resume attached. (Please add your resume)
       %0D%0A
       %0D%0AHere are my coordinates: (Please fill your coordinates)
       %0D%0A
       %0D%0AKind regards,`
          var button = `<a class="pbtn positionBtn" href="mailto:${emailAddress}?subject=${reference} ${position}&body=${mailBody}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16">
       <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/>
       <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/>
     </svg> Apply Now</a>`
          let htmlDisplay = `<table class='item'>
              <tr>
                  <th class='textPrimary' colspan='2'>
                      <h3>${position}</h3>
                  </th>
              </tr>
                  <tr>
                      <td>Important</td>
                      <td>${important}</td>
                  </tr>
                  <tr>
                      <td>Reference</td>
                      <td>${reference}</td>
                  </tr>
                  <tr>
                      <td>Position</td>
                      <td><span>${position}</span></td>
                  </tr>
                  <tr>
                      <td>Languages</td>
                      <td>${languages}</td>
                  </tr>
                  <tr>
                      <td>Location</td>
                      <td>${location}</td>
                  </tr>
                  <tr>
                      <td>Deadline</td>
                      <td>${deadline}</td>
                  </tr>
                  <tr>
                      <td class='btnCenter' colspan='2'>${button}</td>
                  </tr>
            
      </table>`;
          $(htmlDisplay).appendTo('.itemGroup:first-of-type');
        })
        var footnote = itemGroup[itemGroup.length - 1].getElementsByTagName('footnote')[0].innerHTML
        $('.itemGroup:first-of-type').after("<p>" + footnote + "</p>")
        $('.itemGroup:first-of-type').after('<a class="btn" href="/openPositions.html">View more vacancies</a>')
        sliderInit()

        //promoted and published jobs table with DataTables plugin see openPositions.html*****************************************************************************************************************
        var itemTable = itemGroup
        var htmlOk = `<thead>
          <tr>
            <th></th>
            <th>Job title</th>
            <th>Reference</th>
            <th>Language(s)</th>
            <th>Location</th>
            <th>Deadline</th>
            <th></th>
          </tr>
         </thead>
        <tbody id="bd"></tbody>`
        $(htmlOk).appendTo(".itemTable:first-of-type")
        $.each(itemTable, (i) => {
          if (i === itemTable.length - 1) {
            return;
          }
          var position = itemTable[i].getElementsByTagName('position')[0]
          var hotjob = position.getAttribute("hot-job");

          $("<tr class='itemTr'> </tr>").appendTo(".itemTable:first-of-type #bd")

          var hotJobIcons = hotjob === "published" ? "<td></td>" : "<td>" + "<span class='material-symbols-outlined'>new_releases</span>"+ "</td>"
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += hotJobIcons

          var positionTitle = position.innerHTML
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += "<td>" + positionTitle + "</td>"

          var reference = itemTable[i].getElementsByTagName('reference')[0].innerHTML
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += "<td>" + reference + "</td>"

          var exists = itemTable[i].getElementsByTagName('languages').length
          var languages = exists ? itemTable[i].getElementsByTagName('languages')[0].innerHTML : "/"
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += "<td>" + languages + "</td>"

          exists = itemTable[i].getElementsByTagName('location').length
          var location = exists ? itemTable[i].getElementsByTagName('location')[0].innerHTML : "/"
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += "<td>" + location + "</td>"

          exists = itemTable[i].getElementsByTagName('deadline').length
          var deadline = exists ? itemTable[i].getElementsByTagName('deadline')[0].innerHTML : "/"
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += "<td>" + deadline + "</td>"
         

          const emailAddress = "cv@braytonglobal.com"
          const mailBody = `Dear Brayton Global,
         %0D%0A
         %0D%0AI want to submit a candidacy for the position ${positionTitle}.
         %0D%0A
         %0D%0APlease find my resume attached. (Please add your resume)
         %0D%0A
         %0D%0AHere are my coordinates: (Please fill your coordinates)
         %0D%0A
         %0D%0AKind regards,`
          $('.itemTable:first-of-type #bd .itemTr')[i].innerHTML += `<td><a class="positionMailto2" href="mailto:${emailAddress}?subject=${reference} ${positionTitle}&body=${mailBody}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-at-fill" viewBox="0 0 16 16">
          <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"/>
          <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034v.21Zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791Z"/>
        </svg>   Apply</a></td>`

        });
        var footnote = itemTable[itemTable.length - 1].getElementsByTagName('footnote')[0].innerHTML
        $('.itemTable:first-of-type').after("<p>" + footnote + "</p>")
        $("#positionsTable").DataTable({
          info: true,
          lengthChange: true,
          ordering: true,
          "language": {
            "lengthMenu": "_MENU_&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
            "paginate": {
              "next": "<span class='lnr lnr-chevron-right'></span>",
              "previous": "<span class='lnr lnr-chevron-left'></span>"
            },
           /* "info":"",*/
            "searchPlaceholder":"Enter a key word",
            "search": ""
          },
          pageLength:5,
          lengthMenu: [
            [5, 10, 25, 50, -1],
            [5 ,15 ,25 ,50 ,100],
          ],
          columnDefs: [
            { orderable: true, targets: 0},
            { orderable: false, targets: '_all' }
        ],
        scrollY: '450px',
        scrollCollapse: true,

        })
        $('.dataTables_wrapper .dataTables_length select option').append(' per page')
      }
    }
  }

  request.send(null);
})
