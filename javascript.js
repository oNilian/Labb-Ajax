const defaultKey = 'S8beU';
const url = 'https://www.forverkliga.se/JavaScript/api/crud.php';
let key = defaultKey;
let numOfCallsBok = 0;
let numOfCallsViewList = 0;



$(document).ready(() => {


        $('#apiReq').on('click', function apiAnrop() {
            let numOfCallsAPI = 0;
            numOfCallsAPI++
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
                $('#serverMess').html('Your API-request was successful on try number '+numOfCallsAPI+++' and your key is now: '+output);
                key = output;
            })
            .fail(data => {
                $('serverMess').html('Failed to get key!');
                apiAnrop();
            });
        });  // click #apiReq

    $('#addBookButton').on('click', function bokAnrop() {
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
            // console.log('add book DONE! data is: ', data, 'and has data type:', typeof data);
            let addBookResult = JSON.parse(data);
            // console.log('addBookResult is:', addBookResult)
            if (addBookResult.status == 'success') {
                numOfCallsBok++;
                $('#serverMess').html('successfully added book on try number '+numOfCallsBok );
                console.log('add book Success');
             } else if(addBookResult.status == "error") {
                numOfCallsBok++;
                $('#serverMess').html('Failed to add book! due to '+addBookResult.message);
                console.log('add book ERROR', addBookResult);
            }
        })
    })  // #addBookButton click

    $('#viewList').on('click', function listAnrop() {
        
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
            if (viewResult.status == 'success') {
                numOfCallsViewList++;
                $('#serverMess').html('Successfully retrieved list from database on try number '+numOfCallsViewList)
                $('#bookList').html('');
                for (let i = 0; i < print.length; i++) {
                    $('#bookList').append(`
                    <li>
                    Title: ${print[i].title}
                    Author: ${print[i].author}
                    </li>
                    `);
                } // for
            } else if(viewResult.status == "error"){
                numOfCallsViewList++;
                $('#serverMess').html('')
                $('#bookList').html(`failed to retrieve information due to ${viewResult.message}`);
            }

        }) // done
    })



});
