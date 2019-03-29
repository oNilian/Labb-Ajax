const defaultKey = 'S8beU';
const url = 'https://www.forverkliga.se/JavaScript/api/crud.php';
let key = defaultKey;
let listOfResponses = [];


$(document).ready(() => {

    $('.serverMessage').html('Bleep Bloooop, Hi and welcome new user!');

        $('#apiRequest').on('click', function apiAnrop() {
            const settings = {
                method: 'GET',
                data: {
                    requestKey: ''
                },
            }
            $.ajax(url, settings)
            .done(data => {
                let newData = JSON.parse(data);
                let output = newData.key;
                console.log(newData)
                $('.serverMessage').html(`API-request was successful and your key is now: ${output}`);
                key = output;
            })
            .fail(data => {
                $('.serverMessage').html('Failed to get key!');
                apiAnrop();
            });
        });  // click #apiReq

        function bokAnrop() {
        
            author = $('#addAuthor').val();
            title = $('#addTitle').val();
    
            const settings = {
                method: 'GET',
                data: {
                    op: 'insert',
                    key: key,
                    title: title,
                    author: author
                }
            };
            $.ajax(url, settings)
            .done(data => {
                //vart skall listOfResponses = []; sitta någonstans för att det skall tömmas vid varje knapptryckning istället för varje anrops
                // console.log('add book DONE! data is: ', data, 'and has data type:', typeof data);
                let addBookResult = JSON.parse(data);
                console.log(addBookResult);
                // console.log('addBookResult is:', addBookResult)
                if(listOfResponses != false && addBookResult.status == 'success' ) {
                    $('.serverMessage').html(`successfully added book but it seems we also encountered some problems:`)
                    for(let i=0; i<listOfResponses.length; i++) {    
                    $('.serverMessage').append(`<li>${listOfResponses[i]}</li>`);
                    }
                } else if (addBookResult.status == 'success' ) {
                    $('.serverMessage').html('Successfully added book 8-]')
                } else if(addBookResult.status == "error") {
                    // $('.serverMessage').html('Failed to add book! due to '+addBookResult.message);
                    listOfResponses.push(addBookResult.message);
                    bokAnrop();
                }    
            })  
        }
    $('#addBookButton').on('click', () => { listOfResponses = []; bokAnrop();})  // #addBookButton click

    function listAnrop() {
        const settings = {
            method: 'GET',
            data: {   // queryString
                op: 'select',
                key: key,
            }
        }
        $.ajax(url, settings)   // https://url?op=select&key=RT5Y5
        .done(data => {
            let viewResult = JSON.parse(data);
            let print = viewResult.data;
            console.log(viewResult);
            if (listOfResponses!= false &&  viewResult.status == 'success') {
                $('#bookList').html('');
                $('.serverMessage').html(`Successfully retrieved list from database but it seems we have encountered some problems: `)
                 for(let i=0; i<listOfResponses.length; i++) {    
                     $('.serverMessage').append(`<li>${listOfResponses[i]}</li>`);
                 }    
                for (let i = 0; i < print.length; i++) {
                    $('#bookList').append(`
                    <li>
                    Title: ${print[i].title}
                    Author: ${print[i].author}
                    </li>
                    `);
                } // for
            } else if (viewResult.status == 'success' ) {
                $('#bookList').html('');
                $('.serverMessage').html('Successfully retrieved list 8-]')
                for (let i = 0; i < print.length; i++) {
                    $('#bookList').append(`
                    <li>
                    Title: ${print[i].title}
                    Author: ${print[i].author}
                    </li>
                    `);
                }    
            } else if(viewResult.status == "error"){
                $('#bookList').html('');
                listOfResponses.push(viewResult.message);
                listAnrop();
            }
        }) // done
    }
    $('#viewList').on('click', () => { $('.serverMessage').html('');listOfResponses = []; listAnrop();})
});
