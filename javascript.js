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
        numOfCallsBok++

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
                $('#serverMess').html('successfully added book on try number '+numOfCallsBok );
                console.log('add book Success');
             } else if(addBookResult.status == "error") {
                 $('#serverMess').html('Failed to add book! on try number '+numOfCallsBok+' due to '+addBookResult.message);
                 console.log('add book ERROR', addBookResult);
            }
        })
    })  // #addBookButton click

    $('#viewList').on('click', function listAnrop() {
        numOfCallsViewList++;
        
        const settings = {
            method: 'GET',
            data: {
                op: 'select',
                key: key,
            }
        }
        $.ajax(url, settings)
        .done(data => {
            let viewResult = JSON.parse(data);
            let print = viewResult.data;
            console.log("viewresult är ", viewResult);
            if (viewResult.status == 'success') {
                for (let i = 0; i < print.length; i++) {
                        $('#serverMess').html(`Successfully rendered booklist on try number ${numOfCallsViewList}`)
                        $('#bookList').html('');
                        $('#bookList').append(`
                        <li>
                        Title: ${print[i].title}
                        Author: ${print[i].author}
                        </li>
                        `);
                } // for
            } else if(viewResult.status == "error"){
                $('#serverMess').html('')
                $('#bookList').html(`failed to retrieve information on try number ${numOfCallsViewList} due to ${viewResult.message}`);
            }

        }) // done
    })



});
